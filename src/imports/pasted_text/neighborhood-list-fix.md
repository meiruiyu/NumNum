Apply the following 4 targeted changes to the existing app design.
Do not redesign any screen from scratch. Only modify the specific
elements described below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 1 — REPLACE BELL ICON WITH SOCIAL / CHAT ICON
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM: The notification bell icon does not visually
communicate the social / messaging nature of Friends Space.

SOLUTION: Replace the bell icon in the Home screen top bar
with a chat bubble icon that resembles messaging apps
like WeChat or WhatsApp.

Icon specifications:
- Shape: A rounded speech bubble / chat bubble icon
  Specifically: a filled rounded rectangle bubble with
  a small triangular tail at the bottom-left corner —
  this is the universally recognized "chat" icon shape
  used by WeChat, WhatsApp, iMessage, and LINE
- Size: 24x24px
- Style: outlined (stroke, not filled) to match the
  notification bell's existing visual weight
- Stroke width: 1.5px
- Color: #2C1A0E (default inactive state)
- Color when Friends Space is active/open: #E8603C (terracotta)

The red notification dot indicator stays in place:
- Position: top-right corner of the chat bubble icon
- Size: 8px diameter circle
- Color: #E8603C (terracotta)
- Shown when there are unread messages or friend activity

If Figma's built-in icon library includes a "message-circle",
"chat-bubble", or "comment" icon, use that. The icon must
clearly read as "chat / messaging" at a glance, NOT as
a notification bell.

DO NOT remove the red dot indicator.
DO NOT change the tap behavior — it still opens Friends Space.
Only the icon shape changes.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 2 — LANGUAGE SETTINGS IN PROFILE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

FIND: The "Language" row in the Profile → Settings section.

CURRENT: The language setting shows a modal with generic
language options.

REDESIGN the Language settings row and its detail screen:

