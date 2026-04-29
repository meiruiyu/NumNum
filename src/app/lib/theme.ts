// src/app/lib/theme.ts
// Per-school color theming. We expose the brand colors via CSS custom
// properties on the document root (--brand-primary, --brand-primary-dark,
// --brand-soft) so the rest of the app's Tailwind classes can stay generic
// while we still get a school-flavored accent.
//
// Each school also has a `mascot` emoji used on the Login card alongside
// the text "University of <mascot>". (We dropped the image-based logos
// because Wikimedia Commons hotlinks were blocked / unreliable in the
// browser — emoji + theme color carries the identity just fine.)

export type SchoolKey = 'nyu' | 'columbia' | 'cornell' | 'fordham' | 'guest';

export interface ThemeTokens {
  primary: string;       // main accent color
  primaryDark: string;   // hover / pressed
  soft: string;          // subtle background tint
  label: string;         // human-readable school name
  mascot: string;        // emoji shown next to "University of"
}

export const THEMES: Record<SchoolKey, ThemeTokens> = {
  nyu: {
    primary:     '#57068C',  // NYU's official violet
    primaryDark: '#3F0466',
    soft:        '#F2E9F8',
    label:       'NYU',
    mascot:      '🐾',      // Bobcats
  },
  columbia: {
    primary:     '#1E3A8A',  // Columbia / Ivy blue
    primaryDark: '#152A66',
    soft:        '#E5EAF5',
    label:       'Columbia',
    mascot:      '🦁',      // Lions
  },
  cornell: {
    primary:     '#B31B1B',  // Cornell Big Red
    primaryDark: '#8B1414',
    soft:        '#F8E5E5',
    label:       'Cornell',
    mascot:      '🐻',      // Big Red Bears
  },
  fordham: {
    primary:     '#660000',  // Fordham maroon
    primaryDark: '#4A0000',
    soft:        '#F2E5E5',
    label:       'Fordham',
    mascot:      '🐏',      // Rams
  },
  guest: {
    primary:     '#E8603C',  // app default orange
    primaryDark: '#D55534',
    soft:        '#FDF6EE',
    label:       'Guest',
    mascot:      '',
  },
};

/**
 * Apply a school's theme to the document by writing CSS custom properties
 * on :root. Components that opt-in to theming use these vars.
 */
export function applyTheme(school: SchoolKey): void {
  if (typeof document === 'undefined') return;
  const tokens = THEMES[school] ?? THEMES.guest;
  const root = document.documentElement;
  root.style.setProperty('--brand-primary', tokens.primary);
  root.style.setProperty('--brand-primary-dark', tokens.primaryDark);
  root.style.setProperty('--brand-soft', tokens.soft);
  root.dataset.school = school;
}

/** Lookup tokens for a given school (used to color inline style props). */
export function getTheme(school: SchoolKey): ThemeTokens {
  return THEMES[school] ?? THEMES.guest;
}
