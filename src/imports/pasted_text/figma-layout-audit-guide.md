PERFORM A COMPREHENSIVE LAYOUT AUDIT across every single
screen in this Figma file. Find and fix ALL instances of
the following problems. Do not skip any screen.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM 1 — TEXT OVERFLOW & TRUNCATION
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Find every text element that extends beyond its
parent container boundary.

Fix rule — apply to ALL single-line text labels
(restaurant names, section headers, tab labels,
button text, badge text, navigation labels,
card titles, usernames, location names):
  - Set text to Fixed width (match parent container)
  - Set overflow: hidden
  - Set text truncation: ellipsis (…)
  - Set text to single line / no wrap

Fix rule — apply to ALL multi-line descriptive text
(review excerpts, dish descriptions, subtitles,
card body text):
  - Set to maximum 2 lines
  - Set overflow: hidden
  - Set text truncation: ellipsis after line 2

Fix rule — apply to ALL badge and pill text:
  - Force single line, no wrap
  - If text is too long for the pill, reduce font size
    to 10px minimum before truncating
  - Never let a pill expand to fit its text content —
    the pill has a fixed width, the text conforms to it

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM 2 — ELEMENT OVERLAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Find every instance where two or more UI elements
overlap each other unintentionally (text over text,
icon over text, card over card, badge over content).

Intentional overlaps that must be KEPT:
  - Restaurant photo badges ("Open Now", "Trending",
    "Top Pick") overlaid on photo top-left corner
  - Friend avatar stack in social cards (overlapping
    avatars with white border between them)
  - Notification red dot on tab bar icons and
    on the chat bubble icon

Everything else must NOT overlap. Fix by:
  - Adding sufficient margin/padding between elements
  - Reducing element size to fit within its container
  - Repositioning elements that sit outside their
    designated zone
  - Ensuring Auto Layout spacing prevents collapse

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM 3 — INCONSISTENT CARD HEIGHTS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Within any single list or grid, all cards must be
the same fixed height. Find and fix any section
where cards in the same row or list have
different heights.

Enforce these fixed heights by card type:

Horizontal scroll large cards (Top Picks):
  Fixed height: 300px

Search result / list view cards:
  Fixed height: 100px

Neighborhood / Wishlist / Been There list cards:
  Fixed height: 88px

Rankings list rows:
  Fixed height: 72px

Dish item rows (Menu & Translate tab):
  Fixed height: 72px

Top Dishes ranking rows:
  Rank 1 hero row: 120px
  Rank 2–5 rows: 88px

Friends Space feed cards:
  Variable height is acceptable ONLY for feed cards
  because comment text varies — all other card types
  must be fixed height.

Profile reward cards:
  Fixed height: 80px

Profile achievement badge items:
  Fixed height: 72px (icon 48px + label 24px)

Collection cards (My Collections tab):
  Fixed height: 140px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM 4 — SPACING INCONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Audit and enforce these spacing values on every screen:

Screen horizontal edge padding: 16px (both sides)
  — No content should start at x=0 or end at x=393

Section vertical gap (between sections): 24px

Card-to-card gap in vertical list: 8px

Card-to-card gap in horizontal scroll: 12px

Card internal padding: 12px top/bottom, 14px left/right

Section header margin-bottom (before content): 12px

Tab bar internal padding: 0 16px

Bottom navigation bar height: 56px + safe area

Filter pill gap (between pills): 8px horizontal,
  6px vertical when wrapping

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM 5 — TYPOGRAPHY INCONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Audit every text element across all screens.
Fix any deviation from this type scale:

Level 1 — Page/screen titles:
  22px · weight 700 · #2C1A0E

Level 2 — Section headers:
  20px · weight 700 · #2C1A0E

Level 3 — Card titles / restaurant names:
  14–15px · weight 600 · #2C1A0E

Level 4 — Body / description text:
  13px · weight 400 · #4A3728

Level 5 — Secondary info (rating, price, distance):
  12px · weight 500 · #6B5744

