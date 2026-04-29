// server/menuTemplates.js
// Static menu templates keyed by cuisine. Each template has exactly 10 dishes
// across categories (Signature / Appetizer / Main / Side / Dessert / Drink),
// with multilingual translations and a representative photo URL.
//
// 12 templates cover the most common restaurant types:
//   CHINESE, JAPANESE, KOREAN, SE_ASIAN, CAFE_BOBA, FAST_FOOD,
//   PIZZA_ITALIAN, STEAKHOUSE, MEXICAN, INDIAN, MEDITERRANEAN, DEFAULT
//
// pickTemplateKey() chooses the right template from a Yelp cuisine string.
// buildMenuFromTemplate() returns a ready-to-render menu payload.

/* Helper to keep the data terser. */
const dish = (category, price, description, image, t) => ({
  category, price, description, image, translations: t,
});

const CHINESE = [
  dish('Signature', 28, 'Spicy · Rich broth · Beef',          'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=240',
    { english:'Spicy Beef Hot Pot',          simplified:'麻辣牛肉火锅',     traditional:'麻辣牛肉火鍋',     japanese:'スパイシービーフ火鍋', korean:'매운 소고기 훠궈',   thai:'หม้อไฟเนื้อวัวเผ็ด' }),
  dish('Signature', 14, 'Steamed · Pork · Soup-filled',       'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=240',
    { english:'Soup Dumplings (XLB)',        simplified:'小笼包',          traditional:'小籠包',          japanese:'小籠包',           korean:'샤오롱바오',        thai:'เซียวหลงเปา' }),
  dish('Main',      16, 'Numbing spice · Tofu · Pork',        'https://images.unsplash.com/photo-1582450871972-ab5ca641643d?w=240',
    { english:'Mapo Tofu',                   simplified:'麻婆豆腐',         traditional:'麻婆豆腐',         japanese:'麻婆豆腐',         korean:'마파두부',           thai:'มาโป้เต้าหู้' }),
  dish('Main',      32, 'Slow-stewed · Premium · Festive',    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=240',
    { english:"Buddha Jumps Over The Wall",  simplified:'佛跳墙',          traditional:'佛跳牆',          japanese:'仏跳牆',           korean:'불도장',             thai:'พระกระโดดกำแพง' }),
  dish('Main',      18, 'Spicy · Peanuts · Chicken',          'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=240',
    { english:'Kung Pao Chicken',            simplified:'宫保鸡丁',         traditional:'宮保雞丁',         japanese:'宮保鶏丁',         korean:'궁바오 치킨',        thai:'ไก่กังเปา' }),
  dish('Main',      22, 'Caramelised · Soy · Chicken',        'https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=240',
    { english:'Red-Braised Chicken',         simplified:'红烧鸡',          traditional:'紅燒雞',          japanese:'鶏の醤油煮込み',   korean:'간장찜닭',           thai:'ไก่ตุ๋นซีอิ๊ว' }),
  dish('Appetizer', 12, 'Pan-fried or steamed · Pork',        'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=240',
    { english:'Pork Dumplings',              simplified:'猪肉饺子',         traditional:'豬肉餃子',         japanese:'豚肉餃子',         korean:'돼지고기 만두',      thai:'เกี๊ยวหมู' }),
  dish('Side',      10, 'Garlic · Light soy · Greens',        'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=240',
    { english:'Stir-fried Bok Choy',         simplified:'清炒白菜',         traditional:'清炒白菜',         japanese:'青梗菜炒め',       korean:'청경채 볶음',        thai:'ผัดผักกาดขาว' }),
  dish('Dessert',   7,  'Chilled · Sweet · Smooth',           'https://images.unsplash.com/photo-1568827999250-3f6afff96e66?w=240',
    { english:'Mango Pudding',               simplified:'芒果布丁',         traditional:'芒果布丁',         japanese:'マンゴープリン',   korean:'망고 푸딩',          thai:'มะม่วงพุดดิ้ง' }),
  dish('Drink',     4,  'Hot · Floral · Caffeinated',         'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=240',
    { english:'Jasmine Tea',                 simplified:'茉莉花茶',         traditional:'茉莉花茶',         japanese:'ジャスミン茶',     korean:'자스민 차',          thai:'ชามะลิ' }),
];

