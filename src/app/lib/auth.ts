// src/app/lib/auth.ts
// Lightweight client-side "demo auth" — purely for class project polish.
// We persist the logged-in user in localStorage and detect their school
// from the email domain to drive the theme color.
//
// IMPORTANT: This is NOT a real auth system. The backend doesn't verify
// anything. Don't ship this to production.

import { applyTheme, type SchoolKey } from './theme';

const STORAGE_KEY = 'numnum_user';
const LEGACY_STORAGE_KEY = 'nomnom_user';

export interface AuthUser {
  email: string;
  name: string;        // derived from email local-part
  school: SchoolKey;   // 'nyu' | 'columbia' | 'cornell' | 'fordham' | 'guest'
  loggedInAt: string;  // ISO timestamp
}

/**
 * Detect which school a given email belongs to. Looks at the domain
 * (everything after the @). Anything not recognised maps to 'guest'.
 *
 * Subdomains are accepted: e.g. "stern.nyu.edu" is still NYU,
 * "law.columbia.edu" is still Columbia, etc.
 */
export function detectSchool(email: string): SchoolKey {
  const domain = email.toLowerCase().split('@')[1] ?? '';
  if (domain === 'nyu.edu'       || domain.endsWith('.nyu.edu'))      return 'nyu';
  if (domain === 'columbia.edu'  || domain.endsWith('.columbia.edu')) return 'columbia';
  if (domain === 'cornell.edu'   || domain.endsWith('.cornell.edu'))  return 'cornell';
  if (domain === 'fordham.edu'   || domain.endsWith('.fordham.edu'))  return 'fordham';
  return 'guest';
}

/**
 * Build a friendly display name from the email local-part.
 *   "cynthia.lu237@nyu.edu" -> "Cynthia Lu237"
 *   "yl5931@columbia.edu"   -> "Yl5931"
 */
export function nameFromEmail(email: string): string {
  const local = email.split('@')[0] ?? 'Student';
  return local
    .replace(/[._-]+/g, ' ')
    .replace(/\b\w/g, (ch) => ch.toUpperCase())
    .trim();
}

/**
 * Take a person's name and return up-to-2-letter uppercase initials.
 * Used wherever we render an avatar circle.
 *   "Cynthia Lu" -> "CL"
 *   "Yl5931"     -> "Y"
 *   ""           -> "U" (catch-all)
 */
export function initialsFromName(name: string | null | undefined): string {
  const safe = (name ?? '').trim();
  if (!safe) return 'U';
  const parts = safe.split(/\s+/).filter(Boolean);
  const letters = parts.map((p) => p[0]).join('');
  return (letters.slice(0, 2) || safe[0]).toUpperCase();
}

export function getUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    let raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      raw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
      if (raw) {
        window.localStorage.setItem(STORAGE_KEY, raw);
        window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      }
    }
    if (!raw) return null;
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function setUser(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  applyTheme(user.school);
}

export function clearUser(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
  window.localStorage.removeItem(LEGACY_STORAGE_KEY);
  applyTheme('guest');
}

/**
 * Initialise the theme on app boot — call this from main.tsx so the
 * correct colours are applied as early as possible.
 */
export function bootstrapAuth(): AuthUser | null {
  const user = getUser();
  applyTheme(user?.school ?? 'guest');
  return user;
}
