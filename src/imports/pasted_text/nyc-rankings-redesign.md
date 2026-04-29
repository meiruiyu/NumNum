CHANGE: Redesign the NYC Rankings section on the Home
screen and create a new filterable Rankings page.
Two parts below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 1 — HOME SCREEN: Replace NYC Rankings list
with a horizontally scrollable category tag cloud
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REMOVE: The current vertical list of 12 ranking rows
in the NYC Rankings section.

KEEP: The section header "NYC Rankings" +
"Curated lists updated weekly" + "View All ›"

REPLACE the list with a horizontally scrollable
tag cloud row, inspired by Weee's category pills.

── TAG CLOUD DESIGN ──

A single horizontally scrollable row of category
pill tags. User swipes left/right to browse all
categories. No vertical wrapping — single row only.

Each category pill tag:

Container:
  Height: 72px
  Min-width: auto (fits content)
  Background: white (#FFFFFF)
  Border: 0.5px solid #F0EBE3
  Border-radius: 16px
  Padding: 8px 14px
  Margin-right: 10px
  Flex-shrink: 0

Internal layout — vertical stack, centered:
  TOP: Category icon (illustration/emoji style)
    Size: 32px × 32px
    Centered horizontally
    Margin-bottom: 4px
  BOTTOM: Category label
    Font: 11px, weight 500, #2C1A0E
    Text-align: center
    white-space: nowrap

ACTIVE / selected pill:
  Background: #FDF6EE (warm cream)
  Border: 1px solid #E8603C (terracotta)
  Label color: #E8603C

Show these 12 category pills in order,
each with a relevant food illustration icon:

Pill 1:  icon: wok/flame        label: "Stir-Fry"
Pill 2:  icon: ramen bowl       label: "Ramen"
Pill 3:  icon: chopsticks       label: "Southeast Asian"
Pill 4:  icon: BBQ grill        label: "Korean BBQ"
Pill 5:  icon: wine glass       label: "Date Night"
Pill 6:  icon: price tag        label: "Best Value"
Pill 7:  icon: map pin sparkle  label: "Hidden Gems"
Pill 8:  icon: coffee cup       label: "Cafe"
Pill 9:  icon: moon             label: "Late Night"
Pill 10: icon: pancake stack    label: "Brunch"
Pill 11: icon: chopsticks bowl  label: "Asian Picks"
Pill 12: icon: ribbon/sparkle   label: "New Openings"

Default: no pill selected (all in default white state)

First 4 pills visible on screen.
Pills 5–12 are revealed by scrolling right.
A subtle right fade gradient (white 0% → white 80%)
on the right edge hints at more content.

TAPPING any pill:
  → That pill becomes active (terracotta border)
  → Navigate to Rankings Detail page
    with that category pre-selected

── SECTION LAYOUT AFTER CHANGE ──

"NYC Rankings"        [View All ›]
"Curated lists updated weekly"
[tag cloud horizontal scroll row — 72px tall]

Total section height: approximately 120px
(much more compact than the previous list)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 2 — CREATE Rankings Detail page
with left-side filter panel (Dianping style)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This page opens when:
  A) User taps any category pill on Home screen
  B) User taps "View All ›" in NYC Rankings header
  C) User taps any ranking row in the old list
     (if any remain in prototype)

── TOP BAR ──

