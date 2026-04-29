import { Search, Bookmark, User } from 'lucide-react';
import { Link, useNavigate } from 'react-router';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#2C1A0E]/8 shadow-sm">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between mb-4">
          <Link to="/" className="flex items-baseline gap-1.5">
            <span className="text-[28px] font-bold text-[#E8603C] tracking-tight">NumNum</span>
            <span className="text-[28px] font-bold text-[#2C1A0E] tracking-tight">NYC</span>
          </Link>
          <div className="flex items-center gap-2">
            <button className="p-2.5 hover:bg-[#FDF6EE] rounded-full transition-colors">
              <Bookmark className="size-5 text-[#8A8078]" />
            </button>
            <button className="p-2.5 hover:bg-[#FDF6EE] rounded-full transition-colors">
              <User className="size-5 text-[#8A8078]" />
            </button>
          </div>
        </div>
        <button
          onClick={() => navigate('/search')}
          className="w-full flex items-center gap-3 px-5 py-3.5 bg-[#F5EDE3] hover:bg-[#F0E4D7] rounded-full text-left transition-colors"
        >
          <Search className="size-5 text-[#8A8078]" />
          <span className="text-[#8A8078] font-medium">Search restaurants, cuisines...</span>
        </button>
      </div>
    </header>
  );
}