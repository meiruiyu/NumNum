Add a brand new social feature module to the existing app.
This is triggered by tapping the bell/notification icon in
the top-right corner of the Home screen.

DO NOT replace the notification bell. Instead, redesign
the bell icon tap behavior:

CURRENT: Bell icon shows a notification dropdown
NEW: Bell icon tap navigates to a full new page called
"Friends Space" — a completely separate social area
with its own navigation system.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ENTRY POINT — HOME SCREEN BELL ICON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The bell icon in the Home screen top bar remains in place.
It retains its red notification dot indicator.

Prototype interaction:
On tap → Navigate to "Friends Space" screen
Transition: slide up from bottom (modal style)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FIRST-LAUNCH PERMISSION SCREEN
(shown only once, the very first time user enters)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Design a permission/opt-in screen that appears before
entering Friends Space for the first time.

Layout: centered card on dimmed background overlay

Card content (white card, border-radius 20px, padding 28px):

TOP: A warm illustration — two people sharing a meal,
  simple flat style, terracotta and cream tones, 120px tall

TITLE: "Discover where your friends eat"
  22px, weight 700, #2C1A0E, centered

BODY TEXT (13px, weight 400, #8A8078, centered, 3 lines):
  "See where your friends have been, share your
  favorite spots, and discover new restaurants
  through the people you trust."

FEATURES LIST (left-aligned, 3 rows, each 40px tall):
  Row 1: [friend icon 20px] "See friends' recent check-ins"
  Row 2: [fork icon 20px]   "Share & recommend restaurants"
  Row 3: [chat icon 20px]   "Chat about food with friends"
  Each row: icon left (terracotta), text 13px #4A3728, right

PRIVACY NOTE (11px, #8A8078, centered):
  "Your activity is private by default.
  You control what you share."

TWO BUTTONS stacked:
  Button 1 (primary, full width, terracotta):
    "Enable Friends Space"
    52px height, border-radius 12px, 16px 700 white

  Button 2 (text link, full width):
    "Maybe Later"
    13px, #8A8078, no background

Prototype: "Enable Friends Space" → navigate to
Friends Space Main screen
"Maybe Later" → dismiss back to Home

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FRIENDS SPACE — MAIN SCREEN
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is a completely new full-screen page with its OWN
navigation bar at the bottom, separate from the main
app's 5-tab navigation.

TOP BAR:
Left: Back arrow "←" (20px, #2C1A0E) — tapping returns
  to Home screen
Center: "Friends Space" (17px, weight 600, #2C1A0E)
Right: "Add Friends" icon (person+ icon, 20px, terracotta)

TOP BAR height: 52px
Separator line below: 0.5px #F0EBE3

FRIENDS SPACE INTERNAL NAVIGATION:
A segmented tab bar directly below the top bar
(NOT a bottom nav bar — place it just below the top bar)

4 tabs in a horizontal pill-style tab bar:
[Feed] [Friends] [Messages] [Discover]

Tab bar style:
- Outer container: full width, height 44px,
  background #FDF6EE, border-radius 0
- Active tab: white pill background, border-radius 999px,
  terracotta text (#E8603C), weight 600, 13px
- Inactive tab: no background, #8A8078 text, weight 400
- Transition between tabs: smooth 200ms slide

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TAB 1 — FEED (default view)
"What your friends are eating recently"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A vertically scrollable activity feed, similar to
Instagram's following feed but focused on food.

Each activity card in the feed:

CARD STRUCTURE (white card, border-radius 16px,
  padding 14px 16px, margin-bottom 12px):

ROW 1 — User info bar (height 44px):
  Left: User avatar circle (36px diameter)
    Show initials if no photo (e.g. "KL", "MJ")
    Avatar border: 2px terracotta ring if posted today
  Center-left:
    Line 1: Username (14px, weight 600, #2C1A0E)
    Line 2: Activity text (12px, weight 400, #8A8078)
      e.g. "checked in at" / "recommended" / "added to wishlist"
  Right: Timestamp (11px, #8A8078)
    e.g. "2h ago" / "Yesterday" / "3 days ago"

ROW 2 — Restaurant card (appears below user info):
  A compact restaurant reference block:
  - Restaurant photo thumbnail (full width, height 180px,
    border-radius 12px, object-fit cover)
  - Over the photo, bottom-left: restaurant name badge
    (white pill, 12px bold, with star rating inline)

ROW 3 — Friend's comment (optional, appears below photo):
  If the friend left a note with their check-in:
  Quote-style text block:
  - Left border: 3px terracotta vertical line
  - Text: 13px, weight 400, #4A3728, italic
  - Padding: 8px 12px
  - Background: #FDF6EE
  - Border-radius: 0 8px 8px 0

ROW 4 — Action row (below comment):
  Three small action buttons in a row:
  [heart icon + "Like"]  [bookmark + "Save"]  [share + "Share"]
  Each button: 12px, #8A8078, icon 14px, gap 4px
  "Save" means save the restaurant to own wishlist

Populate the feed with these 4 sample activity cards:

Card 1:
  User: "Karen L." (avatar: KL, coral background)
  Activity: "checked in at"
  Restaurant: "Flushing Hot Pot" — 4.7★ $$
  Comment: "The soup base is incredible, must try
    the spicy lamb version!"
  Time: "2h ago"

Card 2:
  User: "Mike J." (avatar: MJ, blue background)
  Activity: "recommended"
  Restaurant: "Han Joo KBBQ" — 4.5★ $$$
  Comment: "Perfect for a big group dinner, book
    at least 3 days in advance"
  Time: "Yesterday"

Card 3:
  User: "Amy C." (avatar: AC, green background)
  Activity: "added to wishlist"
  Restaurant: "Sakura Brunch" — 4.3★ $$
  No comment (ROW 3 omitted)
  Time: "2 days ago"

Card 4:
  User: "David K." (avatar: DK, purple background)
  Activity: "checked in at"
  Restaurant: "JSQ Spice Garden" — 4.6★ $$
  Comment: "Hidden gem in Jersey City, the dosa
    here is better than anything in Manhattan"
  Time: "3 days ago"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TAB 2 — FRIENDS
"Your friend list and add friends"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

TOP: Search bar (full width, 40px height, rounded pill)
  Placeholder: "Search by name or username..."

SECTION 1 — "My Friends" (header 16px bold)
A vertically scrollable list of friend rows.

Each friend row (height 64px):
Left: Avatar circle (40px) with initials
Center:
  Line 1: Name (14px, weight 600, #2C1A0E)
  Line 2: "@username  ·  X restaurants in common"
    (12px, #8A8078)
Right: "View" text button (12px, terracotta)

Show 4 sample friends:
- Karen L. / @karenl / 12 restaurants in common
- Mike J. / @mikej / 8 restaurants in common
- Amy C. / @amyc / 5 restaurants in common
- David K. / @davidk / 3 restaurants in common

Separator between rows: 0.5px #F5F0EB line

SECTION 2 — "People You May Know" (header 16px bold)
Same row structure but with an "Add +" button instead
of "View":

Show 2 sample suggested friends:
- Jenny W. / @jennyw / 2 mutual friends
- Tom H. / @tomh / 5 mutual friends

"Add +" button style:
  Border: 1px terracotta, terracotta text, no fill
  Border-radius: 999px, padding 4px 14px, 12px text

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TAB 3 — MESSAGES
"Simple chat to discuss and recommend restaurants"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

A conversation list screen (like iMessage list view).

Each conversation row (height 72px):
Left: Avatar circle (44px)
Center:
  Line 1: Name (14px, weight 600, #2C1A0E)
  Line 2: Last message preview (13px, #8A8078,
    truncate at 1 line)
Right: Timestamp (11px, #8A8078, top-aligned)
  Unread badge: small terracotta circle with
  white count number (if unread messages exist)

Show 3 sample conversations:

Conversation 1:
  Name: Karen L.
  Last message: "Have you tried the new ramen place
    in Midtown? 🍜"
  Time: "2:34 PM"
  Unread: 2

Conversation 2:
  Name: Mike J.
  Last message: "Sent you a restaurant recommendation"
  Time: "Yesterday"
  Unread: 0

Conversation 3:
  Name: Amy C.
  Last message: "That brunch place was amazing, thanks!"
  Time: "Mon"
  Unread: 0

Tapping a conversation row opens a CHAT SCREEN:

CHAT SCREEN design:
Top bar: back arrow + friend name + their avatar (small)
Chat bubble area (scrollable):
  - Received messages: left-aligned, light gray bubble
    (#F2EDE8), #2C1A0E text, border-radius 4px 16px 16px 16px
  - Sent messages: right-aligned, terracotta bubble
    (#E8603C), white text, border-radius 16px 4px 16px 16px
  - Font: 14px, weight 400, line-height 1.5

SPECIAL MESSAGE TYPE — Restaurant Recommendation Card:
When a restaurant is shared via message, it appears as
a rich card inside the chat bubble:
  - Small restaurant photo (full width, 120px height,
    border-radius 12px top)
  - Restaurant name (14px bold) + rating + price
  - "View Restaurant" button (terracotta, full width,
    40px, border-radius 0 0 12px 12px)

Show 3 chat messages in Karen's conversation:
  Karen (received): "Have you tried the new ramen place
    in Midtown? 🍜"
  [Restaurant Card] "Ramen Nakamura" 4.5★ $$
    [View Restaurant button]
  You (sent): "OMG looks amazing, adding to my wishlist!"

Input bar at bottom (44px height):
  Left: attachment/restaurant-share icon (terracotta)
  Center: text input (rounded, placeholder "Message...")
  Right: send arrow button (terracotta circle, 32px)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TAB 4 — DISCOVER
"Find new friends with similar food taste"
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

SECTION 1 — "Taste Match" (16px bold header)
Subtitle: "People with similar food preferences"
  (13px muted)

Cards in a horizontal scroll row (like a dating-app
style discovery but for food taste compatibility):

Each taste match card (width 160px, height 200px,
border-radius 16px, white bg, border 0.5px #F0EBE3):
- Top: Avatar (52px, centered, top 20px)
- Name: 14px bold, centered
- "@username": 12px muted, centered
- "Taste Match:" label + colored score pill
  e.g. "87% match" in green pill
- 3 cuisine tags (small pills): e.g. "Ramen" "KBBQ" "Thai"
- "Add Friend" button: full width, 36px, terracotta

Show 3 taste match cards:
  Person 1: Sarah M. / @sarahm / 91% match
    Tags: Hot Pot, Dim Sum, Boba
  Person 2: James L. / @jamesl / 84% match
    Tags: Ramen, Sushi, Brunch
  Person 3: Lisa W. / @lisaw / 78% match
    Tags: Korean BBQ, Thai, Cafe

SECTION 2 — "Trending in Your Area" (16px bold)
Subtitle: "Restaurants your friends' friends love"

A vertical list of restaurant cards (same compact style
as Home screen but smaller — 64px height horizontal rows)
with the note: "3 people in your network have been here"
shown in 11px muted text below the restaurant name.

Show 3 trending restaurants:
  1. Golden Dumpling — Chinatown, 4.7★ — "4 friends"
  2. Flushing Hot Pot — Flushing, 4.7★ — "3 friends"
  3. Han Joo KBBQ — Koreatown, 4.5★ — "2 friends"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PRIVACY SETTINGS (accessible from Friends Space)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Add a small settings gear icon (⚙) in the top bar of
Friends Space, to the left of the "Add Friends" icon.

Tapping the gear opens a bottom sheet titled
"Friends Space Settings"

Settings list (toggle rows):

Toggle 1: "Share my check-ins"
  Subtitle: "Let friends see where you dine"
  Default: ON

Toggle 2: "Share my wishlist"
  Subtitle: "Let friends see restaurants you saved"
  Default: OFF

Toggle 3: "Allow friend requests"
  Subtitle: "Let others send you friend requests"
  Default: ON

Toggle 4: "Appear in Discover"
  Subtitle: "Let others find you by taste match"
  Default: ON

Toggle 5: "Activity status"
  Subtitle: "Show when you were last active"
  Default: OFF

Section divider: "Notifications"

Toggle 6: "Friend check-in alerts"
  Subtitle: "Notify when a friend checks in nearby"
  Default: ON

Toggle 7: "New recommendations"
  Subtitle: "Notify when a friend recommends a spot"
  Default: ON

"Disable Friends Space" text button at the bottom:
  13px, #E24B4A (red), centered
  Tapping shows a confirmation dialog:
  "Disable Friends Space?"
  "Your friends won't see your activity anymore."
  [Cancel] [Disable] buttons

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN CONSISTENCY RULES FOR FRIENDS SPACE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. The Friends Space page uses the SAME color system
   as the main app:
   - Primary: #E8603C (terracotta)
   - Background: #FDF6EE (warm cream)
   - Cards: #FFFFFF (white)
   - Text primary: #2C1A0E
   - Text secondary: #8A8078
   - Borders: #F0EBE3

2. The Friends Space does NOT have the main app's
   bottom navigation bar (Home/Map/Search/Lists/Profile).
   It has its own internal 4-tab segmented control
   at the top (Feed / Friends / Messages / Discover).

3. The back arrow "←" in the top-left always returns
   to the Home screen of the main app.

4. All avatar circles for users follow this system:
   - If no profile photo: show initials in a colored
     circle. Color assigned by first letter of name:
     A-E: terracotta (#FAECE7 bg, #993C1D text)
     F-J: blue (#E6F1FB bg, #0C447C text)
     K-O: green (#EAF3DE bg, #27500A text)
     P-T: purple (#EEEDFE bg, #3C3489 text)
     U-Z: amber (#FAEEDA bg, #633806 text)

5. All text must be English only.
   No text overflow. All labels truncate with ellipsis.

6. Screen size: iPhone 14 Pro, 393 × 852px.
   Use Auto Layout for all components.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROTOTYPE CONNECTIONS REQUIRED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Connect these interactions in Figma Prototype mode:

1. Home screen bell icon tap
   → Navigate to: Permission Screen (first time)
   → OR Navigate to: Friends Space Feed (returning user)

2. Permission Screen "Enable Friends Space" button
   → Navigate to: Friends Space Feed tab

3. Permission Screen "Maybe Later" button
   → Navigate back to: Home screen

4. Friends Space back arrow "←"
   → Navigate back to: Home screen

5. Friends Space internal tabs
   Feed / Friends / Messages / Discover
   → Each tab switches to its respective content frame

6. Messages list: tap Karen L. row
   → Navigate to: Chat Screen with Karen

7. Chat Screen back arrow
   → Navigate back to: Messages list

8. Friends Space gear icon
   → Open: Privacy Settings bottom sheet overlay

9. Privacy Settings "Disable Friends Space" button
   → Show: Confirmation dialog overlay