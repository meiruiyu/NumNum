import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router';
import { ArrowLeft, Search as SearchIcon, Star, ChevronDown } from 'lucide-react';
import { searchRestaurants, type SearchParams } from '../api/restaurants';
import { yelpBatchToRestaurants } from '../api/transform';
import type { Restaurant } from '../data/restaurants';

/* =========================================================================
 *  Rankings — live Yelp data, per category.
 *
 *  Each category card from Home maps to a Yelp search query (categories +
 *  term + sort) so users get real, relevant restaurants instead of mock data.
 *
 *  We use the user's geolocation when granted, otherwise we fall back to
 *  Columbia University Uris Hall — the same default the Map page uses.
 * ========================================================================= */

// Map each home-screen category id to a Yelp Fusion search query.
// Yelp's category aliases are lowercase, comma-separated. See:
//   https://blog.yelp.com/businesses/yelp_category_list/
const CATEGORY_QUERY: Record<string, SearchParams & { uiLabel: string }> = {
  all:               { uiLabel: 'All Asian',       term: 'asian',                                      sort_by: 'rating' },
  'stir-fry':        { uiLabel: 'Stir-Fry',        term: 'stir fry',         categories: 'chinese',     sort_by: 'rating' },
  'ramen':           { uiLabel: 'Ramen',                                     categories: 'ramen',       sort_by: 'rating' },
  'southeast-asian': { uiLabel: 'Southeast Asian',                            categories: 'thai,vietnamese,malaysian,indonesian,filipino', sort_by: 'rating' },
  'korean-bbq':      { uiLabel: 'Korean BBQ',      term: 'korean bbq',       categories: 'korean,bbq',  sort_by: 'rating' },
  'date-night':      { uiLabel: 'Date Night',      term: 'asian',                                      sort_by: 'rating', price: '3,4' },
  'best-value':      { uiLabel: 'Best Value',      term: 'asian',                                      sort_by: 'rating', price: '1,2' },
  'hidden-gems':     { uiLabel: 'Hidden Gems',     term: 'asian',                                      sort_by: 'rating' },
  'cafe':            { uiLabel: 'Cafe',                                       categories: 'cafes,coffee,bubbletea', sort_by: 'rating' },
  'late-night':      { uiLabel: 'Late Night',      term: 'late night asian', categories: 'asianfusion,ramen,korean', sort_by: 'rating' },
  'brunch':          { uiLabel: 'Brunch',          term: 'asian brunch',     categories: 'breakfast_brunch,asianfusion', sort_by: 'rating' },
  'asian-picks':     { uiLabel: 'Asian Picks',     term: 'asian',            categories: 'chinese,japanese,korean,thai,vietnamese', sort_by: 'rating' },
  'new-openings':    { uiLabel: 'New Openings',    term: 'new asian',                                  sort_by: 'best_match' },
};

const CATEGORIES = [
  { id: 'all',              label: 'All' },
  { id: 'stir-fry',         label: 'Stir-Fry' },
  { id: 'ramen',            label: 'Ramen' },
  { id: 'southeast-asian',  label: 'Southeast Asian' },
  { id: 'korean-bbq',       label: 'Korean BBQ' },
  { id: 'date-night',       label: 'Date Night' },
  { id: 'best-value',       label: 'Best Value' },
  { id: 'hidden-gems',      label: 'Hidden Gems' },
  { id: 'cafe',             label: 'Cafe' },
  { id: 'late-night',       label: 'Late Night' },
  { id: 'brunch',           label: 'Brunch' },
  { id: 'asian-picks',      label: 'Asian Picks' },
  { id: 'new-openings',     label: 'New Openings' },
];

const FILTERS = ['Top Rated', 'Most Reviewed', 'Best Value', 'Veteran Spots'];

const COLUMBIA_URIS_HALL = { lat: 40.8076, lng: -73.9626 };

interface RankedRestaurant extends Restaurant {
  pricePerPerson: number;
  quote: string;
  rank: number;
}

function priceToDollars(p: string): number {
  // Rough "per person" dollar estimate based on Yelp's $ tier.
  if (p === '$') return 18;
  if (p === '$$') return 32;
  if (p === '$$$') return 55;
  if (p === '$$$$') return 95;
  return 25;
}

const SAMPLE_QUOTES = [
  'Authentic flavors and great service!',
  'A must-try for anyone in NYC.',
  'Hidden gem — worth the trek.',
  'Cozy spot perfect for date night.',
  'Generous portions, fair prices.',
  'Best in the neighborhood, hands down.',
  'Don\'t miss the signature dish.',
  'Late-night go-to for ramen lovers.',
];

function quoteFor(name: string): string {
  // Deterministic quote based on the restaurant name so it stays stable.
  const seed = Array.from(name).reduce((s, c) => s + c.charCodeAt(0), 0);
  return SAMPLE_QUOTES[seed % SAMPLE_QUOTES.length];
}

