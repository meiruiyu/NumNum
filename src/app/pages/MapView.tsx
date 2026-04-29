import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, SlidersHorizontal, Star, Locate } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap, CircleMarker } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { searchRestaurants, type SearchParams } from '../api/restaurants';
import { yelpBatchToRestaurants, type YelpBusiness } from '../api/transform';
import type { Restaurant } from '../data/restaurants';

/* =========================================================================
 *  MapView — interactive Leaflet map with 20+ Columbia-area restaurants.
 *
 *  We run several Yelp searches in parallel:
 *    1) Specific named restaurants the user expects to see on campus
 *       (Yunnan Kitchen, The Tang, Junzi, Yu Xiang Yuan, Shanhai…)
 *    2) Multiple cuisine categories so the map covers more than just Asian
 *       food (italian, mexican, indian, cafe…)
 *  Results are merged, deduped by business id, sorted by distance from the
 *  current center, and the top 25 are rendered as orange teardrop pins.
 *
 *  Interaction:
 *    - Hover a pin → small popup with name / rating / price / distance.
 *    - Click "View Details →" in popup → navigate to /restaurant/:id.
 * ========================================================================= */

// Columbia University, Uris Hall — used as the geolocation fallback because
// the team is presenting on campus.
const COLUMBIA_URIS_HALL: LatLngExpression = [40.8076, -73.9626];

// Search profiles fired in parallel. Each one is a partial set of Yelp
// search params; lat/lng/radius are filled in at request time.
const SEARCH_PROFILES: Array<Omit<SearchParams, 'latitude' | 'longitude' | 'radius'> & { tag: string }> = [
  // Specific named restaurants the user wants visible on the map.
  { tag: 'named:yunnan',       term: 'Yunnan Kitchen',  limit: 4, sort_by: 'distance' },
  { tag: 'named:the-tang',     term: 'The Tang',        limit: 4, sort_by: 'distance' },
  { tag: 'named:junzi',        term: 'Junzi Kitchen',   limit: 4, sort_by: 'distance' },
  { tag: 'named:yuxiangyuan',  term: 'Yu Xiang Yuan',   limit: 4, sort_by: 'distance' },
  { tag: 'named:shanhai',      term: 'Shanhai',         limit: 4, sort_by: 'distance' },
  { tag: 'named:hibino',       term: 'noodle',          limit: 4, sort_by: 'distance', categories: 'chinese' },
  // Broader cuisine sweeps so the map covers many cuisines.
  { tag: 'cat:chinese',        categories: 'chinese,szechuan,cantonese,dimsum,hotpot', limit: 6, sort_by: 'rating' },
  { tag: 'cat:japanese',       categories: 'japanese,ramen,sushi',       limit: 4, sort_by: 'rating' },
  { tag: 'cat:korean',         categories: 'korean',                     limit: 3, sort_by: 'rating' },
  { tag: 'cat:thai-viet',      categories: 'thai,vietnamese',            limit: 3, sort_by: 'rating' },
  { tag: 'cat:italian',        categories: 'italian,pizza',              limit: 3, sort_by: 'rating' },
  { tag: 'cat:mexican',        categories: 'mexican,latin',              limit: 2, sort_by: 'rating' },
  { tag: 'cat:indian',         categories: 'indpak,himalayan',           limit: 2, sort_by: 'rating' },
  { tag: 'cat:cafe',           categories: 'cafes,coffee,bubbletea',     limit: 3, sort_by: 'rating' },
];

// Default orange teardrop marker.
const restaurantIcon = L.divIcon({
  className: 'custom-restaurant-marker',
  html: `
    <div style="position:relative;transform:translate(-50%,-100%);">
      <svg width="30" height="38" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 23 15 23s15-11.75 15-23C30 6.716 23.284 0 15 0z"
          fill="#E8603C" stroke="white" stroke-width="2"/>
        <circle cx="15" cy="14" r="4" fill="white"/>
      </svg>
    </div>`,
  iconSize: [30, 38],
  iconAnchor: [15, 38],
  popupAnchor: [0, -34],
});

