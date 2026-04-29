This is a targeted revision prompt. Apply all 5 changes below
precisely. Do not redesign screens from scratch.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 1 — NYC RANKINGS SECTION LAYOUT FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM: The current 2-column grid causes text overflow and
truncated descriptions on every card. The icons are generic
and not food-relevant.

SOLUTION: Replace the 2-column grid with a SINGLE-COLUMN
vertical list layout (full-width rows, stacked top to bottom).

Each ranking row is a horizontal card with this structure:

[LEFT: Icon container 56x56px] [MIDDLE: Text block] [RIGHT: Arrow chevron]

Exact layout specs:
- Card height: 72px fixed
- Card background: white (#FFFFFF)
- Border: 0.5px solid #F0EBE3
- Border-radius: 12px
- Padding: 12px 16px
- Margin between cards: 8px
- Icon container: 56x56px, border-radius 12px, colored background

Text block (middle, flex-grow):
- Line 1: Category name, 14px, weight 600, color #2C1A0E
  — must fit on ONE line, no wrapping, max 28 characters
- Line 2: Subtitle, 12px, weight 400, color #8A8078
  — must fit on ONE line, no wrapping, truncate with ellipsis
    if too long (max-width enforced)
- Gap between lines: 2px

Right side: chevron "›" icon, 16px, color #C5BDB4

CRITICAL TEXT OVERFLOW RULE:
All text MUST be constrained within its container.
Set text to: overflow hidden, text-overflow ellipsis,
white-space nowrap on BOTH title and subtitle lines.
No text may extend beyond the card boundary under any
circumstance.

RANKING LIST — 12 items in this exact order, each with a
RELEVANT food icon (use Figma's built-in emoji/icon sets
or simple flat vector icons that are directly related to
the food category):

1. "Chinese Stir-Fry Top 10"
   Subtitle: "Best wok-fired dishes in NYC"
   Icon: a wok or stir-fry pan icon
   Icon bg: #FFF0E6 (warm peach)

2. "Ramen & Noodles Top 10"
   Subtitle: "From tonkotsu to hand-pulled"
   Icon: a bowl of noodles / ramen bowl icon
   Icon bg: #FFF8E1 (warm yellow)

3. "Southeast Asian Top 10"
   Subtitle: "Thai, Vietnamese, Malaysian & more"
   Icon: a plate with herbs / chopsticks icon
   Icon bg: #F0F7EC (soft green)

4. "Korean BBQ Top 10"
   Subtitle: "Best KBBQ spots in NYC & NJ"
   Icon: a Korean grill / BBQ grill grate icon
   Icon bg: #FFF3E0 (amber)

5. "Date Night Picks"
   Subtitle: "Romantic & atmospheric spots"
   Icon: a wine glass or candle + fork icon
   Icon bg: #FFF0F3 (blush pink)

6. "Best Value Eats"
   Subtitle: "Great food under $20 per person"
   Icon: a price tag or coins icon
   Icon bg: #F1F8E9 (light green)

7. "Hidden Gems"
   Subtitle: "Locals only, tourist-free"
   Icon: a map pin with sparkle icon
   Icon bg: #F3F0FF (soft purple)

8. "Cafe & Coffee Top 10"
   Subtitle: "Aesthetic cafes & study spots"
   Icon: a coffee cup with steam icon
   Icon bg: #FDF6EE (warm cream)

9. "Late Night Bites"
   Subtitle: "Open past midnight in NYC"
   Icon: a moon + fork icon or night skyline
   Icon bg: #EEF2FF (soft blue)

10. "Best Brunch"
    Subtitle: "Weekend brunch worth the wait"
    Icon: a pancake stack or eggs icon
    Icon bg: #FFFDE7 (pale yellow)

11. "Asian-Friendly Menus"
    Subtitle: "Dishes that match Asian palates"
    Icon: chopsticks + bowl icon
    Icon bg: #FFF3F3 (soft red)

12. "New Openings"
    Subtitle: "Just opened this month in NYC"
    Icon: a ribbon / sparkle / new badge icon
    Icon bg: #F0FFF8 (mint)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 2 — TYPOGRAPHY CONSISTENCY ACROSS ALL SECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

All section headers throughout the entire app must use
IDENTICAL formatting. Match this exact spec:

Section header text style:
- Font size: 20px
- Font weight: 700 (bold)
- Color: #2C1A0E (deep brown)
- Letter spacing: -0.2px
- Margin bottom: 4px

Section subheader / descriptor text style:
- Font size: 13px
- Font weight: 400
- Color: #8A8078 (muted warm gray)
- Margin bottom: 12px

Apply this to ALL section headers including:
- "Top Picks Near You"
- "Top Dishes This Week"
- "NYC Rankings"
- "Your Neighborhood"
- "Hidden Gems"
- Any other section headers across all screens

They must all look IDENTICAL in weight, size, and color.
No exceptions. Remove any inconsistencies.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 3 — GLOBAL TYPOGRAPHY & COLOR SYSTEM AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Enforce this typography hierarchy consistently across
ALL screens and ALL components in the entire app:

LEVEL 1 — Screen titles / Page headers:
- Size: 22px, Weight: 700, Color: #2C1A0E

LEVEL 2 — Section headers (see Change 2):
- Size: 20px, Weight: 700, Color: #2C1A0E

LEVEL 3 — Card titles / Restaurant names:
- Size: 15px, Weight: 600, Color: #2C1A0E

LEVEL 4 — Body text / Descriptions:
- Size: 13px, Weight: 400, Color: #4A3728

LEVEL 5 — Secondary info (ratings, price, distance):
- Size: 12px, Weight: 500, Color: #6B5744

LEVEL 6 — Captions / Timestamps / Muted labels:
- Size: 11px, Weight: 400, Color: #8A8078

BADGE / PILL TEXT:
- Size: 11px, Weight: 600
- Text color always matches darkest shade of badge background ramp

NAVIGATION BAR labels:
- Size: 10px, Weight: 500
- Active: #E8603C (terracotta)
- Inactive: #8A8078 (muted gray)

BUTTON TEXT:
- Primary button: 14px, Weight: 600, White (#FFFFFF)
- Secondary button: 14px, Weight: 500, #2C1A0E

Remove ALL inconsistencies across screens. Every text
element on every screen must conform to one of the
above levels. No arbitrary font sizes outside this system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 4 — MAP SCREEN: REAL NYC MAP IMAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM: The current map looks fake and has no geographic
accuracy.

SOLUTION: Replace the current map placeholder with a real
static map image of New York City.

Use this publicly available static map image URL from
OpenStreetMap / Stamen (free, no API key required):

Primary map image to embed as a Fill image in the map
artboard background:

https://tile.openstreetmap.org/11/602/769.png

For a wider NYC + NJ view showing Manhattan, Brooklyn,
Queens, and New Jersey waterfront together, use this
static map snapshot URL from the OpenStreetMap tile system
centered on NYC at zoom level 12:

Alternatively, in the Figma map artboard, set the
background fill to use this image URL:
https://maps.wikimedia.org/osm-intl/12/1206/1539.png

This shows NYC centered with Manhattan clearly visible,
surrounding boroughs, and the NJ waterfront.

IF direct URL embedding is not supported, instruct the
designer to:
1. Go to https://www.openstreetmap.org/#map=12/40.7128/-74.0060
2. Take a screenshot of the NYC metro area view
3. Import that screenshot as the map background image
4. Crop and position to show: Manhattan, Brooklyn, Queens
   (partially), Bronx (top), and the NJ waterfront
   (Jersey City, Hoboken)

Map visual requirements:
- The map must clearly show Manhattan island with the
  Hudson River on the left and East River on the right
- New Jersey shoreline (Jersey City, Hoboken) must be
  visible on the left side of the map
- Central Park must be recognizable as a green rectangle
  in upper Manhattan
- Major street grid of Manhattan must be visible
- Brooklyn and Queens must be partially visible on the
  right side

Map styling overlay (apply on top of any map image):
- Add a warm semi-transparent color overlay:
  background color #FDF6EE at 20% opacity layered
  over the map image to give it the warm beige tone
  consistent with the app's color palette
- Do NOT cover the map completely — just tint it slightly

Keep all existing restaurant pins, bottom sheet, and
NYC/NJ toggle from the previous version.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 5 — SEARCH & FILTER SCREEN: DETAILED FILTERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

REDESIGN the filter bottom sheet on the Search screen
with these specific, detailed filter categories.
The bottom sheet slides up from the bottom when the
user taps the "Filters" button.

Bottom sheet design:
- Drag handle at top (40px wide, 4px tall, rounded,
  color #D4C9BE)
- Title: "Filter" 17px bold, centered
- "Clear All" text button top-right, 13px, #8A8078
- Scrollable content area
- Bottom: "Show Results" full-width button, terracotta

━━━ FILTER SECTION A: Location (地区) ━━━
Label: "Location" (16px, weight 600, #2C1A0E)

Two-row toggle group:
ROW 1 — Region toggle (pill multi-select):
NYC | New Jersey

ROW 2 — NYC Sub-areas (shown only when NYC is selected,
pill multi-select, horizontally scrollable):
Manhattan | Queens | Brooklyn | Bronx | Staten Island

ROW 3 — NJ Sub-areas (shown only when NJ is selected,
pill multi-select, horizontally scrollable):
Jersey City | Hoboken | Fort Lee | Weehawken | Edgewater

Each pill: 12px text, 6px 14px padding, border-radius 999px
Active: terracotta fill (#E8603C) + white text
Inactive: white fill + #8A8078 text + #E8E0D8 border

━━━ FILTER SECTION B: Cuisine Type (餐饮类型) ━━━
Label: "Cuisine" (16px, weight 600)

A WRAPPING grid of cuisine pill tags (not horizontally
scrollable — they wrap onto multiple lines):

Chinese | Japanese | Korean | Thai | Vietnamese
Malaysian | Indian | Italian | Mexican | American
Mediterranean | Middle Eastern | Brunch | Desserts
Bubble Tea & Drinks | Bakery & Cafe | Seafood | BBQ
Hot Pot | Sushi & Sashimi | Dim Sum | Street Food

Each pill same style as Location pills above.
Allow multi-select. Show a maximum of 3 rows
(approximately 6-8 pills per row), with a
"Show More" link to expand if needed.

━━━ FILTER SECTION C: Price Range (价位) ━━━
Label: "Price per Person" (16px, weight 600)

A row of 5 clearly labeled price tier buttons
(NOT just $ symbols — show actual dollar amounts):

[$10–$20] [$20–$35] [$35–$55] [$55–$80] [$80+]

Button style:
- Width: equal, fill available space with 6px gaps
- Height: 40px, border-radius 8px
- Font: 12px, weight 500
- Active: terracotta background, white text
- Inactive: white background, #4A3728 text, 0.5px #E0D8D0 border
- Multi-select allowed

Below the price buttons, add two small labels:
Left: "Budget-friendly" in 10px muted gray
Right: "Fine dining" in 10px muted gray

━━━ FILTER SECTION D: Rating (评分区间) ━━━
Label: "Minimum Rating" (16px, weight 600)

A row of 6 rating options as pill buttons:

[Any] [3.0+] [3.5+] [4.0+] [4.2+] [4.5+] [4.8+]

Each pill: same style as price buttons above.
Single-select only (radio behavior).
Default selected: "Any"

Below the rating pills, add a visual star display that
updates based on selection: show the selected minimum
rating as amber stars (e.g. selecting "4.0+" shows
4 amber stars + 1 empty star).

━━━ FILTER SECTION E: Vibe / Occasion ━━━
Label: "Vibe" (16px, weight 600)
Subtitle: "What's the occasion?" (12px muted)

Wrapping pill tags, multi-select:
Date Night | Friends Gathering | Solo Dining
Special Occasion | Business Lunch | Family
Instagrammable | Quiet & Cozy | Lively & Fun
Local Favorite | Hidden Gem | Walk-in OK
Outdoor Seating | Late Night | Lunch Special

━━━ FILTER SECTION F: Additional Options ━━━
Label: "More Options" (16px, weight 600)

Toggle switches (iOS-style, terracotta when on):
- "Open Now"  [toggle]
- "Walk-in Accepted"  [toggle]
- "Verified Reviews Only"  [toggle]
- "Asian-Friendly Menu"  [toggle]
- "Menu Translation Available"  [toggle]

Each toggle row: 44px height, label 14px #2C1A0E left,
toggle right. Separator line between rows: 0.5px #F0EBE3

━━━ BOTTOM ACTION BAR ━━━
Full-width terracotta button: "Show Results"
- Height: 52px, border-radius 12px
- Font: 16px, weight 600, white
- Shows result count: "Show 48 Results"
  (update count based on filter combination)
- Margin: 16px all sides from screen edge

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FINAL GLOBAL RULES (apply to entire project)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. NO TEXT OVERFLOW ANYWHERE in the entire app.
   All text containers must have defined max-width
   and overflow behavior. Truncate with ellipsis
   if content exceeds container.

2. ALL UI text must be in English only.
   No Chinese, Korean, or other language characters
   in any UI label, button, header, placeholder,
   badge, or navigation element.
   (Exception: restaurant names may be in any language)

3. CONSISTENT SPACING SYSTEM:
   - Screen horizontal padding: 16px
   - Section vertical gap: 24px
   - Card internal padding: 12px 14px
   - Between cards in a list: 8px
   - Between filter sections: 20px

4. ALL interactive elements (pills, toggles, buttons,
   cards) must have clearly defined active/inactive
   visual states that are visually distinct.

5. The warm color palette must be consistent:
   Primary action: #E8603C (terracotta)
   Background: #FDF6EE (warm cream)
   Card surface: #FFFFFF (white)
   Text primary: #2C1A0E (deep brown)
   Text secondary: #8A8078 (warm gray)
   Border: #F0EBE3 (light warm border)