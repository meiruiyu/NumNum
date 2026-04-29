import { useParams, useNavigate, Link } from 'react-router';
import { restaurants, type Restaurant } from '../data/restaurants';
import { ArrowLeft, Star, MapPin, Phone, Clock, Heart, Share2, Users, Bookmark, Navigation, Calendar, Menu as MenuIcon, Utensils, Languages, ChevronDown, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { getRestaurantById, getRestaurantMenu, type MenuDish } from '../api/restaurants';
import { yelpToRestaurant, type YelpBusiness } from '../api/transform';
import { buildPhotoSet } from '../api/photos';
import { getUser, initialsFromName } from '../lib/auth';
import PopularDishes from '../components/PopularDishes';

/* --------------------------------------------------------------------------
 *  pickTopDishes — pick the dishes most likely to be "Recommended" on the
 *  restaurant detail page. Prefers Signature category first, then Main, then
 *  fills any leftover slots from the rest of the menu in order.
 * -------------------------------------------------------------------------- */
function pickTopDishes(dishes: MenuDish[], count: number): MenuDish[] {
  if (!dishes?.length) return [];
  const signature = dishes.filter((d) => d.category === 'Signature');
  const mains     = dishes.filter((d) => d.category === 'Main');
  const others    = dishes.filter(
    (d) => d.category !== 'Signature' && d.category !== 'Main',
  );
  return [...signature, ...mains, ...others].slice(0, count);
}

/* Deterministic "X Recs" number based on dish position so the order looks
 * intentional but doesn't change between renders. */
function pseudoRecCount(dish: MenuDish, idx: number): number {
  // 8, 5, 4, 3, 3, 2 ... pattern.
  const base = [8, 5, 4, 3, 3, 2, 2, 1, 1, 1];
  return base[idx] ?? Math.max(1, dish.id % 8);
}

/* --------------------------------------------------------------------------
 *  The backend's /api/restaurants/:id can return TWO different shapes:
 *
 *    1. A fresh Yelp payload (nested:  { coordinates: { latitude }, location: { ... } })
 *    2. A flattened cached row from SQLite (flat: { latitude, address1, city ... })
 *
 *  Convert either one into the YelpBusiness shape that yelpToRestaurant() expects.
 * -------------------------------------------------------------------------- */
function normaliseToYelp(raw: any): YelpBusiness {
  if (!raw) return { id: '', name: 'Unknown' };

  // Already a Yelp-shaped payload — has nested coordinates / location objects.
  if (raw.coordinates || raw.location) return raw as YelpBusiness;

  // Flattened SQLite cache row — rebuild the nested objects.
  let categories = raw.categories;
  if (!categories && raw.categories_json) {
    try {
      categories = JSON.parse(raw.categories_json);
    } catch {
      categories = [];
    }
  }

  return {
    id: raw.id,
    name: raw.name,
    image_url: raw.image_url,
    url: raw.url,
    review_count: raw.review_count,
    rating: raw.rating,
    price: raw.price,
    phone: raw.phone,
    display_phone: raw.display_phone,
    is_closed: !!raw.is_closed,
    coordinates: raw.latitude != null
      ? { latitude: raw.latitude, longitude: raw.longitude }
      : undefined,
    categories: Array.isArray(categories) ? categories : [],
    transactions: typeof raw.transactions === 'string'
      ? raw.transactions.split(',').filter(Boolean)
      : [],
    distance: raw.distance,
    location: {
      address1: raw.address1,
      address2: raw.address2,
      address3: raw.address3,
      city: raw.city,
      state: raw.state,
      zip_code: raw.zip_code,
      country: raw.country,
      display_address: [raw.address1, raw.city && `${raw.city}, ${raw.state ?? ''} ${raw.zip_code ?? ''}`.trim()]
        .filter(Boolean) as string[],
    },
  };
}

export function RestaurantDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const localRestaurant = restaurants.find((r) => r.id === id);

  // The restaurant we end up rendering. Starts with the hardcoded match if
  // present; otherwise we fetch from /api/restaurants/:id and convert Yelp's
  // response into the same shape so all UI below this point keeps working.
  const [restaurant, setRestaurant] = useState<Restaurant | null>(
    localRestaurant ?? null,
  );
  const [fetching, setFetching] = useState(!localRestaurant && Boolean(id));
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [saved, setSaved] = useState(false);
  const [liked, setLiked] = useState(false);
  const [activeTab, setActiveTab] = useState('menu');
  const [showCheckInSheet, setShowCheckInSheet] = useState(false);
  const [showCallPopup, setShowCallPopup] = useState(false);

  // Photo carousel state — final array of >=5 image URLs and current slide.
  const [photos, setPhotos] = useState<string[]>([]);
  const [carouselIdx, setCarouselIdx] = useState(0);

  // Menu state — lifted up here so both the "Recommended Dishes" carousel
  // and the MenuTab below share a single API call.
  const [menuDishes, setMenuDishes] = useState<MenuDish[]>([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [menuSource, setMenuSource] = useState<'cache' | 'template' | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setMenuLoading(true);
    getRestaurantMenu(id)
      .then((res) => {
        if (cancelled) return;
        setMenuDishes(res.dishes ?? []);
        setMenuSource(res.source ?? null);
      })
      .catch(() => {
        // Carousel will fall back to an empty state; not a blocker.
      })
      .finally(() => {
        if (!cancelled) setMenuLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Build the photo set whenever the restaurant data changes. Uses Yelp's
  // photos[] when available, plus cuisine-themed fallbacks to guarantee 5+.
  useEffect(() => {
    if (!restaurant) return;
    // Local 18 hardcoded restaurants don't have a `photos` array, so we just
    // pad with cuisine fallbacks. API-fetched ones get the real Yelp photos
    // via the secondary effect below.
    const initial = buildPhotoSet(restaurant.imageUrl, undefined, restaurant.cuisine, 5);
    setPhotos(initial);
    setCarouselIdx(0);
  }, [restaurant]);

  // Fetch the full Yelp business detail so we can grab the real photos[] array.
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getRestaurantById(id)
      .then((res) => {
        if (cancelled) return;
        const raw: any = res.restaurant ?? {};
        const yelpPhotos: string[] = Array.isArray(raw.photos) ? raw.photos : [];
        if (yelpPhotos.length === 0) return; // keep the fallback set we already computed
        const cuisine =
          (Array.isArray(raw.categories) && raw.categories[0]?.title) ||
          restaurant?.cuisine ||
          undefined;
        setPhotos(buildPhotoSet(raw.image_url ?? restaurant?.imageUrl, yelpPhotos, cuisine, 5));
        setCarouselIdx(0);
      })
      .catch(() => {
        // Keep whatever we already had — fallbacks always cover us.
      });
    return () => {
      cancelled = true;
    };
  }, [id, restaurant?.cuisine, restaurant?.imageUrl]);

  // If the id wasn't found in the hardcoded list, ask the backend.
  // The backend will first hit its SQLite cache and fall back to Yelp Fusion.
  useEffect(() => {
    if (localRestaurant || !id) return;
    let cancelled = false;
    setFetching(true);
    setFetchError(null);
    getRestaurantById(id)
      .then((res) => {
        if (cancelled) return;
        // Convert the Yelp business shape (or our cached row) into our
        // internal Restaurant type so the existing UI renders correctly.
        setRestaurant(yelpToRestaurant(normaliseToYelp(res.restaurant)));
      })
      .catch((err) => {
        if (cancelled) return;
        setFetchError(err?.message ?? 'Could not load restaurant.');
      })
      .finally(() => {
        if (!cancelled) setFetching(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, localRestaurant]);

  if (fetching) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
        <div className="text-center px-5">
          <div className="size-10 border-4 border-[#F0EBE3] border-t-[#E8603C] rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#8A8078]">Loading restaurant…</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
        <div className="text-center px-5">
          <p className="text-[#8A8078] mb-2 text-lg">Restaurant not found</p>
          {fetchError && (
            <p className="text-[12px] text-[#993C1D] mb-4">{fetchError}</p>
          )}
          <Link to="/" className="text-[#E8603C] hover:underline font-medium">
            Go back home
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: restaurant.name,
          text: `Check out ${restaurant.name} on NumNum NYC!`,
          url: window.location.href,
        });
      } catch (err) {
        // User cancelled or share failed
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const tabs = [
    { id: 'menu', label: 'Menu' },
    { id: 'photos', label: `Photos (${photos.length})` },
    { id: 'reviews', label: `Reviews (${(restaurant.reviewCount ?? 0).toLocaleString()})` },
    { id: 'info', label: 'Info' },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      {/* Hero Image Carousel — at least 5 photos (Yelp + cuisine fallbacks) */}
      <div className="relative">
        <div className="relative w-full h-[260px] overflow-hidden bg-[#F0EBE3]">
          {photos.map((url, i) => (
            <img
              key={url + i}
              src={url}
              alt={`${restaurant.name} photo ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                i === carouselIdx ? 'opacity-100' : 'opacity-0'
              }`}
            />
          ))}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

        {/* Carousel arrows — hidden when there's only one photo */}
        {photos.length > 1 && (
          <>
            <button
              onClick={() => setCarouselIdx((i) => (i - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              aria-label="Previous photo"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              onClick={() => setCarouselIdx((i) => (i + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors"
              aria-label="Next photo"
            >
              <ChevronRight className="size-5" />
            </button>

            {/* Dot indicators */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCarouselIdx(i)}
                  className={`h-1.5 rounded-full transition-all ${
                    i === carouselIdx ? 'w-5 bg-white' : 'w-1.5 bg-white/50'
                  }`}
                  aria-label={`Go to photo ${i + 1}`}
                />
              ))}
            </div>
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/50 text-white text-[10px] font-semibold tracking-wide">
              {carouselIdx + 1} / {photos.length}
            </div>
          </>
        )}
        
        {/* Top Actions */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-5 left-5 p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
        >
          <ArrowLeft className="size-5 text-[#2C1A0E]" />
        </button>
        <div className="absolute top-5 right-5 flex gap-2.5">
          <button
            onClick={handleShare}
            className="p-3 bg-white/95 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <Share2 className="size-5 text-[#2C1A0E]" />
          </button>
          <button
            onClick={() => setSaved(!saved)}
            className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all ${
              saved ? 'bg-[#E8603C] text-white' : 'bg-white/95 hover:bg-white text-[#2C1A0E]'
            }`}
          >
            <Bookmark className={`size-5 ${saved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Restaurant Name Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-5">
          <h1 className="text-white text-[28px] font-bold mb-2 drop-shadow-lg">{restaurant.name}</h1>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold border border-white/30">
              {restaurant.cuisine}
            </span>
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white rounded-full text-xs font-bold border border-white/30">
              {restaurant.neighborhood}
            </span>
          </div>
        </div>
      </div>

      {/* Info Bar */}
      <div className="bg-white border-b border-[#2C1A0E]/8 px-5 py-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <Star className="size-5 fill-[#F4A535] text-[#F4A535]" />
            <span className="font-bold text-[#2C1A0E]">{restaurant.rating}</span>
            <span className="text-[#8A8078] text-sm">({restaurant.reviewCount})</span>
          </div>
          <span className="text-[#8A8078]">•</span>
          <span className="font-bold text-[#8A8078]">{restaurant.priceRange}</span>
          <span className="text-[#8A8078]">•</span>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 h-7 px-3 bg-[#EAF3DE] border-[0.5px] border-[#3B6D11] rounded-full">
              <div className="size-1.5 rounded-full bg-[#2D6A4F]" />
              <span className="text-[13px] font-semibold text-[#27500A]">Open Now</span>
            </div>
            <span className="text-[13px] font-normal text-[#8A8078]">· Closes 10pm</span>
          </div>
          <span className="text-[#8A8078]">•</span>
          <div className="h-7 px-3 bg-[#FAEEDA] border-[0.5px] border-[#BA7517] rounded-full flex items-center">
            <span className="text-[13px] font-medium text-[#633806]">~30 min wait</span>
          </div>
        </div>
        
        {/* Sub-ratings row */}
        <div className="flex items-center gap-2 h-6 mt-1 mb-1.5">
          <span className="text-xs font-normal text-[#8A8078]">Food</span>
          <span className="text-xs font-semibold text-[#2C1A0E]" style={{ marginLeft: '-5px' }}>4.8</span>
          <span className="text-[#8A8078] text-sm">•</span>
          <span className="text-xs font-normal text-[#8A8078]">Ambiance</span>
          <span className="text-xs font-semibold text-[#2C1A0E]" style={{ marginLeft: '-5px' }}>4.5</span>
          <span className="text-[#8A8078] text-sm">•</span>
          <span className="text-xs font-normal text-[#8A8078]">Service</span>
          <span className="text-xs font-semibold text-[#2C1A0E]" style={{ marginLeft: '-5px' }}>4.2</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border-b border-[#2C1A0E]/8 px-5 py-4">
        <div className="grid grid-cols-3 gap-3">
          <QuickActionButton icon={Navigation} label="Directions" />
          <QuickActionButton icon={Calendar} label="Reserve" onClick={() => navigate(`/restaurant/${id}/reservation`)} />
          <QuickActionButton icon={Phone} label="Call" onClick={() => setShowCallPopup(true)} />
        </div>
      </div>

      {/* Recommended Dishes — top dishes from this restaurant's actual menu */}
      <div className="bg-white px-5 py-4">
        <div className="flex items-center justify-between mb-2.5">
          <h2 className="text-[16px] font-bold text-[#2C1A0E]">Recommended Dishes</h2>
          <button
            onClick={() => navigate(`/restaurant/${id}/dishes`)}
            className="text-[13px] font-medium text-[#E8603C]"
          >
            View All ›
          </button>
        </div>

        <div className="flex gap-2.5 overflow-x-auto scrollbar-hide -mx-5 px-5">
          {menuLoading && menuDishes.length === 0 && (
            <>
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="flex-shrink-0 w-[90px]">
                  <div className="w-[90px] h-[90px] rounded-[10px] bg-[#F5F0EB] animate-pulse mb-1" />
                  <div className="h-3 bg-[#F5F0EB] rounded animate-pulse" />
                </div>
              ))}
            </>
          )}
          {pickTopDishes(menuDishes, 4).map((dish, idx) => (
            <DishCard
              key={dish.id}
              name={dish.translations.english}
              recs={`${pseudoRecCount(dish, idx)} Recs`}
              imageUrl={dish.image ?? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200'}
              onClick={() => navigate(`/restaurant/${id}/dishes`)}
            />
          ))}
        </div>
      </div>

      <PopularDishes
        restaurantId={restaurant.id}
        restaurantName={restaurant.name}
      />
      
      {/* Divider */}
      <div className="h-[0.5px] bg-[#F0EBE3] mt-3.5" />

      {/* Friends Social Section — show which friends have been here */}
      <FriendsWhoVisitedSection restaurantName={restaurant.name} />

      {/* Tab Navigation */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#2C1A0E]/8 shadow-sm">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-6 py-4 font-bold text-sm border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#E8603C] text-[#E8603C]'
                  : 'border-transparent text-[#8A8078]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-5 py-6 pb-28">
        {activeTab === 'photos' && <PhotosTab restaurant={restaurant} photos={photos} />}
        {activeTab === 'info' && <InfoTab restaurant={restaurant} onCallClick={() => setShowCallPopup(true)} />}
        {activeTab === 'reviews' && <ReviewsTab restaurant={restaurant} />}
        {activeTab === 'menu' && (
          <MenuTab dishes={menuDishes} loading={menuLoading} source={menuSource} />
        )}
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#F0EBE3] h-14 px-4 py-2">
        <div className="flex items-center gap-2.5 h-full">
          {/* Check In Button - 40% */}
          <button
            onClick={() => setShowCheckInSheet(true)}
            className="flex-[0.4] h-10 bg-white border border-[#E8603C] rounded-[10px] flex items-center justify-center gap-1.5 hover:bg-[#FDF6EE] transition-colors"
          >
            <MapPin className="size-4 text-[#E8603C]" />
            <span className="text-[13px] font-semibold text-[#E8603C]">Check In</span>
          </button>

          {/* Write Review Button - 60% */}
          <button
            onClick={() => {/* Navigate to write review */}}
            className="flex-[0.6] h-10 bg-[#E8603C] rounded-[10px] flex items-center justify-center gap-1.5 hover:bg-[#D55534] transition-colors"
          >
            <Edit3 className="size-4 text-white" />
            <span className="text-[13px] font-semibold text-white">Write Review</span>
          </button>
        </div>
      </div>

      {/* Check In Bottom Sheet */}
      {showCheckInSheet && (
        <>
          <div 
            className="fixed inset-0 bg-black/40 z-[60]"
            onClick={() => setShowCheckInSheet(false)}
          />
          <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[20px] h-[180px] px-6 py-5 animate-slideUp">
            <h3 className="text-lg font-bold text-[#2C1A0E] mb-2 text-center">
              Check in at {restaurant.name}?
            </h3>
            <p className="text-sm text-[#8A8078] mb-6 text-center">
              Let your friends know you're dining here
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCheckInSheet(false)}
                className="flex-1 h-12 bg-white border border-[#2C1A0E]/20 rounded-xl font-semibold text-[#2C1A0E] hover:bg-[#F5EDE3] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowCheckInSheet(false);
                  // Handle check-in logic
                }}
                className="flex-1 h-12 bg-[#E8603C] rounded-xl font-semibold text-white hover:bg-[#D55534] transition-colors"
              >
                Check In
              </button>
            </div>
          </div>
        </>
      )}

      {/* Call Popup */}
      {showCallPopup && (
        <>
          {/* Background Overlay */}
          <div 
            className="fixed inset-0 bg-black/40 z-[60] flex items-center justify-center"
            onClick={() => setShowCallPopup(false)}
          >
            {/* Popup Card */}
            <div 
              className="w-[280px] bg-white rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Top Section */}
              <div className="px-5 pt-6 pb-5 text-center">
                <h3 className="text-base font-semibold text-[#2C1A0E] mb-1">
                  {restaurant.name}
                </h3>
                <p className="text-xl font-medium text-[#E8603C]">
                  +1 (718) 555-0192
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-[#F0EBE3]" />

              {/* Bottom Section - Two Buttons */}
              <div className="flex h-12">
                {/* Call Button */}
                <button
                  onClick={() => {
                    window.location.href = 'tel:+17185550192';
                    setShowCallPopup(false);
                  }}
                  className="flex-1 flex items-center justify-center gap-1.5 rounded-bl-2xl hover:bg-[#FDF6EE] transition-colors"
                >
                  <Phone className="size-4 text-[#E8603C]" />
                  <span className="text-[15px] font-semibold text-[#E8603C]">Call</span>
                </button>

                {/* Vertical Divider */}
                <div className="w-px bg-[#F0EBE3]" />

                {/* Cancel Button */}
                <button
                  onClick={() => setShowCallPopup(false)}
                  className="flex-1 flex items-center justify-center rounded-br-2xl hover:bg-[#FDF6EE] transition-colors"
                >
                  <span className="text-[15px] font-normal text-[#8A8078]">Cancel</span>
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function QuickActionButton({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center gap-2 py-3 bg-[#F5EDE3] rounded-xl hover:bg-[#F0E4D7] transition-colors"
    >
      <Icon className="size-5 text-[#E8603C]" />
      <span className="text-xs font-bold text-[#2C1A0E]">{label}</span>
    </button>
  );
}

/* --------------------------------------------------------------------------
 *  FriendsWhoVisitedSection
 *  Mock social-graph component shown on the restaurant detail page.
 *  Displays a small avatar stack + 2-3 friends with a star rating and a
 *  one-line review. Demonstrates the social community feature requested by
 *  the professor without requiring a real friend graph backend.
 * -------------------------------------------------------------------------- */
function FriendsWhoVisitedSection({ restaurantName }: { restaurantName: string }) {
  // Hash the name to deterministically pick which friends "visited" this spot,
  // so revisiting the page shows consistent friends.
  const seed = Array.from(restaurantName).reduce((s, c) => s + c.charCodeAt(0), 0);
  const allFriends = [
    { name: 'Karen L.',  initials: 'KL', bgColor: '#EAF3DE', stars: 4.7, comment: 'Loved the food and service. Highly recommend the appetizers!' },
    { name: 'Mike J.',   initials: 'MJ', bgColor: '#E6F1FB', stars: 4.5, comment: 'Solid spot for groups — book ahead though, gets busy.' },
    { name: 'Amy C.',    initials: 'AC', bgColor: '#FAECE7', stars: 4.6, comment: 'Authentic flavors. The signature dish is a must-try.' },
    { name: 'David K.',  initials: 'DK', bgColor: '#EEEDFE', stars: 4.4, comment: 'Cozy vibes, perfect for date night.' },
    { name: 'Jenny W.',  initials: 'JW', bgColor: '#FFF1DE', stars: 4.8, comment: 'Best in NYC. The portion sizes are generous.' },
    { name: 'Tom H.',    initials: 'TH', bgColor: '#E1F0EE', stars: 4.3, comment: 'Quick service, great for a weekday lunch.' },
  ];
  // Pick 3 friends based on the seed.
  const visitors = [
    allFriends[seed % allFriends.length],
    allFriends[(seed + 2) % allFriends.length],
    allFriends[(seed + 4) % allFriends.length],
  ];

  return (
    <div className="px-4 sm:px-5 py-4 bg-white border-b border-[#F0EBE3]">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3 gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {/* Stacked avatars */}
          <div className="flex -space-x-2 flex-shrink-0">
            {visitors.map((f) => (
              <div
                key={f.name}
                className="size-7 sm:size-8 rounded-full flex items-center justify-center text-[10px] sm:text-[11px] font-semibold ring-2 ring-white"
                style={{ backgroundColor: f.bgColor }}
              >
                {f.initials}
              </div>
            ))}
          </div>
          <span className="text-[12px] sm:text-[13px] text-[#2C1A0E] font-medium truncate">
            <span className="font-semibold">{visitors.length} friends</span> visited
          </span>
        </div>
        <button className="text-[12px] sm:text-[13px] font-medium text-[#E8603C] flex-shrink-0">
          See all
        </button>
      </div>

      {/* Friend reviews — horizontal scroll on mobile, wraps comfortably on wider */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {visitors.map((f) => (
          <div
            key={f.name}
            className="flex-shrink-0 w-[260px] sm:w-[280px] bg-[#FDF6EE] rounded-xl p-3 border border-[#F0EBE3]"
          >
            <div className="flex items-center gap-2 mb-2">
              <div
                className="size-8 rounded-full flex items-center justify-center text-[11px] font-semibold flex-shrink-0"
                style={{ backgroundColor: f.bgColor }}
              >
                {f.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12px] font-semibold text-[#2C1A0E] truncate">
                  {f.name}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="size-3 fill-[#F4A535] text-[#F4A535]" />
                  <span className="text-[11px] font-bold text-[#2C1A0E]">{f.stars}</span>
                </div>
              </div>
            </div>
            <p className="text-[11px] sm:text-[12px] text-[#4A3728] italic leading-snug line-clamp-2">
              "{f.comment}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhotosTab({ restaurant, photos }: { restaurant: any; photos: string[] }) {
  const categories = ['All', 'Food', 'Interior', 'Menu'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  // We don't have category metadata for each photo so the chips are
  // visual-only filters; selecting any of them just shows the same set.
  const visible = photos.length > 0 ? photos : [restaurant.imageUrl].filter(Boolean);

  return (
    <div>
      <div className="flex gap-2 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-all flex-shrink-0 ${
              selectedCategory === cat
                ? 'bg-[#E8603C] text-white'
                : 'bg-white text-[#8A8078] border border-[#2C1A0E]/10'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="text-[12px] text-[#8A8078] mb-3">
        {visible.length} photo{visible.length !== 1 ? 's' : ''}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {visible.map((url, i) => (
          <div key={url + i} className="aspect-square rounded-xl sm:rounded-2xl overflow-hidden bg-[#F0EBE3]">
            <img
              src={url}
              alt={`Photo ${i + 1}`}
              loading="lazy"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

function InfoTab({ restaurant, onCallClick }: { restaurant: any; onCallClick: () => void }) {
  return (
    <div className="space-y-6">
      {/* Description */}
      <div>
        <p className="text-[#2C1A0E] leading-relaxed mb-4">{restaurant.description}</p>
      </div>

      {/* Address */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <div className="flex gap-4 mb-4">
          <MapPin className="size-5 text-[#E8603C] flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-bold mb-2 text-[#2C1A0E]">Address</p>
            <p className="text-[#8A8078] leading-relaxed mb-3">{restaurant.address}</p>
            <div className="h-32 bg-[#F5EDE3] rounded-xl flex items-center justify-center">
              <p className="text-[#8A8078] text-sm">Map preview</p>
            </div>
          </div>
        </div>
      </div>

      {/* Phone */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <div className="flex items-center gap-4">
          <Phone className="size-4 text-[#8A8078] flex-shrink-0" />
          <span className="flex-1 text-sm font-medium text-[#2C1A0E]">+1 (718) 555-0192</span>
          <button 
            onClick={onCallClick}
            className="h-[30px] px-3.5 bg-[#E8603C] text-white rounded-full text-xs font-semibold hover:bg-[#D55534] transition-colors"
          >
            Call
          </button>
        </div>
      </div>

      {/* Hours */}
      <div className="bg-white rounded-2xl p-5 card-shadow">
        <div className="flex gap-4">
          <Clock className="size-5 text-[#E8603C] flex-shrink-0 mt-1" />
          <div className="flex-1">
            <p className="font-bold mb-2 text-[#2C1A0E]">Hours</p>
            <p className="text-[#8A8078]">{restaurant.hours}</p>
            <div className="mt-2 inline-block px-3 py-1 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full text-xs font-bold">
              Open Now
            </div>
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="bg-white rounded-2xl p-5 card-shadow space-y-4">
        <DetailRow label="Walk-in accepted" value="Yes" />
        <DetailRow label="Current wait time" value="~30 minutes" isLive />
        <DetailRow label="Neighborhood" value={restaurant.neighborhood} />
        <DetailRow label="Good for" value={restaurant.groupSize} />
      </div>

      {/* Tags */}
      <div>
        <p className="font-bold text-[#2C1A0E] mb-3">Features</p>
        <div className="flex flex-wrap gap-2">
          {restaurant.features.map((feature: string) => (
            <span
              key={feature}
              className="px-4 py-2 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full text-sm font-medium"
            >
              {feature}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value, isLive }: { label: string; value: string; isLive?: boolean }) {
  return (
    <div className="flex justify-between items-center pb-4 border-b border-[#2C1A0E]/5 last:border-0 last:pb-0">
      <span className="text-[#8A8078] font-medium">{label}</span>
      <div className="flex items-center gap-2">
        {isLive && <div className="size-2 bg-[#E8603C] rounded-full animate-pulse" />}
        <span className="font-bold text-[#2C1A0E]">{value}</span>
      </div>
    </div>
  );
}

function ReviewsTab({ restaurant }: { restaurant: any }) {
  const subRatings = [
    { label: 'Food Quality', score: 4.7 },
    { label: 'Service', score: 4.2 },
    { label: 'Ambiance', score: 4.5 },
    { label: 'Portion Size', score: 4.0 },
  ];

  const filters = ['Most Recent', 'Most Helpful', 'With Photos', 'Critical'];
  const [selectedFilter, setSelectedFilter] = useState('Most Recent');

  return (
    <div>
      {/* Sub-ratings */}
      <div className="bg-white rounded-2xl p-5 card-shadow mb-6">
        <h3 className="font-bold text-[#2C1A0E] mb-4">Rating Breakdown</h3>
        <div className="space-y-3">
          {subRatings.map((rating) => (
            <div key={rating.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-[#8A8078] font-medium">{rating.label}</span>
                <span className="font-bold text-[#2C1A0E]">{rating.score}</span>
              </div>
              <div className="h-2 bg-[#F5EDE3] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#E8603C] to-[#F4A535] rounded-full"
                  style={{ width: `${(rating.score / 5) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-2 mb-6 overflow-x-auto scrollbar-hide pb-2">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setSelectedFilter(filter)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex-shrink-0 ${
              selectedFilter === filter
                ? 'bg-[#E8603C] text-white'
                : 'bg-white text-[#8A8078] border border-[#2C1A0E]/10'
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {/* First review = the logged-in user (their own published review).
            Second = a different mock reviewer so the page looks populated. */}
        <ReviewCard
          reviewer={(() => {
            const u = getUser();
            const name = u?.name ?? 'You';
            return {
              name,
              initials: initialsFromName(name),
              badge: 'Verified Diner',
              visited: 'Visited March 2026',
              rating: 4.5,
              body: 'Amazing experience! The food was incredible and the service was top-notch. Definitely coming back!',
              helpful: 12,
            };
          })()}
        />
        <ReviewCard
          reviewer={{
            name: 'Sarah Kim',
            initials: 'SK',
            badge: 'Verified Diner',
            visited: 'Visited February 2026',
            rating: 5.0,
            body: 'Hidden gem! Authentic flavors, generous portions, and the staff were incredibly welcoming. A must-try.',
            helpful: 24,
          }}
        />
      </div>
    </div>
  );
}

interface Reviewer {
  name: string;
  initials: string;
  badge: string;
  visited: string;
  rating: number;
  body: string;
  helpful: number;
}

function ReviewCard({ reviewer }: { reviewer: Reviewer }) {
  return (
    <div className="bg-white rounded-2xl p-5 card-shadow">
      <div className="flex items-start gap-3 mb-3">
        <div className="size-12 rounded-full bg-gradient-to-br from-[#E8603C] to-[#F4A535] flex items-center justify-center text-white font-bold">
          {reviewer.initials}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-bold text-[#2C1A0E]">{reviewer.name}</span>
            <span className="px-2 py-0.5 bg-[#2D6A4F]/10 text-[#2D6A4F] rounded-full text-xs font-bold">
              {reviewer.badge}
            </span>
          </div>
          <p className="text-xs text-[#8A8078]">{reviewer.visited}</p>
        </div>
        <div className="flex items-center gap-1">
          <Star className="size-4 fill-[#F4A535] text-[#F4A535]" />
          <span className="font-bold text-[#2C1A0E]">{reviewer.rating.toFixed(1)}</span>
        </div>
      </div>
      <p className="text-[#2C1A0E] leading-relaxed mb-3">{reviewer.body}</p>
      <div className="flex items-center gap-2 text-xs text-[#8A8078]">
        <button className="flex items-center gap-1 hover:text-[#E8603C]">
          👍 Helpful ({reviewer.helpful})
        </button>
      </div>
    </div>
  );
}

function MenuTab({
  dishes,
  loading,
  source,
}: {
  dishes: MenuDish[];
  loading: boolean;
  source: 'cache' | 'template' | null;
}) {
  const [selectedLanguage, setSelectedLanguage] = useState<
    'english' | 'simplified' | 'traditional' | 'japanese' | 'korean' | 'thai'
  >('english');
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Signature']);
  const error: string | null = null; // parent owns the fetch; errors don't surface here

  const languages = [
    { id: 'english',     label: 'English' },
    { id: 'simplified',  label: '简体中文' },
    { id: 'traditional', label: '繁體中文' },
    { id: 'japanese',    label: '日本語' },
    { id: 'korean',      label: '한국어' },
    { id: 'thai',        label: 'ภาษาไทย' },
  ] as const;

  // Group dishes by category in the order Yelp menus typically appear.
  const grouped = useMemo(() => {
    const order = ['Signature', 'Appetizer', 'Main', 'Side', 'Dessert', 'Drink', 'Other'];
    const buckets: Record<string, MenuDish[]> = {};
    for (const d of dishes) {
      const cat = order.includes(d.category) ? d.category : 'Other';
      if (!buckets[cat]) buckets[cat] = [];
      buckets[cat].push(d);
    }
    return order.filter((c) => buckets[c]?.length).map((c) => ({ name: c, items: buckets[c] }));
  }, [dishes]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    );
  };

  return (
    <div className="-mx-5 -my-6">
      {/* Language Selector */}
      <div className="bg-[#FDF6EE] px-3 sm:px-4 py-2 border-b border-[#F0EBE3] h-11">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {languages.map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLanguage(lang.id)}
              className={`flex-shrink-0 px-3 h-7 rounded-full transition-all text-[11px] font-medium ${
                selectedLanguage === lang.id
                  ? 'bg-[var(--brand-primary,#E8603C)] text-white'
                  : 'bg-white border border-[#E0D8D0] text-[#8A8078]'
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="bg-[#FDF6EE] px-4 py-6 space-y-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-[72px] bg-white rounded-md animate-pulse" />
          ))}
          <p className="text-center text-[11px] text-[#8A8078]">
            Loading menu…
          </p>
        </div>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="bg-[#FDF6EE] px-4 py-6">
          <div className="bg-[#FFF6F5] border border-[#F4CBC4] rounded-xl p-3 text-[12px] text-[#993C1D] leading-relaxed">
            <strong>Couldn't load menu.</strong> {error}
            <p className="mt-1 text-[10px] opacity-70">
              Make sure the backend server is running.
            </p>
          </div>
        </div>
      )}

      {/* Menu */}
      {!loading && !error && (
        <div className="bg-[#FDF6EE]">
          {grouped.length === 0 && (
            <p className="text-center text-sm text-[#8A8078] py-8">No menu items returned.</p>
          )}
          {grouped.map(({ name, items }) => {
            const isOpen = expandedCategories.includes(name);
            return (
              <div key={name} className="mb-0">
                <button
                  onClick={() => toggleCategory(name)}
                  className="w-full bg-[#F5F0EB] h-10 px-4 flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-[#2C1A0E]">{name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-[#8A8078]">{items.length} items</span>
                    <ChevronDown
                      className={`size-4 text-[#8A8078] transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="bg-white">
                    {items.map((item, index) => (
                      <div
                        key={item.id}
                        className={`min-h-[60px] px-3 sm:px-4 py-3 flex items-start gap-3 ${
                          index < items.length - 1 ? 'border-b border-[#F0EBE3]' : ''
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <h4 className="text-sm font-semibold text-[#2C1A0E] truncate">
                              {item.translations[selectedLanguage] || item.translations.english}
                            </h4>
                            {item.isTopDish && (
                              <span className="flex-shrink-0 px-1.5 py-0.5 bg-[#FAEEDA] text-[#633806] rounded text-[10px] font-semibold">
                                ★ Top Dish
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-[#8A8078] leading-snug">
                            {item.description}
                          </p>
                        </div>
                        <div className="flex-shrink-0 flex items-center gap-2">
                          <span className="text-sm font-semibold text-[#2C1A0E] whitespace-nowrap">
                            ${item.price}
                          </span>
                          {item.image && (
                            <img
                              src={item.image}
                              alt={item.translations.english}
                              loading="lazy"
                              className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover flex-shrink-0 bg-[#F0EBE3]"
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Disclaimer */}
      <div className="bg-[#FDF6EE] px-6 py-4 text-center">
        <p className="text-[11px] text-[#B4B2A9] leading-relaxed">
          Sample menu — actual dishes and prices vary by restaurant.
        </p>
      </div>
    </div>
  );
}

function DishCard({ name, recs, imageUrl, onClick }: { name: string; recs: string; imageUrl: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="flex-shrink-0 w-[90px]"
    >
      {/* Photo with overlay badge */}
      <div className="relative w-[90px] h-[90px] mb-1">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover rounded-[10px]"
        />
        {/* Recommendation badge overlaid on bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-5 bg-black/55 rounded-b-[10px] flex items-center justify-center">
          <span className="text-[10px] font-semibold text-white">{recs}</span>
        </div>
      </div>
      
      {/* Dish name below photo */}
      <p className="text-xs font-medium text-[#2C1A0E] text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[90px]">
        {name}
      </p>
    </button>
  );
}