ADD a dedicated "Translate" tab to the Restaurant Detail
page tab navigation bar.

── UPDATE TAB BAR ──

Restaurant Detail page tab bar now has 6 tabs:
Photos | Info | Reviews | Top Dishes | Menu | Translate

"Translate" is the new 6th tab, positioned at the end.

Tab label: "Translate"
Tab icon: the letter "A" with an arrow pointing to a
  foreign character — universally understood as "translate"
  OR a globe icon with lines — either works.

── TRANSLATE TAB — FULL SCREEN CONTENT ──

TOP SECTION — Language selector bar:
Full width, background #FDF6EE, padding 12px 16px

Label: "Translating to:" — 13px, #8A8078, left aligned
Margin below label: 8px

Language pill buttons — horizontal SCROLLABLE row
(user can scroll right to see more language options):

6 language pills in this exact order:

Pill 1: "English"
  Native label below (same pill): "English"
  Default active state

Pill 2: "Simplified Chinese"
  Native label: "简体中文"

Pill 3: "Traditional Chinese"
  Native label: "繁體中文"

Pill 4: "Thai"
  Native label: "ภาษาไทย"

Pill 5: "Japanese"
  Native label: "日本語"

Pill 6: "Korean"
  Native label: "한국어"

Each language pill design:
- Height: 36px
- Border-radius: 999px
- Horizontal padding: 14px
- Margin-right: 8px between pills

