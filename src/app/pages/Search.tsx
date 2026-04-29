import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowLeft, Search as SearchIcon, SlidersHorizontal, Grid3x3, List, MapIcon, Star, X } from 'lucide-react';
import { RestaurantCard } from '../components/RestaurantCard';
import { SearchResultCard } from '../components/SearchResultCard';
import { occasions } from '../data/restaurants';
import { searchRestaurants } from '../api/restaurants';
import { yelpBatchToRestaurants } from '../api/transform';

export function Search() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [selectedOccasion, setSelectedOccasion] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['NYC']);
  const [selectedNYCAreas, setSelectedNYCAreas] = useState<string[]>([]);
  const [selectedNJAreas, setSelectedNJAreas] = useState<string[]>([]);
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [selectedVibes, setSelectedVibes] = useState<string[]>([]);
  const [openNow, setOpenNow] = useState(false);
  const [walkInAccepted, setWalkInAccepted] = useState(false);

  // Live search results from the API. We store the result in state so we
  // can wire the search input to the backend with debouncing.
  const [apiResults, setApiResults] = useState<any[]>([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(() => {
      setApiLoading(true);
      setApiError(null);
      searchRestaurants({
        term: searchQuery.trim() || 'asian',
        location: 'New York, NY',
        limit: 20,
        sort_by: 'rating',
      })
        .then((res) => {
          if (cancelled) return;
          // Map Yelp businesses into the search-card shape this page expects.
          const mapped = yelpBatchToRestaurants(res.businesses ?? []).map((r) => ({
            id: r.id,
            name: r.name,
            cuisine: r.cuisine,
            location: r.neighborhood,
            distance: '',
            distanceType: 'walk' as const,
            rating: r.rating,
            reviewCount: r.reviewCount,
            priceRange: r.priceRange,
            sceneTags: r.features.slice(0, 2),
            status: r.status ?? ('Open Now' as const),
            friendsVisited: 0,
            imageUrl: r.imageUrl,
          }));
          setApiResults(mapped);
        })
        .catch((err) => {
          if (cancelled) return;
          setApiError(err?.message ?? 'Search failed.');
          setApiResults([]);
        })
        .finally(() => {
          if (!cancelled) setApiLoading(false);
        });
    }, 350); // debounce so we don't spam Yelp on every keystroke

    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [searchQuery]);

  // Empty stub to avoid touching the rest of the file's filter logic
  // (the new searchResultRestaurants is the live API list).
  const searchResultRestaurants = apiResults;

  // Old hardcoded list removed — the backend handles real data now.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _legacyHardcodedRestaurants = [
    {
      id: '1',
      name: 'Flushing Hot Pot',
      cuisine: 'Chinese',
      location: 'Flushing, Queens',
      distance: '8 min',
      distanceType: 'walk' as const,
      rating: 4.7,
      reviewCount: 3284,
      priceRange: '$$',
      sceneTags: ['Group Dining', 'Late Night'],
      status: 'Open Now' as const,
      friendsVisited: 3,
      imageUrl: 'https://images.unsplash.com/photo-1758786267845-7c437f966bb5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxob3QlMjBwb3QlMjByZXN0YXVyYW50JTIwYXNpYW58ZW58MXx8fHwxNzc0NzIyMDY1fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '2',
      name: 'Han Joo KBBQ',
      cuisine: 'Korean',
      location: 'Koreatown, Manhattan',
      distance: '4 min',
      distanceType: 'walk' as const,
      rating: 4.5,
      reviewCount: 1892,
      priceRange: '$$$',
      sceneTags: ['Date Night', 'Group Dining'],
      status: 'Busy' as const,
      friendsVisited: 1,
      imageUrl: 'https://images.unsplash.com/photo-1709433420612-8cad609df914?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxrb3JlYW4lMjBiYnElMjByZXN0YXVyYW50fGVufDF8fHx8MTc3NDcyMTgxN3ww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '3',
      name: 'Ramen Nakamura',
      cuisine: 'Japanese',
      location: 'East Village',
      distance: '14 min',
      distanceType: 'subway' as const,
      rating: 4.6,
      reviewCount: 2107,
      priceRange: '$$',
      sceneTags: ['Solo Dining', 'Late Night'],
      status: 'Open Now' as const,
      friendsVisited: 0,
      imageUrl: 'https://images.unsplash.com/photo-1691426445669-661d566447b1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3p5JTIwcmFtZW4lMjBzaG9wJTIwaW50ZXJpb3J8ZW58MXx8fHwxNzc0NzIyMDY5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: '4',
      name: 'JSQ Spice Garden',
      cuisine: 'Indian',
      location: 'Journal Square, NJ',
      distance: '18 min',
      distanceType: 'subway' as const,
      rating: 4.6,
      reviewCount: 987,
      priceRange: '$',
      sceneTags: ['Hidden Gem', 'Best Value'],
      status: 'Open Now' as const,
      friendsVisited: 2,
      imageUrl: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400',
    },
  ];

  const filteredRestaurants = searchResultRestaurants.filter((restaurant) => {
    const matchesSearch =
      searchQuery === '' ||
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.sceneTags.some((f) => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPrice =
      selectedPriceRanges.length === 0 || selectedPriceRanges.includes(restaurant.priceRange);

    const matchesRating = restaurant.rating >= minRating;

    const matchesOccasion =
      selectedOccasion === 'All' || restaurant.sceneTags.includes(selectedOccasion);

    return matchesSearch && matchesPrice && matchesRating && matchesOccasion;
  });

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

  const handleMapView = () => {
    navigate('/map');
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

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#2C1A0E]/8 px-4 py-4 shadow-sm">
        <div className="flex items-center gap-3 mb-0">
          <button onClick={() => navigate(-1)} className="p-1.5">
            <ArrowLeft className="size-6 text-[#2C1A0E]" />
          </button>
          <div className="flex-1 flex items-center gap-3 px-5 py-3.5 bg-[#F5EDE3] rounded-full">
            <SearchIcon className="size-5 text-[#8A8078]" />
            <input
              type="text"
              placeholder="Asian spots by cuisine, area, price, vibe..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-[#2C1A0E] placeholder:text-[#B4B2A9] text-[13px] font-normal"
              autoFocus
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3 rounded-full transition-all shadow-sm ${
              showFilters ? 'bg-[#E8603C] text-white' : 'bg-[#F5EDE3] text-[#8A8078]'
            }`}
          >
            <SlidersHorizontal className="size-5" />
          </button>
        </div>
      </div>

      {/* Filter Bottom Sheet */}
      {showFilters && (
        <div className="fixed inset-0 bg-black/40 z-[80]" onClick={() => setShowFilters(false)}>
          <div 
            className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[20px] max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drag Handle */}
            <div className="w-10 h-1 bg-[#D4C9BE] rounded-full mx-auto my-4" />
            
            {/* Header */}
            <div className="px-4 pb-4 border-b border-[#F0EBE3] flex items-center justify-between">
              <h3 className="text-[17px] font-bold text-[#2C1A0E]">Filter</h3>
              <button onClick={clearAllFilters} className="text-[13px] text-[#8A8078]">
                Clear All
              </button>
            </div>

            <div className="px-4 py-5 space-y-5">
              {/* Location Filter */}
              <FilterSection title="Location">
                <div className="flex gap-2 mb-3">
                  {['NYC', 'New Jersey'].map((region) => (
                    <button
                      key={region}
                      onClick={() => toggleRegion(region)}
                      className={`px-4 py-2 rounded-full text-xs transition-all ${
                        selectedRegions.includes(region)
                          ? 'bg-[#E8603C] text-white'
                          : 'bg-white text-[#8A8078] border border-[#E8E0D8]'
                      }`}
                    >
                      {region}
                    </button>
                  ))}
                </div>

                {selectedRegions.includes('NYC') && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {['Manhattan', 'Queens', 'Brooklyn', 'Bronx', 'Staten Island'].map((area) => (
                      <button
                        key={area}
                        onClick={() => toggleArea(area, 'nyc')}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                          selectedNYCAreas.includes(area)
                            ? 'bg-[#E8603C] text-white'
                            : 'bg-white text-[#8A8078] border border-[#E8E0D8]'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                )}

                {selectedRegions.includes('New Jersey') && (
                  <div className="flex flex-wrap gap-2">
                    {['Jersey City', 'Hoboken', 'Fort Lee', 'Weehawken', 'Edgewater'].map((area) => (
                      <button
                        key={area}
                        onClick={() => toggleArea(area, 'nj')}
                        className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                          selectedNJAreas.includes(area)
                            ? 'bg-[#E8603C] text-white'
                            : 'bg-white text-[#8A8078] border border-[#E8E0D8]'
                        }`}
                      >
                        {area}
                      </button>
                    ))}
                  </div>
                )}
              </FilterSection>

              {/* Cuisine Filter */}
              <FilterSection title="Cuisine">
                <div className="flex flex-wrap gap-2">
                  {['Chinese', 'Japanese', 'Korean', 'Thai', 'Vietnamese', 'Malaysian', 'Indian', 'Italian', 'Mexican', 'American', 'Mediterranean', 'Middle Eastern', 'Brunch', 'Desserts', 'Bubble Tea', 'Bakery & Cafe', 'Seafood', 'BBQ', 'Hot Pot', 'Sushi', 'Dim Sum', 'Street Food'].map((cuisine) => (
                    <button
                      key={cuisine}
                      onClick={() => toggleCuisine(cuisine)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        selectedCuisines.includes(cuisine)
                          ? 'bg-[#E8603C] text-white'
                          : 'bg-white text-[#8A8078] border border-[#E8E0D8]'
                      }`}
                    >
                      {cuisine}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* Price Range Filter */}
              <FilterSection title="Price per Person">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {[
                    { label: '$10-$20', value: '$' },
                    { label: '$20-$35', value: '$$' },
                    { label: '$35-$55', value: '$$$' },
                    { label: '$55-$80', value: '$$$$' },
                    { label: '$80+', value: '$$$$$' },
                  ].map((range) => (
                    <button
                      key={range.value}
                      onClick={() => {
                        setSelectedPriceRanges((prev) =>
                          prev.includes(range.value)
                            ? prev.filter((r) => r !== range.value)
                            : [...prev, range.value]
                        );
                      }}
                      className={`h-10 rounded-lg text-xs font-medium transition-all ${
                        selectedPriceRanges.includes(range.value)
                          ? 'bg-[#E8603C] text-white'
                          : 'bg-white text-[#4A3728] border border-[#E0D8D0]'
                      }`}
                    >
                      {range.label}
                    </button>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-[#8A8078]">
                  <span>Budget-friendly</span>
                  <span>Fine dining</span>
                </div>
              </FilterSection>

              {/* Rating Filter */}
              <FilterSection title="Minimum Rating">
                <div className="flex flex-wrap gap-2 mb-2">
                  {[
                    { label: 'Any', value: 0 },
                    { label: '3.0+', value: 3.0 },
                    { label: '3.5+', value: 3.5 },
                    { label: '4.0+', value: 4.0 },
                    { label: '4.2+', value: 4.2 },
                    { label: '4.5+', value: 4.5 },
                    { label: '4.8+', value: 4.8 },
                  ].map((rating) => (
                    <button
                      key={rating.value}
                      onClick={() => setMinRating(rating.value)}
                      className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                        minRating === rating.value
                          ? 'bg-[#E8603C] text-white'
                          : 'bg-white text-[#4A3728] border border-[#E0D8D0]'
                      }`}
                    >
                      {rating.label}
                    </button>
                  ))}
                </div>
                {minRating > 0 && (
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < Math.floor(minRating)
                            ? 'fill-[#F4A535] text-[#F4A535]'
                            : 'text-[#E8E0D8]'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </FilterSection>

              {/* Vibe Filter */}
              <FilterSection title="Vibe" subtitle="What's the occasion?">
                <div className="flex flex-wrap gap-2">
                  {['Date Night', 'Friends Gathering', 'Solo Dining', 'Special Occasion', 'Business Lunch', 'Family', 'Instagrammable', 'Quiet & Cozy', 'Lively & Fun', 'Local Favorite', 'Hidden Gem', 'Walk-in OK', 'Outdoor Seating', 'Late Night', 'Lunch Special'].map((vibe) => (
                    <button
                      key={vibe}
                      onClick={() => toggleVibe(vibe)}
                      className={`px-3 py-1.5 rounded-full text-xs transition-all ${
                        selectedVibes.includes(vibe)
                          ? 'bg-[#E8603C] text-white'
                          : 'bg-white text-[#8A8078] border border-[#E8E0D8]'
                      }`}
                    >
                      {vibe}
                    </button>
                  ))}
                </div>
              </FilterSection>

              {/* More Options */}
              <FilterSection title="More Options">
                <div className="space-y-0">
                  <ToggleRow label="Open Now" value={openNow} onChange={setOpenNow} />
                  <ToggleRow label="Walk-in Accepted" value={walkInAccepted} onChange={setWalkInAccepted} />
                  <ToggleRow label="Verified Reviews Only" value={false} onChange={() => {}} />
                  <ToggleRow label="Asian-Friendly Menu" value={false} onChange={() => {}} />
                  <ToggleRow label="Menu Translation Available" value={false} onChange={() => {}} />
                </div>
              </FilterSection>
            </div>

            {/* Bottom Button */}
            <div className="sticky bottom-0 bg-white border-t border-[#F0EBE3] px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
              <button
                onClick={() => setShowFilters(false)}
                className="w-full h-[52px] bg-[#E8603C] text-white rounded-xl text-[16px] font-semibold hover:bg-[#D55534] transition-colors"
              >
                Show {filteredRestaurants.length} Results
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-5">
          <p className="text-[#8A8078] font-medium text-[13px]">
            {filteredRestaurants.length} restaurant{filteredRestaurants.length !== 1 ? 's' : ''}{' '}
            found
          </p>
          
          {/* View Toggle */}
          <div className="flex items-center bg-white rounded-full border border-[#2C1A0E]/10 p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-full transition-all ${
                viewMode === 'grid' ? 'bg-[#E8603C] text-white' : 'text-[#8A8078]'
              }`}
            >
              <Grid3x3 className="size-[18px]" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-full transition-all ${
                viewMode === 'list' ? 'bg-[#E8603C] text-white' : 'text-[#8A8078]'
              }`}
            >
              <List className="size-[18px]" />
            </button>
            <button
              onClick={handleMapView}
              className={`p-2 rounded-full transition-all ${
                viewMode === 'map' ? 'bg-[#E8603C] text-white' : 'text-[#8A8078]'
              }`}
            >
              <MapIcon className="size-[18px]" />
            </button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {filteredRestaurants.map((restaurant) => (
              <SearchResultCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </div>
        )}

        {filteredRestaurants.length === 0 && (
          <div className="text-center py-16">
            <p className="text-[#8A8078] mb-2 text-lg font-medium">No restaurants found</p>
            <p className="text-sm text-[#8A8078]/70">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterSection({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="border-b border-[#F0EBE3] pb-5 last:border-0">
      <h4 className="text-[16px] font-semibold text-[#2C1A0E] mb-1">{title}</h4>
      {subtitle && <p className="text-xs text-[#8A8078] mb-3">{subtitle}</p>}
      {children}
    </div>
  );
}

function ToggleRow({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between h-11 border-b border-[#F0EBE3] last:border-0">
      <span className="text-sm text-[#2C1A0E]">{label}</span>
      <button
        onClick={() => onChange(!value)}
        className={`w-12 h-7 rounded-full transition-all relative ${
          value ? 'bg-[#E8603C]' : 'bg-[#E8E0D8]'
        }`}
      >
        <div
          className={`absolute top-1 size-5 bg-white rounded-full transition-all ${
            value ? 'right-1' : 'left-1'
          }`}
        />
      </button>
    </div>
  );
}
