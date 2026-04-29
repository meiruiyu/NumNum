import { useState, useEffect } from 'react';
import { Utensils, SlidersHorizontal, Trophy, MessageCircle } from 'lucide-react';
import { NumNumLogo } from './NumNumLogo';

interface OnboardingProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Onboarding({ isOpen, onClose }: OnboardingProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isOpen) return null;

  const handleEnter = () => {
    // Fade out animation
    setIsVisible(false);
    // Wait for fade out, then call onClose
    setTimeout(() => {
      onClose();
    }, 300);
  };

  return (
    <div
      className={`fixed inset-0 z-[100] bg-[#2C1A0E]/92 transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ touchAction: 'none' }}
    >
      <div className="h-full overflow-y-auto px-8 pt-12 pb-6">
        <div className="max-w-md mx-auto flex flex-col items-center">
          {/* App Icon */}
          <NumNumLogo size={64} className="mb-3" />

          {/* App Name */}
          <h1 className="text-[26px] font-bold text-white text-center mb-1">
            NumNum
          </h1>

          {/* Tagline */}
          <p className="text-sm text-white/70 text-center mb-8">
            Discover NYC & NJ dining, the real way.
          </p>

          {/* Feature Cards */}
          <div className="w-full space-y-3 mb-7">
            {/* Card 1: Smart Filter & Discovery */}
            <div className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3.5">
                <div className="size-11 rounded-xl bg-[#E8603C]/25 flex items-center justify-center flex-shrink-0">
                  <SlidersHorizontal className="size-[22px] text-[#E8603C]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-white mb-1">
                    Smart Filter & Discovery
                  </h3>
                  <p className="text-[13px] text-white/70 leading-relaxed">
                    Search by cuisine, area, price, and vibe — compare structured restaurant cards across NYC & NJ instantly.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 2: Rankings & Top Dishes */}
            <div className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3.5">
                <div className="size-11 rounded-xl bg-[#FAC775]/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="size-[22px] text-[#FAC775]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-white mb-1">
                    Rankings & Top Dishes
                  </h3>
                  <p className="text-[13px] text-white/70 leading-relaxed">
                    Browse curated NYC rankings and see the most recommended dishes at every restaurant — no guessing needed.
                  </p>
                </div>
              </div>
            </div>

            {/* Card 3: Friends Space */}
            <div className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 backdrop-blur-sm">
              <div className="flex items-start gap-3.5">
                <div className="size-11 rounded-xl bg-[#1D9E75]/20 flex items-center justify-center flex-shrink-0">
                  <MessageCircle className="size-[22px] text-[#1D9E75]" strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-[15px] font-semibold text-white mb-1">
                    Friends Space
                  </h3>
                  <p className="text-[13px] text-white/70 leading-relaxed">
                    See where your friends are eating, share recommendations, and discover restaurants through people you trust.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Enter Button */}
          <button
            onClick={handleEnter}
            className="w-full h-14 bg-[#E8603C] rounded-full text-white text-[17px] font-bold hover:bg-[#D55534] transition-colors relative animate-pulse-glow"
          >
            Enter NumNum
          </button>

          {/* Terms & Privacy */}
          <p className="text-[11px] text-white/45 text-center mt-3">
            By continuing you agree to our Terms & Privacy
          </p>
        </div>
      </div>
    </div>
  );
}