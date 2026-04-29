// src/app/api/photos.ts
// Photo helpers — combine Yelp's photos array with cuisine-themed Unsplash
// fallbacks to guarantee at least 5 distinct images per restaurant.
//
// Yelp Fusion's /businesses/{id} returns up to 3 photos via the `photos`
// field, plus the primary `image_url`. Together that's usually 3-4 unique
// urls. We top up to 5+ with a small curated pool of food photos keyed
// by the restaurant's primary cuisine, so the hero carousel always feels
// full and the Photos tab is never sparse.

const CUISINE_FALLBACKS: Record<string, string[]> = {
  Chinese: [
    'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=900',
    'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=900',
    'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=900',
    'https://images.unsplash.com/photo-1526318896980-cf78c088247c?w=900',
  ],
  Japanese: [
    'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900',
    'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=900',
    'https://images.unsplash.com/photo-1617196034796-73dfa7b1fd56?w=900',
    'https://images.unsplash.com/photo-1559410545-0bdcd187e0a6?w=900',
  ],
  Korean: [
    'https://images.unsplash.com/photo-1532347231146-a8bd8c64d20a?w=900',
    'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=900',
    'https://images.unsplash.com/photo-1583224994076-ae3a3b4eebd2?w=900',
    'https://images.unsplash.com/photo-1607098665874-fd193397547b?w=900',
  ],
  Vietnamese: [
    'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=900',
    'https://images.unsplash.com/photo-1583952233538-0eda4cae2e02?w=900',
    'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=900',
  ],
  Thai: [
    'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=900',
    'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=900',
    'https://images.unsplash.com/photo-1572451877429-83d2bcdb3e74?w=900',
  ],
  Ramen: [
    'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=900',
    'https://images.unsplash.com/photo-1614563637806-1d0e645e0940?w=900',
    'https://images.unsplash.com/photo-1632709810780-b5a4343cebcf?w=900',
  ],
  Sushi: [
    'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=900',
    'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=900',
    'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=900',
  ],
  'Bubble Tea': [
    'https://images.unsplash.com/photo-1558857563-c0c6ee6ff8ab?w=900',
    'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=900',
    'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=900',
  ],
  Cafe: [
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=900',
    'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=900',
    'https://images.unsplash.com/photo-1559925393-8be0ec4767c8?w=900',
  ],
  // Generic fallback used when we don't recognise the cuisine.
  Default: [
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900',
    'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900',
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=900',
  ],
};

/**
 * Build a >= 5 photo array for a restaurant. Combines (in order):
 *   1. Primary image_url from Yelp (if any)
 *   2. Yelp's photos array (typically 3)
 *   3. Cuisine-themed Unsplash fallbacks until we hit at least 5 unique URLs.
 *
 * @param primaryUrl - the restaurant's main image (may be empty)
 * @param yelpPhotos - additional Yelp photos array (may be undefined)
 * @param cuisine    - primary cuisine title used to pick fallback theme
 * @param minPhotos  - minimum photos to return; defaults to 5
 */
export function buildPhotoSet(
  primaryUrl: string | undefined | null,
  yelpPhotos: string[] | undefined | null,
  cuisine: string | undefined | null,
  minPhotos = 5,
): string[] {
  const seen = new Set<string>();
  const out: string[] = [];

  const add = (url: string | undefined | null) => {
    if (!url) return;
    if (seen.has(url)) return;
    seen.add(url);
    out.push(url);
  };

  add(primaryUrl);
  (yelpPhotos ?? []).forEach(add);

  // Pad with cuisine-themed fallbacks if we still don't have enough.
  const cuisineKey = matchCuisineKey(cuisine);
  const pool = [...(CUISINE_FALLBACKS[cuisineKey] ?? []), ...CUISINE_FALLBACKS.Default];
  for (const url of pool) {
    if (out.length >= minPhotos) break;
    add(url);
  }
  return out;
}

/**
 * Map a free-form cuisine string to a key in CUISINE_FALLBACKS.
 * Yelp returns titles like "Korean", "Hot Pot", "Ramen Bars" — we match
 * the most descriptive one we recognise.
 */
function matchCuisineKey(cuisine: string | undefined | null): string {
  if (!cuisine) return 'Default';
  const lower = cuisine.toLowerCase();
  if (lower.includes('ramen')) return 'Ramen';
  if (lower.includes('sushi')) return 'Sushi';
  if (lower.includes('boba') || lower.includes('bubble')) return 'Bubble Tea';
  if (lower.includes('cafe') || lower.includes('coffee')) return 'Cafe';
  if (lower.includes('korean')) return 'Korean';
  if (lower.includes('japan')) return 'Japanese';
  if (lower.includes('chinese') || lower.includes('dim sum') || lower.includes('hot pot')) return 'Chinese';
  if (lower.includes('vietnam') || lower.includes('pho')) return 'Vietnamese';
  if (lower.includes('thai')) return 'Thai';
  return 'Default';
}
