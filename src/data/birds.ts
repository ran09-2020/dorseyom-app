export type BirdFamily = 'vultures' | 'eagles' | 'buzzards' | 'harriers' | 'kites' | 'accipiters' | 'falcons' | 'other';

export const FAMILY_NAMES: Record<BirdFamily, string> = {
  vultures: 'עזניות ונשרים',
  eagles: 'עיטים',
  buzzards: 'עקבים',
  harriers: 'זרונים',
  kites: 'דאות',
  accipiters: 'ניצים',
  falcons: 'בזים',
  other: 'אחרים'
};

// אזורים בישראל
export type Region = 
  | 'all'           // כל הארץ
  | 'north'         // צפון
  | 'galil'         // גליל
  | 'golan'         // גולן
  | 'hula'          // עמק החולה
  | 'mayanot'       // עמק המעיינות
  | 'shomron'       // שומרון
  | 'center'        // מרכז
  | 'coast'         // חוף
  | 'south'         // דרום
  | 'negev'         // נגב
  | 'arava'         // ערבה
  | 'eilat'         // אילת
  | 'mountains'     // הרים
  | 'judean_desert';// מדבר יהודה

export const REGION_NAMES: Record<Region, string> = {
  all: 'כל הארץ',
  north: 'צפון',
  galil: 'גליל',
  golan: 'גולן',
  hula: 'עמק החולה',
  mayanot: 'עמק המעיינות',
  shomron: 'שומרון',
  center: 'מרכז',
  coast: 'חוף',
  south: 'דרום',
  negev: 'נגב',
  arava: 'ערבה',
  eilat: 'אילת',
  mountains: 'הרים',
  judean_desert: 'מדבר יהודה'
};

// סטטוס עונתי
export type SeasonStatus = 'resident' | 'summer' | 'winter' | 'passage' | 'vagrant';

export const SEASON_STATUS_NAMES: Record<SeasonStatus, string> = {
  resident: 'יציב',
  summer: 'מקייץ',
  winter: 'חורף',
  passage: 'חולף',
  vagrant: 'מזדמן'
};

// רמת שכיחות
export type Rarity = 'common' | 'uncommon' | 'rare' | 'very_rare';

export const RARITY_NAMES: Record<Rarity, string> = {
  common: 'מצוי',
  uncommon: 'לא מצוי',
  rare: 'נדיר',
  very_rare: 'נדיר מאוד'
};

export interface Bird {
  name: string;
  latin: string;
  desc: string;
  features: string[];
  diff_desc: string;
  quick_marks?: string[];  // סימני זיהוי מהירים
  rare?: boolean;  // האם הדורס נדיר בישראל
  family: BirdFamily;  // משפחת הדורס
  attrs: Record<string, boolean | null>;
  // שדות חדשים לסינון אזור/עונה
  regions: Region[];           // אזורים בהם נצפה
  seasonStatus: SeasonStatus[]; // סטטוס עונתי
  seasonMonths?: string;        // חודשים רלוונטיים (אם לא יציב)
  rarity: Rarity;               // רמת שכיחות
  migrationCommon?: boolean;    // נפוץ בנדידה - יוצג בכל האזורים בעונת המעבר
}

