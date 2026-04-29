import { Star } from 'lucide-react';

interface FilterBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedRegions: string[];
  selectedNYCAreas: string[];
  selectedNJAreas: string[];
  selectedCuisines: string[];
  selectedPriceRanges: string[];
  minRating: number;
  selectedVibes: string[];
  openNow: boolean;
  walkInAccepted: boolean;
  onRegionToggle: (region: string) => void;
  onAreaToggle: (area: string, type: 'nyc' | 'nj') => void;
  onCuisineToggle: (cuisine: string) => void;
  onPriceRangeChange: (ranges: string[]) => void;
  onRatingChange: (rating: number) => void;
  onVibeToggle: (vibe: string) => void;
  onOpenNowChange: (value: boolean) => void;
  onWalkInAcceptedChange: (value: boolean) => void;
  onClearAll: () => void;
  onShowResults: () => void;
  resultsCount?: number;
}

export function FilterBottomSheet({
  isOpen,
  onClose,
  selectedRegions,
  selectedNYCAreas,
  selectedNJAreas,
  selectedCuisines,
  selectedPriceRanges,
  minRating,
  selectedVibes,
  openNow,
  walkInAccepted,
  onRegionToggle,
  onAreaToggle,
  onCuisineToggle,
  onPriceRangeChange,
  onRatingChange,
  onVibeToggle,
  onOpenNowChange,
  onWalkInAcceptedChange,
  onClearAll,
  onShowResults,
  resultsCount = 0,
}: FilterBottomSheetProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 z-[80]" onClick={onClose}>
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[20px] max-h-[85vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag Handle */}
        <div className="w-10 h-1 bg-[#D4C9BE] rounded-full mx-auto my-4" />
        
        {/* Header */}
        <div className="px-4 pb-4 border-b border-[#F0EBE3] flex items-center justify-between">
          <h3 className="text-[17px] font-bold text-[#2C1A0E]">Filter</h3>
          <button onClick={onClearAll} className="text-[13px] text-[#8A8078]">
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
                  onClick={() => onRegionToggle(region)}
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
                    onClick={() => onAreaToggle(area, 'nyc')}
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
                    onClick={() => onAreaToggle(area, 'nj')}
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
                  onClick={() => onCuisineToggle(cuisine)}
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
                    const newRanges = selectedPriceRanges.includes(range.value)
                      ? selectedPriceRanges.filter((r) => r !== range.value)
                      : [...selectedPriceRanges, range.value];
                    onPriceRangeChange(newRanges);
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
                  onClick={() => onRatingChange(rating.value)}
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
                  onClick={() => onVibeToggle(vibe)}
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
              <ToggleRow label="Open Now" value={openNow} onChange={onOpenNowChange} />
              <ToggleRow label="Walk-in Accepted" value={walkInAccepted} onChange={onWalkInAcceptedChange} />
              <ToggleRow label="Verified Reviews Only" value={false} onChange={() => {}} />
              <ToggleRow label="Asian-Friendly Menu" value={false} onChange={() => {}} />
              <ToggleRow label="Menu Translation Available" value={false} onChange={() => {}} />
            </div>
          </FilterSection>
        </div>

        {/* Bottom Button */}
        <div className="sticky bottom-0 bg-white border-t border-[#F0EBE3] px-4 pt-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
          <button
            onClick={onShowResults}
            className="w-full h-[52px] bg-[#E8603C] text-white rounded-xl text-[16px] font-semibold hover:bg-[#D55534] transition-colors"
          >
            Show {resultsCount} Results
          </button>
        </div>
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
