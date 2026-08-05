// נתוני מוטת כנפיים לכל הדורסים

export const WINGSPANS: Record<string, string> = {
  // ענק (240-285 ס"מ)
  cinereous_vulture: '285 ס"מ',
  lappet_faced: '280 ס"מ',
  lammergeier: '275 ס"מ',
  griffon: '265 ס"מ',
  white_tail: '240 ס"מ',

  // גדול מאוד (185-225 ס"מ)
  golden: '225 ס"מ',
  imperial: '205 ס"מ',
  steppe: '190 ס"מ',
  tawny: '185 ס"מ',

  // גדול (177-178 ס"מ)
  short_toed: '178 ס"מ',
  greater_spotted: '177 ס"מ',

  // בינוני-גדול (165-170 ס"מ)
  egyptian: '170 ס"מ',
  lesser_spotted: '168 ס"מ',
  osprey: '167 ס"מ',
  bonelli: '165 ס"מ',
  red_kite: '165 ס"מ',

  // בינוני (85-155 ס"מ)
  black_kite: '155 ס"מ',
  long_legged: '135-150 ס"מ',
  common_buzzard: '135-150 ס"מ',
  steppe_buzzard: '135-150 ס"מ',
  rough_legged: '135-150 ס"מ',
  snake_eagle: '135-150 ס"מ',
  marsh_harrier: '115-140 ס"מ',
  booted: '135 ס"מ',
  goshawk: '93-127 ס"מ',
  saker: '105-129 ס"מ',
  hen_harrier: '97-118 ס"מ',
  pallid_harrier: '97-118 ס"מ',
  montagu_harrier: '96-116 ס"מ',
  peregrine: '89-113 ס"מ',
  lanner: '95-105 ס"מ',
  eleanora: '87-104 ס"מ',
  barbary_falcon: '76-98 ס"מ',
  sooty_falcon: '78-90 ס"מ',
  black_shouldered: '85 ס"מ',

  // קטן (פחות מ-85 ס"מ)
  hobby: '70-84 ס"מ',
  sparrowhawk: '58-80 ס"מ',
  common_kestrel: '68-78 ס"מ',
  levant_sparrowhawk: '63-76 ס"מ',
  red_footed_falcon: '65-76 ס"מ',
  lesser_kestrel: '63-72 ס"מ',
  merlin: '55-69 ס"מ',
};

// פונקציה לקבלת מוטת כנפיים לפי מזהה דורס
export function getWingspan(birdId: string): string | null {
  return WINGSPANS[birdId] || null;
}