export const BIRDS: Record<string, Bird> = {
  // === עזניות ונשרים ===
  cinereous_vulture: {
    name: 'עזניה שחורה',
    latin: 'Aegypius monachus',
    desc: 'הדורס הגדול ביותר. נדיר ביותר, מזדמנת.',
    features: ['גוף ענקי - מוטת כנפיים 2.5–3 מטר', 'כנפיים ישרות לחלוטין בגלישה', 'ראש כהה מסיבי וחשוף'],
    diff_desc: 'ראש שחור–כהה מסיבי ללא נוצות; גוף כהה לחלוטין. ענקית - גדולה בבירור מנשר. אין צווארון לבן.',
    quick_marks: ['ענקית', 'ראש כהה חשוף', 'גוף כהה לחלוטין'],
    rare: true,
    family: 'vultures',
    regions: ['all'],
    seasonStatus: ['vagrant'],
    seasonMonths: 'ספט׳-מרץ',
    rarity: 'very_rare',
    attrs: { giant: true, very_large: true, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: true, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, short_white_tail: false, large_eagle: false }
  },
  lappet_faced: {
    name: 'עזניית הנגב',
    latin: 'Torgos tracheliotos',
    desc: 'יציבה נדירה מאוד בערבה. ענקית עם ראש ורוד.',
    features: ['גוף ענקי', 'ראש ורוד חשוף עם קפלי עור', 'ירכיים לבנות ("מכנסיים")'],
    diff_desc: 'ראש ורוד חשוף עם קפלי עור. ניגוד בין גוף שחור-חום לירכיים לבנות.',
    quick_marks: ['ראש ורוד חשוף', 'ירכיים לבנות', 'ענקית'],
    rare: true,
    family: 'vultures',
    regions: ['negev', 'arava', 'eilat'],
    seasonStatus: ['resident'],
    rarity: 'very_rare',
    attrs: { giant: true, very_large: true, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: true, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: true, pink_head: true, short_white_tail: false, large_eagle: false }
  },
  griffon: {
    name: 'נשר מקראי',
    latin: 'Gyps fulvus',
    desc: 'הנשר הנפוץ בישראל. מקנן בצוקים ונראה לרוב בסחרורים מעל הרים.',
    features: ['7 אצבעות ארוכות ובולטות בקצה הכנף', 'זנב קצר מאוד ומרובע', 'צווארון לבן בבסיס הצוואר', 'ראש וצוואר בהירים', 'כנפיים שחורות מאחור חומות מלפנים'],
    diff_desc: 'צווארון לבן בולט בבסיס הצוואר; גוף חום-קרם, ראש וצוואר בהירים.',
    quick_marks: ['צווארון לבן', '7 אצבעות', 'זנב קצר מרובע'],
    family: 'vultures',
    regions: ['galil', 'golan', 'negev', 'judean_desert', 'arava'],
    seasonStatus: ['resident'],
    rarity: 'uncommon',
    attrs: { giant: true, very_large: true, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: true, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, short_white_tail: false, large_eagle: false }
  },
  lammergeier: {
    name: 'פרס',
    latin: 'Gypaetus barbatus',
    desc: 'דורס נדיר ביותר בישראל. מרשים במיוחד בזנבו המעויין הייחודי.',
    features: ['זנב מעויין ארוך מאוד - ייחודי!', 'גוף כתום-חלוד בבוגר', 'ראש קטן עם "זקן" שחור'],
    rare: true,
    family: 'vultures',
    diff_desc: 'זנב מעויין ארוך מאוד - ייחודי. גוף כתום-חלוד בבוגר. "זקן" שחור.',
    quick_marks: ['זנב מעויין ארוך', 'זקן שחור', 'גוף כתום-חלוד'],
    regions: ['negev', 'judean_desert'],
    seasonStatus: ['resident'],
    rarity: 'very_rare',
    attrs: { giant: true, very_large: true, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: true, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: true, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, short_white_tail: false, large_eagle: false }
  },
  egyptian: {
    name: 'רחם מדברי',
    latin: 'Neophron percnopterus',
    desc: 'דורס קיצי המגיע לישראל בקיץ. נפוץ יחסית בנגב ובגולן.',
    features: ['זנב מעויין', 'בוגר: לבן עם קצוות כנפיים שחורים', 'פנים צהובות חשופות'],
    diff_desc: 'בוגר: זנב מעויין לבן. כנף דו-גונית - לבן מקדימה ושחור מאחורה (מזכיר חסידה). פנים צהובות חשופות.',
    quick_marks: ['לבן + שחור בקצוות', 'פנים צהובות', 'זנב מעויין'],
    family: 'vultures',
    regions: ['golan', 'negev', 'judean_desert', 'arava'],
    seasonStatus: ['summer'],
    seasonMonths: 'מרץ-אוק׳',
    rarity: 'uncommon',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: true, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: true, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, short_white_tail: false, large_eagle: false }
  },

  // === עיטים ===
  white_tail: {
    name: 'עיטם לבן זנב',
    latin: 'Haliaeetus albicilla',
    desc: 'מבקר חורף נדיר. נראה בעיקר ליד אגם חולה, הכנרת ועמק בית שאן.',
    features: ['זנב לבן קצר וטריזי (בבוגר)', 'מקור צהוב עצום', 'כנפיים ישרות כ"לוח מעופף"'],
    rare: true,
    family: 'eagles',
    diff_desc: 'תמיד ליד מים. מקור צהוב–כתום עצום. בוגר: זנב לבן טריזי קצר. כנפיים ישרות ורחבות כ"לוח".',
    quick_marks: ['זנב לבן קצר', 'מקור צהוב עצום', 'ליד מים'],
    regions: ['hula', 'mayanot', 'coast'],
    seasonStatus: ['winter'],
    seasonMonths: 'נוב׳-מרץ',
    rarity: 'rare',
    attrs: { giant: true, very_large: true, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: true, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, white_wing_band: true, short_white_tail: true }
  },
  golden: {
    name: 'עיט זהוב',
    latin: 'Aquila chrysaetos',
    desc: 'יציב נדיר בישראל. מקנן בגליל ובגולן. מרשים בגודלו ובעורפו הזהוב.',
    features: ['V רדוד (בגלישה)', '7 אצבעות, עורף זהוב בולט', 'מבנה מסיבי ומלכותי'],
    diff_desc: 'עורף זהוב בולט. V רדוד (בגלישה). מבנה מסיבי. גדול יותר מעיט שמש.',
    quick_marks: ['עורף זהוב', 'V רדוד', 'מסיבי ומלכותי'],
    family: 'eagles',
    regions: ['galil', 'golan'],
    seasonStatus: ['resident'],
    rarity: 'rare',
    attrs: { giant: false, very_large: true, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: true, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, short_white_tail: false, large_eagle: true }
  },
  imperial: {
    name: 'עיט שמש',
    latin: 'Aquila heliaca',
    desc: 'חולף נדיר יחסית בישראל. עיט גדול וכהה עם כתמים לבנים בולטים בכתפיים.',
    features: ['כתמי כתף לבנים/זהובים בולטים', 'מנח כנפיים שטוח (בגלישה)', 'כנפיים רחבות ומלבניות, זנב קצר יחסית'],
    diff_desc: 'כתמי כתף לבנים/זהובים בולטים - ייחודי. ראש ואורף בהירים יותר מהגוף. מנח שטוח (בגלישה).',
    quick_marks: ['עורף וצוואר בהירים', 'כתמי כתף בהירים', 'מנח שטוח'],
    family: 'eagles',
    regions: ['all'],
    seasonStatus: ['passage', 'winter'],
    seasonMonths: 'ספט׳-אפר׳',
    rarity: 'rare',
    migrationCommon: false,
    attrs: { giant: false, very_large: true, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: true, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, short_white_tail: false, large_eagle: true }
  },
  steppe: {
    name: 'עיט ערבות',
    latin: 'Aquila nipalensis',
    desc: 'נפוץ במעבר בדרום ישראל. עובר בעשרות אלפים בסתיו.',
    features: ['פס לבן לאורך הכנף (צעירים ותת-בוגרים)', 'שפה צהובה ארוכה - עוברת את העין', '7 אצבעות בולטות'],
    diff_desc: 'פס לבן בולט לאורך הכנף (צעירים). שפה צהובה ארוכה שעוברת מעבר לעין.',
    quick_marks: ['פס לבן בכנף', 'שפה ארוכה', '7 אצבעות'],
    family: 'eagles',
    regions: ['eilat', 'arava', 'negev'],
    seasonStatus: ['passage'],
    seasonMonths: 'ספט׳-נוב׳, מרץ-מאי',
    rarity: 'common',
    migrationCommon: true,
    attrs: { giant: false, very_large: true, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, white_wing_band: true, short_white_tail: false, large_eagle: true }
  },

  tawny: {
    name: 'עיט סוואנות',
    latin: 'Aquila rapax',
    desc: 'מזדמן נדיר. דומה לעיט ערבות אך שפה קצרה.',
    features: ['חום-צהבהב', 'שפה צהובה קצרה - לא עוברת את העין', '7 אצבעות', 'אין פס לבן על הכנף'],
    rare: true,
    family: 'eagles',
    diff_desc: 'שפה צהובה קצרה (לא עוברת את העין). אין פס לבן על הכנף - להבדיל מעיט ערבות צעיר.',
    quick_marks: ['שפה קצרה', 'אין פס בכנף', 'חום-צהבהב'],
    regions: ['eilat', 'arava'],
    seasonStatus: ['vagrant'],
    seasonMonths: 'ספט׳-נוב׳',
    rarity: 'very_rare',
    attrs: { giant: false, very_large: true, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, large_eagle: true }
  },

  greater_spotted: {
    name: 'עיט צפרדעים',
    latin: 'Clanga clanga',
    desc: 'מבקר חורף. כהה מאוד עם כנפיים שמוטות אופייניות.',
    features: ['כהה מאוד - כמעט שחור (לא חום-שוקולד)', 'כנפיים שמוטות בולטות בגלישה', '7 אצבעות', 'מבנה כבד ומסיבי', 'גדול מעיט חורש'],
    diff_desc: 'כהה מאוד, כמעט שחור - לא חום-שוקולד כמו עיט חורש; סוככות כהות מאברות התעופה',
    quick_marks: ['כהה מאוד', 'כנפיים שמוטות', '7 אצבעות'],
    family: 'eagles',
    regions: ['hula', 'mayanot', 'coast', 'center'],
    seasonStatus: ['winter'],
    seasonMonths: 'נוב׳-מרץ',
    rarity: 'rare',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: true, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, large_eagle: false }
  },
  lesser_spotted: {
    name: 'עיט חורש',
    latin: 'Clanga pomarina',
    desc: 'נפוץ מאוד במעבר - עובר בעשרות אלפים מעל ישראל.',
    features: ['חום-שוקולד אחיד (לא שחור)', '6 אצבעות (לא 7)', 'כנפיים שמוטות קלות בגלישה', 'קטן יותר מעיט צפרדעים', 'סוככות בהירות מאברות תעופה', 'שני פסיקים בהירים ליד מפרק כף היד'],
    diff_desc: 'חום-שוקולד אחיד - לא כהה כמו עיט צפרדעים; סוככות בהירות מאברות התעופה',
    quick_marks: ['חום-שוקולד', '6 אצבעות', 'כנפיים שמוטות'],
    family: 'eagles',
    regions: ['all'],
    seasonStatus: ['passage'],
    seasonMonths: 'אפר׳-מאי, ספט׳-אוק׳',
    rarity: 'common',
    migrationCommon: true,
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: true, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: true, short_white_tail: false, large_eagle: false }
  },

  bonelli: {
    name: 'עיט ניצי',
    latin: 'Aquila fasciata',
    desc: 'יציב נדיר. מקנן בישראל. ניגוד חריף בין בטן בהירה לגב כהה.',
    features: ['בטן לבנה מול גב כהה - ניגוד חריף', 'כתם לבן על הגב (מעויין)', 'פס קצה שחור עבה בזנב'],
    diff_desc: 'בטן לבנה מול גב כהה - ניגוד חריף. כתם לבן על הגב. פס שחור עבה בקצה הזנב.',
    quick_marks: ['ניגוד בטן/גב', 'כתם לבן בגב', 'פס שחור בזנב'],
    family: 'eagles',
    regions: ['galil', 'judean_desert', 'negev'],
    seasonStatus: ['resident'],
    rarity: 'rare',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: true, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, short_white_tail: false, large_eagle: false }
  },

  booted: {
    name: 'עיט גמדי',
    latin: 'Hieraaetus pennatus',
    desc: 'הקטן בעיטים. נפוץ במעבר ובקיץ. יש מופע בהיר וכהה.',
    features: ['"פנסים" - כתמי לבן בולטים בבסיס הכנף הקדמי - ייחודי!', 'כנפיים דו-גוניות במופע בהיר', 'קטן מעיט - בגודל עקב'],
    diff_desc: 'הקטן ביותר בקבוצה זו. בגודל עקב. "פנסים" - שני כתמי לבן בולטים מאוד (בפרט במופע הכהה) בבסיס הכנף הקדמי. מופע בהיר: כנפיים לבנות מקדימה ושחורות מאחורה. בטן לבנה עם פיספוס אורך חום על החזה. כתמים כהים סביב העיניים. מופע כהה: קשה יותר לזיהוי. לחפש את "אורות הנחיתה" במבט מלפנים. ראו צילום בגלרייה.',
    quick_marks: ['"פנסים" בבסיס הכנף', 'כנפיים דו-גוניות', 'בגודל עקב'],
    family: 'eagles',
    regions: ['all'],
    seasonStatus: ['summer', 'passage'],
    seasonMonths: 'מרץ-אוק׳',
    rarity: 'common',
    migrationCommon: false,
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: true, hover: false, deep_v: false, shallow_v: null, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: true, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, short_white_tail: false, large_eagle: false }
  },
  short_toed: {
    name: 'חיוויאי',
    latin: 'Circaetus gallicus',
    desc: 'מקייץ. אוכל נחשים. מרחף הרבה.',
    features: ['סנטר/ראש כהים ("ראש קרמבו") על גוף בהיר', 'בהיר מלמטה עם נקודות כהות בבטן ובסוככות', 'עומד תלוי באוויר מול הרוח', 'כנפיים שטוחות בגלישה איטית', 'מפרקים משוכים קדימה בגלישה מהירה (צורת W)'],
    diff_desc: 'ראש כהה ("קרמבו") על רקע גוף בהיר. נקודות כהות לרוחב הבטן. מרפרף או תלוי חסר תנועה מול הרוח. כנפיים שטוחות בגלישה איטית, מפרקים משוכים קדימה בגלישה מהירה.',
    quick_marks: ['ראש כהה "קרמבו"', 'מרחף', 'נקודות בבטן'],
    family: 'eagles',
    regions: ['all'],
    seasonStatus: ['summer'],
    seasonMonths: 'מרץ-אוק׳',
    rarity: 'common',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: true, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, flat_wings: true, forward_wrist: true, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: true, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, large_eagle: false }
  },



  // === איות ===
  snake_eagle: {
    name: 'איית צרעים',
    latin: 'Pernis apivorus',
    desc: 'ולפת בהמונים בנדידה. דומה לחיוויאי אך קטנה יותר וצוואר ארוך.',
    features: ['צוואר ארוך', 'זנב ארוך עם 3 פסים שחורים', '6 אצבעות', 'שפת זרימה שחורה (מסגרת)', 'חלונות בהירים', 'כתם כהה במפרק היד', 'פסי אורך בכנף מגיעים לשפת התקיפה', 'חולפת בהמונים'],
    diff_desc: 'צוואר ארוך וראש קטן בהיר (יחסית לעקב). זנב ארוך עם 3 פסים שחורים (2 בבסיס, 1 בקצה). 6 אצבעות. שפת זרימה וחלונות בהירים.',
    quick_marks: ['צוואר ארוך + ראש קטן', '3 פסים בזנב', '6 אצבעות'],
    family: 'buzzards',
    regions: ['all'],
    seasonStatus: ['passage'],
    seasonMonths: 'אפר׳-מאי, אוג׳-ספט׳',
    rarity: 'common',
    migrationCommon: true,
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, trailing_edge: true, light_bars: true, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: true, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: true, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: true, three_tail_bands: true, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, pale_tail: false, large_eagle: false }
  },

  // === עקבים ===
  long_legged: {
    name: 'עקב עיטי',
    latin: 'Buteo rufinus',
    desc: 'יציב נפוץ בישראל. עקב גדול וחזק.',
    features: ['זנב בהיר מלמעלה - בולט מרחוק', 'V רדוד (בגלישה)', 'כתם כהה בפרק הכנף', 'חלונות בהירים', 'מרפרף'],
    diff_desc: 'גדול יותר מעקב חורף. בטן בהירה עם "מכנסיים" כהים. זנב בהיר/חלוד ללא פסים.',
    quick_marks: ['זנב בהיר מלמעלה', 'הגדול ביותר', 'מכנסיים כהים'],
    family: 'buzzards',
    regions: ['all'],
    seasonStatus: ['resident'],
    rarity: 'common',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: true, light_bars: true, deep_v: false, shallow_v: true, drooping: false, kinked_wing: false, flat_wings: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: true, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: true, trailing_edge: false, tail_band: true, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, pale_tail: true, ginger_rusty: true, large_eagle: false }
  },
  common_buzzard: {
    name: 'עקב חורף',
    latin: 'Buteo buteo',
    desc: 'מבקר חורף נפוץ מאוד. נראה בכל הארץ בחורף.',
    features: ['מבנה "כללי" של עקב', 'V רדוד (בגלישה)', 'זנב עם הרבה פסים דקים', 'חלונות בהירים', 'מרפרף'],
    diff_desc: 'כתם כהה בולט בפרק הכנף. V רדוד (בגלישה). סהר בהיר על החזה. זנב עם הרבה פסים דקים. טיפ: נסו לראות פסי רוחב על הזנב - אם יש, זה עקב חורף. אם הזנב חלוד-אחיד, זה עקב מזרחי.',
    quick_marks: ['זנב עם הרבה פסים דקים'],
    family: 'buzzards',
    regions: ['all'],
    seasonStatus: ['winter'],
    seasonMonths: 'אוק׳-מרץ',
    rarity: 'common',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: true, light_bars: true, deep_v: false, shallow_v: true, drooping: false, kinked_wing: false, flat_wings: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: true, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: true, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: true, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, pale_tail: false, ginger_rusty: false, large_eagle: false }
  },
  steppe_buzzard: {
    name: 'עקב מזרחי',
    latin: 'Buteo buteo vulpinus',
    desc: 'חולף במעבר. תת-מין של עקב חורף.',
    features: ['זנב חלודי מפוספס', 'V רדוד (בגלישה)', 'קטן מעקב עיטי', 'חלונות בהירים', 'מרפרף'],
    diff_desc: 'כתם כהה במפרק הכנף. סהר בהיר על החזה. זנב חלודי מפוספס. קטן יותר מעקב עיטי.',
    quick_marks: ['זנב חלודי מפוספס'],
    family: 'buzzards',
    regions: ['all'],
    seasonStatus: ['passage'],
    seasonMonths: 'מרץ-מאי, ספט׳-נוב׳',
    rarity: 'common',
    migrationCommon: true,
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: true, light_bars: true, deep_v: false, shallow_v: true, drooping: false, kinked_wing: false, flat_wings: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: true, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: true, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, pale_tail: false, ginger_rusty: true, large_eagle: false }
  },
  rough_legged: {
    name: 'עקב מכנסיים',
    latin: 'Buteo lagopus',
    desc: 'מבקר חורף נדיר.',
    features: ['זנב לבן עם פס שחור רחב בקצה', 'מרחף הרבה', 'כתמי כנף שחורים גדולים', 'חלונות בהירים', 'מרפרף'],
    rare: true,
    family: 'buzzards',
    diff_desc: 'זנב לבן עם פס שחור רחב בקצה - ייחודי. כתמי כנף שחורים גדולים. מרחף הרבה.',
    quick_marks: ['זנב לבן עם פס שחור רחב בקצה'],
    regions: ['north', 'golan', 'hula'],
    seasonStatus: ['winter'],
    seasonMonths: 'נוב׳-מרץ',
    rarity: 'rare',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: true, light_bars: true, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: true, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: true, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, pale_tail: false, ginger_rusty: false, large_eagle: false }
  },

  // === זרונים ===
  marsh_harrier: {
    name: 'זרון סוף',
    latin: 'Circus aeruginosus',
    desc: 'יציב ליד מקורות מים. זכר תלת-גוני יפה.',
    features: ['V רדוד (בגלישה)', 'זכר תלת-גוני: חלוד, אפור, שחור', 'נקבה חומה עם כיפה קרמית', 'זנב ארוך'],
    diff_desc: 'הגדול בזרונים. זכר תלת-גוני. נקבה חומה עם כיפה קרמית. קשור לביצות.',
    quick_marks: ['זכר תלת-גוני', 'כיפה קרמית (נקבה)', 'ליד ביצות'],
    family: 'harriers',
    regions: ['hula', 'mayanot', 'coast', 'center'],
    seasonStatus: ['resident', 'winter'],
    rarity: 'common',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: true, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: true, low_over_marsh: true, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, large_eagle: false }
  },
  hen_harrier: {
    name: 'זרון תכול',
    latin: 'Circus cyaneus',
    desc: 'מבקר חורף. זכר אפור בהיר מאוד.',
    features: ['V רדוד (בגלישה)', 'זכר אפור בהיר מאוד', 'על-שת לבן בולט', 'זנב ארוך'],
    diff_desc: 'זכר אפור בהיר מאוד. על-שת לבן בולט. קצוות כנף שחורות רחבות.',
    quick_marks: ['אפור בהיר', 'על-שת לבן', 'קצוות רחבות'],
    family: 'harriers',
    regions: ['all'],
    seasonStatus: ['winter'],
    seasonMonths: 'אוק׳-מרץ',
    rarity: 'uncommon',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: true, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: true, black_shoulders: false, near_water: false, uniform_grey: true, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, large_eagle: false }
  },
  pallid_harrier: {
    name: 'זרון שדות',
    latin: 'Circus macrourus',
    desc: 'חולף נדיר יחסית. זכר לבן מאוד.',
    features: ['V רדוד (בגלישה)', 'זכר לבן-אפור מאוד', 'קצוות כנף שחורות צרות וחדות', 'זנב ארוך'],
    diff_desc: 'זכר לבן-אפור מאוד עם קצוות כנף שחורות צרות וחדות - ייחודי. קטן יותר מזרון תכול.',
    quick_marks: ['לבן כמעט', 'קצוות חדות כדיו', 'על-שת לבן'],
    family: 'harriers',
    regions: ['all'],
    seasonStatus: ['passage'],
    seasonMonths: 'מרץ-מאי, ספט׳-נוב׳',
    rarity: 'uncommon',
    migrationCommon: true,
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: true, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: true, black_shoulders: false, near_water: false, uniform_grey: true, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: true, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, large_eagle: false }
  },
  montagu_harrier: {
    name: 'זרון פס',
    latin: 'Circus pygargus',
    desc: 'חולף נפוץ. הקטן והרזה בזרונים.',
    features: ['V רדוד (בגלישה)', 'זכר עם פס שחור לאורך הכנף', 'הקטן והרזה בזרונים', 'זנב ארוך'],
    diff_desc: 'זכר עם פס שחור לאורך הכנף (על המשניות) - ייחודי. הקטן והרזה בזרונים.',
    quick_marks: ['פס שחור בכנף', 'קטן ורזה', 'V רדוד'],
    family: 'harriers',
    regions: ['all'],
    seasonStatus: ['passage'],
    seasonMonths: 'מרץ-מאי, אוג׳-אוק׳',
    rarity: 'common',
    migrationCommon: true,
    attrs: { giant: false, very_large: false, small: true, two_tone_wings: false, hover: false, deep_v: false, shallow_v: true, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: true, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, short_white_tail: false, large_eagle: false }
  },

  // === דאות ===
  black_kite: {
    name: 'דיה שחורה',
    latin: 'Milvus migrans',
    desc: 'חולפת בעשרות אלפים. זנב מזלגי רדוד , משולש.',
    features: ['זנב מזלגי רדוד (משולש)', 'כנפיים שמוטות בגלישה', 'בדרך כלל חומה כהה אחידה'],
    diff_desc: 'זנב מזלגי רדוד (משולש). כנפיים שמוטות בגלישה. חומה כהה אחידה אך מופיעה במס׳ דגמי צבע.',
    quick_marks: ['זנב מזלגי רדוד', 'כנפיים שמוטות', 'חומה כהה'],
    family: 'kites',
    regions: ['all'],
    seasonStatus: ['passage'],
    seasonMonths: 'מרץ-מאי, אוג׳-אוק׳',
    rarity: 'common',
    migrationCommon: true,
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: true, kinked_wing: false, light_bars: false, forked_any: true, forked: false, forked_shallow: true, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, belly_bars: true, pale_eye: true, dark_wingtips: false, white_supercilium: false, large_eagle: false }
  },

  red_kite: {
    name: 'דיה אדומה',
    latin: 'Milvus milvus',
    desc: 'מזדמנת נדירה. זנב מזלגי עמוק מאוד.',
    features: ['זנב מזלגי עמוק מאוד - ייחודי!', 'צבע אדמדם-חלוד, ראש לבן', 'חלונות לבנים בכנף'],
    diff_desc: 'זנב מזלגי עמוק מאוד. גוף חלוד-אדום, ראש לבן. חלונות לבנים בכנף.',
    quick_marks: ['זנב מזלגי עמוק', 'חלוד-אדום', 'ראש לבן'],
    family: 'kites',
    regions: ['north', 'center'],
    seasonStatus: ['vagrant'],
    seasonMonths: 'חורף',
    rarity: 'very_rare',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: true, kinked_wing: false, light_bars: null, forked_any: true, forked: true, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, belly_bars: true, pale_eye: true, dark_wingtips: false, white_supercilium: true, large_eagle: false }
  },
  black_shouldered: {
    name: 'דאה שחורת כתף',
    latin: 'Elanus caeruleus',
    desc: 'יציבה נפוצה. מרחפת מעל שדות.',
    features: ['כתפיים שחורות בולטות', 'גוף לבן-אפור', 'גולשת ומרפרפת ב-V עמוק, עיניים אדומות'],
    diff_desc: 'קטנה ולבנה עם כתפיים שחורות בולטות. מרחפת הרבה ב-V עמוק (בגלישה). עיניים אדומות.',
    quick_marks: ['כתפיים שחורות', 'לבנה + מרחפת', 'V עמוק'],
    family: 'kites',
    regions: ['all'],
    seasonStatus: ['resident'],
    rarity: 'common',
    attrs: { giant: false, very_large: false, small: true, two_tone_wings: false, hover: true, deep_v: true, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: true, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, pale_body: true, large_eagle: false }
  },

  // === שלכים ===
  osprey: {
    name: 'שלך',
    latin: 'Pandion haliaetus',
    desc: 'חולף וחורף ליד מקורות מים. שולה דגים מומחה.',
    features: ['כנף כפופה (בגלישה) - צורת M', 'פס עין שחור רחב', 'תחתית לבנה, תמיד ליד מים', 'כיפה לבנה', 'דגם V שחור ממפרק הכנף לגוף'],
    diff_desc: ' תמיד ליד מים. כנף כפופה (בגלישה) - צורת M. פס עין שחור רחב. כיפה לבנה. בטן לבנה.',
    quick_marks: ['כנף כפופה M', 'פס עין שחור', 'ליד מים'],
    family: 'other',
    regions: ['hula', 'mayanot', 'coast', 'eilat'],
    seasonStatus: ['passage', 'winter'],
    seasonMonths: 'ספט׳-אפר׳',
    rarity: 'uncommon',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: true, hover: false, deep_v: false, shallow_v: false, drooping: null, kinked_wing: true, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: true, lanterns: false, white_shoulders: false, pale_head: true, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: true, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, pale_body: true, pale_tail: false, large_eagle: false }
  },

  // === ניצים ===
  sparrowhawk: {
    name: 'נץ מצוי',
    latin: 'Accipiter nisus',
    desc: 'יציב נפוץ. קטן עם "יד" ארוכה.',
    features: ['"יד" ארוכה עם פינות חדות', 'עין בהירה', 'פסי רוחב חום-כתום בבטן (זכר)', 'זנב ארוך מרוחב הכנף', 'מעוף מהיר וגלישה מהירה'],
    diff_desc: 'קטן. "יד" ארוכה עם פינות חדות. עין בהירה. זכר: פסי רוחב חום-כתום. נקבה: גדולה יותר עם פסי אפור.',
    quick_marks: ['"יד" ארוכה', 'עין בהירה', 'קטן'],
    family: 'accipiters',
    regions: ['all'],
    seasonStatus: ['resident', 'winter'],
    rarity: 'common',
    attrs: { giant: false, very_large: false, small: true, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, accipiter: true, dark_wingtips: true, belly_bars: true, pale_eye: true, underwing_contrast: false, large_eagle: false }
  },
  goshawk: {
    name: 'נץ גדול',
    latin: 'Accipiter gentilis',
    desc: 'יציב נדיר יחסית. גדול וחזק.',
    features: ['"אמה" ארוכה עם פינות מעוגלות', 'גבה לבנה בולטת', 'עין כתומה, גוף מסיבי'],
    diff_desc: '"אמה" ארוכה עם פינות מעוגלות. גבה לבנה בולטת. עין כתומה. גוף מסיבי.',
    quick_marks: ['אמה ארוכה', 'גבה לבנה', 'עין כתומה'],
    family: 'accipiters',
    regions: ['galil', 'golan', 'shomron'],
    seasonStatus: ['resident'],
    rarity: 'rare',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, accipiter: true, dark_wingtips: true, belly_bars: true, pale_eye: true, large_eagle: false }
  },
  levant_sparrowhawk: {
    name: 'נץ קצר אצבעות',
    latin: 'Accipiter brevipes',
    desc: 'חולף במעבר. כנפיים מחודדות עם קצוות שחורות.',
    features: ['כנפיים מחודדות עם קצוות שחורות', 'עין כהה (לא בהירה)', 'לחי אפורה', 'דואה בקבוצות בדרך כלל', 'פסי רוחב על הבטן (אצל בוגרים)', 'חמישה פסים על הזנב', 'מלמעלה אין פספוס לאורך מרכז הזנב'],
    diff_desc: 'כנפיים מחודדות עם קצוות שחורות. עין כהה (לא בהירה). לחי אפורה. דואה בקבוצות.',
    quick_marks: ['קצוות שחורות', 'עין כהה', 'דואה בקבוצות'],
    family: 'accipiters',
    regions: ['all'],
    seasonStatus: ['passage'],
    seasonMonths: 'אפר׳-מאי, ספט׳-אוק׳',
    rarity: 'common',
    migrationCommon: true,
    attrs: { giant: false, very_large: false, small: true, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: false, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, chocolate_brown: false, accipiter: true, dark_wingtips: true, belly_bars: true, pale_eye: false, underwing_contrast: true, large_eagle: false }
  },

  // === בזים ===
  lesser_kestrel: {
    name: 'בז אדום',
    latin: 'Falco naumanni',
    desc: 'יציב קיץ. חברתי מאוד - תמיד בלהקות. גב חלוד נקי בזכר.',
    features: ['תמיד בלהקות (בז מצוי בודד)', 'זכר עם ראש אפור וגב חלוד נקי', 'נקבה דומה מאוד לבז מצוי', 'גולש בכנפיים שטוחות'],
    diff_desc: 'תמיד בלהקות! זכר עם גב חלוד נקי מניקוד. נקבות קשות להבחנה מבז מצוי.',
    quick_marks: ['בלהקה!', 'גב נקי (זכר)', 'חברתי'],
    family: 'falcons',
    regions: ['all'],
    seasonStatus: ['summer'],
    seasonMonths: 'מרץ-אוק׳',
    rarity: 'common',
    attrs: { giant: false, very_large: false, small: true, two_tone_wings: false, hover: true, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: true, flocking: true, large_eagle: false }
  },
  common_kestrel: {
    name: 'בז מצוי',
    latin: 'Falco tinnunculus',
    desc: 'הבז הנפוץ ביותר בישראל. בודד - לא בלהקות. מרחף הרבה.',
    features: ['בודד (בז אדום תמיד בלהקות)', 'זכר עם ראש אפור וגב מנוקד', 'נקבה דומה מאוד לבז אדום', 'מרחף הרבה'],
    diff_desc: 'בודד - לא בלהקות! זכר עם גב חלוד מנוקד בשחור. נקבות קשות להבחנה מבז אדום.',
    quick_marks: ['בודד!', 'גב מנוקד (זכר)', 'מרחף'],
    family: 'falcons',
    regions: ['all'],
    seasonStatus: ['resident'],
    rarity: 'common',
    attrs: { giant: false, very_large: false, small: true, two_tone_wings: false, hover: true, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: true, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: false, large_eagle: false }
  },
  red_footed_falcon: {
    name: 'בז ערב',
    latin: 'Falco vespertinus',
    desc: 'חולף נדיר. זכר אפור כהה עם "מכנסיים" ורגליים אדומות.',
    features: ['זכר אפור כהה עם "מכנסיים" ורגליים אדומות', 'נקבה עם ראש כתום', 'מרחף', 'גולש בכנפיים שטוחות'],
    diff_desc: 'זכר אפור כהה עם "מכנסיים" ורגליים ומקור אדומים. נקבה עם ראש כתום.',
    quick_marks: ['זכר אפור כהה', 'רגליים אדומות', 'מרחף'],
    family: 'falcons',
    regions: ['all'],
    seasonStatus: ['passage'],
    seasonMonths: 'אפר׳-מאי, ספט׳-אוק׳',
    rarity: 'uncommon',
    migrationCommon: true,
    attrs: { giant: false, very_large: false, small: true, two_tone_wings: false, hover: true, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, red_trousers: true, red_legs: true, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: false, large_eagle: false }
  },

  merlin: {
    name: 'בז גמדי',
    latin: 'Falco columbarius',
    desc: 'מבקר חורף נדיר. הקטן בבזים.',
    features: ['הקטן בבזים', 'טיסה מהירה נמוך מעל הקרקע', 'חסר שפם בולט', 'גולש בכנפיים שטוחות'],
    diff_desc: 'הקטן בבזים. טיסה מהירה נמוך מעל הקרקע. חסר שפם בולט.',
    quick_marks: ['הקטן בבזים', 'טיסה נמוכה', 'חסר שפם'],
    family: 'falcons',
    regions: ['all'],
    seasonStatus: ['winter'],
    seasonMonths: 'אוק׳-מרץ',
    rarity: 'rare',
    attrs: { giant: false, very_large: false, small: true, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: true, pinkish_underparts: false, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: false, large_eagle: false }
  },
  peregrine: {
    name: 'בז נודד',
    latin: 'Falco peregrinus',
    desc: 'יציב נדיר ומבקר חורף. מפורסם במהירותו.',
    features: ['"קסדה" שחורה עם שפם רחב מאוד', 'גוף מסיבי', 'חתירה מהירה ביותר', 'גולש בכנפיים שטוחות'],
    diff_desc: '"קסדה" שחורה עם שפם רחב מאוד. גוף מסיבי. חתירה מהירה ביותר.',
    quick_marks: ['קסדה + שפם רחב', 'גוף מסיבי', 'מהיר מאוד'],
    family: 'falcons',
    regions: ['all'],
    seasonStatus: ['resident', 'winter'],
    rarity: 'rare',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: true, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: false, large_eagle: false, hobby_features: false }
  },
  barbary_falcon: {
    name: 'בז מדברי',
    latin: 'Falco pelegrinoides',
    desc: 'יציב נדיר בדרום. דומה לבז נודד.',
    features: ['דומה לבז נודד אך קטן יותר', 'עורף חלוד', 'תחתית ורדרדה'],
    diff_desc: 'דומה לבז נודד אך קטן יותר. עורף חלוד. תחתית ורדרדה.',
    quick_marks: ['עורף חלוד', 'תחתית ורדרדה', 'קסדה'],
    family: 'falcons',
    regions: ['negev', 'arava', 'eilat', 'judean_desert'],
    seasonStatus: ['resident'],
    rarity: 'rare',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: true, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: true, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: true, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: false, large_eagle: false, hobby_features: false }
  },
  lanner: {
    name: 'בז צוקים',
    latin: 'Falco biarmicus',
    desc: 'יציב נדיר. בז גדול עם כיפה חלודה.',
    features: ['כיפה חלודה ושפם דק (לא רחב כנודד)', 'גוף בהיר יחסית', 'גדול יחסית'],
    diff_desc: 'כיפה חלודה ושפם דק (לא רחב כנודד). גוף בהיר יחסית.',
    quick_marks: ['כיפה חלודה', 'שפם דק', 'גוף בהיר'],
    family: 'falcons',
    regions: ['negev', 'judean_desert', 'arava'],
    seasonStatus: ['resident'],
    rarity: 'rare',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: true, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: false, large_eagle: false }
  },
  saker: {
    name: 'בז ציידים',
    latin: 'Falco cherrug',
    desc: 'מבקר חורף נדיר. בז גדול וחזק.',
    features: ['גדול ומסיבי', 'כיפה בהירה', 'שפם חלש (לא בולט כנודד)'],
    diff_desc: 'גדול ומסיבי. כיפה בהירה. שפם חלש (לא בולט כנודד).',
    quick_marks: ['גדול ומסיבי', 'כיפה בהירה', 'שפם חלש'],
    family: 'falcons',
    regions: ['all'],
    seasonStatus: ['winter'],
    seasonMonths: 'נוב׳-מרץ',
    rarity: 'rare',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: true, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: false, large_eagle: false }
  },
  eleanora: {
    name: 'בז חופים',
    latin: 'Falco eleonorae',
    desc: 'חולף / מקייץ. מעוף אקרובטי. נצפה בשנים האחרונות ביוני-יולי בחרמון ובסביבות שביל הפסגה במירון.',
    features: ['קסדה ושפם', 'סוככות תת-כנף כהות', 'פס זרימה כהה', 'כיפה בהירה', 'כנפיים ארוכות', 'מעוף אקרובטי'],
    diff_desc: 'קסדה ושפם. סוככות תת-כנף כהות - הסימן הכי בולט. פס זרימה כהה יותר מבזים אחרים. כיפה בהירה. כנפיים ארוכות. מעוף אקרובטי. קיץ בלבד.',
    quick_marks: ['סוככות תת-כנף כהות', 'פס זרימה כהה', 'כיפה בהירה'],
    family: 'falcons',
    regions: ['eilat', 'galil', 'golan'],
    seasonStatus: ['passage', 'summer'],
    seasonMonths: 'אפר׳-מאי, יוני-יולי, ספט׳-אוק׳',
    rarity: 'uncommon',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: true, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, trailing_edge: true, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: false, dark_underwing_coverts: true, large_eagle: false, hobby_features: false }
  },
  hobby: {
    name: 'בז עצים',
    latin: 'Falco subbuteo',
    desc: 'מקייץ ומקנן שכיח למדי בחבל הים תיכוני ובנגב הצפוני. חולף במספרים קטנים על פני כל הארץ. מגיע במחצית השנייה של מרץ ובאפריל, עוזב מסוף אוגוסט עד אמצע אוקטובר. מקנן בקיני עורבים נטושים. בעשורים האחרונים הרחיב תפוצתו דרומה למרכז הנגב בעקבות התפשטות העורבים. מעוף אקרובטי.',
    features: ['כנפי מגל צרות מאוד', '"מכנסיים" חלודים', 'שפם שחור בולט'],
    diff_desc: 'כנפי מגל צרות מאוד. "מכנסיים" חלודים. שפם שחור בולט.',
    quick_marks: ['כנפי מגל צרות', 'מכנסיים חלודים', 'שפם בולט'],
    family: 'falcons',
    regions: ['all'],
    seasonStatus: ['passage', 'summer'],
    seasonMonths: 'מרץ-אוק׳',
    rarity: 'uncommon',
    attrs: { giant: false, very_large: false, small: true, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: true, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: false, rusty_cap: false, rusty_trousers: false, red_trousers: true, streaked_belly: true, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: false, large_eagle: false, hobby_features: true }
  },
  sooty_falcon: {
    name: 'בז שחור',
    latin: 'Falco concolor',
    desc: 'יציב קיץ בדרום. אפור אחיד לגמרי.',
    features: ['בוגר אפור אחיד לגמרי - ייחודי', 'כנפיים ארוכות', 'דרום בלבד'],
    diff_desc: 'בוגר אפור אחיד לגמרי - ייחודי. כנפיים ארוכות. דרום בלבד.',
    quick_marks: ['אפור אחיד לגמרי', 'כנפיים ארוכות', 'דרום'],
    family: 'falcons',
    regions: ['eilat', 'arava'],
    seasonStatus: ['summer'],
    seasonMonths: 'אפר׳-אוק׳',
    rarity: 'rare',
    attrs: { giant: false, very_large: false, small: false, two_tone_wings: false, hover: false, deep_v: false, shallow_v: false, drooping: false, kinked_wing: false, light_bars: false, forked_any: false, forked: false, forked_shallow: false, diamond_tail: false, short_square: false, carpal: false, lanterns: false, white_shoulders: false, pale_head: false, white_back_patch: false, owl_head: false, dove_head: false, helmet: false, low_white_rump: false, black_shoulders: false, near_water: false, uniform_grey: true, rusty_cap: false, rusty_trousers: false, trailing_edge: false, tail_band: false, three_tail_bands: false, pointed_wings: true, spotted_back: false, beard: false, long_gape: false, ink_tip: false, white_thighs: false, pink_head: false, tail_bars_many: false, pinkish_underparts: false, accipiter: false, dark_wingtips: true, belly_bars: true, pale_eye: true, clean_rusty_back: false, large_eagle: false }
  }
};