const JAPANESE = [
  dish('Signature', 16, 'Pork bone · Rich · Noodles',         'https://images.unsplash.com/photo-1591814468924-caf88d1232e1?w=240',
    { english:'Tonkotsu Ramen',              simplified:'豚骨拉面',         traditional:'豚骨拉麵',         japanese:'豚骨ラーメン',     korean:'돈코츠 라멘',        thai:'ราเมงทงคตสึ' }),
  dish('Signature', 14, 'Fresh salmon · Sliced · Wasabi',     'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=240',
    { english:'Salmon Sashimi (5 pcs)',      simplified:'三文鱼刺身',       traditional:'三文魚刺身',       japanese:'サーモン刺身',     korean:'연어 사시미',        thai:'ปลาแซลมอนซาชิมิ' }),
  dish('Main',      10, 'Crab · Avocado · Cucumber',          'https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=240',
    { english:'California Roll',             simplified:'加州卷',          traditional:'加州卷',          japanese:'カリフォルニアロール', korean:'캘리포니아 롤',     thai:'แคลิฟอร์เนียโรล' }),
  dish('Main',      12, 'Spicy tuna · Cucumber · Sesame',     'https://images.unsplash.com/photo-1564489563601-c53cfc451e93?w=240',
    { english:'Spicy Tuna Roll',             simplified:'辣金枪鱼卷',       traditional:'辣金槍魚卷',       japanese:'スパイシーツナロール', korean:'매운 참치 롤',     thai:'โรลทูน่าเผ็ด' }),
  dish('Appetizer', 9,  'Crispy · Marinated · Fried',         'https://images.unsplash.com/photo-1614563637806-1d0e645e0940?w=240',
    { english:'Chicken Karaage',             simplified:'日式炸鸡',         traditional:'日式炸雞',         japanese:'鶏の唐揚げ',       korean:'카라아게',           thai:'ไก่คาราอาเกะ' }),
  dish('Appetizer', 6,  'Salted · Steamed · Soybeans',        'https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?w=240',
    { english:'Edamame',                     simplified:'毛豆',            traditional:'毛豆',            japanese:'枝豆',             korean:'에다마메',           thai:'ถั่วแระญี่ปุ่น' }),
  dish('Main',      22, 'Beef · Sweet glaze · Rice',          'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=240',
    { english:'Beef Teriyaki',               simplified:'牛肉照烧',         traditional:'牛肉照燒',         japanese:'牛肉の照り焼き',   korean:'소고기 테리야키',    thai:'เนื้อเทอริยากิ' }),
  dish('Side',      4,  'Warm · Fermented · Tofu',            'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=240',
    { english:'Miso Soup',                   simplified:'味噌汤',          traditional:'味噌湯',          japanese:'味噌汁',           korean:'미소 된장국',        thai:'ซุปมิโซะ' }),
  dish('Dessert',   7,  'Cold · Chewy · Sweet',               'https://images.unsplash.com/photo-1633933358116-a27b902fad35?w=240',
    { english:'Mochi Ice Cream',             simplified:'麻薯冰淇淋',       traditional:'麻糬冰淇淋',       japanese:'餅アイス',         korean:'모찌 아이스크림',    thai:'โมจิไอศกรีม' }),
  dish('Drink',     5,  'Matcha · Steamed milk',              'https://images.unsplash.com/photo-1536013455414-17b50fbf8b4c?w=240',
    { english:'Matcha Latte',                simplified:'抹茶拿铁',         traditional:'抹茶拿鐵',         japanese:'抹茶ラテ',         korean:'말차 라떼',          thai:'มัทฉะลาเต้' }),
];

const KOREAN = [
  dish('Signature', 24, 'Marinated · Grilled · Beef rib',     'https://images.unsplash.com/photo-1632709810780-b5a4343cebcf?w=240',
    { english:'Galbi (Marinated Short Rib)', simplified:'韩式烤排骨',       traditional:'韓式烤排骨',       japanese:'カルビ',           korean:'갈비',               thai:'กัลบี' }),
  dish('Signature', 20, 'Sweet · Smoky · Beef',               'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=240',
    { english:'Bulgogi',                     simplified:'韩式烤牛肉',       traditional:'韓式烤牛肉',       japanese:'プルコギ',         korean:'불고기',             thai:'พุลโกกิ' }),
  dish('Main',      15, 'Spicy · Pork · Tofu',                'https://images.unsplash.com/photo-1583224994076-ae3a3b4eebd2?w=240',
    { english:'Kimchi Stew',                 simplified:'泡菜锅',          traditional:'泡菜鍋',          japanese:'キムチチゲ',       korean:'김치찌개',           thai:'กิมจิจิเก' }),
  dish('Main',      16, 'Rice · Vegetables · Egg',            'https://images.unsplash.com/photo-1607098665874-fd193397547b?w=240',
    { english:'Bibimbap',                    simplified:'石锅拌饭',         traditional:'石鍋拌飯',         japanese:'ビビンバ',         korean:'비빔밥',             thai:'บิบิมบับ' }),
  dish('Appetizer', 18, 'Crispy · Sweet & spicy · Chicken',   'https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=240',
    { english:'Korean Fried Chicken',        simplified:'韩式炸鸡',         traditional:'韓式炸雞',         japanese:'韓国式フライドチキン', korean:'양념치킨',         thai:'ไก่ทอดเกาหลี' }),
  dish('Appetizer', 12, 'Scallion · Crispy · Pancake',        'https://images.unsplash.com/photo-1635363638580-c2809d049eee?w=240',
    { english:'Pajeon (Scallion Pancake)',   simplified:'韩式煎饼',         traditional:'韓式煎餅',         japanese:'チヂミ',           korean:'파전',               thai:'ปาจอน' }),
  dish('Main',      14, 'Sweet potato noodles · Stir-fry',    'https://images.unsplash.com/photo-1552611052-33e04de081de?w=240',
    { english:'Japchae',                     simplified:'韩式杂菜',         traditional:'韓式雜菜',         japanese:'チャプチェ',       korean:'잡채',               thai:'จัพแช' }),
  dish('Side',      5,  'Fermented · Spicy · Cabbage',        'https://images.unsplash.com/photo-1583224994076-ae3a3b4eebd2?w=240',
    { english:'Kimchi',                      simplified:'泡菜',            traditional:'泡菜',            japanese:'キムチ',           korean:'김치',               thai:'กิมจิ' }),
  dish('Dessert',   6,  'Sweet pancake · Cinnamon',           'https://images.unsplash.com/photo-1568376794508-ae52c6ab3929?w=240',
    { english:'Hotteok',                     simplified:'韩式糖饼',         traditional:'韓式糖餅',         japanese:'ホットック',       korean:'호떡',               thai:'ฮอตต็อก' }),
  dish('Drink',     10, 'Korean rice spirit',                 'https://images.unsplash.com/photo-1556679343-c1a99e9b2bcc?w=240',
    { english:'Soju (1 bottle)',             simplified:'烧酒',            traditional:'燒酒',            japanese:'ソジュ',           korean:'소주',               thai:'โซจู' }),
];

