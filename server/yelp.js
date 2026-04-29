// server/yelp.js
// Thin wrapper around the Yelp Fusion API.
// Requires process.env.YELP_API_KEY. If absent, methods return a clear error
// so the dev knows to set it up — the rest of the backend still runs.

const YELP_API = 'https://api.yelp.com/v3';

function yelpHeaders() {
  const key = process.env.YELP_API_KEY;
  if (!key || !key.trim()) {
    throw new Error(
      'YELP_API_KEY not set. Copy .env.example to .env and add your Yelp API key.',
    );
  }
  return {
    Authorization: `Bearer ${key.trim()}`,
    Accept: 'application/json',
  };
}

/**
 * Search businesses. Accepts either a textual `location` OR `latitude`+`longitude`.
 * Yelp requires one or the other.
 * @param {Object} params - { term, location, latitude, longitude, categories, limit, offset, sort_by, price, radius }
 * @returns {Promise<{ businesses: Array, total: number }>}
 */
export async function yelpSearch(params = {}) {
  // Build query — prefer lat/lng when present (more accurate than a text city),
  // otherwise fall back to a location string.
  const hasCoords =
    params.latitude !== undefined && params.longitude !== undefined &&
    params.latitude !== null && params.longitude !== null;

  const baseQuery = {
    term: params.term ?? 'restaurants',
    limit: String(params.limit ?? 20),
    offset: String(params.offset ?? 0),
    sort_by: params.sort_by ?? 'best_match',
  };

  const locationParams = hasCoords
    ? { latitude: String(params.latitude), longitude: String(params.longitude) }
    : { location: params.location ?? 'New York, NY' };

  const query = new URLSearchParams({
    ...baseQuery,
    ...locationParams,
    ...(params.categories ? { categories: params.categories } : {}),
    ...(params.price ? { price: params.price } : {}),
    ...(params.radius ? { radius: String(params.radius) } : {}),
  });

  const res = await fetch(`${YELP_API}/businesses/search?${query}`, {
    headers: yelpHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Yelp search failed: ${res.status} ${text}`);
  }
  return res.json();
}

/**
 * Fetch full business detail by id.
 */
export async function yelpBusinessDetail(id) {
  const res = await fetch(`${YELP_API}/businesses/${encodeURIComponent(id)}`, {
    headers: yelpHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Yelp detail failed: ${res.status} ${text}`);
  }
  return res.json();
}

/**
 * Fetch up to 3 reviews for a business.
 */
export async function yelpReviews(id) {
  const res = await fetch(
    `${YELP_API}/businesses/${encodeURIComponent(id)}/reviews`,
    { headers: yelpHeaders() },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Yelp reviews failed: ${res.status} ${text}`);
  }
  return res.json();
}
