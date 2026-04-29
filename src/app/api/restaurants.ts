// src/app/api/restaurants.ts
// Domain-specific API wrappers that call the Express backend.

import { api } from './client';
import type { YelpBusiness } from './transform';

export interface SearchParams {
  term?: string;
  location?: string;
  /** Latitude — Yelp uses this when location string is missing. */
  latitude?: number;
  /** Longitude — Yelp uses this when location string is missing. */
  longitude?: number;
  categories?: string;
  limit?: number;
  offset?: number;
  price?: string;
  /** Search radius in meters (max 40000 = ~25 miles). */
  radius?: number;
  sort_by?: 'best_match' | 'rating' | 'review_count' | 'distance';
}

export interface SearchResponse {
  total: number;
  businesses: YelpBusiness[];
  cached_count: number;
}

export function searchRestaurants(params: SearchParams = {}): Promise<SearchResponse> {
  const qs = new URLSearchParams();
  if (params.term)        qs.set('term', params.term);
  if (params.location)    qs.set('location', params.location);
  if (params.latitude !== undefined)  qs.set('latitude', String(params.latitude));
  if (params.longitude !== undefined) qs.set('longitude', String(params.longitude));
  if (params.radius)      qs.set('radius', String(params.radius));
  if (params.categories)  qs.set('categories', params.categories);
  if (params.price)       qs.set('price', params.price);
  if (params.sort_by)     qs.set('sort_by', params.sort_by);
  qs.set('limit', String(params.limit ?? 12));
  qs.set('offset', String(params.offset ?? 0));
  return api.get<SearchResponse>(`/api/restaurants/search?${qs.toString()}`);
}

export function getRestaurantById(id: string): Promise<{ source: string; restaurant: any }> {
  return api.get(`/api/restaurants/${encodeURIComponent(id)}`);
}

export function getRestaurantReviews(id: string) {
  return api.get(`/api/restaurants/${encodeURIComponent(id)}/reviews`);
}

// ---- AI-generated menus ----------------------------------------------------

export interface MenuDish {
  id: number;
  category: string;            // Signature | Appetizer | Main | Side | Dessert | Drink
  price: number;               // USD
  description: string;
  image?: string;              // dish photo URL
  translations: {
    english: string;
    simplified: string;
    traditional: string;
    japanese: string;
    korean: string;
    thai: string;
  };
  original: string;
  isTopDish: boolean;
}

export interface MenuResponse {
  source: 'cache' | 'template';
  template?: string;           // e.g. 'CHINESE', 'PIZZA_ITALIAN'
  restaurant_id: string;
  restaurant_name: string;
  cuisine: string;
  dishes: MenuDish[];
  generated_at?: string;
}

export function getRestaurantMenu(id: string): Promise<MenuResponse> {
  return api.get<MenuResponse>(`/api/restaurants/${encodeURIComponent(id)}/menu`);
}

// ---- Reservations ----------------------------------------------------------

export interface ReservationInput {
  restaurant_id: string;
  restaurant_name: string;
  party_size: number;
  reservation_date: string; // "2026-05-02"
  reservation_time: string; // "19:00"
  special_request?: string;
  user_id?: string;
  user_name?: string;
}

export interface Reservation {
  id: number;
  restaurant_id: string;
  restaurant_name: string;
  user_id: string;
  user_name: string;
  party_size: number;
  reservation_date: string;
  reservation_time: string;
  special_request: string | null;
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export function createReservation(input: ReservationInput) {
  return api.post<{ reservation: Reservation }>('/api/reservations', input);
}

export function listReservations(userId = 'demo_user') {
  return api.get<{ count: number; reservations: Reservation[] }>(
    `/api/reservations?user_id=${encodeURIComponent(userId)}`,
  );
}

export function cancelReservation(id: number) {
  return api.patch<{ reservation: Reservation }>(`/api/reservations/${id}`, {
    status: 'cancelled',
  });
}

// ---- Friend posts ----------------------------------------------------------

export interface FriendPost {
  id: number;
  author_id: string;
  author_name: string;
  restaurant_id: string | null;
  restaurant_name: string | null;
  comment: string;
  like_count: number;
  created_at: string;
}

export interface PostComment {
  id: number;
  post_id: number;
  author_id: string;
  author_name: string;
  comment: string;
  created_at: string;
}

export interface UserList {
  id: number;
  user_id: string;
  name: string;
  emoji: string;
  created_at: string;
  item_count?: number;
}

export interface UserListItem {
  id: number;
  list_id: number;
  restaurant_id: string;
  restaurant_name: string | null;
  note: string | null;
  added_at: string;
}

export interface UserListExport {
  export_version: string;
  exported_at: string;
  list: UserList;
  items: UserListItem[];
  audit: {
    item_count: number;
    exported_by_user_id: string;
  };
  share: {
    canonical_url: string;
    x_intent_url: string;
  };
}

export function listPosts(limit = 20, offset = 0) {
  return api.get<{ count: number; posts: FriendPost[] }>(
    `/api/posts?limit=${limit}&offset=${offset}`,
  );
}

export function createPost(input: {
  restaurant_id?: string;
  restaurant_name?: string;
  comment: string;
  author_id?: string;
  author_name?: string;
}) {
  return api.post<{ post: FriendPost }>('/api/posts', input);
}

export function likePost(id: number) {
  return api.post<{ post: FriendPost }>(`/api/posts/${id}/like`);
}

export function listPostComments(postId: number) {
  return api.get<{ count: number; comments: PostComment[] }>(`/api/posts/${postId}/comments`);
}

export function createPostComment(
  postId: number,
  input: { comment: string; author_id?: string; author_name?: string },
) {
  return api.post<{ comment: PostComment }>(`/api/posts/${postId}/comments`, input);
}

export function exportUserList(id: number) {
  return api.get<UserListExport>(`/api/lists/${id}/export`);
}