const SE_ASIAN = [
  dish('Signature', 14, 'Beef · Rice noodles · Herbs',        'https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=240',
    { english:'Pho Bo (Beef Pho)',           simplified:'越南牛肉粉',       traditional:'越南牛肉粉',       japanese:'フォーボー',       korean:'베트남 쌀국수',     thai:'เฝอเนื้อ' }),
  dish('Signature', 15, 'Tamarind · Peanuts · Shrimp',        'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=240',
    { english:'Pad Thai',                    simplified:'泰式炒河粉',       traditional:'泰式炒河粉',       japanese:'パッタイ',         korean:'팟타이',             thai:'ผัดไทย' }),
  dish('Main',      16, 'Spicy · Sour · Shrimp soup',         'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=240',
    { english:'Tom Yum Goong',               simplified:'冬阴功汤',         traditional:'冬陰功湯',         japanese:'トムヤムクン',     korean:'똠얌꿍',             thai:'ต้มยำกุ้ง' }),
  dish('Main',      10, 'Crusty bread · Pork · Pickles',      'https://images.unsplash.com/photo-1583952233538-0eda4cae2e02?w=240',
    { english:'Banh Mi',                     simplified:'越南法包',         traditional:'越南法包',         japanese:'バインミー',       korean:'반미',               thai:'บั๋นหมี' }),
  dish('Appetizer', 8,  'Fresh · Rice paper · Shrimp',        'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=240',
    { english:'Vietnamese Spring Rolls',     simplified:'越南春卷',         traditional:'越南春卷',         japanese:'生春巻き',         korean:'월남쌈',             thai:'ปอเปี๊ยะสด' }),
  dish('Appetizer', 9,  'Spicy · Lime · Crunchy',             'https://images.unsplash.com/photo-1572451877429-83d2bcdb3e74?w=240',
    { english:'Green Papaya Salad',          simplified:'凉拌青木瓜',       traditional:'涼拌青木瓜',       japanese:'青パパイヤサラダ', korean:'그린파파야샐러드',  thai:'ส้มตำ' }),
  dish('Main',      16, 'Coconut · Basil · Spicy',            'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=240',
    { english:'Green Curry',                 simplified:'绿咖喱',          traditional:'綠咖哩',          japanese:'グリーンカレー',   korean:'그린커리',           thai:'แกงเขียวหวาน' }),
  dish('Side',      4,  'Steamed · Glutinous',                'https://images.unsplash.com/photo-1567606404787-9bba4ebd6b66?w=240',
    { english:'Sticky Rice',                 simplified:'糯米饭',          traditional:'糯米飯',          japanese:'もち米',           korean:'찰밥',               thai:'ข้าวเหนียว' }),
  dish('Dessert',   8,  'Coconut milk · Fresh mango',         'https://images.unsplash.com/photo-1626208388838-eddf45e3d52e?w=240',
    { english:'Mango Sticky Rice',           simplified:'芒果糯米饭',       traditional:'芒果糯米飯',       japanese:'マンゴーもち米',   korean:'망고 찰밥',          thai:'ข้าวเหนียวมะม่วง' }),
  dish('Drink',     5,  'Sweet · Creamy · Iced',              'https://images.unsplash.com/photo-1558857563-c0c6ee6ff8ab?w=240',
    { english:'Thai Iced Tea',               simplified:'泰式奶茶',         traditional:'泰式奶茶',         japanese:'タイミルクティー', korean:'타이 밀크티',        thai:'ชาไทย' }),
];

const CAFE_BOBA = [
  dish('Signature', 7,  'Brown sugar · Tapioca · Milk',       'https://images.unsplash.com/photo-1558857563-c0c6ee6ff8ab?w=240',
    { english:'Brown Sugar Boba Milk',       simplified:'黑糖珍珠奶茶',     traditional:'黑糖珍珠奶茶',     japanese:'黒糖タピオカミルク', korean:'흑당버블티',       thai:'ชานมไข่มุกน้ำตาลทรายแดง' }),
  dish('Signature', 6,  'Taro purée · Tapioca · Sweet',       'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=240',
    { english:'Taro Bubble Milk Tea',        simplified:'芋头珍珠奶茶',     traditional:'芋頭珍珠奶茶',     japanese:'タロ芋ミルクティー', korean:'토란버블티',       thai:'ชานมไข่มุกเผือก' }),
  dish('Drink',     5,  'Espresso · Cold · Milk',             'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=240',
    { english:'Iced Latte',                  simplified:'冰拿铁',          traditional:'冰拿鐵',          japanese:'アイスラテ',       korean:'아이스 라떼',        thai:'ลาเต้เย็น' }),
  dish('Drink',     6,  'Matcha · Frozen · Whipped',          'https://images.unsplash.com/photo-1536013455414-17b50fbf8b4c?w=240',
    { english:'Matcha Frappe',               simplified:'抹茶星冰乐',       traditional:'抹茶星冰樂',       japanese:'抹茶フラッペ',     korean:'말차 프라페',        thai:'มัทฉะแฟรปเป้' }),
  dish('Main',      8,  'Avocado · Sourdough · Egg',          'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=240',
    { english:'Avocado Toast',               simplified:'牛油果吐司',       traditional:'酪梨吐司',         japanese:'アボカドトースト', korean:'아보카도 토스트',    thai:'ขนมปังอะโวคาโด' }),
  dish('Main',      7,  'Egg · Mayo · Soft bread',            'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=240',
    { english:'Egg Salad Sandwich',          simplified:'鸡蛋三明治',       traditional:'雞蛋三明治',       japanese:'たまごサンド',     korean:'에그샌드위치',       thai:'แซนด์วิชไข่' }),
  dish('Appetizer', 4,  'Buttery · Flaky · French',           'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=240',
    { english:'Croissant',                   simplified:'牛角面包',         traditional:'牛角麵包',         japanese:'クロワッサン',     korean:'크루아상',           thai:'ครัวซองต์' }),
  dish('Dessert',   6,  'Cream cheese · Graham crust',        'https://images.unsplash.com/photo-1567171466295-4afa63d45416?w=240',
    { english:'New York Cheesecake',         simplified:'芝士蛋糕',         traditional:'起司蛋糕',         japanese:'チーズケーキ',     korean:'치즈케익',           thai:'ชีสเค้ก' }),
  dish('Dessert',   7,  'Coffee · Mascarpone · Cocoa',        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=240',
    { english:'Tiramisu',                    simplified:'提拉米苏',         traditional:'提拉米蘇',         japanese:'ティラミス',       korean:'티라미수',           thai:'ทีรามิสุ' }),
  dish('Drink',     4,  'Espresso · Hot water',               'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=240',
    { english:'Iced Americano',              simplified:'冰美式',          traditional:'冰美式',          japanese:'アイスアメリカーノ', korean:'아이스 아메리카노', thai:'อเมริกาโน่เย็น' }),
];

