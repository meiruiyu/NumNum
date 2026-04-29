// src/app/data/restaurants.ts
// Restaurant data is now sourced exclusively from the live Yelp Fusion API
// via our Express backend (see src/app/api/restaurants.ts). The previous
// 18 hand-curated entries were removed per professor feedback so the demo
// reflects real NYC restaurants.
//
// We keep the Restaurant type and the supporting filter vocabulary arrays
// (cuisines / neighborhoods / occasions) because they're consumed by the
// FilterBottomSheet UI and other components that don't need actual rows.

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string;
  neighborhood: string;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  address: string;
  phone: string;
  hours: string;
  features: string[];
  popular: boolean;
  trending?: boolean;
  occasions: string[];
  groupSize: string;
  // Additional fields for search results
  location?: string;
  distance?: string;
  distanceType?: 'walk' | 'subway';
  sceneTags?: string[];
  status?: 'Open Now' | 'Closed' | 'Busy';
  friendsVisited?: number;
}

// Intentionally empty — data comes from the live API at runtime.
export const restaurants: Restaurant[] = [];

export const cuisines = [
  'All',
  'Chinese',
  'Korean',
  'Japanese',
  'Vietnamese',
  'Thai',
  'Bubble Tea',
  'Italian',
  'Middle Eastern',
  'Indian',
  'Cafe',
];

export const neighborhoods = [
  'All',
  'Flushing, Queens',
  'Manhattan',
  'East Village, Manhattan',
  'West Village, Manhattan',
  'Koreatown, Manhattan',
  'Chinatown, Manhattan',
  'Fort Lee, NJ',
  'Hoboken, NJ',
  'Williamsburg, Brooklyn',
];

export const occasions = [
  'All',
  'Quick Meal',
  'Casual Hangout',
  'Date Night',
  'Birthday',
  'Group Dining',
  'Late Night',
  'Study Session',
  'Celebration',
];
