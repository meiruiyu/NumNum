CREATE a new full-screen page that appears when the user
taps "View All ›" in the Recommended Dishes section
of the Restaurant Detail page.

This page is inspired by Dianping's 推荐菜 page layout,
combined with our app's multi-language translation feature.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
TOP BAR
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Left: Back arrow "←" (20px, #2C1A0E)
  Tapping returns to Restaurant Detail page

Center: Two tabs (segmented, underline style):
  Tab 1: "Recommended Dishes" — ACTIVE by default
    Active: #2C1A0E text, weight 600, 15px
    Underline: 2px solid #E8603C below the label
  Tab 2: "Full Menu"
    Inactive: #8A8078 text, weight 400, 15px
    No underline

  Tapping "Full Menu" tab switches to the Menu &
  Translate content (same content as the Menu tab
  in the Restaurant Detail page — all dishes
  organized by category with language selector)

Right: Search icon (magnifier, 20px, #8A8078)
  Tapping opens an inline search bar to filter
  dishes by name

Top bar height: 52px
Separator below: 0.5px #F0EBE3

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
LANGUAGE SELECTOR (below top bar)
Only visible on "Recommended Dishes" tab
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Horizontally scrollable pill row:
[English] [简体中文] [繁體中文] [ภาษาไทย] [日本語] [한국어]

Active pill: #E8603C fill, white text
Inactive pill: white fill, #E0D8D0 border, #8A8078 text
Height: 28px, border-radius: 999px
Font: 11px, weight 500
Padding: 0 12px, margin-right: 8px
Row padding: 8px 16px
Row background: #FDF6EE
Border-bottom: 0.5px #F0EBE3

Default selected: "English"

Tapping a language pill updates ALL dish name
Line 1 text across the entire list to that language
(same translation logic as Menu & Translate tab)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SECTION HEADER (below language selector)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Full width row, padding: 12px 16px

Left: "User Picks (34)"
  Font: 16px, weight 700, #2C1A0E
  "(34)" in same size but weight 400, #8A8078

Right: Search icon (already in top bar — omit here)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DISH RANKING LIST (main content, scrollable)
Inspired by Dianping's 推荐菜 list layout
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Each dish row — full width, height: 120px fixed
Background: white
Border-bottom: 0.5px #F0EBE3
Padding: 12px 16px

Internal layout — horizontal flex:

[LEFT: Rank badge + Photo] [MIDDLE: Info] [RIGHT: Actions]

── LEFT BLOCK (width: 110px, flex-shrink: 0) ──

Rank badge (overlaid on top-left corner of photo):
  TOP 1–3: filled red-orange pill
    Background: #E8603C
    Text: "TOP 1" / "TOP 2" / "TOP 3"
    Font: 10px, weight 700, white
    Border-radius: 6px 0 6px 0
    (top-left and bottom-right rounded, others sharp)
    Position: absolute, top-left of photo, no margin
  TOP 4+: same pill style but background: #888780 (gray)
    Text: "TOP 4" / "TOP 5" etc.

Photo:
  Width: 110px, height: 96px
  Border-radius: 10px
  Object-fit: cover
  Rank badge overlaid on top-left corner

Photo count indicator (overlaid bottom-right of photo):
  Small pill: dark semi-transparent background
  Icon: image/photo icon (10px, white)
  Text: count number e.g. "1" or "2"
  Font: 10px, white
  Height: 18px, padding: 0 6px
  Border-radius: 0 0 10px 0 (bottom-right corner)
  Position: absolute, bottom-right of photo

── MIDDLE BLOCK (flex-grow: 1, padding: 0 12px) ──

Line 1: Dish name in selected language
  Font: 15px, weight 600, #2C1A0E
  white-space: nowrap, overflow: hidden,
  text-overflow: ellipsis

Line 2: Original dish name (always in source language)
  Font: 12px, weight 400, #8A8078
  white-space: nowrap, overflow: hidden,
  text-overflow: ellipsis
  e.g. "麻辣牛肉火锅"

Line 3: Top user review quote
  A short excerpt from the highest-voted review
  about this specific dish
  Style: italic, 12px, weight 400, #4A3728
  Displayed in quotation marks: "..."
  Max 1 line, truncate with ellipsis
  e.g. "Best hot pot broth I've had in NYC"

Line 4: Points incentive row (inspired by Dianping):
  Small amber dot (6px, #F4A535) +
  "Review this dish · earn 15 pts"
  Font: 11px, weight 400, #BA7517
  Tapping navigates to Write Review screen
  with this dish pre-selected

── RIGHT BLOCK (width: 52px, flex-shrink: 0) ──

Two action buttons stacked vertically, centered:

TOP — Like / Thumbs up:
  Icon: thumbs up outline (20px, #8A8078)
  Count below icon: number e.g. "4"
    Font: 11px, weight 500, #8A8078
  Tapping: icon fills to #E8603C, count increments

BOTTOM — Save / Bookmark:
  Icon: bookmark outline (20px, #8A8078)
  Label below: "Save"
    Font: 11px, weight 400, #8A8078
  Tapping: icon fills to #E8603C

Gap between the two action buttons: 8px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SAMPLE DISH DATA — 6 rows
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Row 1 — TOP 1 (terracotta badge):
  English name: "Spicy Beef Hot Pot"
  Original: "麻辣牛肉火锅"
  Quote: "Best hot pot broth I've had in NYC"
  Likes: 8
  Photo count: 3

Row 2 — TOP 2 (terracotta badge):
  English name: "Silky Tofu Pudding"
  Original: "豆花"
  Quote: "Perfectly smooth, not too sweet"
  Likes: 5
  Photo count: 2

Row 3 — TOP 3 (terracotta badge):
  English name: "Crispy Duck Tongues"
  Original: "香酥鸭舌"
  Quote: "Surprisingly addictive, must order"
  Likes: 4
  Photo count: 1

Row 4 — TOP 4 (gray badge):
  English name: "Handmade Pork Dumplings"
  Original: "手工猪肉饺子"
  Quote: "Thin skin, juicy filling, authentic"
  Likes: 3
  Photo count: 1

Row 5 — TOP 5 (gray badge):
  English name: "Taro Bubble Milk Tea"
  Original: "芋泥珍珠奶茶"
  Quote: "Thick taro flavor, real tapioca"
  Likes: 3
  Photo count: 2

Row 6 — TOP 6 (gray badge):
  English name: "Mango Pudding"
  Original: "芒果布丁"
  Quote: "Light and refreshing dessert"
  Likes: 2
  Photo count: 1

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
BOTTOM ACTION BAR (fixed, same as detail page)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Same persistent bottom bar as Restaurant Detail page:
  LEFT: "Check In" (outlined, terracotta border)
  RIGHT: "Write Review" (filled terracotta)

Height: 56px, border-top: 0.5px #F0EBE3
Background: white

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FULL MENU TAB CONTENT
(shown when user taps "Full Menu" tab)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When "Full Menu" tab is active:
  Show the same language selector pill row at top
  Show the same collapsible category sections
  with dish rows (same content as Menu tab in
  Restaurant Detail page)

The language selector works identically in both tabs —
selecting a language updates dish name Line 1
across whichever tab is currently visible.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PROTOTYPE CONNECTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. Restaurant Detail page "View All ›" in
   Recommended Dishes section
   → Navigate to this new page
   → Default: "Recommended Dishes" tab active

2. Back arrow "←" top-left
   → Navigate back to Restaurant Detail page

3. "Recommended Dishes" tab tap
   → Show Recommended Dishes list frame

4. "Full Menu" tab tap
   → Show Full Menu frame (collapsible categories)

5. Language pills (on both tabs)
   → Swap to corresponding language frame

6. Like button tap
   → Toggle filled/outline state
   → Increment/decrement count number

7. "Review this dish · earn 15 pts" row tap
   → Navigate to Write Review screen

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DESIGN CONSISTENCY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Background: #FDF6EE (warm cream)
Card rows: white with 0.5px #F0EBE3 border-bottom
Primary: #E8603C (terracotta)
Text primary: #2C1A0E
Text secondary: #8A8078
All text: overflow hidden, ellipsis, no wrapping
All dish row heights: 120px fixed, no exceptions
Screen edge padding: 16px horizontal