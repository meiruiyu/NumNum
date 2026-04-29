// src/app/components/AuthGate.tsx
// Wraps any subtree that requires the user to be logged in. If no user
// is found in localStorage, we redirect to /login.

import { useEffect } from 'react';
import { useNavigate } from 'react-router';
import { getUser } from '../lib/auth';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (!getUser()) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  // While the redirect runs we render a small loader instead of the
  // protected content (prevents a 1-frame flash).
  if (!getUser()) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FDF6EE]">
        <div className="size-10 border-4 border-[#F0EBE3] border-t-[var(--brand-primary,#E8603C)] rounded-full animate-spin" />
      </div>
    );
  }
  return <>{children}</>;
}
