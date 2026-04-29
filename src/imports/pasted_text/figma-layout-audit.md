PERFORM A FULL LAYOUT AND FORMAT AUDIT across every
screen in this Figma file. Fix every instance of the
issues listed below. Do not skip any screen.
Do not make any visual design changes — only fix
formatting, spacing, typography, and overlap errors.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE 1 — TEXT OVERFLOW & TRUNCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Find every text element that extends beyond
its parent container boundary.

Rule A — Single-line labels (names, titles,
  navigation labels, button text, badge text,
  card titles, usernames, location names,
  cuisine tags, ranking titles):
  Set to: fixed width = parent container width
  Text truncation: ellipsis (…)
  Text wrap: off (single line only)

Rule B — Multi-line body text (descriptions,
  review excerpts, card subtitles, highlights,
  user quotes, dish descriptions):
  Maximum lines: 2
  Text truncation: ellipsis after line 2
  Word wrap: on

Rule C — Badge and pill text:
  Single line only, no wrap
  If text too long: reduce to 10px minimum
  Pill width is fixed — text never expands pill

Rule D — Section headers:
  Single line, no wrap
  Ellipsis if too long
  Never allow header text to push layout down

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE 2 — ELEMENT OVERLAP (unintentional)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Find every case where two or more elements
overlap each other unintentionally.

PERMITTED overlaps (do not fix these):
  - Photo badges ("Open Now", "Trending",
    "Top Pick", "TOP 01" etc.) on photos
  - Friend avatar stacks with white borders
  - Red notification dot on nav icons
  - Rank badge on ranking photo top-left
  - Chopstick logo star between tips

FIX all other overlaps by:
  - Adding margin/padding between elements
  - Reducing element size to fit container
  - Repositioning elements to correct zones
  - Ensuring Auto Layout prevents collapse

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE 3 — INCONSISTENT CARD HEIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Within each list or grid, all cards must share
the same fixed height. Find and fix any section
where cards in the same list have different heights.

Enforce these fixed heights:

Home Top Picks horizontal cards: 240px total
  (photo 160px + info section 80px)

Search result / Wishlist / Been There rows: 100px

Neighborhood / Friends feed preview rows: 88px

Rankings Detail restaurant rows: 108px
  Exception: Rank 1 hero row: 120px

Ranking Detail left sidebar items: 48px

Dish item rows in Menu tab: 72px

Recommended Dishes view all rows: 120px

Profile reward cards: 80px

Profile badge cells: 72px

Collection cards (My Collections): 140px

Friends Space feed cards: variable height OK

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE 4 — SPACING INCONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enforce these exact spacing values everywhere:

Screen horizontal edge padding: 16px both sides
  No content starts at x=0 or ends at x=393px

Section vertical gap (between sections): 24px
  Exception: Top Picks → Rankings: 16px

Card-to-card gap in vertical list: 8px

Card-to-card gap in horizontal scroll: 12px

Card internal padding: 12px top/bottom, 14px sides

Section header margin-bottom: 12px

Section subtitle margin-bottom: 8px

Tab bar internal horizontal padding: 0 16px

Bottom nav bar height: 56px + safe area

Filter pill gap horizontal: 8px
Filter pill gap vertical when wrapping: 6px

Rankings grid cell gap: 8px (row and column)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE 5 — TYPOGRAPHY INCONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Audit every text element. Fix any deviation
from this exact type scale:

L1 — Screen/page titles:
  22px · weight 700 · #2C1A0E

L2 — Section headers (Top Picks, NYC Rankings,
  Friends Space, Recommended Dishes etc.):
  20px · weight 700 · #2C1A0E

L3 — Card titles / restaurant names:
  14–15px · weight 600 · #2C1A0E

L4 — Body / description / subtitle text:
  13px · weight 400 · #4A3728

L5 — Secondary info (rating number, price,
  distance, cuisine type, location):
  12px · weight 500 · #6B5744

L6 — Captions / timestamps / muted labels:
  11px · weight 400 · #8A8078

Badge/pill text: 10–11px · weight 600

Bottom nav labels:
  10px · weight 500
  Active: #E8603C · Inactive: #8A8078

Primary button text: 14–16px · weight 600 · white

Secondary / text link: 13–14px · weight 500

Top bar center "NomNom":
  15px · weight 700 · #E8603C

Top bar center tagline:
  8px · weight 400 · #8A8078

Find and correct ANY text using sizes outside
this scale (e.g. 9px, 16px body, 18px card title,
24px section header, 26px page title etc.)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE 6 — COLOR INCONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Replace any off-palette color with the correct value:

Primary / active:        #E8603C
Page background:         #FDF6EE
Card surface:            #FFFFFF
Card border:             #F0EBE3 (0.5px)
Text primary:            #2C1A0E
Text secondary:          #8A8078
Text muted:              #B4B2A9
Divider lines:           #F0EBE3
Rating stars:            #F4A535
Open Now green:          #2D6A4F
Busy/warning amber:      #BA7517
Error/destructive red:   #E24B4A
Left sidebar background: #F5F0EB

Fix all instances of:
  Pure black #000000 text → #2C1A0E
  Pure gray text → nearest palette value
  Bright blue links → #E8603C
  White cards with no border → add 0.5px #F0EBE3
  Any green that is not #2D6A4F → correct it
  Any orange that is not #E8603C → correct it

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE 7 — BORDER RADIUS INCONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enforce:
  Restaurant / dish / profile cards: 12px
  Large cards / bottom sheets / modals: 16–20px
  Pills / toggles / tags / search bar: 999px
  Small category badges on cards: 4px
  Photo thumbnails inside cards: 8–10px
  Primary full-width buttons: 12px
  Inline/compact buttons: 999px
  NYC Rankings grid category cells: 14px
  App logo icon container: 16px
  Reservation time slot buttons: 10px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE 8 — LANGUAGE CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Scan every screen for non-English UI text.
Remove or replace any Chinese, Korean, Japanese,
or other language characters appearing in:
  Section headers, nav labels, button text,
  placeholder text, badge text, filter labels,
  tab labels, settings labels, tooltip text

PERMITTED non-English text:
  Restaurant names (any language)
  Language selector native script labels
  Menu item original names in Menu/Translate tab
  User-generated content in Friends Space

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE 9 — ICON SIZE CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enforce these icon sizes throughout:

Bottom navigation icons: 22×22px
Top bar icons (back arrow, search, bookmark): 20px
Quick action icons (Directions, Reserve, Call): 22px
Card bookmark/heart icons: 20px
Filter icon in search bar: 18px
Cuisine tag icons in NYC Rankings grid: 28px
  (inside 40px circle container)
Chat bubble icon (Friends Space entry): 24px
Settings gear icon: 20px
Star rating icons: 12px per star

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ISSUE 10 — BOTTOM NAV BAR CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The bottom navigation bar must be identical
across all main screens. Verify on every screen:

  5 tabs: Home · Map · Search · Friends · Profile
  Height: 56px + safe area inset
  Background: #FFFFFF
  Top border: 0.5px #F0EBE3
  Active tab: icon + label in #E8603C
  Inactive tab: icon + label in #8A8078
  Icon size: 22×22px
  Label size: 10px, weight 500
  Gap between icon and label: 4px

Fix any screen where the bottom nav:
  Shows wrong number of tabs
  Uses different colors
  Has wrong height
  Is missing from a main screen

━━━━━━━━━━━━━━━━━━━━━━━━━━━━