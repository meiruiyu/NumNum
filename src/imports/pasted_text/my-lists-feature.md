CHANGE: Repurpose the top-left avatar/icon on the Home screen.

── CURRENT STATE ──
Top-left of Home screen: a circular user avatar (32px)
showing user initials "JD", tapping it either does nothing
or opens a profile dropdown.

── NEW BEHAVIOR ──
The top-left element changes from a plain avatar to a
"My Lists" shortcut button that navigates to the My Lists page.

── NEW DESIGN: Top-left My Lists button ──

Replace the plain avatar circle with a composite button:

Outer container:
- Shape: rounded rectangle pill (not a circle)
- Height: 36px
- Width: auto (fits content)
- Background: white (#FFFFFF)
- Border: 0.5px solid #F0EBE3
- Border-radius: 999px
- Padding: 0 12px 0 6px

Internal layout (horizontal flex, vertically centered):
LEFT: Small user avatar circle
  - Size: 24px diameter
  - Background: terracotta (#E8603C)
  - Initials: "JD" in white, 10px, weight 600
  - This avatar remains as a visual identifier

RIGHT: Bookmark icon + label
  - Icon: bookmark/ribbon icon, 14px, #2C1A0E,
    margin-left 6px
  - Label: "My Lists" — 12px, weight 500, #2C1A0E,
    margin-left 4px

The full pill button looks like:
[ JD avatar | bookmark icon | "My Lists" ]

Tap behavior:
On tap → Navigate to My Lists page (full screen)
Transition: slide in from left

── MY LISTS PAGE — FULL SCREEN DESIGN ──

This is the same My Lists content that was previously
accessible via the bottom navigation tab.
Now it is a full standalone page accessed from
the Home screen top-left button.

TOP BAR:
- Left: Back arrow "←" (20px, #2C1A0E)
  Tapping returns to Home screen
- Center: "My Lists" (17px, weight 600, #2C1A0E)
- Right: Edit icon (pencil, 18px, #8A8078)

TOP BAR separator: 0.5px #F0EBE3 below

INTERNAL TAB BAR (below top bar, same segmented style
as Friends Space internal tabs):
4 tabs: [Wishlist] [Been There] [My Collections] [Friends' Picks]

Active tab: white pill, terracotta text, weight 600, 13px
Inactive tab: no background, #8A8078 text, 13px

━━━ TAB 1: Wishlist (default) ━━━
Header row below tab bar:
  Left: "Saved Restaurants" — 16px, weight 700, #2C1A0E
  Right: "[N] places" — 13px, #8A8078

Restaurant cards — single column vertical list
(same card style as Search Results list from Prompt 3):
- Full width, height 88px, white card, 12px radius
- Photo left (80x68px) + info middle + chevron right
- Shows: name, cuisine · location, rating + price
- Additional tag bottom-left of card:
  "Added [date]" — 11px, #8A8078
  e.g. "Added Mar 15"

Sample wishlist items:
  1. Flushing Hot Pot — Chinese · Flushing, Queens
     ★ 4.7 (3,284) · $$ — Added Mar 20
  2. Han Joo KBBQ — Korean · Koreatown, Manhattan
     ★ 4.5 (1,892) · $$$ — Added Mar 18
  3. Pho Bac — Vietnamese · Manhattan
     ★ 4.5 (1,876) · $ — Added Mar 15
  4. Ramen Nakamura — Japanese · East Village
     ★ 4.6 (2,107) · $$ — Added Mar 10

Bottom of Wishlist tab:
  "+ Add a place" text button, centered, terracotta,
  14px, weight 500

━━━ TAB 2: Been There ━━━
Header: "Places I've Visited" — 16px, weight 700

Timeline-style list, sorted by most recent visit.
Same card layout as Wishlist but with:
- "Visited [date]" tag instead of "Added [date]"
  e.g. "Visited Mar 22"
- A small "My Rating" star display on the card:
  If user rated: show their personal star rating
  (amber stars, 12px) next to "Visited" date
  If not rated: show "Rate this" link in terracotta

Sample been-there items:
  1. Golden Dumpling — Chinese · Chinatown
     ★ 4.7 (876) · $ — Visited Mar 22
     My rating: ★★★★★
  2. Bonchon — Korean · Fort Lee, NJ
     ★ 4.6 (2,156) · $$ — Visited Mar 14
     My rating: ★★★★☆
  3. Tiger Sugar — Bubble Tea · Flushing
     ★ 4.4 (4,521) · $ — Visited Feb 28
     My rating: not yet rated → "Rate this" link

━━━ TAB 3: My Collections ━━━
Header: "My Collections" — 16px, weight 700
Subheader: "Organize your saves into lists"
  — 13px, #8A8078

Grid of collection cards — 2 columns:

Each collection card:
- Width: fills column minus 6px gap
- Height: 140px
- Border-radius: 12px
- Border: 0.5px #F0EBE3

Card design:
TOP (height 90px): Collage of up to 4 restaurant
  photos in a 2x2 grid, clipped to top rounded corners
  Photo cells: each 50% width, 50% height, no gap
  object-fit: cover

BOTTOM (height 50px, white, padding 8px 10px):
  Line 1: Collection name — 13px, weight 600, #2C1A0E
    white-space: nowrap, overflow: hidden,
    text-overflow: ellipsis
  Line 2: "[N] places · [privacy icon]" — 11px, #8A8078
  Privacy icon: lock (private) or people (friends)
    or globe (public) — 10px

Sample collections:
  Collection 1: "Date Night Spots"
    4 places · friends icon (shared with friends)
  Collection 2: "Cheap Eats Queens"
    7 places · lock icon (private)
  Collection 3: "Special Occasions"
    3 places · lock icon (private)
  Collection 4: "Best Ramen NYC"
    5 places · globe icon (public)

Below the grid:
  "+ Create New Collection" button:
  Full width, height 48px, dashed border 1px #D4C9BE,
  border-radius 12px, background transparent
  Center: "+" icon (20px, #8A8078) + "Create New Collection"
    (13px, #8A8078)

━━━ TAB 4: Friends' Picks ━━━
Header: "What Your Friends Saved" — 16px, weight 700

Same vertical list card style.
Each card shows a "Saved by [friend name]" note:
  Below the restaurant name, a small row:
  [friend avatar 16px] "Saved by Karen L." — 11px, #8A8078

Sample items:
  1. JSQ Spice Garden — Indian · Jersey City
     ★ 4.6 (987) · $
     Saved by Karen L. · Saved by Mike J.
  2. Sakura Brunch — Japanese · Upper West Side
     ★ 4.3 (654) · $$
     Saved by Amy C.
  3. Hoboken Noodle House — Chinese · Hoboken, NJ
     ★ 4.5 (432) · $
     Saved by David K.

━━━ PROTOTYPE CONNECTIONS ━━━

1. Home screen top-left "My Lists" pill button
   → Navigate to: My Lists page (Wishlist tab default)
   Transition: slide from left

2. My Lists page back arrow "←"
   → Navigate back to: Home screen

3. My Lists internal tabs
   Wishlist / Been There / My Collections / Friends' Picks
   → Each tab switches to its respective content frame
   (same segmented tab interaction as Friends Space)

4. My Collections: tap any collection card
   → Navigate to: individual collection detail page
   (show a simple full-screen list of restaurants
   in that collection, with same card style,
   back arrow top-left returns to My Collections)

━━━ CONSISTENCY RULES ━━━

1. My Lists page uses identical visual language
   as the rest of the app:
   - Background: #FDF6EE (warm cream)
   - Cards: white, 0.5px #F0EBE3 border, 12px radius
   - Primary: #E8603C terracotta
   - Text: #2C1A0E primary, #8A8078 secondary

2. The internal 4-tab segmented bar matches
   Friends Space tab bar style exactly.

3. All text overflow rules apply:
   white-space: nowrap, overflow: hidden,
   text-overflow: ellipsis on all single-line text.
   Fixed card heights — never expand for content.

4. The Home screen top-left area now shows the
   "My Lists" pill button instead of a plain avatar.
   This is the ONLY change to the Home screen top bar.
   The center NYC|NJ toggle and right chat bubble icon
   remain unchanged.