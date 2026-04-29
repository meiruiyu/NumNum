import { Link } from 'react-router';
import { Star, MapPin, Footprints, Train } from 'lucide-react';

interface SearchResultCardProps {
  restaurant: {
    id: string;
    name: string;
    cuisine: string;
    location: string;
    distance: string;
    distanceType: 'walk' | 'subway';
    rating: number;
    reviewCount: number;
    priceRange: string;
    sceneTags: string[];
    status: 'Open Now' | 'Closed' | 'Busy';
    friendsVisited?: number;
    imageUrl: string;
  };
}

export function SearchResultCard({ restaurant }: SearchResultCardProps) {
  const statusStyles = {
    'Open Now': 'bg-[#2D6A4F] text-white',
    'Closed': 'bg-[#8A8078] text-white',
    'Busy': 'bg-[#BA7517] text-white',
  };

  // Generate friend avatars (mock data — these represent OTHER friends who
  // visited, not the logged-in user, so we use generic non-placeholder initials).
  const friendAvatars = restaurant.friendsVisited
    ? Array.from({ length: Math.min(restaurant.friendsVisited, 2) }, (_, i) => ({
        id: i,
        initials: ['EM', 'SK', 'AL', 'MK'][i],
        color: ['from-[#E8603C] to-[#F4A535]', 'from-[#2D6A4F] to-[#52B788]'][i % 2],
      }))
    : [];

  return (
    <Link
      to={`/restaurant/${restaurant.id}`}
      className="w-full h-[100px] bg-white rounded-xl border border-[#F0EBE3] flex items-center gap-3 px-3.5 py-3 hover:border-[#E8603C]/30 transition-all"
    >
      {/* LEFT: Photo */}
      <div className="relative w-[88px] h-[76px] flex-shrink-0">
        <img
          src={restaurant.imageUrl}
          alt={restaurant.name}
          className="w-full h-full rounded-[10px] object-cover"
        />
        {/* Status Badge */}
        <div
          className={`absolute top-2 left-2 px-1.5 py-0.5 rounded text-[10px] font-semibold h-[18px] flex items-center whitespace-nowrap ${
            statusStyles[restaurant.status]
          }`}
        >
          {restaurant.status}
        </div>
      </div>

      {/* MIDDLE: Info Block */}
      <div className="flex-1 min-w-0 pr-2">
        {/* ROW 1: Name + Cuisine Tag */}
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-sm font-semibold text-[#2C1A0E] truncate overflow-hidden whitespace-nowrap flex-1">
            {restaurant.name}
          </h3>
          <span className="px-1.5 py-0.5 bg-[#F0EBE3] text-[#6B5744] rounded text-[10px] font-medium flex-shrink-0 whitespace-nowrap">
            {restaurant.cuisine}
          </span>
        </div>

        {/* ROW 2: Location + Distance */}
        <div className="flex items-center gap-1 text-xs text-[#8A8078] mb-1 truncate overflow-hidden whitespace-nowrap">
          <MapPin className="size-[10px] flex-shrink-0" />
          <span className="truncate">{restaurant.location}</span>
          <span className="flex-shrink-0">·</span>
          {restaurant.distanceType === 'walk' ? (
            <Footprints className="size-[10px] flex-shrink-0" />
          ) : (
            <Train className="size-[10px] flex-shrink-0" />
          )}
          <span className="flex-shrink-0 whitespace-nowrap">{restaurant.distance}</span>
        </div>

        {/* ROW 3: Rating + Price */}
        <div className="flex items-center gap-1 mb-1 whitespace-nowrap overflow-hidden">
          <Star className="size-3 fill-[#F4A535] text-[#F4A535] flex-shrink-0" />
          <span className="text-xs font-medium text-[#4A3728]">{restaurant.rating}</span>
          <span className="text-[11px] text-[#8A8078]">({restaurant.reviewCount.toLocaleString()})</span>
          <span className="text-[#8A8078] mx-0.5">·</span>
          <span className="text-xs font-medium text-[#4A3728]">{restaurant.priceRange}</span>
        </div>

        {/* ROW 4: Scene Tags */}
        <div className="flex items-center gap-1 overflow-hidden">
          {restaurant.sceneTags.slice(0, 2).map((tag, index) => (
            <span
              key={index}
              className="px-1.5 py-0.5 bg-[#FDF6EE] text-[#993C1D] rounded text-[10px] font-medium whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
          {restaurant.sceneTags.length > 2 && (
            <span className="px-1.5 py-0.5 bg-[#FDF6EE] text-[#993C1D] rounded text-[10px] font-medium whitespace-nowrap">
              +{restaurant.sceneTags.length - 2}
            </span>
          )}
        </div>
      </div>

      {/* RIGHT: Friends Badge or Chevron */}
      {restaurant.friendsVisited ? (
        <div className="w-12 flex-shrink-0 flex flex-col items-center justify-center gap-1">
          {/* Stacked Avatars */}
          <div className="flex -space-x-1.5">
            {friendAvatars.map((avatar) => (
              <div
                key={avatar.id}
                className={`size-5 rounded-full bg-gradient-to-br ${avatar.color} border border-white flex items-center justify-center text-white text-[8px] font-semibold`}
              >
                {avatar.initials}
              </div>
            ))}
          </div>
          {/* Friends Label */}
          <span className="text-[10px] font-medium text-[#E8603C] whitespace-nowrap">
            {restaurant.friendsVisited} {restaurant.friendsVisited === 1 ? 'friend' : 'friends'}
          </span>
        </div>
      ) : (
        <svg
          className="size-4 text-[#C5BDB4] flex-shrink-0"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
    </Link>
  );
}