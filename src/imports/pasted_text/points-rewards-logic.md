CHANGE: Fix logical errors on the Profile page Points &
Rewards section, then audit all other screens for
similar logic inconsistencies.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 1 — CORRECT REWARD CARD STATES
(Profile page → Points & Rewards section)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User's current points balance: 1,240 pts

The 4 reward cards must reflect this balance accurately.
A reward is AVAILABLE (full color) if its cost is
less than or equal to 1,240 pts.
A reward is LOCKED (dimmed) if its cost is greater
than 1,240 pts.

CORRECT state for each reward card:

Card 1 — "10% Off Coupon" — 500 pts
  Status: AVAILABLE (user has 1,240 pts ≥ 500 pts)
  Visual: full color, normal opacity (1.0)
  Icon: colored terracotta coupon icon
  Points pill: #FAEEDA background, #633806 text
  No "Almost there!" label

Card 2 — "Free Dessert" — 800 pts
  Status: AVAILABLE (user has 1,240 pts ≥ 800 pts)
  Visual: full color, normal opacity (1.0)
  Icon: colored terracotta dessert icon
  Points pill: #FAEEDA background, #633806 text
  No "Almost there!" label

Card 3 — "Priority Booking" — 1,200 pts
  Status: AVAILABLE (user has 1,240 pts ≥ 1,200 pts)
  Visual: full color, normal opacity (1.0)
  Icon: colored terracotta star icon
  Points pill: #FAEEDA background, #633806 text
  REMOVE the "Almost there!" label — user CAN afford this
  ADD a subtle "Redeemable!" badge instead:
    Font: 10px, weight 600
    Background: #EAF3DE (soft green)
    Color: #27500A (dark green)
    Border-radius: 4px, padding: 2px 6px
    Positioned below the points pill

Card 4 — "$50 Credit" — 2,000 pts
  UPDATE name from "$5 Credit" to "$50 Credit"
  UPDATE the reward value shown on the card:
    Old: "$5 Credit"
    New: "$50 Credit"
  Status: LOCKED (user has 1,240 pts < 2,000 pts)
  Visual: dimmed, opacity 0.45
  Icon: gray gift icon (desaturated)
  Points pill: #F0EBE3 background, #B4B2A9 text
  ADD "Almost there!" label below points pill:
    Font: 10px, weight 600, color #E8603C (terracotta)

LOGIC RULE to apply permanently:
  If reward cost ≤ user's points balance
    → full color, opacity 1.0, no lock
  If reward cost > user's points balance
    → dimmed, opacity 0.45, show "Almost there!"
  If reward cost ≤ user's points balance
    AND cost is closest affordable reward
    → add "Redeemable!" green badge

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 2 — UPDATE PROGRESS BAR & RING LOGIC
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The progress bar and ring currently show progress
toward 2,000 pts (the "$50 Credit" reward).

KEEP this logic — progress toward next LOCKED reward
is correct. No change needed here.

However update the label below the progress bar
to reflect the corrected reward name:

CURRENT: (implied "$5 Credit" as the goal)
NEW label below progress bar right side: "2,000 pts"
NEW label below ring: "to next reward"
Both labels are unchanged — only the reward name
on Card 4 changes from "$5" to "$50".

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 3 — UPDATE ACHIEVEMENT BADGE LOGIC
(Profile page → Achievements section)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Verify that earned vs unearned badges are logically
consistent with the user's activity stats:

User stats (shown in profile stats row):
  Reviews written: visible on screen (use whatever
    number is currently shown)
  Restaurants visited: visible on screen
  Points balance: 1,240 pts

Badge logic check:
  "First Review" (earned) → requires 1+ reviews
    If user has any reviews shown → KEEP as earned ✓

  "Photo Pro" (earned) → requires 10+ photos uploaded
    Assume earned if user has multiple reviews ✓

  "Explorer" (earned) → requires 5+ neighborhoods
    Assume earned based on Flushing + Manhattan
    + Jersey City activity shown in feed ✓

  "Trusted Voice" (earned) → requires 50+ helpful votes
    Keep as earned ✓

  "Top Reviewer" (unearned) → requires 20+ reviews
    Keep as unearned, locked ✓

  "Social Butterfly" (unearned) → requires 10+ friends
    Keep as unearned, locked ✓

  "NYC Expert" (unearned) → requires 20+ restaurants
    Keep as unearned, locked ✓

  "Elite Member" (unearned) → requires 5,000+ points
    Keep as unearned — user has 1,240 pts < 5,000 ✓