const FAST_FOOD = [
  dish('Signature', 9,  'Beef patty · Cheese · Lettuce',      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=240',
    { english:'Classic Cheeseburger',        simplified:'经典芝士汉堡',     traditional:'經典起司漢堡',     japanese:'チーズバーガー',   korean:'치즈버거',           thai:'ชีสเบอร์เกอร์' }),
  dish('Signature', 11, 'Double beef · Bacon · BBQ',          'https://images.unsplash.com/photo-1607013251379-e6eecfffe234?w=240',
    { english:'BBQ Bacon Burger',            simplified:'培根烧烤汉堡',     traditional:'培根燒烤漢堡',     japanese:'BBQベーコンバーガー', korean:'BBQ 베이컨 버거',  thai:'เบอร์เกอร์เบคอนบาร์บีคิว' }),
  dish('Main',      10, 'Crispy chicken · Mayo · Pickles',    'https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=240',
    { english:'Crispy Chicken Sandwich',     simplified:'酥脆鸡肉三明治',   traditional:'酥脆雞肉三明治',   japanese:'クリスピーチキンサンド', korean:'크리스피 치킨샌드', thai:'แซนด์วิชไก่กรอบ' }),
  dish('Side',      4,  'Crispy · Salted · Hot',              'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=240',
    { english:'French Fries',                simplified:'薯条',            traditional:'薯條',            japanese:'フライドポテト',   korean:'감자튀김',           thai:'เฟรนช์ฟรายส์' }),
  dish('Side',      6,  'Battered · Crunchy · Onion',         'https://images.unsplash.com/photo-1639024471283-03518883512d?w=240',
    { english:'Onion Rings',                 simplified:'洋葱圈',          traditional:'洋蔥圈',          japanese:'オニオンリング',   korean:'어니언링',           thai:'หัวหอมทอด' }),
  dish('Appetizer', 8,  'Buttermilk-fried · Spicy · Crunchy', 'https://images.unsplash.com/photo-1562967914-608f82629710?w=240',
    { english:'Fried Chicken (4 pcs)',       simplified:'炸鸡（4块）',      traditional:'炸雞（4塊）',      japanese:'フライドチキン（4個）', korean:'후라이드 치킨 4조각', thai:'ไก่ทอด 4 ชิ้น' }),
  dish('Main',      8,  'Pepperoni · Cheese · Tomato',        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=240',
    { english:'Pepperoni Pizza Slice',       simplified:'意式辣肠披萨',     traditional:'意式辣腸披薩',     japanese:'ペパロニピザ',     korean:'페퍼로니 피자',      thai:'พิซซ่าเปปเปอโรนี่' }),
  dish('Drink',     3,  'Cold · Bubbly · Caffeinated',        'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=240',
    { english:'Coca-Cola (Large)',           simplified:'可口可乐（大）',   traditional:'可口可樂（大）',   japanese:'コカコーラ（L）',  korean:'코카콜라 (라지)',    thai:'โคคา-โคล่า (ใหญ่)' }),
  dish('Drink',     4,  'Vanilla · Cold · Creamy',            'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=240',
    { english:'Vanilla Milkshake',           simplified:'香草奶昔',         traditional:'香草奶昔',         japanese:'バニラシェイク',   korean:'바닐라 밀크쉐이크',  thai:'มิลค์เชควานิลลา' }),
  dish('Dessert',   5,  'Soft serve · Caramel · Cone',        'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=240',
    { english:'Soft Serve Sundae',           simplified:'软冰淇淋圣代',     traditional:'軟冰淇淋聖代',     japanese:'ソフトクリームサンデー', korean:'소프트 아이스크림 선데', thai:'ซันเดย์ซอฟต์เสิร์ฟ' }),
];

const PIZZA_ITALIAN = [
  dish('Signature', 18, 'Tomato · Mozzarella · Basil',        'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=240',
    { english:'Margherita Pizza',            simplified:'玛格丽特披萨',     traditional:'瑪格麗特披薩',     japanese:'マルゲリータピザ', korean:'마르게리타 피자',    thai:'พิซซ่ามาร์เกอริต้า' }),
  dish('Signature', 22, 'Pepperoni · Cheese · Crispy crust',  'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=240',
    { english:'Pepperoni Pizza',             simplified:'意式辣肠披萨',     traditional:'意式辣腸披薩',     japanese:'ペパロニピザ',     korean:'페퍼로니 피자',      thai:'พิซซ่าเปปเปอโรนี่' }),
  dish('Main',      19, 'Pancetta · Egg yolk · Pecorino',     'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=240',
    { english:'Spaghetti Carbonara',         simplified:'培根蛋面',         traditional:'培根蛋麵',         japanese:'カルボナーラ',     korean:'까르보나라',         thai:'สปาเก็ตตี้คาร์โบนาร่า' }),
  dish('Main',      18, 'Slow-simmered · Beef · Tomato',      'https://images.unsplash.com/photo-1611270629569-8b357cb88da9?w=240',
    { english:'Spaghetti Bolognese',         simplified:'番茄肉酱面',       traditional:'番茄肉醬麵',       japanese:'ボロネーゼ',       korean:'볼로네제 스파게티',  thai:'สปาเก็ตตี้โบโลเนส' }),
  dish('Main',      24, 'Layered · Cheese · Béchamel',        'https://images.unsplash.com/photo-1574894709920-11b28e7367e3?w=240',
    { english:'Beef Lasagna',                simplified:'千层面',          traditional:'千層麵',          japanese:'ラザニア',         korean:'라자냐',             thai:'ลาซานญ่า' }),
  dish('Appetizer', 10, 'Tomato · Basil · Bread',             'https://images.unsplash.com/photo-1572441710534-3e9efea21f30?w=240',
    { english:'Bruschetta',                  simplified:'番茄烤面包',       traditional:'番茄烤麵包',       japanese:'ブルスケッタ',     korean:'브루스케타',         thai:'บรูสเก็ตต้า' }),
  dish('Appetizer', 9,  'Mozzarella · Tomato · Basil',        'https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=240',
    { english:'Caprese Salad',               simplified:'卡布雷塞沙拉',     traditional:'卡布雷塞沙拉',     japanese:'カプレーゼ',       korean:'카프레제 샐러드',    thai:'สลัดคาเปรเซ' }),
  dish('Side',      8,  'Crispy · Roasted · Garlic',          'https://images.unsplash.com/photo-1619985632461-f33748ef8d3c?w=240',
    { english:'Garlic Bread',                simplified:'蒜香面包',         traditional:'蒜香麵包',         japanese:'ガーリックブレッド', korean:'마늘빵',           thai:'ขนมปังกระเทียม' }),
  dish('Dessert',   8,  'Coffee · Mascarpone · Cocoa',        'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=240',
    { english:'Tiramisu',                    simplified:'提拉米苏',         traditional:'提拉米蘇',         japanese:'ティラミス',       korean:'티라미수',           thai:'ทีรามิสุ' }),
  dish('Drink',     12, 'Italian · Sparkling · Aperitif',     'https://images.unsplash.com/photo-1547595628-c61a29f496f0?w=240',
    { english:'Aperol Spritz',               simplified:'阿佩罗气泡酒',     traditional:'阿佩羅氣泡酒',     japanese:'アペロールスプリッツ', korean:'아페롤 스프리츠',  thai:'อาเปรอลสปริตซ์' }),
];