ACTIVE pill (currently selected language):
  Background: #E8603C (terracotta)
  Text color: white (#FFFFFF)
  Line 1 (English name): 12px, weight 600
  Line 2 (native script): 11px, weight 400, opacity 0.85

INACTIVE pill:
  Background: white (#FFFFFF)
  Border: 0.5px solid #E0D8D0
  Line 1 (English name): 12px, weight 500, #2C1A0E
  Line 2 (native script): 11px, weight 400, #8A8078

Default selected: "English" (Pill 1)

NOTE ON PILL CONTENT:
Each pill shows both the English name AND the native
script on two lines to help users who cannot read
English select their own language.
If two lines make the pill too tall, use only the
native script for inactive pills and English only
for the active pill.

── MENU CATEGORY SECTIONS ──

The menu is organized into collapsible category sections.

CATEGORY HEADER ROW:
Full width, background #F5F0EB, height 40px,
padding 0 16px
Left: Category name — 14px, weight 600, #2C1A0E
Right: item count + collapse chevron

DISH ITEM ROW (inside each category):
Height: 72px fixed, padding 12px 16px
Border-bottom: 0.5px #F0EBE3

Layout — horizontal flex:
[LEFT: Translated name + original script]
[RIGHT: Price + small photo]

LEFT info block (flex-grow: 1, min-width: 0):

  Line 1: Translated dish name
    (in the currently selected language)
    14px, weight 600, #2C1A0E
    white-space: nowrap, overflow: hidden,
    text-overflow: ellipsis
    Examples by selected language:
    - English:           "Spicy Beef Hot Pot"
    - Simplified Chinese: "麻辣牛肉火锅"
    - Traditional Chinese: "麻辣牛肉火鍋"
    - Thai:              "หม้อไฟเนื้อวัวเผ็ด"
    - Japanese:          "スパイシービーフホットポット"
    - Korean:            "매운 쇠고기 샤브샤브"

  Line 2: Original name (always in restaurant's
    original script, regardless of selected language)
    12px, weight 400, #8A8078, italic
    e.g. always shows "麻辣牛肉火锅" as the source

  Line 3: Flavor/allergen descriptor
    11px, weight 400, #8A8078
    Always in English regardless of language selection
    e.g. "Spicy · Rich broth · Contains nuts"

RIGHT block (width 72px, flex-shrink: 0):
  Top: Price in USD — 14px, weight 600, #2C1A0E,
    right-aligned. Always in "$" format regardless
    of language.
  Bottom: dish photo thumbnail
    48x48px, border-radius 8px, object-fit: cover

SPECIAL BADGE on top-ranked dishes:
If dish appears in Top Dishes ranking:
  "★ Top Dish" badge below dish name
  Background: #FAEEDA, color: #633806
  border-radius: 4px, font: 10px weight 600,
  padding: 1px 6px

── SAMPLE MENU DATA ──

Show English as default selected. Design all 6 dish name
translations into the frames so the prototype can switch
between language states.

CATEGORY 1: "Signature Dishes" — 4 items (expanded)

Item 1:
  English:            "Spicy Beef Hot Pot"
  Simplified Chinese: "麻辣牛肉火锅"
  Traditional Chinese:"麻辣牛肉火鍋"
  Thai:               "หม้อไฟเนื้อวัวเผ็ด"
  Japanese:           "スパイシービーフ火鍋"
  Korean:             "매운 소고기 훠궈"
  Original:           "麻辣牛肉火锅"
  Description:        "Spicy · Rich broth · Beef"
  Price: $28
  Badge: "★ Top Dish"

Item 2:
  English:            "Silky Tofu Pudding"
  Simplified Chinese: "豆花"
  Traditional Chinese:"豆花"
  Thai:               "เต้าหู้นุ่มหวาน"
  Japanese:           "絹ごし豆腐プリン"
  Korean:             "부드러운 두부 푸딩"
  Original:           "豆花"
  Description:        "Sweet · Soft texture · Gluten-free"
  Price: $8

Item 3:
  English:            "Crispy Duck Tongues"
  Simplified Chinese: "香酥鸭舌"
  Traditional Chinese:"香酥鴨舌"
  Thai:               "ลิ้นเป็ดกรอบ"
  Japanese:           "カリカリアヒルの舌"
  Korean:             "바삭한 오리 혀"
  Original:           "香酥鸭舌"
  Description:        "Spicy · Crispy · Sichuan style"
  Price: $14
  Badge: "★ Top Dish"

Item 4:
  English:            "Handmade Pork Dumplings"
  Simplified Chinese: "手工猪肉饺子"
  Traditional Chinese:"手工豬肉餃子"
  Thai:               "เกี๊ยวหมูทำมือ"
  Japanese:           "手作り豚肉餃子"
  Korean:             "수제 돼지고기 만두"
  Original:           "手工猪肉饺子"
  Description:        "Savory · Steamed or pan-fried"
  Price: $12

CATEGORY 2: "Hot Pot Bases" — 3 items (collapsed by default)

Item 1:
  English:            "Spicy Sichuan Broth"
  Simplified Chinese: "麻辣锅底"
  Traditional Chinese:"麻辣鍋底"
  Thai:               "น้ำซุปเสฉวนเผ็ด"
  Japanese:           "麻辣スープベース"
  Korean:             "마라 탕 베이스"
  Original:           "麻辣锅底"
  Description:        "Very spicy · Numbing · Beef tallow"
  Price: $6

Item 2:
  English:            "Tomato & Pork Bone Broth"
  Simplified Chinese: "番茄骨汤锅底"
  Traditional Chinese:"番茄骨湯鍋底"
  Thai:               "น้ำซุปมะเขือเทศกระดูกหมู"
  Japanese:           "トマトと豚骨スープベース"
  Korean:             "토마토 돼지뼈 국물 베이스"
  Original:           "番茄骨汤锅底"
  Description:        "Mild · Sweet · Good for kids"
  Price: $6

Item 3:
  English:            "Half & Half (Yin Yang)"
  Simplified Chinese: "鸳鸯锅底"
  Traditional Chinese:"鴛鴦鍋底"
  Thai:               "หม้อครึ่งเผ็ดครึ่งอ่อน"
  Japanese:           "ハーフ＆ハーフ（陰陽鍋）"
  Korean:             "반반 (인양) 베이스"
  Original:           "鸳鸯锅底"
  Description:        "One spicy + one mild side"
  Price: $8

CATEGORY 3: "Drinks & Desserts" — 3 items (collapsed)

Item 1:
  English:            "Taro Bubble Milk Tea"
  Simplified Chinese: "芋泥珍珠奶茶"
  Traditional Chinese:"芋泥珍珠奶茶"
  Thai:               "ชานมไข่มุกเผือก"
  Japanese:           "タロイモバブルミルクティー"
  Korean:             "타로 버블 밀크티"
  Original:           "芋泥珍珠奶茶"
  Description:        "Sweet · Creamy · Tapioca pearls"
  Price: $7
  Badge: "★ Top Dish"

Item 2:
  English:            "Plum Juice"
  Simplified Chinese: "酸梅汤"
  Traditional Chinese:"酸梅湯"
  Thai:               "น้ำบ๊วย"
  Japanese:           "梅ジュース"
  Korean:             "매실 주스"
  Original:           "酸梅汤"
  Description:        "Sour · Refreshing · No sugar option"
  Price: $5

Item 3:
  English:            "Mango Pudding"
  Simplified Chinese: "芒果布丁"
  Traditional Chinese:"芒果布丁"
  Thai:               "พุดดิ้งมะม่วง"
  Japanese:           "マンゴープリン"
  Korean:             "망고 푸딩"
  Original:           "芒果布丁"
  Description:        "Sweet · Cold · Gluten-free"
  Price: $6

── PROTOTYPE INTERACTIONS ──

Create 6 versions of the Translate tab content frame,
one per language. Each frame shows the same menu
structure but with dish names in the corresponding
language in Line 1 of each dish row.

Language pill tap interactions:
  Tap "English"            → show English frame
  Tap "Simplified Chinese" → show 简体中文 frame
  Tap "Traditional Chinese"→ show 繁體中文 frame
  Tap "Thai"               → show Thai frame
  Tap "Japanese"           → show Japanese frame
  Tap "Korean"             → show Korean frame

Each language pill tap: swap the content frame using
Figma prototype "Swap with" or "Navigate to" interaction.
Active pill updates to terracotta fill on each tap.

── BOTTOM DISCLAIMER ──

Below all menu categories, add:
"Translations are AI-assisted and may not be exact.
Prices and availability may vary. Please confirm
with restaurant staff."
Font: 11px, #B4B2A9, centered, padding 16px 24px

── DESIGN CONSISTENCY ──

All text overflow rules apply:
  white-space: nowrap, overflow: hidden,
  text-overflow: ellipsis on Line 1 of each dish row.
  Fixed row height 72px — never expand.

All colors match the app's design system:
  Background: #FDF6EE
  Cards: white with 0.5px #F0EBE3 border
  Primary action: #E8603C terracotta
  Text primary: #2C1A0E
  Text secondary: #8A8078