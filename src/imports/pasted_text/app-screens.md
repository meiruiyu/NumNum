---

SCREEN 1 — SPLASH / ONBOARDING

A single centered screen with:
- App logo (fork + map pin combined icon) in terracotta
- App name in large rounded bold font
- Tagline: "Discover NYC & NJ dining, the real way."
- A warm-toned food photography background (blurred, darkened overlay)
- Two buttons: "Get Started" (filled terracotta) and "Log In" (outlined)

---

SCREEN 2 — HOME / DISCOVER FEED

Top bar:
- Left: User avatar (small circle, 32px)
- Center: Location selector pill showing "Manhattan" with a chevron — tappable to switch between NYC boroughs and NJ areas (Jersey City, Hoboken, Fort Lee)
- Right: Notification bell icon

Search bar below top bar:
- Rounded pill shape, warm gray border
- Placeholder: "Search cuisine, dish, or restaurant..."
- Has a microphone icon on the right (voice search hint)
- Tapping expands to full search with smart suggestions

Vibe / Mood filter row (horizontal scroll, pill tags):
- Tags: "Date Night", "Friends Gathering", "Solo Lunch", "Special Occasion", "Quick Bite", "Late Night", "Instagrammable", "Hidden Gem", "Walk-in OK", "Outdoor Seating"
- Active tag has terracotta fill + white text
- Inactive tags have cream fill + brown text + warm border

View toggle (top right of feed):
- Three icons: Grid cards / List / Map view
- Default: Grid cards

Section 1 — "Top Picks Near You"
- Horizontal scroll of large cards (width 280px, height 340px)
- Each card:
  - Full-bleed food photo (top 65% of card)
  - Bottom section on white: Restaurant name (bold 16px), cuisine type tag (pill), star rating with number of reviews, price range ($ to $$$$), one-line highlight (e.g. "Best Xiaolongbao in Manhattan")
  - Top-left of photo: "Open Now" green badge OR "45 min wait" amber badge
  - Top-right of photo: Bookmark/save icon (heart outline, fills on tap with animation)
  - Bottom right: "Friends been here" micro-avatar stack (show 2–3 small avatars if applicable)

Section 2 — "Top Dishes This Week" (榜单)
- Horizontal scroll of dish-focused cards (not restaurant-focused)
- Each card: dish photo, dish name, restaurant name below, rating
- Gives "dish ranking" feel similar to Dianping 大众点评

Section 3 — "Your Neighborhood" (Queens / Manhattan split based on user profile)
- Grid of 2 columns, standard restaurant cards
- Each card: photo (top half), name, tags, rating, distance

Section 4 — "Hidden Gems" (小众推荐)
- Full-width editorial card with a warm-toned illustration or photo
- Label: "Staff Pick — Lesser Known, Worth It"
- Restaurant name, one paragraph description, rating

---

SCREEN 3 — SEARCH & FILTER

Full screen search experience:

Top: search bar (active, cursor blinking)
Below: smart suggestions as the user types (restaurant names, cuisine types, dishes)

Filter panel (accessible via "Filters" button, slides up as bottom sheet):

Section A — Cuisine Type
- Grid of cuisine icons with labels: Chinese, Japanese, Korean, Thai, Italian, Mexican, Indian, American, Brunch, Dessert, etc.
- Multi-select, selected ones get terracotta border

Section B — Location
- Toggle switch: "NYC Only" / "NYC + NJ"
- If NJ enabled: show sub-checkboxes for Jersey City, Hoboken, Fort Lee

Section C — Price Range
- Four pill buttons: $ / $$ / $$$ / $$$$
- Multi-select

Section D — Rating
- Slider from 3.0 to 5.0 stars

Section E — Vibe / Occasion (soft filters)
- Pill multi-select: Instagrammable / Quiet & Cozy / Lively & Fun / Local Favorite / Tourist-Free / Pet Friendly / Outdoor Seating / Walk-in Welcome / Lunch Special / Late Night

Section F — Dietary
- Pill multi-select: Vegetarian / Vegan / Halal / Gluten-Free / Asian Friendly

Section G — Availability
- Toggle: "Show only restaurants with open seats now"
- Toggle: "Walk-in accepted"