export function Rankings() {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const initialCategory = routerLocation.state?.selectedCategory || 'all';

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedFilter, setSelectedFilter] = useState<string>('Top Rated');
  const [priceSort, setPriceSort] = useState<'none' | 'asc' | 'desc'>('none');

  const [results, setResults] = useState<RankedRestaurant[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Geolocation — used to anchor the Yelp search near the user's actual area.
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Step 1 — request browser geolocation; fall back to Columbia.
  useEffect(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setCoords(COLUMBIA_URIS_HALL);
      setUsingFallback(true);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setUsingFallback(false);
      },
      () => {
        setCoords(COLUMBIA_URIS_HALL);
        setUsingFallback(true);
      },
      { timeout: 6000, maximumAge: 60_000 },
    );
  }, []);

  // Step 2 — fetch real data whenever category or coords change.
  useEffect(() => {
    if (!coords) return;
    let cancelled = false;
    setLoading(true);
    setErrorMsg(null);

    const cfg = CATEGORY_QUERY[selectedCategory] ?? CATEGORY_QUERY.all;
    const params: SearchParams = {
      ...cfg,
      latitude: coords.lat,
      longitude: coords.lng,
      radius: 5000,                 // 5 km — wider for rankings since we want enough variety
      limit: 20,                    // ask for 20, post-filter down to 10+ ranks
    };

    searchRestaurants(params)
      .then((res) => {
        if (cancelled) return;
        let list = yelpBatchToRestaurants(res.businesses ?? []);

        // Apply category-specific post-filter.
        if (selectedCategory === 'hidden-gems') {
          list = list.filter((r) => r.reviewCount < 250 && r.rating >= 4.3);
        }
        if (selectedCategory === 'best-value') {
          list = list.filter((r) => r.priceRange === '$' || r.priceRange === '$$');
        }

        // Map into ranked rows for display.
        const ranked: RankedRestaurant[] = list.map((r, i) => ({
          ...r,
          pricePerPerson: priceToDollars(r.priceRange),
          quote: quoteFor(r.name),
          rank: i + 1,
        }));
        setResults(ranked);
      })
      .catch((err) => {
        if (cancelled) return;
        setErrorMsg(err?.message ?? 'Failed to load rankings.');
        setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedCategory, coords]);

  // Apply the filter sidebar (sort).
  const sortedResults = useMemo(() => {
    let list = [...results];
    if (selectedFilter === 'Top Rated') {
      list.sort((a, b) => b.rating - a.rating);
    } else if (selectedFilter === 'Most Reviewed') {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    } else if (selectedFilter === 'Best Value') {
      list.sort((a, b) => a.pricePerPerson - b.pricePerPerson || b.rating - a.rating);
    } else if (selectedFilter === 'Veteran Spots') {
      list.sort((a, b) => b.reviewCount - a.reviewCount);
    }
    if (priceSort === 'asc') list.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
    if (priceSort === 'desc') list.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
    // Re-rank after sorting.
    return list.map((r, i) => ({ ...r, rank: i + 1 }));
  }, [results, selectedFilter, priceSort]);

  const getRankBadgeStyle = (rank: number) => {
    if (rank === 1) return { bg: '#E8603C', text: 'TOP 01' };
    if (rank <= 3)  return { bg: '#BA7517', text: `TOP ${String(rank).padStart(2, '0')}` };
    return { bg: '#888780', text: `TOP ${String(rank).padStart(2, '0')}` };
  };

  const getCategoryTitle = () => {
    const c = CATEGORIES.find((c) => c.id === selectedCategory);
    if (selectedCategory === 'all') return 'All Rankings';
    return `${c?.label} Taste Rankings`;
  };

  const togglePriceSort = () => {
    setPriceSort((p) => (p === 'none' ? 'asc' : p === 'asc' ? 'desc' : 'none'));
  };

  return (
    <div className="min-h-screen bg-[#FDF6EE]">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b-[0.5px] border-[#F0EBE3] px-4 py-3">
        <div className="flex items-center justify-between h-[44px] sm:h-[52px]">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2" aria-label="Back">
            <ArrowLeft className="size-5 text-[#2C1A0E]" />
          </button>
          <h1 className="text-[16px] sm:text-[17px] font-semibold text-[#2C1A0E]">
            NYC Rankings
          </h1>
          <button onClick={() => navigate('/search')} className="p-2 -mr-2" aria-label="Search">
            <SearchIcon className="size-5 text-[#8A8078]" />
          </button>
        </div>
      </div>

      {/* Category tabs */}
      <div className="sticky top-[60px] sm:top-[68px] z-40 bg-white border-b-[0.5px] border-[#F0EBE3]">
        <div className="flex gap-4 sm:gap-6 overflow-x-auto px-4 scrollbar-hide">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`py-3 text-[12px] sm:text-[13px] font-medium whitespace-nowrap flex-shrink-0 relative ${
                selectedCategory === category.id
                  ? 'text-[#2C1A0E] font-semibold'
                  : 'text-[#8A8078]'
              }`}
            >
              {category.label}
              {selectedCategory === category.id && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--brand-primary,#E8603C)]" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Location hint */}
      <div className="px-4 py-2 bg-[#FDF6EE] text-[11px] text-[#8A8078] border-b border-[#F0EBE3]">
        📍 {usingFallback
          ? 'Showing rankings near Columbia University Uris Hall'
          : 'Showing rankings near your current location'}
      </div>

      {/* Main */}
      <div className="flex">
        {/* Left filter sidebar */}
        <div className="w-16 sm:w-20 flex-shrink-0 bg-[#F5F0EB] border-r-[0.5px] border-[#F0EBE3] min-h-screen">
          {FILTERS.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`w-full h-12 flex items-center justify-center text-[11px] sm:text-[13px] relative overflow-hidden ${
                selectedFilter === filter
                  ? 'bg-white text-[var(--brand-primary,#E8603C)] font-semibold'
                  : 'text-[#8A8078] font-normal'
              }`}
            >
              {selectedFilter === filter && (
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[var(--brand-primary,#E8603C)]" />
              )}
              <span className="text-center leading-[1.2] px-1">{filter}</span>
            </button>
          ))}
        </div>

        {/* Right content */}
        <div className="flex-1 bg-[#FDF6EE] min-w-0">
          <div className="px-3 sm:px-3.5 py-2.5 flex items-center justify-between border-b-[0.5px] border-[#F0EBE3] bg-white">
            <h2 className="text-[13px] sm:text-[14px] font-bold text-[#2C1A0E] truncate">
              {getCategoryTitle()}
            </h2>
            <button
              onClick={togglePriceSort}
              className="flex items-center gap-1 text-[11px] sm:text-[12px] font-medium text-[#8A8078] flex-shrink-0"
            >
              Price
              <ChevronDown className={`size-3 transition-transform ${priceSort === 'desc' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {errorMsg && (
            <div className="mx-3 my-3 text-[11px] text-[#993C1D] bg-[#FFF6F5] border border-[#F4CBC4] rounded-lg p-2">
              {errorMsg}
            </div>
          )}

          {loading && (
            <div className="px-3 py-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-[100px] bg-white border-b border-[#F0EBE3] flex items-center gap-3 px-3.5 py-2.5">
                  <div className="size-[80px] rounded-[10px] bg-[#F5F0EB] animate-pulse flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-[#F5F0EB] rounded w-3/4 animate-pulse" />
                    <div className="h-3 bg-[#F5F0EB] rounded w-1/2 animate-pulse" />
                    <div className="h-3 bg-[#F5F0EB] rounded w-2/3 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && sortedResults.length === 0 && !errorMsg && (
            <p className="text-sm text-[#8A8078] text-center py-12 px-4">
              No restaurants found for this category. Try another tab.
            </p>
          )}

          {!loading &&
            sortedResults.map((r) => {
              const badge = getRankBadgeStyle(r.rank);
              return (
                <Link
                  key={r.id}
                  to={`/restaurant/${r.id}`}
                  className="h-[100px] sm:h-[108px] bg-white border-b-[0.5px] border-[#F0EBE3] px-3 sm:px-3.5 py-2.5 flex items-center gap-2 sm:gap-2.5 hover:bg-[#FDF6EE] transition-colors"
                >
                  {/* Rank + Photo */}
                  <div className="relative w-[80px] h-[80px] sm:w-[88px] sm:h-[88px] flex-shrink-0">
                    <div
                      className="absolute top-0 left-0 z-10 px-1.5 py-0.5 text-[9px] font-bold text-white"
                      style={{
                        backgroundColor: badge.bg,
                        borderRadius: '6px 0 6px 0',
                      }}
                    >
                      {badge.text}
                    </div>
                    <img
                      src={r.imageUrl}
                      alt={r.name}
                      className="w-full h-full rounded-[10px] object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center gap-0.5">
                    <h3 className="text-[13px] sm:text-[14px] font-semibold text-[#2C1A0E] truncate">
                      {r.name}
                    </h3>
                    <div className="flex items-center gap-1 sm:gap-1.5 flex-wrap">
                      <Star className="size-3 fill-[#F4A535] text-[#F4A535] flex-shrink-0" />
                      <span className="text-[12px] sm:text-[13px] font-semibold text-[var(--brand-primary,#E8603C)]">
                        {r.rating.toFixed(1)}
                      </span>
                      <span className="text-[11px] sm:text-[12px] text-[#8A8078] truncate">
                        · ${r.pricePerPerson}/person
                      </span>
                    </div>
                    <p className="text-[11px] sm:text-[12px] font-normal text-[#8A8078] truncate">
                      {r.neighborhood} · {r.cuisine}
                    </p>
                    <p className="text-[11px] sm:text-[12px] font-normal text-[#4A3728] italic truncate">
                      "{r.quote}"
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </div>
  );
}
