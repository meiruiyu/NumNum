import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import {
  ArrowLeft, Search, ThumbsUp, Bookmark, MapPin, Edit3, ChevronDown,
} from 'lucide-react';
import { getRestaurantById, getRestaurantMenu, type MenuDish } from '../api/restaurants';

/* =========================================================================
 *  RecommendedDishes — full page reached via /restaurant/:id/dishes
 *
 *  Two tabs:
 *    - Recommended Dishes: top 10 dishes for this restaurant, ranked
 *      with TOP 1-N badges, thumbs-up "user likes", and save buttons.
 *    - Full Menu: same data grouped by category with collapsible sections.
 *
 *  Data source: the same /api/restaurants/:id/menu endpoint that powers the
 *  detail page's MenuTab. The menu dishes come from one of 12 cuisine
 *  templates picked based on the restaurant's primary category, so a Korean
 *  BBQ place shows galbi/bulgogi/etc., a pizza place shows pizza/pasta, etc.
 * ========================================================================= */

const LANGUAGES = [
  { id: 'english',     label: 'English' },
  { id: 'simplified',  label: '简体中文' },
  { id: 'traditional', label: '繁體中文' },
  { id: 'japanese',    label: '日本語' },
  { id: 'korean',      label: '한국어' },
  { id: 'thai',        label: 'ภาษาไทย' },
] as const;

type LanguageId = typeof LANGUAGES[number]['id'];

const CATEGORY_ORDER = ['Signature', 'Appetizer', 'Main', 'Side', 'Dessert', 'Drink', 'Other'];

/* Pseudo "user picks" count + comment per dish — deterministic by dish id
 * so they don't change between renders, no backend needed. */
const SAMPLE_QUOTES = [
  "Best in NYC!",
  "Solid choice for groups",
  "Hidden gem, must try",
  "Perfect for date night",
  "Authentic flavors",
  "Generous portions",
  "Great value",
  "Crowd favorite",
  "Cozy and delicious",
  "Light and refreshing dessert",
];

function pseudoLikes(dish: MenuDish, idx: number): number {
  const base = [12, 9, 7, 6, 5, 4, 3, 3, 2, 1];
  return base[idx] ?? Math.max(1, dish.id % 9);
}

function pseudoQuote(dish: MenuDish, idx: number): string {
  return SAMPLE_QUOTES[idx % SAMPLE_QUOTES.length];
}

