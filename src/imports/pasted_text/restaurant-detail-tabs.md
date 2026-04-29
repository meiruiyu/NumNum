CHANGE: Restructure the Restaurant Detail page tab bar.
Apply all 4 modifications described below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODIFICATION 1 — REMOVE duplicate Menu tab
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

The tab bar currently has a standalone "Menu" tab
AND a "Translate" tab (which also contains menu content).
These are redundant.

DELETE the standalone "Menu" tab from the tab bar entirely.
Its content is now merged into the new combined tab
described in Modification 4 below.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODIFICATION 2 — REMOVE "Call" quick action button
and MOVE it into the Info tab
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CURRENT STATE:
Below the restaurant hero photo and info bar, there is
a row of 4 quick action icon buttons:
[Directions] [Call] [Reserve] [Menu]

CHANGE:
Remove "Call" from this quick action row entirely.
The quick action row now has 3 buttons only:
[Directions] [Reserve] [Menu]

Each button redistributes to fill the space evenly
across the full width (3 equal columns instead of 4).

ADD "Call" inside the Info tab content:
In the Info tab, in the Contact & Hours section,
add a "Call Restaurant" row:

Row design (same style as other info rows):
- Left: phone icon (16px, #8A8078)
- Center: phone number text
    e.g. "+1 (718) 555-0192"
    14px, weight 500, #2C1A0E
- Right: "Call" pill button
    Height: 30px, border-radius: 999px
    Background: #E8603C (terracotta)
    Text: "Call" — 12px, weight 600, white
    Padding: 0 14px

This row sits between the Address row and the
Hours row inside the Info tab.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODIFICATION 3 — REORDER Tab bar, Translation first
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

After removing "Menu" and merging it into the new
combined tab, the final tab bar order is:

OLD order (before this prompt):
Photos | Info | Reviews | Top Dishes | Menu | Translate

NEW order (after all modifications):
[Menu & Translate] | Photos | Info | Reviews | Top Dishes

Rules:
- "Menu & Translate" is now the FIRST tab (leftmost)
  so it is immediately visible without scrolling
- "Photos" moves to second position
- "Info" moves to third position
- "Reviews" moves to fourth position
- "Top Dishes" moves to fifth position (last)
- The standalone "Translate" tab is deleted (merged)
- The standalone "Menu" tab is deleted (merged)

Total tabs: 5 (reduced from 6)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
MODIFICATION 4 — MERGE Menu + Translation into one Tab
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CREATE a new combined tab called "Menu & Translate"
that serves as both the menu viewer AND the
translation tool in one unified experience.

── TAB LABEL & ICON ──

Tab label: "Menu"
Tab icon above label: a fork-and-knife icon (menu symbol)
with a small overlaid translate indicator:
  - Base icon: fork + knife crossed (standard menu icon)
  - Small badge overlay on top-right of the icon:
    The letter "A→" in 8px, terracotta color,
    suggesting translation is available
    OR use a small globe dot (6px terracotta circle)
    overlaid on the top-right corner of the fork icon
This icon communicates "menu with translation available"
at a glance, similar to a notification badge concept.

── TOP SECTION: Language selector ──

Immediately below the tab bar, before any menu content:

A compact language selector row:
Left label: "View in:" — 12px, #8A8078
Right: horizontally scrollable pill row of 6 languages:

[English] [简体中文] [繁體中文] [ภาษาไทย] [日本語] [한국어]

ACTIVE pill: terracotta fill (#E8603C), white text
INACTIVE pill: white fill, #8A8078 text, #E0D8D0 border
Height: 28px (compact, smaller than before)
Border-radius: 999px
Padding: 0 12px
Font: 11px, weight 500
Each pill shows ONLY the native script for non-English
options (saves space):
  Pill 1: "English" (English label)
  Pill 2: "简体中文" (native only)
  Pill 3: "繁體中文" (native only)
  Pill 4: "ภาษาไทย" (native only)
  Pill 5: "日本語" (native only)
  Pill 6: "한국어" (native only)

Default selected: "English"

The language selector row:
- Full width, background #FDF6EE
- Padding: 10px 16px
- Border-bottom: 0.5px #F0EBE3
- Height: 48px total

── MENU CONTENT (below language selector) ──

Collapsible category sections (same as before):

CATEGORY HEADER ROW:
Background: #F5F0EB, height: 40px, padding: 0 16px
Left: Category name — 14px, weight 600, #2C1A0E
Right: item count + chevron icon

DISH ITEM ROW:
Height: 72px fixed, padding: 12px 16px
Border-bottom: 0.5px #F0EBE3

Layout — horizontal flex:
[LEFT: dish name + original + descriptor]
[RIGHT: price + photo]

LEFT info block (flex-grow: 1, min-width: 0):

  Line 1: Dish name in SELECTED language
    14px, weight 600, #2C1A0E
    white-space: nowrap, overflow: hidden,
    text-overflow: ellipsis
    Changes dynamically based on language pill selection

  Line 2: Original name (always in source language)
    12px, weight 400, #8A8078, italic
    Always shows original script regardless of selection

  Line 3: Flavor/allergen note
    11px, weight 400, #8A8078
    Always in English regardless of language selection
    e.g. "Spicy · Contains nuts · Gluten-free"

RIGHT block (width: 72px, flex-shrink: 0):
  Price: 14px, weight 600, #2C1A0E, right-aligned
  Photo: 48x48px, border-radius: 8px, object-fit: cover

TOP DISH badge (where applicable):
  "★ Top Dish" — 10px, weight 600
  Background: #FAEEDA, color: #633806
  border-radius: 4px, padding: 1px 6px

── SAMPLE MENU CONTENT ──

CATEGORY 1: "Signature Dishes" — 4 items (expanded)

Item 1:
  English:             "Spicy Beef Hot Pot"
  简体中文:             "麻辣牛肉火锅"
  繁體中文:             "麻辣牛肉火鍋"
  ภาษาไทย:            "หม้อไฟเนื้อวัวเผ็ด"
  日本語:              "スパイシービーフ火鍋"
  한국어:              "매운 소고기 훠궈"
  Original:            "麻辣牛肉火锅"
  Descriptor:          "Spicy · Rich broth · Beef"
  Price: $28 | Badge: "★ Top Dish"

Item 2:
  English:             "Silky Tofu Pudding"
  简体中文:             "豆花"
  繁體中文:             "豆花"
  ภาษาไทย:            "เต้าหู้นุ่มหวาน"
  日本語:              "絹ごし豆腐プリン"
  한국어:              "부드러운 두부 푸딩"
  Original:            "豆花"
  Descriptor:          "Sweet · Soft texture · Gluten-free"
  Price: $8

Item 3:
  English:             "Crispy Duck Tongues"
  简体中文:             "香酥鸭舌"
  繁體中文:             "香酥鴨舌"
  ภาษาไทย:            "ลิ้นเป็ดกรอบ"
  日本語:              "カリカリアヒルの舌"
  한국어:              "바삭한 오리 혀"
  Original:            "香酥鸭舌"
  Descriptor:          "Spicy · Crispy · Sichuan style"
  Price: $14 | Badge: "★ Top Dish"

Item 4:
  English:             "Handmade Pork Dumplings"
  简体中文:             "手工猪肉饺子"
  繁體中文:             "手工豬肉餃子"
  ภาษาไทย:            "เกี๊ยวหมูทำมือ"
  日本語:              "手作り豚肉餃子"
  한국어:              "수제 돼지고기 만두"
  Original:            "手工猪肉饺子"
  Descriptor:          "Savory · Steamed or pan-fried"
  Price: $12

CATEGORY 2: "Hot Pot Bases" — 3 items (collapsed)

Item 1:
  English:             "Spicy Sichuan Broth"
  简体中文:             "麻辣锅底"
  繁體中文:             "麻辣鍋底"
  ภาษาไทย:            "น้ำซุปเสฉวนเผ็ด"
  日本語:              "麻辣スープベース"
  한국어:              "마라 탕 베이스"
  Original:            "麻辣锅底"
  Descriptor:          "Very spicy · Numbing · Beef tallow"
  Price: $6

Item 2:
  English:             "Tomato & Pork Bone Broth"
  简体中文:             "番茄骨汤锅底"
  繁體中文:             "番茄骨湯鍋底"
  ภาษาไทย:            "น้ำซุปมะเขือเทศกระดูกหมู"
  日本語:              "トマトと豚骨スープ"
  한국어:              "토마토 돼지뼈 국물"
  Original:            "番茄骨汤锅底"
  Descriptor:          "Mild · Sweet · Good for kids"
  Price: $6

Item 3:
  English:             "Half & Half (Yin Yang)"
  简体中文:             "鸳鸯锅底"
  繁體中文:             "鴛鴦鍋底"
  ภาษาไทย:            "หม้อครึ่งเผ็ดครึ่งอ่อน"
  日本語:              "ハーフ＆ハーフ鍋"
  한국어:              "반반 베이스"
  Original:            "鸳鸯锅底"
  Descriptor:          "One spicy + one mild side"
  Price: $8

CATEGORY 3: "Drinks & Desserts" — 3 items (collapsed)

Item 1:
  English:             "Taro Bubble Milk Tea"
  简体中文:             "芋泥珍珠奶茶"
  繁體中文:             "芋泥珍珠奶茶"
  ภาษาไทย:            "ชานมไข่มุกเผือก"
  日本語:              "タロイモバブルティー"
  한국어:              "타로 버블 밀크티"
  Original:            "芋泥珍珠奶茶"
  Descriptor:          "Sweet · Creamy · Tapioca pearls"
  Price: $7 | Badge: "★ Top Dish"

Item 2:
  English:             "Plum Juice"
  简体中文:             "酸梅汤"
  繁體中文:             "酸梅湯"
  ภาษาไทย:            "น้ำบ๊วย"
  日本語:              "梅ジュース"
  한국어:              "매실 주스"
  Original:            "酸梅汤"
  Descriptor:          "Sour · Refreshing · No sugar option"
  Price: $5

Item 3:
  English:             "Mango Pudding"
  简体中文:             "芒果布丁"
  繁體中文:             "芒果布丁"
  ภาษาไทย:            "พุดดิ้งมะม่วง"
  日本語:              "マンゴープリン"
  한국어:              "망고 푸딩"
  Original:            "芒果布丁"
  Descriptor:          "Sweet · Cold · Gluten-free"
  Price: $6

── PROTOTYPE INTERACTIONS ──

Create 6 versions of the menu content frame,
one per language. Language pill taps swap the frame:

  Tap "English"   → English dish names in Line 1
  Tap "简体中文"   → Simplified Chinese in Line 1
  Tap "繁體中文"   → Traditional Chinese in Line 1
  Tap "ภาษาไทย"   → Thai in Line 1
  Tap "日本語"    → Japanese in Line 1
  Tap "한국어"    → Korean in Line 1

Active pill updates to terracotta on each tap.
All other content (original script, descriptor,
price, photos) remains unchanged across all frames.

── BOTTOM DISCLAIMER ──

"Translations are AI-assisted and may not be exact.
Please confirm dish details with restaurant staff."
11px, #B4B2A9, centered, padding: 16px 24px

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
SUMMARY OF FINAL TAB BAR STATE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Final Restaurant Detail page tab bar (5 tabs total):

Tab 1: "Menu"       — fork+knife icon with small
                      translation badge dot
                      (leftmost, immediately visible)
Tab 2: "Photos"     — image/gallery icon
Tab 3: "Info"       — info circle icon
                      (contains Call button inside)
Tab 4: "Reviews"    — speech bubble icon
Tab 5: "Top Dishes" — trophy/star icon

Remove completely: standalone "Translate" tab
Remove completely: standalone "Menu" tab
Remove from quick actions: "Call" button