Left: Back arrow "←" (20px, #2C1A0E)
Center: "NYC Rankings" — 17px, weight 600, #2C1A0E
Right: Search icon (magnifier, 20px, #8A8078)
Height: 52px, separator: 0.5px #F0EBE3

── CATEGORY FILTER TABS (below top bar) ──

Horizontally scrollable tab row:
  [All] [Stir-Fry] [Ramen] [Southeast Asian]
  [Korean BBQ] [Date Night] [Best Value]
  [Hidden Gems] [Cafe] [Late Night] [Brunch]
  [Asian Picks] [New Openings]

Tab style:
  Height: 36px, padding: 0 14px
  Font: 13px, weight 500
  Active: #2C1A0E text, 2px #E8603C underline,
    weight 600
  Inactive: #8A8078 text, no underline
  No background on any tab

If arriving from a category pill tap on Home:
  That category tab is pre-selected and active.
If arriving from "View All ›":
  "All" tab is active by default.

── LEFT FILTER SIDEBAR + RIGHT CONTENT ──

Below the category tabs, the page splits into
TWO columns (inspired by Dianping's layout):

LEFT SIDEBAR:
  Width: 80px, fixed
  Background: #F5F0EB (slightly darker than page bg)
  Full height scrollable
  Border-right: 0.5px #F0EBE3

  Each sidebar filter item (height: 48px):
    Text centered vertically and horizontally
    Font: 13px, weight 400, #8A8078
    Active state:
      Background: white (#FFFFFF)
      Font weight: 600, color: #E8603C
      Left border: 3px solid #E8603C

  Sidebar filter options (5 items):
    "Top Rated"   ← default active
    "Most Reviewed"
    "Best Value"
    "Highest Food"
    "Veteran Spots"

RIGHT CONTENT AREA:
  Width: fills remaining space (393 - 80 = 313px)
  Background: #FDF6EE (warm cream)
  Scrollable vertically

  ── RIGHT AREA HEADER ──
  Full width row, padding: 10px 14px
  Left: Current ranking title (bold)
    e.g. "Southeast Asian Taste Rankings"
    Font: 14px, weight 700, #2C1A0E
  Right: Price sort button "Price ▾"
    Font: 12px, weight 500, #8A8078
    Tapping toggles price sort order

  ── RESTAURANT RANKING ROWS ──

  Each row height: 108px
  Background: white
  Border-bottom: 0.5px #F0EBE3
  Padding: 10px 14px 10px 10px

  Internal layout — horizontal flex:

  [RANK BADGE + PHOTO] [INFO]

  LEFT: Rank + Photo block (width: 90px, flex-shrink: 0):

    Rank badge (overlaid top-left corner of photo):
      TOP 1: background #E8603C, text "TOP 01"
        font 9px, weight 700, white
        border-radius: 6px 0 6px 0
      TOP 2: same style, text "TOP 02"
      TOP 3: same style, text "TOP 03"
        background: #BA7517 (amber) for 02 and 03
      TOP 4+: background #888780 (gray),
        text "TOP 04" etc.

    Photo:
      Width: 88px, height: 88px
      Border-radius: 10px
      Object-fit: cover

  RIGHT: Info block
    (flex-grow: 1, min-width: 0, padding-left: 10px)

    Line 1: Restaurant name
      Font: 14px, weight 600, #2C1A0E
      white-space: nowrap, overflow: hidden,
      text-overflow: ellipsis

    Line 2: Rating row
      [5 amber stars filled to rating level]
      [rating number 13px weight 600 #E8603C]
      [price per person 12px #8A8078]
      e.g. ★★★★★ 4.9  ·  $25/person

    Line 3: Location · Cuisine
      Font: 12px, weight 400, #8A8078
      Format: "East Village  ·  Thai"
      white-space: nowrap, overflow: hidden,
      text-overflow: ellipsis

    Line 4: User review quote
      Font: 12px, weight 400, #4A3728, italic
      In quotation marks, max 1 line, ellipsis
      e.g. "Best tom yum in all of NYC"

  ── SAMPLE DATA for Southeast Asian category ──

  Row 1 — TOP 01:
    Name: "Mitr Thai Restaurant"
    Rating: ★★★★★ 4.9  ·  $35/person
    Location · Cuisine: "Midtown  ·  Thai"
    Quote: "Authentic regional Thai, every dish is perfect"

  Row 2 — TOP 02:
    Name: "Fish Cheeks"
    Rating: ★★★★★ 4.8  ·  $40/person
    Location · Cuisine: "NoHo  ·  Thai"
    Quote: "Tom yum here is better than Bangkok"

  Row 3 — TOP 03:
    Name: "Soothr"
    Rating: ★★★★★ 4.8  ·  $38/person
    Location · Cuisine: "East Village  ·  Thai"
    Quote: "The seafood hot pot is worth every penny"

  Row 4 — TOP 04:
    Name: "Pranakhon"
    Rating: ★★★★☆ 4.7  ·  $30/person
    Location · Cuisine: "Greenwich Village  ·  Thai"
    Quote: "Cozy spot, great for dates"

  Row 5 — TOP 05:
    Name: "Ugly Baby"
    Rating: ★★★★☆ 4.7  ·  $28/person
    Location · Cuisine: "Carroll Gardens, BK  ·  Thai"
    Quote: "Spice levels are real here, not tourist-friendly"

  Row 6 — TOP 06:
    Name: "Khe-Yo"
    Rating: ★★★★☆ 4.6  ·  $35/person
    Location · Cuisine: "Tribeca  ·  Laotian"
    Quote: "Hidden gem, incredible larb and papaya salad"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PART 3 — PROTOTYPE CONNECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Home screen — any category pill tap
   → Navigate to Rankings Detail page
   → Pre-select the matching category tab
   → Pre-select "Top Rated" in left sidebar

2. Home screen "View All ›" tap
   → Navigate to Rankings Detail page
   → "All" tab active, "Top Rated" sidebar active

3. Rankings Detail — left sidebar item tap
   → Swap right content to show re-sorted list
   → Active sidebar item gets terracotta indicator

4. Rankings Detail — category tab tap
   → Swap right content to show that category list
   → Active tab gets terracotta underline

5. Rankings Detail — any restaurant row tap
   → Navigate to Restaurant Detail page

6. Rankings Detail — back arrow "←"
   → Navigate back to Home screen

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Home tag cloud pills: white cards, 0.5px #F0EBE3
  border, 16px radius, 72px height

Rankings Detail left sidebar: #F5F0EB background,
  active item white bg + #E8603C left border

Rankings Detail right area: #FDF6EE background,
  white restaurant rows, 0.5px #F0EBE3 divider

All text: overflow hidden, ellipsis, no wrapping
All row heights: 108px fixed (no exceptions)
Screen horizontal padding: 0 (sidebar + content
  fill full width with no outer padding)