// server/routes/restaurants.js
// Restaurant endpoints. All routes proxy to Yelp Fusion and cache the results
// in the local SQLite restaurants_cache table.
//
// Endpoints:
//   GET  /api/restaurants/search?term=sushi&location=NYC&limit=20&offset=0
//   GET  /api/restaurants/:id
//   GET  /api/restaurants/:id/reviews
//   GET  /api/restaurants/cached            -> list whatever is cached
//
// Error handling is centralised via `next(err)` so the Express error
// middleware renders consistent JSON responses.

import { Router } from 'express';
import db from '../db.js';
import { yelpSearch, yelpBusinessDetail, yelpReviews } from '../yelp.js';
import { buildMenuFromTemplate } from '../menuTemplates.js';
import {
  HttpError,
  assertNonEmptyString,
  parsePagination,
} from '../utils/http.js';

const router = Router();
const YELP_MAX_RADIUS_METERS = 40000;

function parseOptionalNumber(value, fieldName) {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new HttpError(400, `${fieldName} must be a valid number`);
  }
  return parsed;
}

function parseOptionalPositiveInt(value, fieldName, maxValue = undefined) {
  if (value === undefined) return undefined;
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new HttpError(400, `${fieldName} must be a positive integer`);
  }
  if (maxValue !== undefined && parsed > maxValue) {
    throw new HttpError(400, `${fieldName} must be <= ${maxValue}`);
  }
  return parsed;
}

// Prepared statements (compiled once for performance).
const upsertStmt = db.prepare(`
  INSERT INTO restaurants_cache (
    id, name, image_url, url, review_count, rating, price, phone, display_phone,
    latitude, longitude, address1, address2, address3, city, zip_code, state,
    country, categories_json, transactions, distance, is_closed, raw_json, cached_at
  ) VALUES (
    @id, @name, @image_url, @url, @review_count, @rating, @price, @phone, @display_phone,
    @latitude, @longitude, @address1, @address2, @address3, @city, @zip_code, @state,
    @country, @categories_json, @transactions, @distance, @is_closed, @raw_json, CURRENT_TIMESTAMP
  )
  ON CONFLICT(id) DO UPDATE SET
    name           = excluded.name,
    image_url      = excluded.image_url,
    url            = excluded.url,
    review_count   = excluded.review_count,
    rating         = excluded.rating,
    price          = excluded.price,
    phone          = excluded.phone,
    display_phone  = excluded.display_phone,
    latitude       = excluded.latitude,
    longitude      = excluded.longitude,
    address1       = excluded.address1,
    address2       = excluded.address2,
    address3       = excluded.address3,
    city           = excluded.city,
    zip_code       = excluded.zip_code,
    state          = excluded.state,
    country        = excluded.country,
    categories_json = excluded.categories_json,
    transactions   = excluded.transactions,
    distance       = excluded.distance,
    is_closed      = excluded.is_closed,
    raw_json       = excluded.raw_json,
    cached_at      = CURRENT_TIMESTAMP
`);

// Convert a Yelp business payload into the flattened row shape SQLite expects.
function flattenBusiness(b) {
  const loc = b.location ?? {};
  return {
    id: b.id,
    name: b.name ?? '',
    image_url: b.image_url ?? null,
    url: b.url ?? null,
    review_count: b.review_count ?? 0,
    rating: b.rating ?? 0,
    price: b.price ?? null,
    phone: b.phone ?? null,
    display_phone: b.display_phone ?? null,
    latitude: b.coordinates?.latitude ?? null,
    longitude: b.coordinates?.longitude ?? null,
    address1: loc.address1 ?? null,
    address2: loc.address2 ?? null,
    address3: loc.address3 ?? null,
    city: loc.city ?? null,
    zip_code: loc.zip_code ?? null,
    state: loc.state ?? null,
    country: loc.country ?? null,
    categories_json: JSON.stringify(b.categories ?? []),
    transactions: Array.isArray(b.transactions) ? b.transactions.join(',') : null,
    distance: b.distance ?? null,
    is_closed: b.is_closed ? 1 : 0,
    raw_json: JSON.stringify(b),
  };
}

// Cache a batch of business payloads inside a single transaction.
function cacheBusinesses(businesses) {
  const insertMany = db.transaction((rows) => {
    for (const row of rows) upsertStmt.run(row);
  });
  insertMany(businesses.map(flattenBusiness));
}