const STEAKHOUSE = [
  dish('Signature', 58, 'USDA Prime · 16oz · Charred',        'https://images.unsplash.com/photo-1546964124-0cce460f38ef?w=240',
    { english:'Ribeye Steak (16 oz)',        simplified:'肋眼牛排（16oz）', traditional:'肋眼牛排（16oz）', japanese:'リブアイステーキ', korean:'립아이 스테이크',    thai:'ริบอายสเต็ก' }),
  dish('Signature', 48, 'Tender · Lean · Seared',             'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=240',
    { english:'Filet Mignon (8 oz)',         simplified:'菲力牛排（8oz）',  traditional:'菲力牛排（8oz）',  japanese:'フィレミニョン',   korean:'필레미뇽',           thai:'ฟิเลมิญอง' }),
  dish('Main',      36, 'Slow-roasted · Rosemary · Lamb',     'https://images.unsplash.com/photo-1604908554007-3902bee14d65?w=240',
    { english:'Roast Lamb Leg',              simplified:'烤羊腿',          traditional:'烤羊腿',          japanese:'ラム肉のロースト', korean:'양다리 구이',        thai:'ขาแกะอบ' }),
  dish('Main',      32, 'Pan-seared · Lemon · Butter',        'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=240',
    { english:'Atlantic Salmon',             simplified:'大西洋三文鱼',     traditional:'大西洋三文魚',     japanese:'アトランティックサーモン', korean:'대서양 연어',     thai:'ปลาแซลมอนแอตแลนติก' }),
  dish('Main',      26, 'Slow-braised · Red wine · Beef',     'https://images.unsplash.com/photo-1544025162-d76694265947?w=240',
    { english:'Beef Bourguignon',            simplified:'勃艮第炖牛肉',     traditional:'勃艮第燉牛肉',     japanese:'ビーフブルギニョン', korean:'부르기뇽 비프',    thai:'เนื้อตุ๋นไวน์แดง' }),
  dish('Appetizer', 18, 'Chilled · Cocktail · 6 pcs',         'https://images.unsplash.com/photo-1559847844-5315695dadae?w=240',
    { english:'Shrimp Cocktail',             simplified:'冰镇虾鸡尾',       traditional:'冰鎮蝦雞尾',       japanese:'シュリンプカクテル', korean:'쉬림프 칵테일',    thai:'กุ้งค็อกเทล' }),
  dish('Appetizer', 14, 'Romaine · Caesar · Parmesan',        'https://images.unsplash.com/photo-1551248429-40975aa4de74?w=240',
    { english:'Caesar Salad',                simplified:'凯撒沙拉',         traditional:'凱撒沙拉',         japanese:'シーザーサラダ',   korean:'시저 샐러드',        thai:'สลัดซีซาร์' }),
  dish('Side',      10, 'Yukon Gold · Cream · Butter',        'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=240',
    { english:'Mashed Potatoes',             simplified:'土豆泥',          traditional:'馬鈴薯泥',         japanese:'マッシュポテト',   korean:'으깬 감자',          thai:'มันบดเนย' }),
  dish('Dessert',   12, 'Caramel · Custard · Torched',        'https://images.unsplash.com/photo-1470124182917-cc6e71b22ecc?w=240',
    { english:'Crème Brûlée',                simplified:'焦糖布丁',         traditional:'焦糖布丁',         japanese:'クレームブリュレ', korean:'크렘 브륄레',        thai:'เครมบรูเล่' }),
  dish('Drink',     16, 'Cabernet · Full-bodied',             'https://images.unsplash.com/photo-1553361371-9b22f78e8b1d?w=240',
    { english:'Glass of Cabernet Sauvignon', simplified:'赤霞珠红酒杯',     traditional:'卡本內紅酒杯',     japanese:'カベルネ・ソーヴィニヨン', korean:'카베르네 와인',  thai:'ไวน์คาเบอร์เนต์' }),
];