Bottom of filter sheet:
- "Clear All" text button (left)
- "Show Results" filled terracotta button (right, shows count e.g. "Show 48 Results")

---

SCREEN 4 — RESTAURANT DETAIL PAGE

Hero section:
- Full-width photo carousel (swipeable), 260px tall
- Overlaid at bottom: restaurant name (large, white, bold), cuisine tag pill, neighborhood tag pill
- Top-left back arrow, top-right share icon + bookmark heart icon

Info bar (horizontal row below hero):
- Star rating (amber stars) + review count
- Price range
- "Open Now" / "Closes at 10pm" status
- "~30 min wait" or "Seats Available" badge

Quick action buttons (horizontal row, icon + label):
- "Directions" (map pin icon)
- "Call" (phone icon)
- "Reserve" (calendar icon)
- "Menu" (fork icon)

Tab navigation below: Photos / Info / Reviews / Menu / Top Dishes

--- TAB: Photos ---
- Masonry grid of real user-uploaded photos
- Category filter pills at top: All / Food / Interior / Exterior / Menu

--- TAB: Info ---
- Address (with mini map thumbnail)
- Hours (expandable by day, shows if open now in green)
- "Walk-in accepted: Yes / No" clearly labeled
- Current wait time (if available)
- Neighborhood: e.g. "Flushing, Queens"
- Tags: Outdoor seating / Parking nearby / Reservation required

--- TAB: Reviews ---

Sub-rating breakdown (4 categories, shown as horizontal bar scores):
- Food Quality: 4.7
- Service: 4.2
- Ambiance: 4.5
- Portion Size: 4.0

Filter pills: Most Recent / Most Helpful / With Photos / Critical

Each review card:
- User avatar + name + "Verified Diner" green badge
- Date of visit (shown prominently, e.g. "Visited March 2025")
- Star rating
- Review text
- Photos (if any, small thumbnails)
- "Helpful" thumbs up count
- If reviewer is a friend: show "Your friend [Name] reviewed this" highlight banner in warm amber