// ---------------------------------------------------------------------------
// GET /api/restaurants/search
// ---------------------------------------------------------------------------
router.get('/search', async (req, res, next) => {
  try {
    const {
      term, location, categories, sort_by, price,
      latitude, longitude, radius,
    } = req.query;
    const { limit, offset } = parsePagination(req.query, { limit: 20, maxLimit: 50 });
    const parsedLatitude = parseOptionalNumber(latitude, 'latitude');
    const parsedLongitude = parseOptionalNumber(longitude, 'longitude');
    const parsedRadius = parseOptionalPositiveInt(radius, 'radius', YELP_MAX_RADIUS_METERS);
    const normalizedLocation =
      location !== undefined ? assertNonEmptyString(location, 'location') : undefined;

    if (
      (parsedLatitude !== undefined && parsedLongitude === undefined) ||
      (parsedLatitude === undefined && parsedLongitude !== undefined)
    ) {
      throw new HttpError(400, 'latitude and longitude must be provided together');
    }

    if (parsedLatitude === undefined && normalizedLocation === undefined) {
      throw new HttpError(400, 'Provide either location or latitude/longitude');
    }

    const data = await yelpSearch({
      term,
      location: normalizedLocation,
      categories,
      limit,
      offset,
      sort_by,
      price,
      latitude: parsedLatitude,
      longitude: parsedLongitude,
      radius: parsedRadius,
    });

    // Cache every returned business.
    if (Array.isArray(data.businesses) && data.businesses.length > 0) {
      cacheBusinesses(data.businesses);
    }

    res.json({
      total: data.total,
      businesses: data.businesses,
      cached_count: data.businesses?.length ?? 0,
    });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/restaurants/cached  (list whatever is in the local cache)
// ---------------------------------------------------------------------------
router.get('/cached', (req, res, next) => {
  try {
    const { limit } = parsePagination(req.query, { limit: 50, maxLimit: 200 });
    const city = req.query.city;
    const normalizedCity =
      city !== undefined ? assertNonEmptyString(city, 'city') : undefined;
    const rows = city
      ? db.prepare(
          'SELECT * FROM restaurants_cache WHERE city = ? ORDER BY rating DESC LIMIT ?',
        ).all(normalizedCity, limit)
      : db.prepare(
          'SELECT * FROM restaurants_cache ORDER BY cached_at DESC LIMIT ?',
        ).all(limit);

    // Parse the JSON-serialised category array before returning.
    for (const r of rows) {
      try { r.categories = JSON.parse(r.categories_json || '[]'); } catch { r.categories = []; }
    }
    res.json({ count: rows.length, restaurants: rows });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/restaurants/:id
// Tries the cache first; falls back to Yelp API and caches the result.
// ---------------------------------------------------------------------------
router.get('/:id', async (req, res, next) => {
  try {
    const id = assertNonEmptyString(req.params.id, 'restaurant id');
    const fresh = req.query.fresh === '1';

    if (!fresh) {
      const row = db.prepare('SELECT * FROM restaurants_cache WHERE id = ?').get(id);
      if (row) {
        try { row.categories = JSON.parse(row.categories_json || '[]'); } catch { row.categories = []; }
        return res.json({ source: 'cache', restaurant: row });
      }
    }

    const data = await yelpBusinessDetail(id);
    cacheBusinesses([data]);
    res.json({ source: 'yelp', restaurant: data });
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/restaurants/:id/reviews
// ---------------------------------------------------------------------------
router.get('/:id/reviews', async (req, res, next) => {
  try {
    const id = assertNonEmptyString(req.params.id, 'restaurant id');
    const data = await yelpReviews(id);
    res.json(data);
  } catch (err) {
    next(err);
  }
});

// ---------------------------------------------------------------------------
// GET /api/restaurants/:id/menu
// Returns a 10-dish menu picked from one of 12 cuisine templates based on
// the restaurant's primary Yelp category. Each dish has multilingual
// translations and a representative photo. No LLM call — instant response.
// The first hit is cached in `ai_menus` table so repeated loads don't even
// re-pick the template.
// ---------------------------------------------------------------------------
router.get('/:id/menu', async (req, res, next) => {
  try {
    const id = assertNonEmptyString(req.params.id, 'restaurant id');

    // 1. Cache hit? (still use the same table — it doubles as a generic menu cache)
    if (!req.query.force) {
      const cached = db.prepare('SELECT * FROM ai_menus WHERE restaurant_id = ?').get(id);
      if (cached) {
        return res.json({
          source: 'cache',
          restaurant_id: id,
          restaurant_name: cached.restaurant_name,
          cuisine: cached.cuisine,
          dishes: JSON.parse(cached.menu_json),
          generated_at: cached.generated_at,
        });
      }
    }

    // 2. Resolve restaurant name + cuisine from cache or Yelp.
    let row = db.prepare('SELECT * FROM restaurants_cache WHERE id = ?').get(id);
    if (!row) {
      try {
        const fresh = await yelpBusinessDetail(id);
        cacheBusinesses([fresh]);
        row = db.prepare('SELECT * FROM restaurants_cache WHERE id = ?').get(id);
      } catch (err) {
        // Unknown restaurant IDs should surface as 404 so frontend can react deterministically.
        throw new HttpError(404, `Could not find restaurant: ${err.message}`);
      }
    }
    if (!row) throw new HttpError(404, 'Restaurant not found');

    const restaurantName = row.name;
    let categories = [];
    try { categories = JSON.parse(row.categories_json || '[]'); } catch {}
    const cuisine =
      (Array.isArray(categories) && categories[0]?.title) ||
      'Restaurant';

    // 3. Match cuisine → template and build the menu.
    const { templateKey, dishes } = buildMenuFromTemplate(cuisine);

    // 4. Cache it forever (same restaurant id = same template).
    db.prepare(
      `INSERT INTO ai_menus (restaurant_id, restaurant_name, cuisine, menu_json)
       VALUES (?, ?, ?, ?)
       ON CONFLICT(restaurant_id) DO UPDATE SET
         restaurant_name = excluded.restaurant_name,
         cuisine         = excluded.cuisine,
         menu_json       = excluded.menu_json,
         generated_at    = CURRENT_TIMESTAMP`,
    ).run(id, restaurantName, cuisine, JSON.stringify(dishes));

    res.json({
      source: 'template',
      template: templateKey,
      restaurant_id: id,
      restaurant_name: restaurantName,
      cuisine,
      dishes,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