// Selected marker — bigger, deep purple, with a subtle ring.
// Used when the user taps a row in the bottom restaurant list, so they can
// easily spot which pin matches.
const selectedRestaurantIcon = L.divIcon({
  className: 'custom-restaurant-marker custom-restaurant-marker--selected',
  html: `
    <div style="position:relative;transform:translate(-50%,-100%);filter:drop-shadow(0 4px 6px rgba(124,58,237,0.4));">
      <svg width="40" height="50" viewBox="0 0 30 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 0C6.716 0 0 6.716 0 15c0 11.25 15 23 15 23s15-11.75 15-23C30 6.716 23.284 0 15 0z"
          fill="#7C3AED" stroke="white" stroke-width="2.5"/>
        <circle cx="15" cy="14" r="5" fill="white"/>
      </svg>
    </div>`,
  iconSize: [40, 50],
  iconAnchor: [20, 50],
  popupAnchor: [0, -46],
});

// Helper component: imperatively recenters the map when target changes.
function FlyTo({ target, zoom }: { target: LatLngExpression | null; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, zoom ?? 15, { duration: 0.7 });
  }, [target, zoom, map]);
  return null;
}

interface MapRestaurant extends Restaurant {
  coords: LatLngExpression;
  distanceMeters?: number;
}

// Haversine distance (m) between two lat/lng pairs.
function haversineMeters(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const R = 6371_000;
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);
  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const aa = sinDLat * sinDLat + sinDLng * sinDLng * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(aa), Math.sqrt(1 - aa));
  return R * c;
}