Level 6 — Captions / timestamps / muted labels:
  11px · weight 400 · #8A8078

Badge / pill text:
  10–11px · weight 600

Navigation bar labels:
  10px · weight 500
  Active: #E8603C · Inactive: #8A8078

Button text — primary:
  14–16px · weight 600 · white #FFFFFF

Button text — secondary / text link:
  13–14px · weight 500 · #2C1A0E or #E8603C

No font size outside this scale is permitted.
Find and correct any text using arbitrary sizes
such as 9px, 16px (body), 18px (card title),
24px (section header), etc.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM 6 — COLOR INCONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Audit every color used across all screens.
Replace any off-palette color with the correct value:

Primary action / active states: #E8603C
Page background: #FDF6EE
Card surface: #FFFFFF
Card border: #F0EBE3 (0.5px)
Text primary: #2C1A0E
Text secondary: #8A8078
Text muted/caption: #B4B2A9
Divider lines: #F0EBE3
Rating stars: #F4A535 (amber)
Success / open now green: #2D6A4F
Warning / busy amber: #BA7517
Destructive / error red: #E24B4A

Find and fix:
  - Any pure black (#000000) used for text
    → replace with #2C1A0E
  - Any pure gray (#999999, #666666 etc.)
    → replace with nearest palette value
  - Any bright blue used for links
    → replace with #E8603C (terracotta)
  - Any white background card that uses no border
    → add 0.5px solid #F0EBE3 border

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROBLEM 7 — BORDER RADIUS INCONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enforce these border-radius values:

Cards (restaurant, dish, collection, profile sections):
  border-radius: 12px

Large feature cards / bottom sheets / modals:
  border-radius: 16–20px

Pills / tags / toggles / small badges:
  border-radius: 999px (fully rounded)

Small category badges on cards:
  border-radius: 4px

Photo thumbnails inside cards:
  border-radius: 8–10px

Input fields / search bar:
  border-radius: 999px (pill shape)

Primary action buttons:
  border-radius: 12px (full width buttons)
  border-radius: 999px (inline/compact buttons)

Fix any element using 0px, 2px, 6px, or mismatched
radius values that break the visual rhythm.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREENS TO AUDIT (every screen, no exceptions):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1.  Splash / Onboarding screen
2.  Home / Discover Feed
3.  Search screen (empty state)
4.  Search Results (with filter applied)
5.  Filter bottom sheet
6.  Map View
7.  Restaurant Detail — Menu & Translate tab
8.  Restaurant Detail — Top Dishes tab
9.  Restaurant Detail — Photos tab
10. Restaurant Detail — Reviews tab
11. Restaurant Detail — Info tab
12. My Lists — Wishlist tab
13. My Lists — Been There tab
14. My Lists — My Collections tab
15. My Lists — Friends' Picks tab
16. Collection Detail page
17. Rankings page
18. Write a Review (all steps)
19. Profile page
20. Language Settings page
21. Friends Space — Permission screen
22. Friends Space — Feed tab
23. Friends Space — Friends tab
24. Friends Space — Messages tab
25. Friends Space — Chat screen
26. Friends Space — Discover tab
27. Friends Space — Privacy Settings sheet

For each screen, check all 7 problems listed above.
Fix every instance found. Do not leave any screen
with unresolved layout, overflow, overlap,
spacing, typography, color, or radius issues.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
AFTER FIXING — VERIFICATION CHECKLIST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Before completing, verify these conditions
are true across the entire file:

[ ] No text element extends outside its parent frame
[ ] No two unintentional elements overlap on any screen
[ ] All cards in the same list/grid share the same height
[ ] All screen edges have exactly 16px horizontal padding
[ ] All section gaps are exactly 24px
[ ] No font size outside the defined type scale
[ ] No color outside the defined palette
[ ] All pills and toggles use border-radius 999px
[ ] All cards use border-radius 12px
[ ] All photo thumbnails use border-radius 8–10px
[ ] Bottom nav bar is 56px height on all main screens
[ ] All badge text is single-line, no wrapping