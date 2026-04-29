CHANGE: Restore the Points & Rewards and Achievement
Badges sections to the Profile page.

These sections were removed in a previous revision.
Add them back exactly as described below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 1 — POINTS & REWARDS
(place directly below the profile stats row)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section card:
- Full width minus 16px padding each side
- Background: white (#FFFFFF)
- Border: 0.5px solid #F0EBE3
- Border-radius: 16px
- Padding: 16px

TOP ROW inside card:
Left: "Points & Rewards" — 15px, weight 600, #2C1A0E
Right: "Redeem" pill button
  Background: #E8603C (terracotta)
  Text: "Redeem" — 12px, weight 600, white
  Height: 28px, border-radius: 999px, padding: 0 14px

POINTS BALANCE ROW (below top row):
Left side:
  Large points number: "1,240"
    28px, weight 700, #E8603C (terracotta)
  Label below number: "points earned"
    12px, weight 400, #8A8078

Right side: circular progress indicator
  A circular ring (stroke-based, not filled):
  - Ring diameter: 56px
  - Track color: #F0EBE3 (light warm gray)
  - Progress color: #E8603C (terracotta)
  - Progress fill: 62% of the ring
    (representing 1,240 of 2,000 points to next reward)
  - Center of ring: "62%" — 12px, weight 600, #E8603C
  Label below ring: "to next reward"
    11px, weight 400, #8A8078, centered

PROGRESS BAR ROW (below balance row):
Full width progress bar:
- Track: #F0EBE3, height 6px, border-radius 999px
- Fill: #E8603C, width 62% of track, border-radius 999px

Below progress bar, two labels on same line:
Left: "1,240 pts" — 11px, #8A8078
Right: "2,000 pts" — 11px, #8A8078

REWARDS PREVIEW ROW (below progress bar):
Label: "Available Rewards" — 13px, weight 600, #2C1A0E
Margin-bottom: 8px

Horizontal scrollable row of reward cards:
Each reward card (width: 120px, height: 80px,
border-radius: 12px, border: 0.5px #F0EBE3,
padding: 10px, background: white):

  TOP: reward icon (24px, centered)
  MIDDLE: reward name (12px, weight 600, #2C1A0E, centered)
    max 2 lines, text-align center
  BOTTOM: points cost pill
    Background: #FAEEDA, color: #633806
    Font: 11px, weight 600
    Border-radius: 4px, padding: 2px 8px
    Centered below reward name

Show 4 reward cards:
  Card 1: [coupon icon] "10% Off Coupon" — 500 pts
  Card 2: [dessert icon] "Free Dessert" — 800 pts
  Card 3: [star icon] "Priority Booking" — 1,200 pts
  Card 4: [gift icon] "$5 Credit" — 2,000 pts

Card 3 "Priority Booking" (1,200 pts) should appear
slightly dimmed (opacity 0.6) since user has 1,240 pts
and can just barely afford it — add a subtle
"Almost there!" label in 10px terracotta below
the points pill.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION 2 — ACHIEVEMENT BADGES
(place directly below Points & Rewards section)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Section card: same style as Points & Rewards card
(white, 0.5px #F0EBE3 border, 16px radius, 16px padding)

TOP ROW:
Left: "Achievements" — 15px, weight 600, #2C1A0E
Right: "See All" — 13px, #E8603C (terracotta link)

BADGES GRID — 2 rows × 4 columns = 8 badges:

Each badge item (width: fills quarter of container,
centered content, vertical stack):

  TOP: Badge icon circle
    Size: 48px diameter
    EARNED badge: colored background + white icon inside
    UNEARNED badge: #F0EBE3 background + #B4B2A9 icon,
      with a small lock icon (10px) overlaid bottom-right

  BOTTOM: Badge name
    11px, weight 500
    EARNED: #2C1A0E
    UNEARNED: #B4B2A9
    white-space: nowrap, text-align: center
    overflow: hidden, text-overflow: ellipsis

Show these 8 badges in this order
(first 4 earned, last 4 unearned):

Badge 1 — EARNED:
  Icon: fork + knife (dining icon)
  Background: #E8603C (terracotta)
  Name: "First Review"
  Sub: "Write your first review"

Badge 2 — EARNED:
  Icon: camera icon
  Background: #1D9E75 (teal/green)
  Name: "Photo Pro"
  Sub: "Upload 10+ photos"

Badge 3 — EARNED:
  Icon: map pin icon
  Background: #185FA5 (blue)
  Name: "Explorer"
  Sub: "Visit 5+ neighborhoods"

Badge 4 — EARNED:
  Icon: thumbs up icon
  Background: #BA7517 (amber)
  Name: "Trusted Voice"
  Sub: "Get 50+ helpful votes"

Badge 5 — UNEARNED (locked):
  Icon: star icon (grayed)
  Background: #F0EBE3
  Name: "Top Reviewer"
  Sub: "Write 20+ reviews"

Badge 6 — UNEARNED (locked):
  Icon: people/friends icon (grayed)
  Background: #F0EBE3
  Name: "Social Butterfly"
  Sub: "Add 10+ friends"

Badge 7 — UNEARNED (locked):
  Icon: trophy icon (grayed)
  Background: #F0EBE3
  Name: "NYC Expert"
  Sub: "Visit 20+ restaurants"

Badge 8 — UNEARNED (locked):
  Icon: crown icon (grayed)
  Background: #F0EBE3
  Name: "Elite Member"
  Sub: "Earn 5,000+ points"

BELOW THE BADGE GRID:
A thin progress note for the next badge to unlock:
"Next: Top Reviewer — write 8 more reviews"
Font: 12px, #8A8078, left-aligned
Left accent: 3px terracotta vertical line
  border-radius: 0, margin-right: 8px
Background: #FDF6EE, border-radius: 8px,
padding: 8px 12px, margin-top: 12px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PLACEMENT ON PROFILE PAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The final Profile page vertical order from top to bottom:

1. Profile header (avatar + name + bio)
2. Stats row (Reviews written / Restaurants visited
   / Points balance)
3. Points & Rewards card  ← RESTORED
4. Achievement Badges card ← RESTORED
5. My Activity section (recent reviews, recently viewed)
6. Settings section

All other existing Profile page content remains unchanged.
Only sections 3 and 4 are being added back.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Both restored sections must follow the app design system:
- Background: #FDF6EE (page background)
- Card surface: white (#FFFFFF)
- Borders: 0.5px #F0EBE3
- Primary color: #E8603C (terracotta)
- Text primary: #2C1A0E
- Text secondary: #8A8078
- All text overflow: ellipsis, no wrapping beyond spec
- Section gap between cards: 12px