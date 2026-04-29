This is a revision prompt for the existing NomNom NYC app design.
Please apply ALL of the following changes carefully. Do not redesign
screens from scratch — only modify the specific components described below.

---

CHANGE 1 — LOCATION TOGGLE (Home Screen Top Bar)

REMOVE: The "Manhattan" dropdown that pretends to switch between
NYC boroughs in detail.

REPLACE WITH: A simple two-state pill toggle switch in the top bar,
centered between the user avatar and the notification bell.

The toggle has exactly TWO states only:
- State A: "NYC" (active by default — filled terracotta pill, white text)
- State B: "NJ" (inactive — cream background, brown text)

When tapped, the pills animate: the active state slides/fills to
the other option. This is a tap toggle, not a dropdown.

No sub-selections, no borough breakdown, no dropdown menu.
Just NYC ←→ NJ.

The toggle should look like:
[ NYC | NJ ]
where the active side has a filled terracotta background (#E8603C)
and white text, and the inactive side is transparent/cream with
muted brown text. Pill shape, border-radius 999px, height 32px,
total width ~120px.

---

CHANGE 2 — RANKINGS SECTION (Home Screen, replacing "Top Dishes This Week")

REMOVE: The "Top Dishes This Week 榜单" section entirely.

REPLACE WITH: A new section titled "NYC Rankings" positioned below
the "Top Picks Near You" horizontal scroll.

This section is inspired by Dianping (大众点评) Must-Eat List
(必吃榜) ranking system. It features multiple themed ranking lists,
each as a horizontally scrollable card.

Section header: "NYC Rankings" (bold, 18px, left-aligned)
Subtitle below header: "Curated lists updated weekly" (12px, muted)

The ranking lists are displayed as a 2-column grid of category cards,
each card being tappable to open a full ranking list.

Design each ranking category card as follows:
- Size: width fills half the screen minus padding, height ~110px
- Rounded corners: border-radius 12px
- Left side: a colored icon or emoji-style food illustration (48px)
- Right side: category name (bold 14px) + subtitle (12px muted) +
  small "Top 10" badge in terracotta

Include the following ranking categories, each as a separate card.
These are modeled after Dianping's category and scene-based rankings,
adapted for NYC's Asian dining community:

ROW 1 (Cuisine-based rankings):
Card 1 — "Chinese Stir-Fry Top 10"
  Subtitle: "Best wok-fired dishes in NYC"
  Icon: wok / flame illustration, warm orange background (#FFF0E6)

Card 2 — "Ramen & Noodles Top 10"
  Subtitle: "From tonkotsu to hand-pulled"
  Icon: noodle bowl illustration, warm yellow background (#FFF8E1)

ROW 2 (Cuisine-based):
Card 3 — "Southeast Asian Top 10"
  Subtitle: "Thai, Vietnamese, Malaysian & more"
  Icon: lemongrass/tropical illustration, soft green background (#F0F7EC)

Card 4 — "Korean BBQ Top 10"
  Subtitle: "Best KBBQ spots in NYC & NJ"
  Icon: grill illustration, amber background (#FFF3E0)

ROW 3 (Occasion/Scene-based rankings, inspired by Dianping's
场景榜 scene rankings):
Card 5 — "Date Night Picks"
  Subtitle: "Romantic, atmospheric restaurants"
  Icon: candle/rose illustration, blush pink background (#FFF0F3)

Card 6 — "Best Value Eats"
  Subtitle: "Great food under $20 per person"
  Icon: wallet/coin illustration, light green background (#F1F8E9)

ROW 4 (Lifestyle/Vibe-based, inspired by Dianping's
小众宝藏榜 hidden gem rankings):
Card 7 — "Hidden Gems"
  Subtitle: "Locals only, tourist-free"
  Icon: gem/sparkle illustration, soft purple background (#F3F0FF)

Card 8 — "Cafe & Coffee Top 10"
  Subtitle: "Study spots, aesthetic cafes"
  Icon: coffee cup illustration, warm cream background (#FDF6EE)

ROW 5 (Time-based / Special):
Card 9 — "Late Night Bites"
  Subtitle: "Open past midnight in NYC"
  Icon: moon/star illustration, dark blue tint background (#EEF2FF)

Card 10 — "Best Brunch"
  Subtitle: "Weekend brunch worth queuing for"
  Icon: eggs/pancake illustration, warm yellow background (#FFFDE7)

ROW 6 (Community-driven, inspired by Dianping's
亚洲口味 Asian-friendly tags):
Card 11 — "Asian-Friendly Menus"
  Subtitle: "Dishes that match Asian palates"
  Icon: chopsticks illustration, soft red background (#FFF3F3)

Card 12 — "New Openings"
  Subtitle: "Just opened this month in NYC"
  Icon: sparkle/ribbon illustration, mint background (#F0FFF8)

Each ranking card is tappable. When tapped, it opens a full-screen
ranking list page showing:
- Rank number (1, 2, 3...) in large terracotta on the left
- Restaurant photo (square, 64px)
- Restaurant name + one-line description
- Star rating + price range
- "Top Dish" badge showing the #1 recommended dish for that restaurant

---

CHANGE 3 — LANGUAGE CONSISTENCY (All Screens)

RULE: All visible UI text, labels, section headers, button text,
placeholder text, tag pills, navigation labels, and any editable
text on all screens must be in ENGLISH ONLY.

Remove any Chinese characters that appear in the UI including:
- The "榜单" text that appeared next to "Top Dishes This Week"
- Any Chinese text in section headers
- Any Chinese text in button labels or navigation

The ONLY exception: restaurant names may contain Chinese characters
if they are the actual name of the restaurant (e.g. "楼下火锅" as
a restaurant name is acceptable).

Add a Language Setting in the Profile / Settings screen:
In the Settings section of the Profile page, add a "Language"
preference row:
- Label: "Language"
- Current value displayed: "English"
- Tapping opens a selection modal with options:
  English / 中文 / 한국어 / 日本語 / Español
- Selecting a language would change the UI language (show as
  a prototype interaction in Figma — the modal closes and a
  toast notification appears: "Language updated to English")

---

CHANGE 4 — VIEW TOGGLE LOCATION (Search Screen, not Home)

REMOVE: The grid/list/map view toggle icons from the Home screen.
The Home screen is purely a content recommendation feed —
no view toggle should appear there.

ADD the view toggle to the Search Results screen instead:
After a user performs a search or applies filters, the results
page should show a view toggle in the top-right corner of the
results list, with three icon buttons:

[grid icon] [list icon] [map icon]

Each icon is 28px, separated by 4px gaps, inside a pill-shaped
container with a light border.

- Grid view: 2-column card grid (default for visual browsing)
- List view: single-column compact list (for information-dense
  scanning — shows name, rating, price, distance, open/closed
  status in one row with a small thumbnail)
- Map view: transitions to the Map screen with results
  highlighted as pins

The toggle must be FUNCTIONAL in the Figma prototype:
- Clicking grid icon → shows grid layout frame
- Clicking list icon → shows list layout frame
- Clicking map icon → navigates to Map screen frame
Use Figma prototype interactions (On Click → Navigate to /
Swap with component) to make all three views actually switch.

---

CHANGE 5 — MAP SCREEN (Real NYC Map Implementation)

The map screen must display a real, recognizable map of New
York City and the NYC metro area including New Jersey.

Implementation approach — use an embedded static map image
as the base layer, since live API connections are not available
in Figma:

STEP A — Map base layer:
Use a high-resolution static screenshot or tile image of the
NYC metro area map as the artboard background. The map should
show:
- Manhattan island clearly visible
- Brooklyn, Queens, The Bronx
- Jersey City, Hoboken, and Fort Lee across the Hudson River
- Major landmarks labeled: Central Park, Times Square, Flushing,
  Downtown Brooklyn, Journal Square
- Map style: warm beige/sand tone (NOT default Google blue/grey)
  Use a Stamen Toner Lite or CartoDB Positron style aesthetic —
  light, minimal, warm

STEP B — Map zoom interactions:
Create at least 2 zoom level frames:
- Frame A: Zoomed out — shows full NYC + NJ metro area
- Frame B: Zoomed in — shows Manhattan only, with more detail

Connect them in Figma prototype:
- Pinch gesture or a "+" button tap → navigate to Frame B
  (zoomed in view)
- A "-" button tap → navigate back to Frame A (zoomed out)

STEP C — Restaurant pins on the map:
Place at least 8 custom restaurant pins on the map at
geographically accurate positions:

Pin locations (approximate, use real NYC geography):
1. Flushing, Queens → Pin labeled "Flushing Hot Pot"
2. Midtown Manhattan (around 38th–42nd St Korean district)
   → Pin labeled "Han Joo KBBQ"
3. Lower East Side / Chinatown → Pin labeled "Golden Dumpling"
4. East Village → Pin labeled "Ramen Nakamura"
5. Williamsburg, Brooklyn → Pin labeled "Pho Saigon"
6. Upper West Side → Pin labeled "Sakura Brunch"
7. Jersey City (Journal Square area) → Pin labeled "JSQ Spice Garden"
8. Hoboken, NJ → Pin labeled "Hoboken Noodle House"

Each pin:
- Custom teardrop shape in terracotta (#E8603C)
- White dot in center
- On hover/tap: shows a small popup card with restaurant name,
  star rating, price range, and "Open Now" badge
  (implement as Figma prototype overlay)

STEP D — NYC/NJ toggle on Map screen:
The same NYC | NJ pill toggle from Change 1 should also
appear at the TOP of the Map screen, below the search bar.
When "NJ" is tapped, the map pans to show NJ pins more
prominently (create a separate NJ-focused frame and connect
it via prototype interaction).

STEP E — Bottom sheet on Map screen:
A draggable bottom sheet sits at the bottom of the map,
collapsed by default (showing just the top handle + first
restaurant card peeking out).

Collapsed state: shows handle bar + 1 restaurant card visible
Expanded state (drag up): shows a scrollable list of 5-6
restaurant cards for the current map view area

Each card in the bottom sheet:
- Small square photo (52px)
- Restaurant name (bold 13px)
- Rating stars + review count
- Price range + distance (e.g. "0.3 mi")
- "Open Now" green badge or "Closed" grey badge

---

ADDITIONAL NOTES FOR ALL CHANGES:

1. Maintain the existing warm terracotta + cream color palette
   throughout all modified components.

2. All new components should use the same border-radius tokens:
   - Pills/toggles: border-radius 999px
   - Cards: border-radius 12px
   - Bottom sheet: border-radius 20px top corners only

3. All new text follows the same typography system:
   - Section headers: 18px, weight 500
   - Card titles: 14px, weight 500
   - Subtitles/descriptions: 12px, weight 400, muted color
   - Labels/badges: 11px, weight 500

4. The ranking cards grid in Change 2 should use Auto Layout
   in Figma with:
   - 2 columns
   - 12px gap between columns
   - 8px gap between rows
   - 16px horizontal padding from screen edges

5. For the map in Change 5, if a real map tile image is not
   directly embeddable, use a detailed illustrated NYC map
   graphic that clearly shows Manhattan, the boroughs, and
   the NJ waterfront — accuracy of geography matters more
   than visual style here.