const MEXICAN = [
  dish('Signature', 14, 'Marinated pork · Pineapple · Corn',  'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=240',
    { english:'Tacos Al Pastor (3)',         simplified:'墨西哥猪肉卷饼',   traditional:'墨西哥豬肉捲餅',   japanese:'タコス・アル・パストール', korean:'타코스 알 파스토르', thai:'ทาโก้อัลปาสตอร์' }),
  dish('Signature', 12, 'Carnitas · Salsa · Lime',            'https://images.unsplash.com/photo-1565299715199-866c917206bb?w=240',
    { english:'Carnitas Tacos (3)',          simplified:'慢炖猪肉卷饼',     traditional:'慢燉豬肉捲餅',     japanese:'カルニタスタコス', korean:'카르니타스 타코',    thai:'ทาโก้คาร์นิตัส' }),
  dish('Main',      13, 'Rice · Beans · Steak',               'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=240',
    { english:'Steak Burrito',               simplified:'牛肉卷饼',         traditional:'牛肉捲餅',         japanese:'ステーキブリトー', korean:'스테이크 부리또',    thai:'เบอร์ริโต้สเต็ก' }),
  dish('Main',      15, 'Cheese · Chicken · Mole',            'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=240',
    { english:'Chicken Enchiladas',          simplified:'鸡肉玉米卷',       traditional:'雞肉玉米捲',       japanese:'チキンエンチラーダ', korean:'치킨 엔칠라다',    thai:'เอนชิลาดาไก่' }),
  dish('Appetizer', 9,  'Avocado · Lime · Cilantro',          'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=240',
    { english:'Guacamole & Chips',           simplified:'鳄梨酱配玉米片',   traditional:'酪梨醬配玉米片',   japanese:'ワカモレ&チップス', korean:'과카몰리 & 칩스',  thai:'กัวคาโมเล่กับชิปส์' }),
  dish('Appetizer', 11, 'Cheese · Beans · Beef',              'https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=240',
    { english:'Loaded Nachos',               simplified:'豪华芝士玉米片',   traditional:'豪華起司玉米片',   japanese:'ロードナチョス',   korean:'로디드 나초',        thai:'นาโชส์โหลดเต็ม' }),
  dish('Main',      14, 'Beef · Lettuce · Crunchy shell',     'https://images.unsplash.com/photo-1584208632869-05fa2b2a5934?w=240',
    { english:'Crunchy Beef Tacos (3)',      simplified:'香脆牛肉卷饼',     traditional:'香脆牛肉捲餅',     japanese:'クランチビーフタコス', korean:'바삭 비프 타코',  thai:'ทาโก้เนื้อกรอบ' }),
  dish('Side',      6,  'Cilantro · Lime · Brown rice',       'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=240',
    { english:'Mexican Rice & Beans',        simplified:'墨西哥米饭和豆',   traditional:'墨西哥米飯和豆',   japanese:'メキシカンライス&豆', korean:'멕시칸 라이스&빈', thai:'ข้าวเม็กซิกันกับถั่ว' }),
  dish('Dessert',   7,  'Cinnamon · Sugar · Crispy',          'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=240',
    { english:'Churros with Chocolate',      simplified:'吉拿棒配巧克力',   traditional:'吉拿棒配巧克力',   japanese:'チュロス',         korean:'추로스',             thai:'ชูโรส' }),
  dish('Drink',     10, 'Lime · Tequila · Salted rim',        'https://images.unsplash.com/photo-1594630002255-4ee2317b1b46?w=240',
    { english:'Classic Margarita',           simplified:'经典玛格丽特',     traditional:'經典瑪格麗特',     japanese:'マルガリータ',     korean:'마가리타',           thai:'มาการิต้า' }),
];

const INDIAN = [
  dish('Signature', 18, 'Creamy · Tomato · Tandoori chicken', 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=240',
    { english:'Butter Chicken',              simplified:'黄油咖喱鸡',       traditional:'奶油咖哩雞',       japanese:'バターチキンカレー', korean:'버터 치킨',         thai:'บัตเตอร์ชิคเก้น' }),
  dish('Signature', 20, 'Basmati rice · Spices · Lamb',       'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=240',
    { english:'Lamb Biryani',                simplified:'羊肉香饭',         traditional:'羊肉香飯',         japanese:'ラムビリヤニ',     korean:'양고기 비리야니',    thai:'บิรยานีเนื้อแกะ' }),
  dish('Main',      16, 'Spinach · Cream · Paneer',           'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=240',
    { english:'Palak Paneer',                simplified:'菠菜奶酪',         traditional:'菠菜起司',         japanese:'パラックパニール', korean:'팔락 파니르',        thai:'พาลักปานีร์' }),
  dish('Main',      17, 'Cumin · Spinach · Lentils',          'https://images.unsplash.com/photo-1626777551742-9b2bdf3a07f6?w=240',
    { english:'Chana Masala',                simplified:'香料鹰嘴豆',       traditional:'香料鷹嘴豆',       japanese:'チャナマサラ',     korean:'차나 마살라',        thai:'ชนามาซาล่า' }),
  dish('Appetizer', 8,  'Crispy · Stuffed · Potato',          'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=240',
    { english:'Vegetable Samosa (2)',        simplified:'蔬菜萨莫萨',       traditional:'蔬菜薩莫薩',       japanese:'ベジサモサ',       korean:'야채 사모사',        thai:'ซาโมซ่าผัก' }),
  dish('Appetizer', 12, 'Yogurt-marinated · Tandoor',         'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=240',
    { english:'Tandoori Chicken',            simplified:'坦都里烤鸡',       traditional:'坦都里烤雞',       japanese:'タンドリーチキン', korean:'탄두리 치킨',        thai:'ไก่ทันดูรี' }),
  dish('Side',      4,  'Buttery · Soft · Tandoor-baked',     'https://images.unsplash.com/photo-1626100134240-6b252ad12a1d?w=240',
    { english:'Garlic Naan',                 simplified:'蒜香烤饼',         traditional:'蒜香烤餅',         japanese:'ガーリックナン',   korean:'갈릭 난',            thai:'นานกระเทียม' }),
  dish('Side',      5,  'Saffron · Buttered · Basmati',       'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=240',
    { english:'Saffron Rice',                simplified:'藏红花米饭',       traditional:'藏紅花米飯',       japanese:'サフランライス',   korean:'사프란 라이스',      thai:'ข้าวหญ้าฝรั่น' }),
  dish('Dessert',   6,  'Milk · Cardamom · Pistachio',        'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=240',
    { english:'Gulab Jamun',                 simplified:'印度炸奶球',       traditional:'印度炸奶球',       japanese:'グラブジャムン',   korean:'굴랍 자문',          thai:'กุหลาบจามุน' }),
  dish('Drink',     5,  'Yogurt · Mango · Sweet',             'https://images.unsplash.com/photo-1571805341302-f857381b76b1?w=240',
    { english:'Mango Lassi',                 simplified:'芒果酸奶',         traditional:'芒果優格',         japanese:'マンゴーラッシー', korean:'망고 라씨',          thai:'มะม่วงลัสซี่' }),
];

