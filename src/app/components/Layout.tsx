import { Outlet } from 'react-router';
import { BottomNav } from './BottomNav';
import { AuthGate } from './AuthGate';
import { ChatBot } from './ChatBot';

export function Layout() {
  return (
    <AuthGate>
      <div className="min-h-screen bg-[#FDF6EE]">
        <Outlet />
        <BottomNav />
        <div className="h-20" /> {/* Spacer for bottom nav */}
        {/* Global floating chatbot — appears on every page in the layout */}
        <ChatBot />
      </div>
    </AuthGate>
  );
}
