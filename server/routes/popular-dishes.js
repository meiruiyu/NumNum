// server/routes/popular-dishes.js
// Popular dishes endpoint with two-tier strategy:
//   1. PRIMARY: Extract dish mentions from real Yelp reviews using Groq Llama 3
//   2. FALLBACK: When Yelp reviews unavailable (rate limit, ID format, etc.),
//      generate plausible popular dishes from cached restaurant metadata
//      (cuisine, name, location) — still LLM-powered, still grounded in real
//      restaurant data, just inferred rather than reviewed.
//
// Endpoint:
//   GET /api/restaurants/:id/popular-dishes?name=Restaurant+Name
//
// Returns: { dishes: [{ name, mentions, sentiment }], source: "reviews"|"inferred", ... }

import { Router } from 'express';
import db from '../db.js';
import { yelpReviews } from '../yelp.js';

const router = Router();

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = process.env.GROQ_MODEL || 'llama-3.3-70b-versatile';
const CACHE_TTL_HOURS = 24;

// Ensure cache table exists. Runs once on module load.
db.exec(`
  CREATE TABLE IF NOT EXISTS popular_dishes_cache (
    restaurant_id TEXT PRIMARY KEY,
    restaurant_name TEXT,
    dishes_json TEXT NOT NULL,
    review_count INTEGER,
    source TEXT,
    generated_at TEXT NOT NULL
  );
`);

// Helper: ask Groq with a prompt, parse JSON array from response.
async function callGroq(prompt) {
  const res = await fetch(GROQ_URL, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 500,
    }),
  });

  if (!res.ok) throw new Error(`Groq failed: ${res.status}`);

  const data = await res.json();
  const raw = data.choices?.[0]?.message?.content?.trim() || '[]';
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();

  try {
    const parsed = JSON.parse(cleaned);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    console.warn('[popular-dishes] Could not parse Llama JSON:', cleaned.slice(0, 200));
    return [];
  }
}

// PRIMARY path: extract dishes from real Yelp reviews.
async function extractFromReviews(reviews, restaurantName) {
  const reviewBlock = reviews
    .map((r, i) => `Review ${i + 1} (${r.rating}★): ${r.text}`)
    .join('\n\n');

  const prompt = `You are analyzing customer reviews for ${restaurantName}.

Below are real reviews. Extract the dishes/food items that customers mention.

For each dish, return:
- name: dish name (lowercase, simple form, max 4 words)
- mentions: how many reviews mention it (1-${reviews.length})
- sentiment: "positive", "mixed", or "negative"

Return ONLY a JSON array, no markdown, no preamble. Example:
[{"name":"soup dumplings","mentions":2,"sentiment":"positive"}]

Reviews:
${reviewBlock}

JSON:`;

  return callGroq(prompt);
}

// FALLBACK path: infer popular dishes from cuisine + restaurant name.
async function inferFromMetadata(name, cuisine, city) {
  const prompt = `You are a NYC food expert. For the restaurant below, list 5 dishes that diners would most likely talk about — based on the cuisine and venue type. Generate plausible, realistic dishes that match this kind of restaurant.

Restaurant: ${name}
Cuisine: ${cuisine || 'general'}
Location: ${city || 'New York'}

For each dish, return:
- name: dish name (lowercase, simple form, max 4 words)
- mentions: a plausible number 1-5
- sentiment: usually "positive", occasionally "mixed"

Return ONLY a JSON array. Example:
[{"name":"soup dumplings","mentions":4,"sentiment":"positive"}]

JSON:`;

  return callGroq(prompt);
}

router.get('/restaurants/:id/popular-dishes', async (req, res) => {
  const restaurantId = req.params.id;
  const restaurantName = req.query.name || 'this restaurant';

  try {
    // 1. Check cache first
    const cached = db.prepare(
      'SELECT * FROM popular_dishes_cache WHERE restaurant_id = ?'
    ).get(restaurantId);

    if (cached) {
      const ageHours = (Date.now() - new Date(cached.generated_at).getTime()) / (1000 * 60 * 60);
      if (ageHours < CACHE_TTL_HOURS) {
        return res.json({
          cached: true,
          cache_age_hours: Math.round(ageHours * 10) / 10,
          restaurant_id: restaurantId,
          restaurant_name: cached.restaurant_name,
          dishes: JSON.parse(cached.dishes_json),
          review_count_analyzed: cached.review_count,
          source: cached.source || 'reviews',
          generated_at: cached.generated_at,
        });
      }
    }

    // 2. PRIMARY: try Yelp reviews
    let dishes = [];
    let reviewCount = 0;
    let source = 'reviews';

    try {
      const reviewsPayload = await yelpReviews(restaurantId);
      const reviews = (reviewsPayload?.reviews || []).map(r => ({
        text: r.text,
        rating: r.rating,
      }));

      if (reviews.length > 0) {
        dishes = await extractFromReviews(reviews, restaurantName);
        reviewCount = reviews.length;
      } else {
        throw new Error('No reviews returned from Yelp');
      }
    } catch (reviewsErr) {
      // 3. FALLBACK: infer from cached restaurant metadata
      console.warn(`[popular-dishes] Yelp reviews unavailable, using fallback: ${reviewsErr.message}`);

      const restaurant = db.prepare(`
        SELECT id, name, city FROM restaurants_cache WHERE id = ?
      `).get(restaurantId);

      // Try to get cuisine from categories_json
      let cuisine = '';
      const cuisineRow = db.prepare(`
        SELECT categories_json FROM restaurants_cache WHERE id = ?
      `).get(restaurantId);

      if (cuisineRow?.categories_json) {
        try {
          const cats = JSON.parse(cuisineRow.categories_json);
          cuisine = cats?.[0]?.title || '';
        } catch {}
      }

      const name = restaurant?.name || restaurantName;
      const city = restaurant?.city || 'New York';

      dishes = await inferFromMetadata(name, cuisine, city);
      source = 'inferred';
      reviewCount = 0;
    }

    // 4. Clean & limit to top 5
    const top5 = dishes
      .filter(d => d && typeof d.name === 'string' && d.name.length > 0)
      .map(d => ({
        name: String(d.name).toLowerCase().slice(0, 50),
        mentions: Math.max(1, parseInt(d.mentions) || 1),
        sentiment: ['positive', 'mixed', 'negative'].includes(d.sentiment) ? d.sentiment : 'positive',
      }))
      .sort((a, b) => b.mentions - a.mentions)
      .slice(0, 5);

    const generatedAt = new Date().toISOString();

    // 5. Save to cache
    db.prepare(`
      INSERT OR REPLACE INTO popular_dishes_cache
      (restaurant_id, restaurant_name, dishes_json, review_count, source, generated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(
      restaurantId,
      restaurantName,
      JSON.stringify(top5),
      reviewCount,
      source,
      generatedAt
    );

    res.json({
      cached: false,
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      dishes: top5,
      review_count_analyzed: reviewCount,
      source: source,
      generated_at: generatedAt,
    });

  } catch (err) {
    // Ultimate fallback — never break the page
    console.error('[popular-dishes] fatal error:', err.message);
    res.json({
      cached: false,
      restaurant_id: restaurantId,
      dishes: [],
      review_count_analyzed: 0,
      source: 'unavailable',
    });
  }
});

export default router;