No badge state changes needed if current design
already matches above. Fix only if any badge shows
a logically impossible state (e.g., "Elite Member"
shown as earned while points balance is 1,240).

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIX 4 — GLOBAL LOGIC AUDIT (all screens)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Check every other screen for similar logical
inconsistencies where the visual state contradicts
the data being shown. Fix all instances found.

── Restaurant Detail page ──

Check "Open Now" / "Closed" / "Busy" badges:
  All restaurants shown with "Open Now" badge must
  NOT simultaneously show a wait time of 0 min.
  If wait time is shown, it must be > 0 minutes.
  Example fix: "Open Now · 0 min wait" is illogical
    → change to "Open Now · Seats Available"
    OR "Open Now · ~15 min wait"

Check rating display:
  A restaurant with 4.7★ must have a review count
  that is plausibly large (hundreds or thousands).
  A 4.7★ with only 12 reviews is implausible.
  Minimum review counts by rating tier:
    4.5–5.0★ → minimum 200 reviews
    4.0–4.4★ → minimum 50 reviews
    3.5–3.9★ → minimum 20 reviews
  Fix any restaurant card showing high rating
  with suspiciously low review count.

Check price range vs cuisine type:
  $ (under $20) must not apply to fine dining
    or premium cuisine types like Omakase, Kaiseki
  $$$$ (over $70) must not apply to bubble tea,
    street food, or fast casual categories
  Fix any mismatch found.

── Search Results & Rankings pages ──

Check that ranking numbers are sequential:
  A ranked list must go 1, 2, 3, 4, 5...
  No skipped numbers, no repeated numbers.
  Fix any ranking list where numbers are out of
  order or duplicated.

Check that "Top Dish" badges only appear on dishes
that are actually referenced in the Top Dishes tab.
Remove any "Top Dish" badge on a dish that does
not appear in the ranking list.

── Friends Space — Feed tab ──

Check timestamps are logically ordered:
  The most recent activity must appear at the top.
  "2h ago" must appear above "Yesterday" which must
  appear above "3 days ago".
  Fix any feed where timestamps are out of order.

Check friend avatar colors:
  Each friend must have a consistent avatar color
  across ALL screens where they appear
  (Feed, Friends list, Messages, chat bubbles).
  Karen L. must always use the same avatar color.
  Mike J. must always use the same avatar color.
  etc. Fix any inconsistency.

── My Lists — Been There tab ──

Check that user ratings make sense:
  A restaurant the user rated ★★★★★ (5 stars)
  should not also have a negative comment shown
  anywhere in the same screen.
  A restaurant with "Rate this" prompt must NOT
  already show a star rating.
  Fix any contradiction found.

── Write a Review — Points preview ──

The points preview shown at the end of the review
flow must be consistent with the profile balance.

Current balance shown on Profile: 1,240 pts
If the Write a Review screen shows a different
starting balance (e.g., 800 pts or 1,500 pts),
update it to show 1,240 pts as the base.

Points earned per review: keep at 120 pts
New balance preview after review: 1,240 + 120 = 1,360 pts
Update the review completion screen to show:
  "You'll earn 120 points!"
  "New balance: 1,360 pts"

── General rule for all screens ──

Any number, status badge, label, or state that
creates a logical contradiction with other data
visible on the same screen OR on other screens
must be corrected to be internally consistent.

The app must tell a coherent story:
  One user (JD), with 1,240 pts, a verified diner,
  living in Manhattan/Queens, with 4 friends,
  who has visited ~8 restaurants and written
  several reviews.

All data across all screens must be consistent
with this single user profile.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY OF SPECIFIC VALUE CHANGES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

These exact value changes must be applied:

1. "$5 Credit" → "$50 Credit" (reward card name)
2. Card 3 "Priority Booking" 1,200 pts:
   opacity 0.45 → opacity 1.0 (now affordable)
   "Almost there!" → "Redeemable!" in green
3. Card 4 "$50 Credit" 2,000 pts:
   opacity 1.0 → opacity 0.45 (not affordable)
   Add "Almost there!" label in terracotta
4. Write a Review points preview:
   Base balance → 1,240 pts
   After review → 1,360 pts