import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Search, SlidersHorizontal, Star, ChevronRight, Flame, Coffee, Moon, Wine, Tag, MapPin, Sparkles, UtensilsCrossed, CakeSlice, Bookmark, Heart, MessageCircle, RefreshCw } from 'lucide-react';
import { restaurants, type Restaurant } from '../data/restaurants';
import { FilterBottomSheet } from '../components/FilterBottomSheet';
import { Onboarding } from '../components/Onboarding';
import { searchRestaurants } from '../api/restaurants';
import { yelpBatchToRestaurants } from '../api/transform';

const ONBOARDING_LS_KEY = 'numnum_onboarding_complete';
const LEGACY_ONBOARDING_LS_KEY = 'nomnom_onboarding_complete';

export function Home() {
  const navigate = useNavigate();
  const [location, setLocation] = useState<'NYC' | 'NJ'>('NYC');
  const [selectedVibe, setSelectedVibe] = useState('All');
  const [showFilters, setShowFilters] = useState(false);
  
  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    // Check if user has completed onboarding before
    const hasCompletedOnboarding =
      localStorage.getItem(ONBOARDING_LS_KEY) === 'true' ||
      localStorage.getItem(LEGACY_ONBOARDING_LS_KEY) === 'true';
    return !hasCompletedOnboarding;
  });

  // Live restaurants pulled from our Express backend / Yelp Fusion API.
  const [liveRestaurants, setLiveRestaurants] = useState<Restaurant[]>([]);
  const [liveLoading, setLiveLoading] = useState(false);
  const [liveError, setLiveError] = useState<string | null>(null);
  const [liveReloadTick, setLiveReloadTick] = useState(0);

  // Geolocation state — used so search results are TRULY near the user.
  // Falls back to Columbia University Uris Hall when geolocation is denied.
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);

  // Step 1: ask the browser for the user's location once on mount.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setUserCoords({ lat: 40.8076, lng: -73.9626 }); // Columbia Uris Hall
      setUsingFallback(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setUsingFallback(false);
      },
      () => {
        // User denied — fall back to Columbia Uris Hall.
        setUserCoords({ lat: 40.8076, lng: -73.9626 });
        setUsingFallback(true);
      },
      { timeout: 6000, maximumAge: 60_000 },
    );
  }, []);

  // Step 2: whenever location/coords/region change, fetch nearby restaurants
  // through the API. We use lat/lng (most accurate) and limit to 6 picks so
  // the home feed stays focused.
  useEffect(() => {
    if (!userCoords) return;
    let cancelled = false;
    setLiveLoading(true);
    setLiveError(null);

    // Default: search around the user's coordinates.
    const params: Parameters<typeof searchRestaurants>[0] = {
      term: 'asian',
      latitude: userCoords.lat,
      longitude: userCoords.lng,
      radius: 2000,            // 2 km from the user — keeps results truly nearby
      limit: 6,
      sort_by: 'rating',
    };

    // If the user explicitly toggled the NYC / NJ pill, override the location.
    if (location === 'NJ') {
      delete params.latitude;
      delete params.longitude;
      delete params.radius;
      params.location = 'Fort Lee, NJ';
    }

    searchRestaurants(params)
      .then((res) => {
        if (cancelled) return;
        setLiveRestaurants(yelpBatchToRestaurants(res.businesses ?? []));
      })
      .catch((err) => {
        if (cancelled) return;
        setLiveError(err?.message ?? 'Unable to reach the backend.');
      })
      .finally(() => {
        if (!cancelled) setLiveLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [location, liveReloadTick, userCoords]);

  const handleOnboardingComplete = () => {
    // Mark onboarding as complete in localStorage
    localStorage.setItem(ONBOARDING_LS_KEY, 'true');
    localStorage.removeItem(LEGACY_ONBOARDING_LS_KEY);
    setShowOnboarding(false);
  };
  
  // Filter states
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['NYC']);
  const [selectedNYCAreas, setSelectedNYCAreas] = useState<string[]>([]);
  const [selectedNJAreas, setSelectedNJAreas] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [openNow, setOpenNow] = useState(false);
  const [walkInAccepted, setWalkInAccepted] = useState(false);

  // Check if any filters are active
  const hasActiveFilters = () => {
    return (
      selectedNYCAreas.length > 0 ||
      selectedNJAreas.length > 0 ||
      selectedCuisines.length > 0 ||
      selectedPriceRanges.length > 0 ||
      minRating > 0 ||
      selectedVibes.length > 0 ||
      openNow ||
      walkInAccepted
    );
  };

  // Filter toggle handlers
  const toggleRegion = (region: string) => {
    setSelectedRegions((prev) =>
      prev.includes(region) ? prev.filter((r) => r !== region) : [...prev, region]
    );
  };

  const toggleArea = (area: string, type: 'nyc' | 'nj') => {
    if (type === 'nyc') {
      setSelectedNYCAreas((prev) =>
        prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
      );
    } else {
      setSelectedNJAreas((prev) =>
        prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
      );
    }
  };

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  const toggleVibe = (vibe: string) => {
    setSelectedVibes((prev) =>
      prev.includes(vibe) ? prev.filter((v) => v !== vibe) : [...prev, vibe]
    );
  };

  const clearAllFilters = () => {
    setSelectedRegions(['NYC']);
    setSelectedNYCAreas([]);
    setSelectedNJAreas([]);
    setSelectedCuisines([]);
    setSelectedPriceRanges([]);
    setMinRating(0);
    setSelectedVibes([]);
    setOpenNow(false);
    setWalkInAccepted(false);
  };

  const handleShowResults = () => {
    setShowFilters(false);
    // Navigate to search page with filters
    navigate('/search');
  };

  const vibes = [
    'All',
    'Date Night',
    'Friends Gathering',
    'Solo Lunch',
    'Quick Bite',
    'Late Night',
    'Instagrammable',
    'Hidden Gem',
    'Walk-in OK',
  ];

  // Live restaurants are filtered locally by selected vibe (occasion).
  // The catalog itself comes entirely from the API.
  const filteredRestaurants =
    selectedVibe === 'All'
      ? liveRestaurants
      : liveRestaurants.filter((r) => r.occasions?.includes(selectedVibe));

  const friendsActivities = [
    {
      id: '1',
      userName: 'Karen L.',
      initials: 'KL',
      avatarBg: '#FAECE7',
      avatarText: '#993C1D',
      action: 'checked in at',
      restaurantName: 'Flushing Hot Pot',
      comment: 'The spicy broth is incredible!',
      timestamp: '2h ago',
      photo: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    },
    {
      id: '2',
      userName: 'Mike J.',
      initials: 'MJ',
      avatarBg: '#E6F1FB',
      avatarText: '#0C447C',
      action: 'recommended',
      restaurantName: 'Han Joo KBBQ',
      comment: 'Perfect for a big group dinner',
      timestamp: 'Yesterday',
      photo: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    },
  ];

  const neighborhoodRestaurants = [
    {
      id: '1',
      name: 'Flushing Hot Pot',
      cuisine: 'Chinese',
      location: 'Flushing, Queens',
      rating: 4.7,
      reviewCount: 3284,
      priceRange: '$$',
      badge: 'Trending',
      image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400',
    },
    {
      id: '2',
      name: 'Bonchon',
      cuisine: 'Korean',
      location: 'Fort Lee, NJ',
      rating: 4.6,
      reviewCount: 2156,
      priceRange: '$$',
      badge: 'Trending',
      image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400',
    },
    {
      id: '3',
      name: 'Pho Bac',
      cuisine: 'Vietnamese',
      location: 'Manhattan',
      rating: 4.5,
      reviewCount: 1876,
      priceRange: '$',
      badge: 'Top Pick',
      image: 'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400',
    },
    {
      id: '4',
      name: 'Tiger Sugar',
      cuisine: 'Bubble Tea',
      location: 'Flushing, Queens',
      rating: 4.4,
      reviewCount: 4521,
      priceRange: '$',
      badge: 'Trending',
      image: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?w=400',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FDF6EE] pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#F0EBE3] shadow-sm px-4 py-4">
        <div className="grid grid-cols-[auto,1fr,auto] items-center gap-3 mb-4">
          {/* NYC/NJ Toggle - Left Side */}
          <div className="h-9 flex items-center bg-white border-[0.5px] border-[#F0EBE3] rounded-full p-0.5">
            <button
              onClick={() => setLocation('NYC')}
              className={`h-8 px-3 rounded-full text-[13px] transition-all whitespace-nowrap ${
                location === 'NYC'
                  ? 'bg-[#E8603C] text-white font-semibold'
                  : 'text-[#8A8078] bg-transparent font-medium'
              }`}
            >
              NYC
            </button>
            <button
              onClick={() => setLocation('NJ')}
              className={`h-8 px-3 rounded-full text-[13px] transition-all whitespace-nowrap ${
                location === 'NJ'
                  ? 'bg-[#E8603C] text-white font-semibold'
                  : 'text-[#8A8078] bg-transparent font-medium'
              }`}
            >
              NJ
            </button>
          </div>

          {/* Center Logo + Tagline */}
          <div className="min-w-0 text-center">
            <div className="truncate text-[15px] font-bold text-[#E8603C] tracking-[-0.3px]">
              NumNum
            </div>
            <div className="hidden sm:block truncate text-[10px] font-normal text-[#8A8078] mt-[1px]">
              For the Asian Community
            </div>
          </div>

          {/* My Lists Button - Right Side
              (JD avatar removed per UX feedback — bookmark + label only) */}
          <button
            onClick={() => navigate('/lists')}
            className="h-9 bg-white border-[0.5px] border-[#F0EBE3] rounded-full flex items-center gap-1.5 px-3.5 hover:border-[#E8603C]/30 transition-colors flex-shrink-0"
          >
            <Bookmark className="size-3.5 text-[#2C1A0E] flex-shrink-0" strokeWidth={2} />
            <span className="text-[13px] font-medium text-[#2C1A0E] whitespace-nowrap">My Lists</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="h-12 flex items-center px-4 bg-white rounded-full border-[0.5px] border-[#F0EBE3]">
          <Search className="size-4 text-[#B4B2A9] flex-shrink-0" />
          <input
            type="text"
            placeholder="Asian spots by cuisine, area, price, vibe..."
            className="flex-1 px-3 bg-transparent outline-none text-[#2C1A0E] placeholder:text-[#B4B2A9] text-[13px] font-normal"
            onFocus={() => navigate('/search')}
          />
          <div className="w-px h-[18px] bg-[#E0D8D0] mx-2.5 flex-shrink-0" />
          <button 
            onClick={() => setShowFilters(true)}
            className="p-2 flex-shrink-0 relative"
          >
            <SlidersHorizontal className={`size-[18px] ${
              hasActiveFilters() ? 'text-[#E8603C]' : 'text-[#8A8078]'
            }`} />
            {hasActiveFilters() && (
              <div className="absolute top-1 right-1 size-1.5 bg-[#E8603C] rounded-full" />
            )}
          </button>
        </div>
      </div>

      {/* Vibe/Mood Filter Row */}
      

      <main>
        {/* Friends Space Banner */}
        <section className="px-4 pt-6 pb-2">
          <button
            onClick={() => navigate('/friends-space')}
            className="w-full h-20 bg-[#E8603C] rounded-2xl flex items-center justify-between px-4 overflow-hidden relative hover:bg-[#D55534] transition-colors"
          >
            {/* Left Side Content */}
            <div className="text-left z-10">
              <div className="text-white font-bold text-[16px] mb-0.5">Friends Space</div>
              <div className="text-white/85 text-xs">See where your friends are eating</div>
            </div>

            {/* Right Side Illustration */}
            <div className="absolute right-12 top-1/2 -translate-y-1/2">
              <div className="relative w-12 h-12">
                <MessageCircle className="absolute top-1 left-1 size-7 text-white/85" fill="white" />
                <MessageCircle className="absolute bottom-1 right-0 size-5 text-white/85" fill="white" />
              </div>
            </div>

            {/* Chevron */}
            <svg className="size-[18px] text-white flex-shrink-0 z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </section>

        {/* Section 1 - Top Picks Near You (live from Yelp) */}
        <section className="mb-4 pt-2">
          <div className="px-4 mb-3 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h2 className="text-[18px] sm:text-[20px] font-bold text-[#2C1A0E] tracking-tight mb-0.5 truncate">
                Top Picks Near You
              </h2>
              <p className="text-[11px] sm:text-[13px] text-[#8A8078] font-normal truncate">
                {location === 'NJ'
                  ? 'Live from Yelp · Fort Lee area'
                  : usingFallback
                    ? 'Live from Yelp · near Columbia University'
                    : 'Live from Yelp · within 2 km of you'}
              </p>
            </div>
            <button
              onClick={() => setLiveReloadTick((t) => t + 1)}
              className="text-[12px] sm:text-[13px] font-medium text-[#E8603C] min-h-[40px] flex items-center gap-1 px-1 flex-shrink-0"
              aria-label="Refresh live results"
            >
              <RefreshCw className={`size-3.5 ${liveLoading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto px-4 pb-3 scrollbar-hide">
            {liveLoading && liveRestaurants.length === 0 && (
              <>
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="flex-shrink-0 w-[260px] sm:w-[280px] bg-white rounded-xl overflow-hidden border-[0.5px] border-[#F0EBE3] animate-pulse"
                  >
                    <div className="h-[140px] sm:h-[160px] bg-[#F5F0EB]" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-[#F5F0EB] rounded w-3/4" />
                      <div className="h-3 bg-[#F5F0EB] rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </>
            )}
            {liveRestaurants
              .filter((r) => r.popular)
              .slice(0, 8)
              .map((restaurant) => (
                <TopPickCard key={restaurant.id} restaurant={restaurant} />
              ))}
            {!liveLoading && liveRestaurants.length === 0 && (
              <div className="flex-shrink-0 w-full p-6 bg-white rounded-xl text-center text-sm text-[#8A8078] border border-[#F0EBE3]">
                {liveError
                  ? 'Backend unreachable. Start the API server with npm run server.'
                  : 'No live results yet.'}
              </div>
            )}
          </div>
        </section>

        {/* Backend status banner — only renders when the API call failed */}
        {liveError && (
          <div className="mx-4 mb-4 p-3 rounded-xl bg-[#FFF6F5] border border-[#F4CBC4] text-[12px] text-[#993C1D] leading-relaxed">
            <strong>Backend not reachable.</strong> Start the API server with
            <code className="mx-1 px-1 py-0.5 bg-white rounded border border-[#F4CBC4] text-[11px]">
              npm run server
            </code>
            and ensure your YELP_API_KEY is set in <code className="mx-1">.env</code>.
            <div className="mt-1 text-[10px] opacity-70">Detail: {liveError}</div>
          </div>
        )}

        {/* Section 2 - NYC Rankings */}
        <section className="mb-6">
          <div className="px-4 mb-3 flex items-center justify-between">
            <div>
              <h2 className="text-[20px] font-bold text-[#2C1A0E] tracking-tight mb-1">NYC Rankings</h2>
              <p className="text-[13px] text-[#8A8078] font-normal">Curated lists updated weekly</p>
            </div>
            <button 
              onClick={() => navigate('/rankings')}
              className="text-[13px] font-medium text-[#E8603C] min-h-[44px] flex items-center gap-0.5"
            >
              View All ›
            </button>
          </div>
          
          {/* 4×3 Grid of Category Cells */}
          <div className="px-4">
            <div className="grid grid-cols-4 gap-2">
              {/* Row 1 */}
              <RankingCategoryCell icon="🍳" bgColor="#FFF0E6" label="Stir-Fry" category="stir-fry" />
              <RankingCategoryCell icon="🍜" bgColor="#FFF8E1" label="Ramen" category="ramen" />
              <RankingCategoryCell icon="🥢" bgColor="#F0F7EC" label="SE Asian" category="southeast-asian" />
              <RankingCategoryCell icon="🔥" bgColor="#FFF3E0" label="Korean BBQ" category="korean-bbq" />
              
              {/* Row 2 */}
              <RankingCategoryCell icon="🍷" bgColor="#FFF0F3" label="Date Night" category="date-night" />
              <RankingCategoryCell icon="💰" bgColor="#F1F8E9" label="Best Value" category="best-value" />
              <RankingCategoryCell icon="💎" bgColor="#F3F0FF" label="Hidden Gems" category="hidden-gems" />
              <RankingCategoryCell icon="☕" bgColor="#FDF6EE" label="Cafe" category="cafe" />
              
              {/* Row 3 */}
              <RankingCategoryCell icon="🌙" bgColor="#EEF2FF" label="Late Night" category="late-night" />
              <RankingCategoryCell icon="🥞" bgColor="#FFFDE7" label="Brunch" category="brunch" />
              <RankingCategoryCell icon="🍚" bgColor="#FFF3F3" label="Asian Picks" category="asian-picks" />
              <RankingCategoryCell icon="✨" bgColor="#F0FFF8" label="New Opens" category="new-openings" />
            </div>
          </div>
        </section>

        {/* Section 3 - Friends Space Feed Preview */}
        <section className="mb-6 px-4">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-[#2C1A0E] tracking-tight mb-1">Friends Space</h2>
            <button 
              onClick={() => navigate('/friends-space')}
              className="text-[13px] font-medium text-[#E8603C] min-h-[44px] flex items-center gap-0.5"
            >
              View All ›
            </button>
          </div>
          <div className="space-y-2">
            {friendsActivities.map((activity) => (
              <FriendsActivityCard key={activity.id} activity={activity} onClick={() => navigate('/friends-space')} />
            ))}
          </div>
          <button
            onClick={() => navigate('/friends-space')}
            className="w-full text-center text-[13px] font-medium text-[#E8603C] pt-2 pb-1"
          >
            See what your friends are eating →
          </button>
        </section>
      </main>

      {/* Filter Bottom Sheet */}
      <FilterBottomSheet
        isOpen={showFilters}
        onClose={() => setShowFilters(false)}
        selectedRegions={selectedRegions}
        selectedNYCAreas={selectedNYCAreas}
        selectedNJAreas={selectedNJAreas}
        selectedCuisines={selectedCuisines}
        selectedPriceRanges={selectedPriceRanges}
        minRating={minRating}
        selectedVibes={selectedVibes}
        openNow={openNow}
        walkInAccepted={walkInAccepted}
        onRegionToggle={toggleRegion}
        onAreaToggle={toggleArea}
        onCuisineToggle={toggleCuisine}
        onPriceRangeChange={setSelectedPriceRanges}
        onRatingChange={setMinRating}
        onVibeToggle={toggleVibe}
        onOpenNowChange={setOpenNow}
        onWalkInAcceptedChange={setWalkInAccepted}
        onClearAll={clearAllFilters}
        onShowResults={handleShowResults}
        resultsCount={filteredRestaurants.length}
      />

      {/* Onboarding Modal */}
      <Onboarding
        isOpen={showOnboarding}
        onClose={handleOnboardingComplete}
      />

      {/* Bottom Fade Hint - signals more content below */}
      
    </div>
  );
}

function TopPickCard({ restaurant }: { restaurant: any }) {
  const [saved, setSaved] = useState(false);

  return (
    <Link to={`/restaurant/${restaurant.id}`} className="flex-shrink-0 w-[280px] bg-white rounded-xl overflow-hidden border-[0.5px] border-[#F0EBE3]">
      <div className="relative h-[160px]">
        <img src={restaurant.imageUrl} alt={restaurant.name} className="w-full h-full object-cover" />
        <div className="absolute top-3 left-3 px-2 py-1 bg-[#2D6A4F] text-white rounded-md text-[11px] font-semibold h-5 flex items-center">
          Open Now
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            setSaved(!saved);
          }}
          className="absolute top-3 right-3 p-2 bg-white/95 backdrop-blur-sm rounded-full"
        >
          <Heart className={`size-5 ${saved ? 'fill-[#E8603C] text-[#E8603C]' : 'text-[#8A8078]'}`} />
        </button>
        {restaurant.trending && (
          <div className="absolute bottom-3 right-3 flex -space-x-2">
            <div className="size-6 rounded-full bg-gradient-to-br from-[#E8603C] to-[#F4A535] border-2 border-white" />
            <div className="size-6 rounded-full bg-gradient-to-br from-[#2D6A4F] to-[#F4A535] border-2 border-white" />
            <div className="flex items-center justify-center size-6 rounded-full bg-[#2C1A0E] border-2 border-white text-white text-[10px] font-bold">
              +3
            </div>
          </div>
        )}
      </div>
      <div className="h-[112px] px-[14px] py-3 flex flex-col overflow-hidden">
        {/* Line 1 - Restaurant Name */}
        <h3 className="font-semibold text-[15px] text-[#2C1A0E] mb-1 truncate overflow-hidden whitespace-nowrap">
          {restaurant.name}
        </h3>
        
        {/* Line 2 - Cuisine Tag Pill */}
        <div className="mb-1.5">
          <span className="inline-block px-2 py-0.5 bg-[#F5F0EB] text-[#6B5744] rounded-full text-[11px] font-medium h-[22px] leading-[20px]">
            {restaurant.cuisine}
          </span>
        </div>
        
        {/* Line 3 - Rating + Price */}
        <div className="flex items-center gap-1.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`size-3 flex-shrink-0 ${
                i < Math.floor(restaurant.rating)
                  ? 'fill-[#F4A535] text-[#F4A535]'
                  : 'fill-[#E8E0D8] text-[#E8E0D8]'
              }`}
            />
          ))}
          <span className="text-[12px] font-medium text-[#4A3728] ml-0.5">{restaurant.rating}</span>
          <span className="text-[12px] text-[#4A3728]">· {restaurant.priceRange}</span>
        </div>
        
        {/* Line 4 - Highlight/Feature Text */}
        <p className="text-[12px] text-[#8A8078] truncate overflow-hidden whitespace-nowrap">
          {restaurant.features?.[0] || restaurant.description}
        </p>
      </div>
    </Link>
  );
}

function RankingRow({
  title,
  subtitle,
  icon,
  bgColor,
}: {
  title: string;
  subtitle: string;
  icon: string;
  bgColor: string;
}) {
  return (
    <button className="w-full h-[72px] bg-white rounded-xl flex items-center gap-3 px-4 border border-[#F0EBE3] hover:border-[#E8603C]/20 transition-all">
      <div
        className="size-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0 text-left">
        <h3 className="text-sm font-semibold text-[#2C1A0E] mb-0.5 truncate overflow-hidden whitespace-nowrap">
          {title}
        </h3>
        <p className="text-xs text-[#8A8078] truncate overflow-hidden whitespace-nowrap">
          {subtitle}
        </p>
      </div>
      <svg className="size-4 text-[#C5BDB4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </button>
  );
}

function NeighborhoodRow({ restaurant }: { restaurant: any }) {
  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="w-full h-[88px] bg-white rounded-xl flex items-center gap-3 px-3.5 py-2.5 border border-[#F0EBE3] hover:border-[#E8603C]/20 transition-all"
    >
      {/* Photo */}
      <div className="relative w-20 h-[68px] flex-shrink-0">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full rounded-[10px] object-cover"
        />
        {restaurant.badge && (
          <div
            className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-semibold h-5 flex items-center whitespace-nowrap ${
              restaurant.badge === 'Trending'
                ? 'bg-[#E8603C] text-white'
                : 'bg-[#2D6A4F] text-white'
            }`}
          >
            {restaurant.badge}
          </div>
        )}
      </div>

      {/* Info Block */}
      <div className="flex-1 min-w-0 pr-3">
        <h3 className="text-sm font-semibold text-[#2C1A0E] mb-0.5 truncate overflow-hidden whitespace-nowrap">
          {restaurant.name}
        </h3>
        <p className="text-xs text-[#8A8078] mb-1 truncate overflow-hidden whitespace-nowrap">
          {restaurant.cuisine} · {restaurant.location}
        </p>
        <div className="flex items-center gap-1 whitespace-nowrap overflow-hidden">
          <Star className="size-3 fill-[#F4A535] text-[#F4A535] flex-shrink-0" />
          <span className="text-xs font-medium text-[#4A3728]">{restaurant.rating}</span>
          <span className="text-[11px] text-[#8A8078]">({restaurant.reviewCount.toLocaleString()})</span>
          <span className="text-[#8A8078] mx-1">·</span>
          <span className="text-xs font-medium text-[#6B5744]">{restaurant.priceRange}</span>
        </div>
      </div>

      {/* Chevron */}
      <svg className="size-4 text-[#C5BDB4] flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  );
}

function FriendsActivityCard({ activity, onClick }: { activity: any; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-xl flex items-center gap-2.5 px-3.5 py-3 border-[0.5px] border-[#F0EBE3] hover:border-[#E8603C]/20 transition-all"
    >
      {/* Avatar */}
      <div
        className="size-9 rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0"
        style={{ backgroundColor: activity.avatarBg, color: activity.avatarText }}
      >
        {activity.initials}
      </div>

      {/* Info Block */}
      <div className="flex-1 min-w-0 text-left">
        <div className="text-[13px] mb-0.5 truncate overflow-hidden whitespace-nowrap">
          <span className="font-semibold text-[#2C1A0E]">{activity.userName}</span>
          {' '}
          <span className="font-normal text-[#8A8078]">{activity.action}</span>
        </div>
        <div className="text-[13px] font-semibold text-[#E8603C] mb-0.5 truncate overflow-hidden whitespace-nowrap">
          {activity.restaurantName}
        </div>
        <p className="text-[12px] text-[#8A8078] italic mb-0.5 truncate overflow-hidden whitespace-nowrap">
          "{activity.comment}"
        </p>
        <div className="text-[11px] text-[#B4B2A9]">
          {activity.timestamp}
        </div>
      </div>

      {/* Restaurant Photo */}
      <div className="relative w-[52px] h-[52px] flex-shrink-0">
        <img
          src={activity.photo}
          alt={activity.restaurantName}
          className="w-full h-full rounded-lg object-cover"
        />
      </div>
    </button>
  );
}

function RankingCategoryPill({ icon, label, category }: { icon: React.ReactNode; label: string; category: string }) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate('/rankings', { state: { selectedCategory: category } })}
      className="h-[72px] min-w-fit bg-white border-[0.5px] border-[#F0EBE3] rounded-2xl px-3.5 py-2 flex-shrink-0 flex flex-col items-center justify-center gap-1 hover:border-[#E8603C]/30 hover:bg-[#FDF6EE] transition-all"
    >
      <div className="size-8 flex items-center justify-center">
        {icon}
      </div>
      <span className="text-[11px] font-medium text-[#2C1A0E] whitespace-nowrap">
        {label}
      </span>
    </button>
  );
}

function RankingCategoryCell({ icon, bgColor, label, category }: { icon: string; bgColor: string; label: string; category: string }) {
  const navigate = useNavigate();
  
  return (
    <button
      onClick={() => navigate('/rankings', { state: { selectedCategory: category } })}
      className="h-20 w-full bg-white border-[0.5px] border-[#F0EBE3] rounded-[14px] px-1 py-2 flex flex-col items-center justify-center gap-1.5 hover:border-[#E8603C] hover:bg-[#FDF6EE] transition-all active:scale-95"
    >
      {/* Icon with circular background */}
      <div
        className="size-10 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: bgColor }}
      >
        <span className="text-[28px] leading-none">{icon}</span>
      </div>
      
      {/* Label */}
      <span className="text-[11px] font-medium text-[#2C1A0E] text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-[76px]">
        {label}
      </span>
    </button>
  );
}