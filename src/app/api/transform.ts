// src/app/api/transform.ts
// Maps a Yelp Fusion business payload onto our existing frontend Restaurant
// shape so the existing UI components can render it without changes.

import type { Restaurant } from '../data/restaurants';

// Yelp API shape (subset we care about).
export interface YelpBusiness {
  id: string;
  name: string;
  image_url?: string;
  review_count?: number;
  rating?: number;
  price?: string;
  phone?: string;
  display_phone?: string;
  coordinates?: { latitude: number; longitude: number };
  location?: {
    address1?: string;
    address2?: string;
    address3?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
    display_address?: string[];
  };
  categories?: Array<{ alias: string; title: string }>;
  transactions?: string[];
  distance?: number;
  is_closed?: boolean;
  url?: string;
}

/**
 * Convert a Yelp business payload into our internal Restaurant type so the
 * existing cards / detail page / lists can render it without refactoring.
 */
export function yelpToRestaurant(b: YelpBusiness): Restaurant {
  const cuisineTitle = b.categories?.[0]?.title ?? 'Restaurant';
  const neighborhood = [b.location?.city, b.location?.state]
    .filter(Boolean)
    .join(', ');
  const address =
    b.location?.display_address?.join(', ') ??
    [b.location?.address1, b.location?.city, b.location?.state]
      .filter(Boolean)
      .join(', ');

  // Normalize the price to our enum. Yelp can omit it entirely.
  const normalizedPrice = (b.price?.trim() || '$$') as Restaurant['priceRange'];
  const priceRange: Restaurant['priceRange'] = ['$', '$$', '$$$', '$$$$'].includes(
    normalizedPrice,
  )
    ? normalizedPrice
    : '$$';

  // Build the "features" array from Yelp categories + transactions.
  const features: string[] = [];
  if (b.categories) features.push(...b.categories.map((c) => c.title));
  if (b.transactions?.includes('delivery')) features.push('Delivery');
  if (b.transactions?.includes('pickup')) features.push('Pickup');
  if (b.transactions?.includes('restaurant_reservation')) features.push('Reservations');

  return {
    id: b.id,
    name: b.name,
    cuisine: cuisineTitle,
    neighborhood: neighborhood || 'New York, NY',
    priceRange,
    rating: Number(b.rating ?? 0),
    reviewCount: Number(b.review_count ?? 0),
    imageUrl:
      b.image_url ||
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800',
    description: b.categories?.map((c) => c.title).join(' · ') ?? 'Restaurant',
    address,
    phone: b.display_phone || b.phone || '',
    hours: 'See full hours on Yelp',
    features,
    popular: (b.rating ?? 0) >= 4.3,
    trending: (b.rating ?? 0) >= 4.5 && (b.review_count ?? 0) > 200,
    occasions: [],
    groupSize: '2-6 people',
    status: b.is_closed ? 'Closed' : 'Open Now',
  };
}

/**
 * Transform a batch of Yelp businesses and return an array of Restaurants.
 */
export function yelpBatchToRestaurants(businesses: YelpBusiness[]): Restaurant[] {
  return businesses.map(yelpToRestaurant);
}
