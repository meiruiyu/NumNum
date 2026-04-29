import { useNavigate } from 'react-router';
import { Users, Utensils, MessageCircle } from 'lucide-react';

export function FriendsSpacePermission() {
  const navigate = useNavigate();

  const handleEnable = () => {
    navigate('/friends-space');
  };

  const handleMaybeLater = () => {
    navigate('/');
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-5 z-50">
      <div className="bg-white rounded-[20px] p-7 max-w-sm w-full">
        {/* Illustration */}
        <div className="flex justify-center mb-6">
          <div className="w-[120px] h-[120px] bg-gradient-to-br from-[#E8603C]/20 to-[#FDF6EE] rounded-full flex items-center justify-center">
            <div className="relative">
              <div className="absolute -left-6 -top-2">
                <div className="size-12 rounded-full bg-[#E8603C] flex items-center justify-center">
                  <span className="text-white text-lg">👤</span>
                </div>
              </div>
              <div className="absolute -right-6 -top-2">
                <div className="size-12 rounded-full bg-[#F4A535] flex items-center justify-center">
                  <span className="text-white text-lg">👤</span>
                </div>
              </div>
              <div className="text-4xl">🍜</div>
            </div>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-[22px] font-bold text-[#2C1A0E] text-center mb-3">
          Discover where your friends eat
        </h2>

        {/* Body Text */}
        <p className="text-[13px] text-[#8A8078] text-center mb-6 leading-relaxed">
          See where your friends have been, share your favorite spots, and discover new restaurants
          through the people you trust.
        </p>

        {/* Features List */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-3 h-10">
            <Users className="size-5 text-[#E8603C] flex-shrink-0" />
            <span className="text-[13px] text-[#4A3728]">See friends' recent check-ins</span>
          </div>
          <div className="flex items-center gap-3 h-10">
            <Utensils className="size-5 text-[#E8603C] flex-shrink-0" />
            <span className="text-[13px] text-[#4A3728]">Share & recommend restaurants</span>
          </div>
          <div className="flex items-center gap-3 h-10">
            <MessageCircle className="size-5 text-[#E8603C] flex-shrink-0" />
            <span className="text-[13px] text-[#4A3728]">Chat about food with friends</span>
          </div>
        </div>

        {/* Privacy Note */}
        <p className="text-[11px] text-[#8A8078] text-center mb-6">
          Your activity is private by default.
          <br />
          You control what you share.
        </p>

        {/* Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleEnable}
            className="w-full h-[52px] bg-[#E8603C] text-white rounded-xl text-[16px] font-bold hover:bg-[#D55534] transition-colors"
          >
            Enable Friends Space
          </button>
          <button
            onClick={handleMaybeLater}
            className="w-full text-[13px] text-[#8A8078] hover:text-[#2C1A0E] transition-colors"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
