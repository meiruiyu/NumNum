import { NavLink } from 'react-router';
import { Home, MapPin, Search, UserPlus, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

export function BottomNav() {
  const [hasNotification, setHasNotification] = useState(true);
  
  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/map', icon: MapPin, label: 'Map' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/friends-space', icon: MessageCircle, label: 'Friends', hasNotification: true },
    { to: '/profile', icon: UserPlus, label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-[0.5px] border-[#F0EBE3] z-50">
      <div className="flex items-center justify-around px-1 sm:px-2 py-2 max-w-screen-xl mx-auto h-14">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `relative flex flex-col items-center gap-1 px-2 sm:px-4 py-2 rounded-xl transition-all ${
                isActive ? 'text-[var(--brand-primary,#E8603C)]' : 'text-[#8A8078]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div className="relative">
                  <item.icon className="size-[20px] sm:size-[22px]" strokeWidth={isActive ? 2.5 : 2} />
                  {item.hasNotification && hasNotification && (
                    <div className="absolute -top-1 -right-1 size-2 bg-[var(--brand-primary,#E8603C)] rounded-full" />
                  )}
                </div>
                <span className={`text-[9px] sm:text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                  {item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}