const MEDITERRANEAN = [
  dish('Signature', 16, 'Lamb · Beef · Pita',                 'https://images.unsplash.com/photo-1561651823-34b6f63a6d54?w=240',
    { english:'Gyro Plate',                  simplified:'希腊烤肉饭',       traditional:'希臘烤肉飯',       japanese:'ジャイロプレート', korean:'기로 플레이트',      thai:'ไจโร' }),
  dish('Signature', 18, 'Marinated · Grilled · Skewers',      'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=240',
    { english:'Chicken Shish Kebab',         simplified:'鸡肉烤串',         traditional:'雞肉烤串',         japanese:'チキンシシュカバブ', korean:'치킨 시쉬케밥',    thai:'ชิคเก้นชิชเคบับ' }),
  dish('Main',      14, 'Falafel · Hummus · Salad · Pita',    'https://images.unsplash.com/photo-1593978301851-40c1849d47d4?w=240',
    { english:'Falafel Plate',               simplified:'鹰嘴豆丸子套餐',   traditional:'鷹嘴豆丸子套餐',   japanese:'ファラフェルプレート', korean:'팔라펠 플레이트',  thai:'ฟาลาเฟลเพลท' }),
  dish('Main',      19, 'Marinated · Grilled · Lamb',         'https://images.unsplash.com/photo-1604908554027-d59b8d1f76b5?w=240',
    { english:'Lamb Shawarma Wrap',          simplified:'羊肉沙瓦玛卷',     traditional:'羊肉沙瓦瑪捲',     japanese:'ラムシャワルマラップ', korean:'양고기 샤와르마', thai:'แกะชวอร์มาแร็พ' }),
  dish('Appetizer', 9,  'Chickpea · Tahini · Olive oil',      'https://images.unsplash.com/photo-1571197119282-7c4f56b16f9c?w=240',
    { english:'Hummus & Pita',               simplified:'鹰嘴豆泥配皮塔饼', traditional:'鷹嘴豆泥配皮塔餅', japanese:'フムス&ピタ',     korean:'후무스 & 피타',     thai:'ฮัมมัสกับพิตา' }),
  dish('Appetizer', 8,  'Eggplant · Tahini · Smoky',          'https://images.unsplash.com/photo-1606471191009-63994c53433b?w=240',
    { english:'Baba Ganoush',                simplified:'茄子泥',          traditional:'茄子泥',          japanese:'ババガヌーシュ',   korean:'바바가누쉬',         thai:'บาบากานูช' }),
  dish('Appetizer', 11, 'Stuffed · Grape leaves · Rice',      'https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=240',
    { english:'Dolmas (6 pcs)',              simplified:'葡萄叶卷（6个）',  traditional:'葡萄葉捲（6個）',  japanese:'ドルマ（6個）',    korean:'돌마 (6개)',         thai:'โดลมา 6 ชิ้น' }),
  dish('Side',      6,  'Bulgur · Parsley · Lemon',           'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=240',
    { english:'Tabouli Salad',               simplified:'塔布勒沙拉',       traditional:'塔布勒沙拉',       japanese:'タブーリサラダ',   korean:'타불리 샐러드',      thai:'สลัดทาบูลี' }),
  dish('Dessert',   7,  'Layered · Pistachio · Honey',        'https://images.unsplash.com/photo-1625395005224-0fce68a3cdc8?w=240',
    { english:'Baklava',                     simplified:'果仁蜜饼',         traditional:'果仁蜜餅',         japanese:'バクラヴァ',       korean:'바클라바',           thai:'บัคลาวา' }),
  dish('Drink',     5,  'Black · Strong · Cardamom',          'https://images.unsplash.com/photo-1572286258217-215cf8e9d99c?w=240',
    { english:'Turkish Coffee',              simplified:'土耳其咖啡',       traditional:'土耳其咖啡',       japanese:'トルココーヒー',   korean:'터키 커피',          thai:'กาแฟตุรกี' }),
];