PROFILE SETTINGS ROW (unchanged visual style, just update content):
- Label: "Language"  (14px, #2C1A0E, left)
- Value shown on the right: "English"  (13px, #8A8078)
- Chevron arrow "›" on far right
- This row always displays "English" as the current value
  regardless of which language is selected — the UI of
  the app always remains in English

LANGUAGE SELECTION SCREEN (opens when row is tapped):
This is a new full sub-screen, NOT a modal.

Top bar:
- Back arrow "←" top-left
- Title: "Language" centered, 17px weight 600
- No right-side button

Screen subtitle below top bar:
"The app interface stays in English. Your language
preference is used for menu translations and search."
Font: 13px, #8A8078, padding 16px, line-height 1.5

Language options list (full-width rows, checkmark on right):

Each row: 52px height, 16px horizontal padding
Left: Language name in English + native script below it
Right: Checkmark circle (filled terracotta when selected,
  empty outline when not selected)
Separator: 0.5px #F0EBE3 between rows

ROW 1 (default selected):
  Top line: "English"  —  15px, weight 600, #2C1A0E
  Bottom line: "English"  —  12px, #8A8078
  Right: filled terracotta checkmark circle ✓

ROW 2:
  Top line: "Simplified Chinese"  —  15px, weight 600, #2C1A0E
  Bottom line: "简体中文"  —  12px, #8A8078
  Right: empty checkmark circle

ROW 3:
  Top line: "Traditional Chinese"  —  15px, weight 600, #2C1A0E
  Bottom line: "繁體中文"  —  12px, #8A8078
  Right: empty checkmark circle

ROW 4:
  Top line: "Thai"  —  15px, weight 600, #2C1A0E
  Bottom line: "ภาษาไทย"  —  12px, #8A8078
  Right: empty checkmark circle

ROW 5 (grayed out, coming soon):
  Top line: "Korean"  —  15px, weight 400, #B4B2A9
  Bottom line: "한국어"  —  12px, #C5BDB4
  Right: "Soon" badge — 10px, #8A8078, border #D4C9BE,
    border-radius 4px, padding 2px 6px
  No checkmark — not selectable

ROW 6 (grayed out, coming soon):
  Top line: "Japanese"  —  15px, weight 400, #B4B2A9
  Bottom line: "日本語"  —  12px, #C5BDB4
  Right: "Soon" badge (same as above)

NOTE AT BOTTOM OF LIST:
"More languages coming soon. Your selection affects
menu translation and dish name display only."
Font: 12px, #8A8078, centered, padding 16px 24px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 3 — "YOUR NEIGHBORHOOD" SECTION LAYOUT FIX
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROBLEM (visible in screenshot):
- Restaurant names wrap onto 2 lines ("Flushing / Hot Pot"
  on two separate lines) causing cards to have uneven height
- Price "$$" is placed on the same line as the restaurant
  name, crowding the layout
- Location text ("Flushin", "Fort Lee") is being cut off
  with no ellipsis
- "4–8 people" capacity info is shown, cluttering the card
- The 2-column grid causes all these overflow problems

SOLUTION: Redesign the "Your Neighborhood" section as a
SINGLE-COLUMN vertical list of horizontal restaurant rows
(not a 2-column grid).

Each restaurant row design:

CARD: full width, height 88px fixed, white background,
border-radius 12px, border 0.5px #F0EBE3,
padding: 10px 14px, margin-bottom: 8px

INTERNAL LAYOUT — horizontal flex row:

[LEFT: Photo 80x68px] [MIDDLE: Info block] [RIGHT: Chevron]

LEFT — Photo block:
- Width: 80px, height: 68px
- Border-radius: 10px
- Object-fit: cover
- Flex-shrink: 0 (never compress)

MIDDLE — Info block (flex-grow: 1, min-width: 0,
  padding: 0 12px 0 10px):

Line 1: Restaurant name
- Font: 14px, weight 600, #2C1A0E
- White-space: nowrap
- Overflow: hidden
- Text-overflow: ellipsis
- Max characters visible: ~22 chars before truncation

Line 2: Cuisine type • Location
- Font: 12px, weight 400, #8A8078
- White-space: nowrap
- Overflow: hidden
- Text-overflow: ellipsis
- Format: "Chinese  ·  Flushing, Queens"
  (use a centered dot · as separator)
- Location must show full neighborhood name:
  "Flushing, Queens" NOT "Flushin"

Line 3: Rating + Price (horizontal row):
- Star icon (amber, 12px) + rating number (12px, #4A3728,
  weight 500) + "(review count)" (11px, #8A8078) +
  "  ·  " separator + price range "$$ "(12px, #4A3728)
- All on ONE line, no wrapping
- White-space: nowrap

REMOVE completely: "4–8 people", "2–6 people" capacity info
  This field is too detailed for a list view card.

RIGHT — Chevron:
- "›" character, 16px, #C5BDB4
- Flex-shrink: 0
- Align: center vertically

BADGE on photo (keep "Trending" and "Top Pick" badges):
- Position: top-left corner of photo, 8px offset
- Style: small pill, 10px text, weight 600
- "Trending": terracotta fill (#E8603C), white text
- "Top Pick": forest green fill (#2D6A4F), white text
- Height: 20px, padding: 2px 8px, border-radius: 999px

UPDATE the sample restaurant data for this section:

Row 1:
  Name: "Flushing Hot Pot"
  Cuisine · Location: "Chinese  ·  Flushing, Queens"
  Rating: ★ 4.7 (3284)  ·  $$
  Badge: Trending
  Photo: use existing hot pot photo

Row 2:
  Name: "Bonchon"
  Cuisine · Location: "Korean  ·  Fort Lee, NJ"
  Rating: ★ 4.6 (2156)  ·  $$
  Badge: Trending
  Photo: use existing Bonchon photo

Row 3:
  Name: "Pho Bac"
  Cuisine · Location: "Vietnamese  ·  Manhattan"
  Rating: ★ 4.5 (1876)  ·  $
  Badge: Top Pick
  Photo: use existing pho photo

Row 4:
  Name: "Tiger Sugar"
  Cuisine · Location: "Bubble Tea  ·  Flushing, Queens"
  Rating: ★ 4.4 (4521)  ·  $
  Badge: Trending
  Photo: use existing Tiger Sugar photo

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CHANGE 4 — GLOBAL LAYOUT & FORMAT AUDIT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Perform a comprehensive audit and fix of ALL screens.
Apply the following rules universally across the entire app:

── TEXT OVERFLOW RULES ──
Every single text element in the app must have overflow
protection. Apply these rules to ALL text:

Rule A — Single-line text labels (names, titles, tags):
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis
  max-width: 100% of parent container

Rule B — Multi-line descriptions (review text, subtitles):
  display: -webkit-box
  -webkit-line-clamp: 2 (max 2 lines)
  overflow: hidden
  word-break: break-word

Rule C — Badge/pill text:
  white-space: nowrap
  max-width: defined (never expand pill beyond design spec)

NO text anywhere in the app may extend beyond its
container boundary, overlap other elements, or be
cut off mid-character without an ellipsis.

── CARD HEIGHT CONSISTENCY ──
Within any single list or grid section, ALL cards must
have IDENTICAL heights. Never mix tall and short cards
in the same row.

In 2-column grids: use fixed heights only, never auto.
In single-column lists: use fixed row heights only.

If content varies, truncate text — never expand the card.

── SPACING CONSISTENCY ──
Apply these spacing values uniformly across ALL screens:

Screen edge padding (horizontal): 16px on both sides
Section gap (vertical between sections): 24px
Card-to-card gap in list: 8px
Card-to-card gap in grid: 10px
Section header margin-bottom: 4px
Section subtitle margin-bottom: 12px

── SECTION HEADER AUDIT ──
Go through every section header on every screen and verify:
Font size: 20px
Font weight: 700
Color: #2C1A0E
No section header may deviate from this spec.

── BADGE/PILL AUDIT ──
All badge pills must have:
Height: exactly 20px
Horizontal padding: exactly 8px left, 8px right
Font size: exactly 11px
Font weight: 600
Border-radius: 999px (fully rounded)
Text: always on ONE line, never wrapping

── NAVIGATION BAR AUDIT ──
Bottom nav bar on all main screens:
Height: 56px (tab bar) + safe area inset
Active icon + label: #E8603C terracotta
Inactive icon + label: #8A8078 warm gray
Icon size: 22x22px
Label size: 10px
Gap between icon and label: 4px
Background: #FFFFFF with 0.5px top border #F0EBE3

── TOP BAR AUDIT ──
Home screen top bar:
Height: 52px
Left: user avatar (32px circle)
Center: NYC | NJ toggle (120px wide pill toggle)
Right: chat bubble icon (24px)
All three elements must be vertically centered at 26px
from the top of the bar.

── RATING DISPLAY AUDIT ──
Wherever ratings appear, they must follow this exact format:
★ [number with 1 decimal] ([review count with comma separator])
Examples: ★ 4.7 (3,284)   ★ 4.5 (1,876)
Star: amber color #F4A535
Number: 12px or 13px depending on context, weight 500
Review count: same size, muted color #8A8078, in parentheses

── PRICE DISPLAY AUDIT ──
Price range symbols must always use $ signs only:
$ = under $20 per person
$$ = $20–$40 per person
$$$ = $40–$70 per person
$$$$ = $70+ per person
Price color: #6B5744, weight 500, same size as rating text

── PHOTO ASPECT RATIO AUDIT ──
All restaurant card photos must maintain consistent
aspect ratios within their context:

Large hero cards (Top Picks horizontal scroll): 16:9
Neighborhood list rows: 80x68px (fixed, not ratio-based)
Grid card photos: square 1:1 ratio
Detail page hero: full width × 260px height

Photos must use object-fit: cover — never stretch or squish.

── FRIENDS SPACE CONSISTENCY ──
The Friends Space module must match the main app's
visual language precisely:
- Same terracotta (#E8603C) primary color
- Same cream (#FDF6EE) background
- Same card style (white, 0.5px border, radius 12px)
- Same typography levels (see Change 3 in previous prompt)
- Chat bubbles: received = #F2EDE8, sent = #E8603C

── LANGUAGE / CONTENT AUDIT ──
Final scan of ALL screens for any non-English UI text:
Remove or replace any Chinese, Korean, or other
language characters appearing in:
- Section headers
- Navigation labels
- Button text
- Placeholder text
- Badge text
- Filter labels
- Settings labels

Only permitted non-English text:
- Restaurant names (may be in any language)
- Language option rows (native script shown as subtitle)
- Menu translation content within restaurant detail page

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SCREENS TO AUDIT AND FIX (all of them):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Home / Discover Feed
2. Search & Filter (with filter sheet)
3. Restaurant Detail (all tabs)
4. Map View
5. My Lists (all tabs)
6. Rankings page
7. Write a Review
8. Profile / Settings
9. Language Settings (new screen from Change 2)
10. Friends Space — all 4 tabs
11. Chat Screen
12. Privacy Settings sheet

Apply all Change 4 rules to every single one of
these screens without exception.