export function MapView() {
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [allRestaurants, setAllRestaurants] = useState<MapRestaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [userLocation, setUserLocation] = useState<LatLngExpression | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);
  const [flyTarget, setFlyTarget] = useState<LatLngExpression | null>(null);

  // Currently-selected restaurant id — used to render its pin in the
  // alternate purple/larger style so the user can spot it on the map.
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const center = userLocation ?? COLUMBIA_URIS_HALL;

  // Step 1: ask the browser for geolocation on mount.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setUserLocation(COLUMBIA_URIS_HALL);
      setUsingFallback(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation([pos.coords.latitude, pos.coords.longitude]);
        setUsingFallback(false);
      },
      () => {
        setUserLocation(COLUMBIA_URIS_HALL);
        setUsingFallback(true);
      },
      { timeout: 6000, maximumAge: 60_000 },
    );
  }, []);

  // Step 2: fan-out parallel Yelp searches and merge.
  useEffect(() => {
    if (!userLocation) return;
    let cancelled = false;
    setLoading(true);
    setError(null);

    const [lat, lng] = userLocation as [number, number];

    Promise.all(
      SEARCH_PROFILES.map((profile) =>
        searchRestaurants({
          ...profile,
          latitude: lat,
          longitude: lng,
          radius: 2500,
        }).catch((err) => {
          // Swallow individual-search failures so one bad profile doesn't
          // kill the whole map. The count gauge will just be smaller.
          console.warn('[MapView] profile failed:', profile.tag, err?.message);
          return { businesses: [] as YelpBusiness[], total: 0, cached_count: 0 };
        }),
      ),
    )
      .then((responses) => {
        if (cancelled) return;

        // Collect every business returned across every search.
        const seen = new Map<string, MapRestaurant>();
        for (const res of responses) {
          for (const b of res.businesses ?? []) {
            if (!b?.id) continue;
            if (seen.has(b.id)) continue;
            const coords = b.coordinates;
            if (!coords?.latitude || !coords?.longitude) continue;

            // Distance to the current map centre — used for sorting.
            const distanceMeters = haversineMeters(
              { lat, lng },
              { lat: coords.latitude, lng: coords.longitude },
            );
            // Drop anything more than 3 km away (roughly Morningside Heights radius).
            if (distanceMeters > 3000) continue;

            const r = yelpBatchToRestaurants([b])[0];
            seen.set(b.id, {
              ...r,
              coords: [coords.latitude, coords.longitude],
              distanceMeters,
            });
          }
        }

        const list = [...seen.values()].sort(
          (a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0),
        );
        setAllRestaurants(list);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? 'Failed to load restaurants.');
        setAllRestaurants([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userLocation]);

  // Apply the search-on-map text filter on top of the merged set.
  const visibleRestaurants = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allRestaurants;
    return allRestaurants.filter(
      (r) =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.toLowerCase().includes(q),
    );
  }, [allRestaurants, query]);

  const visibleListPreview = useMemo(() => visibleRestaurants.slice(0, 12), [visibleRestaurants]);

  const recenterOnMe = () => {
    if (userLocation) setFlyTarget(userLocation);
  };

  const fmtDistance = (m?: number) => {
    if (m === undefined || m === null) return '';
    if (m < 1000) return `${Math.round(m)} m`;
    return `${(m / 1000).toFixed(1)} km`;
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-[900] bg-white/95 backdrop-blur-sm border-b border-[#2C1A0E]/8 shadow-sm px-4 sm:px-5 py-3 sm:py-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex-1 flex items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 bg-[#F5EDE3] rounded-full min-w-0">
            <Search className="size-4 sm:size-5 text-[#8A8078] flex-shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search on map..."
              className="flex-1 min-w-0 bg-transparent outline-none text-[#2C1A0E] placeholder:text-[#8A8078] text-sm sm:text-base font-medium"
            />
          </div>
          <button
            onClick={() => alert('Filters are coming soon in this demo.')}
            className="size-10 sm:size-11 bg-[#F5EDE3] rounded-full hover:bg-[#F0E4D7] transition-colors flex items-center justify-center flex-shrink-0"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="size-4 sm:size-5 text-[#8A8078]" />
          </button>
        </div>

        {/* Status banner */}
        <div className="mt-2 text-[11px] sm:text-[12px] text-[#8A8078] flex items-center gap-1 truncate">
          {loading
            ? <span>Loading restaurants near {usingFallback ? 'Columbia' : 'you'}…</span>
            : <span>📍 {visibleRestaurants.length} restaurants near {usingFallback ? 'Columbia University · Uris Hall' : 'your current location'}</span>
          }
        </div>
      </div>

      {/* Map area */}
      <div className="relative h-[calc(100vh-320px)] sm:h-[calc(100vh-280px)] overflow-hidden">
        <MapContainer
          center={center}
          zoom={15}
          scrollWheelZoom
          style={{ height: '100%', width: '100%' }}
          zoomControl
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* User location: blue accuracy ring + dot */}
          {userLocation && (
            <>
              <CircleMarker
                center={userLocation}
                radius={18}
                pathOptions={{ color: '#3B82F6', fillColor: '#3B82F6', fillOpacity: 0.12, weight: 0 }}
              />
              <CircleMarker
                center={userLocation}
                radius={7}
                pathOptions={{ color: 'white', fillColor: '#3B82F6', fillOpacity: 1, weight: 3 }}
              >
                <Popup>
                  <div className="text-xs font-semibold text-[#2C1A0E]">
                    {usingFallback ? 'Columbia · Uris Hall (default)' : 'You are here'}
                  </div>
                </Popup>
              </CircleMarker>
            </>
          )}

          {/*
            Restaurant markers.
            - Hovering a pin opens its popup (no auto-close on mouseout, so
              the user can move the cursor down into the popup and click
              "View details" without it disappearing).
            - Clicking a pin selects it (purple icon) and opens the popup.
            - Clicking on empty map dismisses the popup (Leaflet default).
          */}
          {visibleRestaurants.map((r) => (
            <Marker
              key={r.id}
              position={r.coords}
              icon={r.id === selectedId ? selectedRestaurantIcon : restaurantIcon}
              eventHandlers={{
                mouseover: (e) => e.target.openPopup(),
                click: (e) => {
                  setSelectedId(r.id);
                  e.target.openPopup();
                },
              }}
            >
              <Popup
                // autoPan keeps the popup within the visible viewport.
                autoPan
                // closeOnClick: clicking on the map (not the popup) closes it.
                closeOnClick={false}
              >
                <div className="min-w-[200px]">
                  <h4 className="font-semibold text-sm text-[#2C1A0E] mb-1 leading-snug">
                    {r.name}
                  </h4>
                  <div className="text-[11px] text-[#8A8078] mb-1.5 truncate">
                    {r.cuisine} · {r.neighborhood}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs mb-2">
                    <Star className="size-3 fill-[#F4A535] text-[#F4A535]" />
                    <span className="font-bold text-[#2C1A0E]">{r.rating.toFixed(1)}</span>
                    <span className="text-[#8A8078]">·</span>
                    <span className="text-[#8A8078]">{r.priceRange}</span>
                    {r.distanceMeters !== undefined && (
                      <>
                        <span className="text-[#8A8078]">·</span>
                        <span className="text-[#8A8078]">{fmtDistance(r.distanceMeters)}</span>
                      </>
                    )}
                  </div>
                  <button
                    onClick={() => navigate(`/restaurant/${r.id}`)}
                    className="block w-full px-3 py-1.5 bg-[var(--brand-primary,#E8603C)] text-white rounded-lg text-xs font-semibold hover:opacity-90 transition-opacity"
                  >
                    View details →
                  </button>
                </div>
              </Popup>
            </Marker>
          ))}

          <FlyTo target={flyTarget} zoom={16} />
        </MapContainer>

        {/* Recenter on me */}
        <button
          onClick={recenterOnMe}
          className="absolute bottom-4 right-4 z-[1000] size-11 rounded-full bg-white shadow-lg flex items-center justify-center hover:bg-[#FDF6EE] transition-colors"
          aria-label="Recenter on my location"
        >
          <Locate className="size-5 text-[#2C1A0E]" />
        </button>
      </div>

      {/* Bottom sheet — list of nearby restaurants (top 12 by distance) */}
      <div className="fixed bottom-20 left-0 right-0 bg-white rounded-t-[24px] sm:rounded-t-[32px] shadow-2xl z-[900]">
        <div className="w-12 h-1.5 bg-[#8A8078]/20 rounded-full mx-auto my-3 sm:my-4" />
        <div className="px-4 sm:px-5 pb-4 sm:pb-5">
          <h3 className="font-bold text-[#2C1A0E] mb-3 text-sm sm:text-base">
            {loading ? 'Searching nearby…' : `Restaurants in this area (${visibleRestaurants.length})`}
          </h3>

          {error && (
            <div className="text-xs text-[#993C1D] bg-[#FFF6F5] border border-[#F4CBC4] rounded-lg p-2 mb-2">
              {error}
            </div>
          )}

          {!loading && visibleRestaurants.length === 0 && !error && (
            <p className="text-sm text-[#8A8078] py-3 text-center">
              No restaurants returned. Try another search term.
            </p>
          )}

          <div className="space-y-2 max-h-44 sm:max-h-48 overflow-y-auto">
            {visibleListPreview.map((r) => {
              const isSelected = r.id === selectedId;
              return (
              <button
                key={r.id}
                onClick={() => {
                  setSelectedId(r.id);
                  setFlyTarget(r.coords);
                }}
                className={`w-full flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl transition-colors ${
                  isSelected
                    ? 'bg-[#7C3AED]/10 ring-1 ring-[#7C3AED]/40'
                    : 'bg-[#FDF6EE] hover:bg-[#F5EDE3]'
                }`}
              >
                <img
                  src={r.imageUrl}
                  alt={r.name}
                  className="size-12 sm:size-[52px] rounded-lg object-cover flex-shrink-0"
                />
                <div className="flex-1 text-left min-w-0">
                  <h4 className="font-bold text-[12px] sm:text-[13px] text-[#2C1A0E] mb-0.5 truncate">
                    {r.name}
                  </h4>
                  <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs">
                    <Star className="size-3 fill-[#F4A535] text-[#F4A535]" />
                    <span className="font-bold text-[#2C1A0E]">{r.rating.toFixed(1)}</span>
                    <span className="text-[#8A8078]">·</span>
                    <span className="text-[#8A8078]">{r.priceRange}</span>
                    {r.distanceMeters !== undefined && (
                      <>
                        <span className="text-[#8A8078]">·</span>
                        <span className="text-[#8A8078]">{fmtDistance(r.distanceMeters)}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="px-2 py-1 rounded-full text-[10px] font-bold bg-[#2D6A4F]/10 text-[#2D6A4F] flex-shrink-0">
                  {r.status === 'Closed' ? 'Closed' : 'Open'}
                </div>
              </button>
              );
            })}
            {visibleRestaurants.length > visibleListPreview.length && (
              <p className="text-[11px] text-[#8A8078] text-center py-1">
                Scroll the map to see all {visibleRestaurants.length} pins
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