--- TAB: Top Dishes (招牌菜榜单) ---
- Ranked list of top dishes based on mentions in reviews
- Each item: dish photo, dish name, rank number (#1, #2, #3...), mention count ("Mentioned in 142 reviews"), average dish rating
- "Menu Translation" button at top — tapping shows original menu with English translation + photo side by side

--- TAB: Menu ---
- Categorized menu items
- Each item: name, description, price, photo (if available)
- "Translate" button for non-English items

---

SCREEN 5 — MAP VIEW

Full-screen map (warm-styled, not default Google Maps — use a warm beige map tile style)

Map pins: custom terracotta teardrop pins, size varies by rating (higher rating = slightly larger pin)

Bottom sheet (collapsed by default, drag up to expand):
- Shows scrollable list of restaurants visible in current map area
- Each item: small thumbnail, name, rating, price, distance, "Open Now" badge

Top of map:
- Search bar overlaid on map
- Filter icon (opens same filter panel as Screen 3)
- "NYC / NJ" toggle switch (prominent, pill style)

Cluster behavior: when zoomed out, pins cluster into numbered circles

---

SCREEN 6 — MY LISTS (个人清单)

Top: "My Dining" header + settings gear

Tab bar: Wishlist / Been There / My Lists / Friends' Picks

--- Wishlist tab ---
- Grid of saved restaurant cards
- Each card: photo, name, cuisine, "Added [date]"
- Long press to organize into custom lists

--- Been There tab ---
- Timeline style, sorted by visit date
- Each entry: restaurant photo, name, date visited, user's own rating (if reviewed), "Add Memory" button (opens review composer)

--- My Lists tab ---
- User-created custom lists (e.g. "Date Night Spots", "Cheap Eats Queens", "Special Occasions")
- Each list: cover photo (from first restaurant), list name, count of restaurants, privacy setting icon (Public / Friends / Private)
- "Create New List" + button

--- Friends' Picks tab ---
- Feed of where friends have been recently
- Each card: friend avatar + name + "checked in at [Restaurant Name]" + date + their rating
- Restaurant thumbnail on right
- "Save to Wishlist" quick action

---

SCREEN 7 — RESTAURANT RANKINGS / 榜单

Header: "This Week's Rankings"

Category tabs (horizontal scroll):
- All / Ramen / Brunch / Korean BBQ / Dim Sum / Sushi / Thai / Hidden Gems / Best Value / Late Night

Each ranking entry (list format):
- Rank number (large, terracotta, left side)
- Restaurant photo (square, 72px)
- Name + cuisine + neighborhood
- Star rating
- Price range
- One-line hook: "NYC's most Instagrammed hot pot spot"
- Top dish badge: "#1 Dish: Spicy Beef Hotpot"

Featured top 3: shown as large hero cards with gold/silver/bronze accent

---

SCREEN 8 — WRITE A REVIEW

Step 1 — Rate Overall
- 5 large amber stars (tap to select)
- 4 sub-category sliders: Food Quality / Service / Ambiance / Portion Size

Step 2 — Add Photos
- Grid of photo upload slots
- "Add up to 10 photos" prompt
- Camera + gallery options

Step 3 — Write Review
- Large text area: "Tell others about your experience..."
- Character count (min 50 recommended)
- Dish tagging: "Which dishes did you try?" — search and tag specific menu items

Step 4 — Details
- Date of visit (date picker)
- Party size
- Visit occasion: Birthday / Date / Friends / Solo / Business / Family

Step 5 — Points preview
- "You'll earn 120 points for this review!"
- Progress bar showing points toward next reward (e.g. coupon, free dessert)

Submit button: large terracotta "Share Review"

---

SCREEN 9 — PROFILE / MY PAGE

Profile header:
- Large avatar circle
- Username + short bio
- Stats row: Reviews written / Restaurants visited / Points balance

Points & Rewards section:
- Points balance with progress bar to next reward
- "Redeem Rewards" button — opens reward catalog (coupons, free desserts, discounts)
- Achievement badges: "First Review", "Photo Pro", "Explorer", "Trusted Reviewer"

My Activity:
- Recent reviews
- Recently viewed restaurants
- Followed friends activity

Settings:
- Dietary preferences
- Preferred neighborhoods
- Notification preferences
- Privacy settings (who can see my lists / check-ins)

---

NAVIGATION BAR (bottom, persistent)

5 tabs with icons + labels:
1. Home (house icon) — Discover feed
2. Map (map pin icon) — Map view
3. Search (magnifying glass icon) — Search + filters
4. My Lists (bookmark icon) — Personal lists
5. Profile (person icon) — My page

Active tab: terracotta icon + label
Inactive: warm gray icon + label

---

KEY MICRO-INTERACTIONS TO NOTE IN DESIGN

- Bookmark/heart tap: filled animation with small burst effect
- Rating stars: tap-to-fill with satisfying snap
- Filter pill selection: smooth background fill transition
- NYC/NJ toggle: smooth sliding pill animation
- Review submission: confetti + points earned celebration animation
- Photo upload: thumbnail preview with gentle scale-in animation
- "Friends been here" avatar stack: subtle overlap with warm border

---

ACCESSIBILITY & DETAIL NOTES

- All food photos should feel warm, saturated, and appetizing
- Use real-looking placeholder restaurant names with Asian-American context (e.g. "Sakura Ramen", "Golden Dumpling House", "Boba & Bites", "Seoul Garden")
- Price range always shown in $ symbols, not numbers
- Ratings always shown with one decimal (e.g. 4.3, not just 4)
- Review dates always shown (not hidden) — this is a key trust feature
- "Verified Diner" badge on reviews that are tied to a real visit
- Menu translation button visible on any non-English menu item
- All wait time / seat availability info shown with a "Live" pulse dot indicator
- NJ area restaurants clearly labeled with their specific neighborhood (e.g. "Journal Square, JC" or "Hoboken, NJ")

---

SCREENS TO PRODUCE (in order):

1. Splash / Onboarding
2. Home / Discover Feed
3. Search & Filter (with filter bottom sheet open)
4. Restaurant Detail — Photos tab
5. Restaurant Detail — Reviews tab
6. Restaurant Detail — Top Dishes tab
7. Map View
8. My Lists — Wishlist tab
9. Rankings / 榜单
10. Write a Review
11. Profile / My Page