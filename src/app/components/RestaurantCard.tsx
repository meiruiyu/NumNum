import { Link } from 'react-router';
import { Star, MapPin, TrendingUp, Users } from 'lucide-react';
import { Restaurant } from '../data/restaurants';

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export function RestaurantCard({ restaurant }: RestaurantCardProps) {
  return (
    <Link to={`/restaurant/${restaurant.id}`} className="block">
      <div className="bg-white rounded-xl overflow-hidden card-shadow hover:card-shadow-hover transition-all duration-300 border border-[#F0EBE3]">
        <div className="relative aspect-square overflow-hidden">
          <img
            src={restaurant.imageUrl}
            alt={restaurant.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {restaurant.trending && (
              <div className="bg-[#E8603C] text-white px-2 py-0.5 rounded-full text-[10px] font-semibold flex items-center gap-1 shadow-lg h-5 whitespace-nowrap">
                <TrendingUp className="size-3 flex-shrink-0" />
                <span className="truncate">Trending</span>
              </div>
            )}
            {restaurant.popular && !restaurant.trending && (
              <div className="bg-[#2D6A4F] text-white px-2 py-0.5 rounded-full text-[10px] font-semibold shadow-lg h-5 whitespace-nowrap">
                Top Pick
              </div>
            )}
          </div>
        </div>
        <div className="p-3.5">
          <h3 className="font-semibold text-[15px] text-[#2C1A0E] mb-2 truncate overflow-hidden whitespace-nowrap">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-2 whitespace-nowrap overflow-hidden">
            <Star className="size-3 fill-[#F4A535] text-[#F4A535] flex-shrink-0" />
            <span className="font-medium text-xs text-[#4A3728]">{restaurant.rating}</span>
            <span className="text-[11px] text-[#8A8078]">({restaurant.reviewCount.toLocaleString()})</span>
            <span className="text-[#8A8078] mx-0.5">·</span>
            <span className="font-medium text-xs text-[#6B5744]">{restaurant.priceRange}</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#8A8078] mb-2 truncate overflow-hidden whitespace-nowrap">
            <span className="font-medium truncate">{restaurant.cuisine}</span>
            <span className="flex-shrink-0">·</span>
            <MapPin className="size-3 flex-shrink-0" />
            <span className="truncate">{restaurant.neighborhood}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}