const DEFAULT = [
  dish('Signature', 15, 'Sweet · Crispy · Sesame',            'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=240',
    { english:'Sesame Chicken',              simplified:'芝麻鸡',          traditional:'芝麻雞',          japanese:'ごまチキン',       korean:'참깨 치킨',          thai:'ไก่งา' }),
  dish('Signature', 12, 'Pan-fried · Pork · Steamed',         'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=240',
    { english:'Pork Dumplings',              simplified:'猪肉饺子',         traditional:'豬肉餃子',         japanese:'豚肉餃子',         korean:'돼지고기 만두',      thai:'เกี๊ยวหมู' }),
  dish('Main',      16, 'Spicy · Peanuts · Chicken',          'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=240',
    { english:'Kung Pao Chicken',            simplified:'宫保鸡丁',         traditional:'宮保雞丁',         japanese:'宮保鶏丁',         korean:'궁바오 치킨',        thai:'ไก่กังเปา' }),
  dish('Main',      20, 'Beef · Sweet glaze · Rice',          'https://images.unsplash.com/photo-1576402187878-974f70c890a5?w=240',
    { english:'Beef Teriyaki',               simplified:'牛肉照烧',         traditional:'牛肉照燒',         japanese:'牛肉の照り焼き',   korean:'소고기 테리야키',    thai:'เนื้อเทอริยากิ' }),
  dish('Appetizer', 7,  'Crispy · Vegetable · Fried',         'https://images.unsplash.com/photo-1568640347023-a616a30bc3bd?w=240',
    { english:'Vegetable Spring Rolls',      simplified:'蔬菜春卷',         traditional:'蔬菜春卷',         japanese:'野菜春巻き',       korean:'야채 춘권',          thai:'ปอเปี๊ยะผัก' }),
  dish('Appetizer', 5,  'Salted · Steamed · Soybeans',        'https://images.unsplash.com/photo-1564834744159-ff0ea41ba4b9?w=240',
    { english:'Edamame',                     simplified:'毛豆',            traditional:'毛豆',            japanese:'枝豆',             korean:'에다마메',           thai:'ถั่วแระญี่ปุ่น' }),
  dish('Main',      12, 'Egg · Wok-fried · Rice',             'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=240',
    { english:'Fried Rice',                  simplified:'炒饭',            traditional:'炒飯',            japanese:'チャーハン',       korean:'볶음밥',             thai:'ข้าวผัด' }),
  dish('Side',      4,  'Warm · Fermented · Tofu',            'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=240',
    { english:'Miso Soup',                   simplified:'味噌汤',          traditional:'味噌湯',          japanese:'味噌汁',           korean:'미소 된장국',        thai:'ซุปมิโซะ' }),
  dish('Dessert',   6,  'Chilled · Sweet · Smooth',           'https://images.unsplash.com/photo-1568827999250-3f6afff96e66?w=240',
    { english:'Mango Pudding',               simplified:'芒果布丁',         traditional:'芒果布丁',         japanese:'マンゴープリン',   korean:'망고 푸딩',          thai:'มะม่วงพุดดิ้ง' }),
  dish('Drink',     3,  'Hot · Floral · Caffeinated',         'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=240',
    { english:'Jasmine Tea',                 simplified:'茉莉花茶',         traditional:'茉莉花茶',         japanese:'ジャスミン茶',     korean:'자스민 차',          thai:'ชามะลิ' }),
];

export const TEMPLATES = {
  CHINESE,
  JAPANESE,
  KOREAN,
  SE_ASIAN,
  CAFE_BOBA,
  FAST_FOOD,
  PIZZA_ITALIAN,
  STEAKHOUSE,
  MEXICAN,
  INDIAN,
  MEDITERRANEAN,
  DEFAULT,
};

/**
 * Pick the best-fitting template key based on a free-form cuisine string
 * (typically the title of Yelp's first category, e.g. "Ramen", "Korean BBQ").
 */
export function pickTemplateKey(cuisine) {
  if (!cuisine || typeof cuisine !== 'string') return 'DEFAULT';
  const lower = cuisine.toLowerCase();

  // Most specific buckets first.
  if (lower.includes('cafe') || lower.includes('coffee') ||
      lower.includes('boba') || lower.includes('bubble') ||
      lower.includes('bakery') || lower.includes('patisserie') ||
      lower.includes('dessert')) return 'CAFE_BOBA';

  if (lower.includes('burger') || lower.includes('fast food') ||
      lower.includes('hot dog') || lower.includes('fried chicken') ||
      lower.includes('chicken wing') || lower.includes('diner')) return 'FAST_FOOD';

  if (lower.includes('pizza') || lower.includes('italian') ||
      lower.includes('pasta') || lower.includes('trattoria')) return 'PIZZA_ITALIAN';

  if (lower.includes('steak') || lower.includes('steakhouse') ||
      lower.includes('grill') || lower.includes('chophouse') ||
      lower.includes('french') || lower.includes('european')) return 'STEAKHOUSE';

  if (lower.includes('mexican') || lower.includes('taco') ||
      lower.includes('burrito') || lower.includes('tex-mex') ||
      lower.includes('latin')) return 'MEXICAN';

  if (lower.includes('indian') || lower.includes('curry') ||
      lower.includes('biryani') || lower.includes('tandoor')) return 'INDIAN';

  if (lower.includes('mediterranean') || lower.includes('greek') ||
      lower.includes('lebanese') || lower.includes('turkish') ||
      lower.includes('middle east') || lower.includes('falafel') ||
      lower.includes('shawarma') || lower.includes('kebab')) return 'MEDITERRANEAN';

  if (lower.includes('korean') || lower.includes('kbbq') ||
      lower.includes('bulgogi')) return 'KOREAN';

  if (lower.includes('ramen') || lower.includes('sushi') ||
      lower.includes('izakaya') || lower.includes('tempura') ||
      lower.includes('yakitori') || lower.includes('japan')) return 'JAPANESE';

  if (lower.includes('thai') || lower.includes('vietnam') ||
      lower.includes('pho') || lower.includes('malaysian') ||
      lower.includes('indonesian') || lower.includes('filipino') ||
      lower.includes('cambodian') || lower.includes('laotian')) return 'SE_ASIAN';

  if (lower.includes('chinese') || lower.includes('hot pot') ||
      lower.includes('dim sum') || lower.includes('cantonese') ||
      lower.includes('szechuan') || lower.includes('sichuan') ||
      lower.includes('shanghainese') || lower.includes('mandarin') ||
      lower.includes('taiwanese')) return 'CHINESE';

  return 'DEFAULT';
}

/**
 * Build a final menu payload for a restaurant. The dishes are deep-cloned
 * with a stable id, image url, and isTopDish flag.
 */
export function buildMenuFromTemplate(cuisine) {
  const key = pickTemplateKey(cuisine);
  const template = TEMPLATES[key] ?? TEMPLATES.DEFAULT;
  const dishes = template.map((d, i) => ({
    id: i + 1,
    category: d.category,
    price: d.price,
    description: d.description,
    image: d.image,
    translations: { ...d.translations },
    original: d.translations.simplified,
    isTopDish: d.category === 'Signature' || i < 2,
  }));
  return { templateKey: key, dishes };
}
