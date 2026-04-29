import { useState } from 'react';

interface FilterChipsProps {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
}

export function FilterChips({ items, selected, onSelect }: FilterChipsProps) {
  return (
    <div className="flex gap-2.5 overflow-x-auto px-5 pb-2 scrollbar-hide">
      {items.map((item) => (
        <button
          key={item}
          onClick={() => onSelect(item)}
          className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 flex-shrink-0 tracking-wide ${
            selected === item
              ? 'bg-[#E8603C] text-white shadow-md'
              : 'bg-white text-[#8A8078] hover:bg-[#F5EDE3] border border-[#2C1A0E]/10'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}