export function RecommendedDishes() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [restaurantName, setRestaurantName] = useState<string>('Restaurant');
  const [dishes, setDishes] = useState<MenuDish[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<'recommended' | 'menu'>('recommended');
  const [selectedLanguage, setSelectedLanguage] = useState<LanguageId>('english');
  const [showCheckInSheet, setShowCheckInSheet] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<string[]>(['Signature']);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Resolve restaurant name (from cache or Yelp).
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    getRestaurantById(id)
      .then((res) => {
        if (cancelled) return;
        if (res.restaurant?.name) setRestaurantName(res.restaurant.name);
      })
      .catch(() => { /* fall back to default name */ });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Fetch the menu (same source the detail page uses).
  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    getRestaurantMenu(id)
      .then((res) => {
        if (cancelled) return;
        setDishes(res.dishes ?? []);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err?.message ?? 'Could not load menu.');
        setDishes([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  // Top dishes for the "Recommended" tab — Signature first, then Mains, etc.
  const rankedDishes = useMemo(() => {
    if (!dishes.length) return [];
    const signature = dishes.filter((d) => d.category === 'Signature');
    const mains     = dishes.filter((d) => d.category === 'Main');
    const others    = dishes.filter(
      (d) => d.category !== 'Signature' && d.category !== 'Main',
    );
    return [...signature, ...mains, ...others];
  }, [dishes]);

  // Group dishes for the "Full Menu" tab.
  const grouped = useMemo(() => {
    const buckets: Record<string, MenuDish[]> = {};
    for (const d of dishes) {
      const cat = CATEGORY_ORDER.includes(d.category) ? d.category : 'Other';
      (buckets[cat] ??= []).push(d);
    }
    return CATEGORY_ORDER
      .filter((c) => buckets[c]?.length)
      .map((c) => ({ name: c, items: buckets[c] }));
  }, [dishes]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((c) => c !== categoryId) : [...prev, categoryId],
    );
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#FDF6EE] flex items-center justify-center">
        <div className="size-10 border-4 border-[#F0EBE3] border-t-[var(--brand-primary,#E8603C)] rounded-full animate-spin" />
      </div>
    );
  }

  // Error / empty state
  if (error || dishes.length === 0) {
    return (
      <div className="min-h-screen bg-[#FDF6EE]">
        <div className="sticky top-0 z-50 bg-white border-b border-[#F0EBE3] h-[52px] flex items-center px-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="size-5 text-[#2C1A0E]" />
          </button>
          <h1 className="ml-2 text-[15px] font-semibold text-[#2C1A0E] truncate">
            {restaurantName}
          </h1>
        </div>
        <div className="text-center px-5 py-16">
          <p className="text-[#8A8078] mb-4 text-lg">No menu available</p>
          {error && <p className="text-xs text-[#993C1D]">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDF6EE] pb-20">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-[#F0EBE3]" style={{ height: '52px' }}>
        <div className="h-full px-3 sm:px-4 flex items-center justify-between gap-2">
          <button
            onClick={() => navigate(-1)}
            className="p-2 -ml-2 hover:bg-[#FDF6EE] rounded-lg transition-colors flex-shrink-0"
            aria-label="Back"
          >
            <ArrowLeft className="size-5 text-[#2C1A0E]" />
          </button>

          <div className="flex-1 flex items-center justify-center gap-4 sm:gap-6 min-w-0">
            <button onClick={() => setActiveTab('recommended')} className="relative pb-1">
              <span
                className={`text-[13px] sm:text-[15px] transition-all ${
                  activeTab === 'recommended'
                    ? 'font-semibold text-[#2C1A0E]'
                    : 'font-normal text-[#8A8078]'
                }`}
              >
                Recommended Dishes
              </span>
              {activeTab === 'recommended' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-primary,#E8603C)]" />
              )}
            </button>
            <button onClick={() => setActiveTab('menu')} className="relative pb-1">
              <span
                className={`text-[13px] sm:text-[15px] transition-all ${
                  activeTab === 'menu'
                    ? 'font-semibold text-[#2C1A0E]'
                    : 'font-normal text-[#8A8078]'
                }`}
              >
                Full Menu
              </span>
              {activeTab === 'menu' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--brand-primary,#E8603C)]" />
              )}
            </button>
          </div>

          <button
            className="p-2 -mr-2 hover:bg-[#FDF6EE] rounded-lg transition-colors flex-shrink-0"
            aria-label="Search"
          >
            <Search className="size-5 text-[#8A8078]" />
          </button>
        </div>
      </div>

      {/* Language Selector */}
      <div className="sticky top-[52px] z-40 bg-[#FDF6EE] border-b border-[#F0EBE3] px-3 sm:px-4 py-2">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {LANGUAGES.map((lang) => (
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

      {/* Tab content */}
      {activeTab === 'recommended' ? (
        <>
          <div className="px-4 py-3">
            <h2 className="text-[15px] sm:text-[16px] text-[#2C1A0E]">
              <span className="font-bold">User Picks</span>{' '}
              <span className="font-normal text-[#8A8078]">({rankedDishes.length * 3 + 4})</span>
            </h2>
          </div>

          <div className="bg-white">
            {rankedDishes.map((dish, idx) => (
              <DishRow
                key={dish.id}
                dish={dish}
                rank={idx + 1}
                selectedLanguage={selectedLanguage}
                likes={pseudoLikes(dish, idx)}
                quote={pseudoQuote(dish, idx)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="bg-[#FDF6EE]">
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
                      className={`size-4 text-[#8A8078] transition-transform ${
                        isOpen ? 'rotate-180' : ''
                      }`}
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

          <div className="bg-[#FDF6EE] px-6 py-4 text-center">
            <p className="text-[11px] text-[#B4B2A9] leading-relaxed">
              Sample menu — actual dishes and prices vary by restaurant.
            </p>
          </div>
        </div>
      )}

      {/* Bottom action bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#F0EBE3] h-14 px-3 sm:px-4 py-2">
        <div className="flex items-center gap-2 sm:gap-2.5 h-full">
          <button
            onClick={() => setShowCheckInSheet(true)}
            className="flex-[0.4] h-10 bg-white border border-[var(--brand-primary,#E8603C)] rounded-[10px] flex items-center justify-center gap-1.5 hover:bg-[#FDF6EE] transition-colors"
          >
            <MapPin className="size-4 text-[var(--brand-primary,#E8603C)]" />
            <span className="text-[12px] sm:text-[13px] font-semibold text-[var(--brand-primary,#E8603C)]">
              Check In
            </span>
          </button>
          <button
            onClick={() => alert('Write review feature coming soon.')}
            className="flex-[0.6] h-10 bg-[var(--brand-primary,#E8603C)] rounded-[10px] flex items-center justify-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <Edit3 className="size-4 text-white" />
            <span className="text-[12px] sm:text-[13px] font-semibold text-white">Write Review</span>
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
          <div className="fixed bottom-0 left-0 right-0 z-[70] bg-white rounded-t-[20px] h-[180px] px-6 py-5">
            <h3 className="text-lg font-bold text-[#2C1A0E] mb-2 text-center">
              Check in at {restaurantName}?
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
                onClick={() => setShowCheckInSheet(false)}
                className="flex-1 h-12 bg-[var(--brand-primary,#E8603C)] rounded-xl font-semibold text-white hover:opacity-90 transition-opacity"
              >
                Check In
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*                          DishRow component                          */
/* ------------------------------------------------------------------ */

function DishRow({
  dish,
  rank,
  selectedLanguage,
  likes: initialLikes,
  quote,
}: {
  dish: MenuDish;
  rank: number;
  selectedLanguage: LanguageId;
  likes: number;
  quote: string;
}) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [saved, setSaved] = useState(false);

  const handleLike = () => {
    setLiked((v) => !v);
    setLikeCount((n) => (liked ? n - 1 : n + 1));
  };

  const rankBadgeBg =
    rank === 1 ? 'bg-[var(--brand-primary,#E8603C)] text-white' :
    rank <= 3  ? 'bg-[#BA7517] text-white' :
                 'bg-[#888780] text-white';

  return (
    <div className="bg-white border-b border-[#F0EBE3] px-3 sm:px-4 py-3 min-h-[120px] flex gap-3">
      {/* Rank + Photo */}
      <div className="flex-shrink-0 relative w-[100px] sm:w-[110px]">
        <div className="relative w-full h-24 rounded-[10px] overflow-hidden bg-[#F0EBE3]">
          {dish.image && (
            <img
              src={dish.image}
              alt={dish.translations.english}
              className="w-full h-full object-cover"
            />
          )}
          <div
            className={`absolute top-0 left-0 px-1.5 py-0.5 text-[10px] font-bold rounded-br-md ${rankBadgeBg}`}
          >
            TOP {rank}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm sm:text-[15px] font-semibold text-[#2C1A0E] mb-0.5 truncate">
          {dish.translations[selectedLanguage] || dish.translations.english}
        </h4>
        {selectedLanguage !== 'english' && (
          <p className="text-[11px] text-[#B4B2A9] mb-0.5 truncate">
            {dish.translations.english}
          </p>
        )}
        <p className="text-[12px] sm:text-[13px] text-[#4A3728] italic mb-1 line-clamp-1">
          "{quote}"
        </p>
        <div className="flex items-center gap-2 text-[11px] text-[#E8603C]">
          <span className="font-medium">${dish.price}</span>
          <span className="text-[#B4B2A9]">·</span>
          <span className="text-[#8A8078]">{dish.category}</span>
        </div>
      </div>

      {/* Like + Save */}
      <div className="flex flex-col items-center justify-center gap-3 flex-shrink-0">
        <button onClick={handleLike} className="flex flex-col items-center gap-0.5">
          <ThumbsUp
            className={`size-5 transition-colors ${
              liked ? 'fill-[var(--brand-primary,#E8603C)] text-[var(--brand-primary,#E8603C)]' : 'text-[#8A8078]'
            }`}
          />
          <span className="text-[10px] text-[#8A8078]">{likeCount}</span>
        </button>
        <button
          onClick={() => setSaved((v) => !v)}
          className="flex flex-col items-center gap-0.5"
        >
          <Bookmark
            className={`size-5 transition-colors ${
              saved ? 'fill-[var(--brand-primary,#E8603C)] text-[var(--brand-primary,#E8603C)]' : 'text-[#8A8078]'
            }`}
          />
          <span className="text-[10px] text-[#8A8078]">Save</span>
        </button>
      </div>
    </div>
  );
}
