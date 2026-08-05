import type { DiagramType } from '@/types/diagrams';

export interface Question {
  id: string;
  text: string;
  hint: string | null;
  explanation?: string;  // הסבר קצר למשתמש - למה המאפיין הזה חשוב לזיהוי
  diagram?: DiagramType;  // תרשים עזר רלוונטי לשאלה
  signature_for?: string[];  // דורסים שהשאלה מזהה אותם במיוחד
  signature_strength?: number;  // עוצמת החתימה: 2 = ראשית, 1 = משנית (ברירת מחדל)
  signature_requires?: string;  // שאלה שחייבת להיענות 'כן' לפני שהבונוס מופעל
}

export const QUESTIONS: Question[] = [
  { id: 'giant', text: 'האם הדורס ענק - בגודל נשר ומעלה (מוטת כנפיים מעל 2.5 מ׳)?', hint: null, signature_for: ['cinereous_vulture', 'lappet_faced', 'griffon', 'lammergeier', 'white_tail'], signature_strength: 50 },
  { id: 'large_eagle', text: 'האם הדורס בגודל עיט גדול (מוטת כנפיים 185-225 ס"מ)?', hint: null, signature_for: ['golden', 'imperial', 'steppe', 'tawny'], signature_strength: 50 },
  { id: 'small', text: 'האם הדורס קטן (בגודל בז מצוי או פחות)?', hint: null, signature_for: ['sparrowhawk', 'levant_sparrowhawk', 'common_kestrel', 'lesser_kestrel', 'merlin', 'hobby'], signature_strength: 45 },
  { id: 'two_tone_wings', text: 'האם הכנפיים דו-גוניות - לבנות/בהירות מקדימה ושחורות/כהות מאחורה?', hint: null, diagram: 'two_tone_wings', signature_for: ['booted', 'osprey', 'egyptian'], signature_strength: 50 },
  { id: 'hover', text: 'האם הדורס מרפרף במקום (עומד באוויר)?', hint: null },
  { id: 'deep_v', text: 'האם בגלישה, הכנפיים מורמות בצורת V עמוק?', hint: 'wing_posture', diagram: 'wing_posture' },
  { id: 'light_bars', text: 'האם יש פסי רוחב כהים על הכנפיים (לא על הבטן)?', hint: null, diagram: 'markings' },
  { id: 'drooping', text: 'האם בגלישה, הכנפיים שמוטות כלפי מטה - קצוות נמוכים מהגוף (צורת M רפויה)?', hint: 'wing_posture', diagram: 'wing_posture', signature_for: ['greater_spotted', 'lesser_spotted', 'red_kite', 'black_kite'], signature_strength: 45 },
  { id: 'kinked_wing', text: 'האם הכנף כפופה בפרק בצורה חדה - אמה מורמת, יד מושפלת (M חד)?', hint: 'wing_posture', diagram: 'wing_posture' },
  { id: 'forked_any', text: 'האם הזנב בצורתו משולש עם שקע קל באמצע?', hint: null, diagram: 'tails' },
  { id: 'forked', text: 'האם הזנב מזלגי עמוק מאוד - שסוע בבירור, תמיד נראה כ-V?', hint: null, diagram: 'tails' },
  { id: 'forked_shallow', text: 'האם הזנב מזלגי רדוד (משולש) - צר בקצה, לפעמים נראה מרובע כשפרוס?', hint: null, diagram: 'tails' },
  { id: 'short_white_tail', text: 'האם הזנב קצר ולבן בבירור?', hint: null, diagram: 'tails' },
  { id: 'diamond_tail', text: 'האם הזנב מעויין (צורת יהלום)?', hint: null, diagram: 'tails' },
  { id: 'short_square', text: 'האם הזנב קצר מאוד ומרובע?', hint: null, diagram: 'tails' },
  { id: 'shallow_v', text: 'האם בגלישה, הכנפיים מורמות בצורת V רדוד?', hint: 'wing_posture', diagram: 'wing_posture' },
  { id: 'carpal', text: 'האם יש כתם כהה גדול בפרק הכנף (באזור "המרפק")?', hint: null, diagram: 'markings', signature_for: ['long_legged', 'common_buzzard', 'steppe_buzzard', 'rough_legged', 'snake_eagle'], signature_strength: 12 },
  { id: 'lanterns', text: 'האם יש "פנסים" - כתמים לבנים בולטים בבסיס הכנף הקדמי?', hint: null, diagram: 'lanterns' },
  { id: 'white_shoulders', text: 'האם יש כתמי לבן בולטים בכתפיים?', hint: null, diagram: 'markings' },
  { id: 'pale_head', text: 'האם הראש והעורף בהירים בולטים - חום-צהבהב - על רקע גוף כהה?', hint: null, signature_for: ['saker'], signature_strength: 75, signature_requires: 'pointed_wings' },
  { id: 'white_back_patch', text: 'האם יש כתם לבן על הגב (לעיתים בצורת מעויין)?', hint: null, diagram: null },
  { id: 'owl_head', text: 'האם הראש/סנטר כהים ("ראש קרמבו") על רקע גוף בהיר מלמטה?', hint: null, diagram: 'markings' },
  { id: 'dove_head', text: 'האם יחסית לעקב, הצוואר ארוך והראש קטן?', hint: null, signature_for: ['snake_eagle'] },
  { id: 'helmet', text: 'האם יש "קסדה" שחורה ושפם שחור?', hint: null, diagram: 'helmet_moustache', signature_for: ['peregrine', 'barbary_falcon', 'hobby', 'eleanora'], signature_strength: 90, signature_requires: 'pointed_wings' },
  { id: 'low_white_rump', text: 'האם הדורס עף נמוך מאוד עם על שת לבן בולט?', hint: null, diagram: 'rump' },
  { id: 'black_shoulders', text: 'האם ניתן לראות כתפיים שחורות בולטות?', hint: null, diagram: 'markings' },
  { id: 'near_water', text: 'האם הדורס פעיל ליד מים (ים, אגם, בריכה)?', hint: null, signature_for: ['osprey'], signature_strength: 15 },
  { id: 'low_over_marsh', text: 'האם הדורס נצפה בתעופה נמוכה מעל ביצה, קנים?', hint: null },
  { id: 'uniform_grey', text: 'האם הדורס בצבע אפור אחיד?', hint: null, signature_for: ['sooty_falcon'], signature_strength: 70, signature_requires: 'pointed_wings' },
  { id: 'rusty_cap', text: 'האם יש כיפה או עורף חלוד-כתום בולט?', hint: null, signature_for: ['barbary_falcon', 'lanner'], signature_strength: 85, signature_requires: 'pointed_wings' },
  { id: 'rusty_trousers', text: 'האם יש "מכנסיים" כהים?', hint: null, diagram: 'markings', explanation: 'עקב עיטי - מכנסיים כהים בולטים', signature_for: ['long_legged'], signature_strength: 5 },
  { id: 'trailing_edge', text: 'האם יש שפת זרימה שחורה ברורה בכנף - כמו מסגרת כהה לאורך קצה הכנף האחורי?', hint: null, diagram: 'markings' },
  { id: 'tail_band', text: 'האם יש פס כהה בולט בקצה הזנב?', hint: null, diagram: 'markings' },
  { id: 'three_tail_bands', text: 'האם יש פס שחור עבה בקצה הזנב ושני פסים דקים בבסיסו?', hint: null, diagram: 'markings', signature_for: ['snake_eagle'], signature_strength: 2 },
  // שאלות לניצים
  { id: 'accipiter', text: 'האם יש כנפיים קצרות ומעוגלות עם זנב ארוך, ותעופת נפנוף-גלישה?', hint: null, diagram: 'wing_shapes', signature_for: ['sparrowhawk', 'goshawk', 'levant_sparrowhawk'], signature_strength: 45 },
  { id: 'pointed_wings', text: 'האם הכנפיים מחודדות וצרות (כמו בז)? לא = רחבות עם אצבעות', hint: null, diagram: 'wing_shapes', signature_for: ['peregrine', 'barbary_falcon', 'hobby', 'common_kestrel', 'lesser_kestrel', 'red_footed_falcon', 'merlin', 'sooty_falcon', 'lanner', 'saker', 'eleanora'], signature_strength: 45 },
  { id: 'belly_bars', text: 'האם יש פסי רוחב דקים על הבטן (אופייני לניצים בוגרים)?', hint: null, diagram: 'markings' },
  { id: 'underwing_contrast', text: 'האם נראים קצוות כנף מחודדים ושחורים? (סוככות הכנף בהירים בניגוד בולט לקצוות)', hint: null, explanation: 'נץ קצר אצבעות: כנפיים מחודדות עם קצוות שחורים' },
  { id: 'dark_wingtips', text: 'האם קצוות הכנפיים שחורות בבירור?', hint: null, diagram: 'markings' },
  { id: 'white_supercilium', text: 'האם יש גבה לבנה בולטת מעל העין?', hint: null },
  // שאלות מבדילות לזוגות בעייתיים
  { id: 'spotted_back', text: 'האם הגב חלוד ומנוקד בכתמים שחורים?', hint: null, signature_for: ['common_kestrel', 'lesser_kestrel'], signature_strength: 100, signature_requires: 'pointed_wings' },
  { id: 'beard', text: 'האם יש "זקן" שחור מתחת למקור? (פרס - כן, רחם - לא)', hint: null },
  { id: 'white_wing_band', text: 'האם יש פס לבן לאורך הכנף (על הזרועיות)?', hint: null, diagram: 'markings' },
  { id: 'ink_tip', text: 'האם קצוות הכנף שחורות וחדות? (זרון שדות - כן, זרון תכול - לא)', hint: null },
  // שאלות מבדילות לעזניות
  { id: 'white_thighs', text: 'האם יש ירכיים ("מכנסיים") לבנות בולטות על רקע גוף כהה?', hint: null, diagram: 'markings' },
  { id: 'pink_head', text: 'האם הראש ורוד וחשוף עם קפלי עור?', hint: null },
  // שאלות מבדילות נוספות
  { id: 'tail_bars_many', text: 'האם הזנב עם הרבה פסים דקים (לא אחיד)?', hint: null, diagram: 'markings', explanation: 'עקב חורף - פסים דקים, עקב מזרחי - זנב חלוד אחיד', signature_for: ['common_buzzard'], signature_strength: 6 },
  { id: 'pale_tail', text: 'האם נראה זנב בהיר/קרמי?', hint: null, explanation: 'עקב עיטי - זנב בהיר בולט מרחוק', signature_for: ['long_legged'], signature_strength: 10 },
  { id: 'ginger_rusty', text: 'האם הדורס ג׳ינג׳י/חלודי בכללותו?', hint: null, explanation: 'עקב מזרחי בדרך כלל חלודי, עקב חורף כהה יותר', signature_for: ['steppe_buzzard'], signature_strength: 8 },
  { id: 'pinkish_underparts', text: 'האם התחתית ורדרדה?', hint: null, signature_for: ['barbary_falcon'], signature_strength: 80, signature_requires: 'pointed_wings' },
  { id: 'pale_body', text: 'האם הדורס בהיר-אפור (כמעט לבן)?', hint: null },
  { id: 'chocolate_brown', text: 'האם הדורס חום-שוקולד אחיד (לא = כהה מאוד או בהיר)?', hint: null },
  // שאלות להבדלה בין בז עצים לבז ערב
  { id: 'red_trousers', text: 'האם יש "מכנסיים" אדומים או חלודים?', hint: null, explanation: 'בז עצים ובז ערב - שניהם עם מכנסיים חלודים/אדומים' },
  { id: 'red_legs', text: 'האם הרגליים אדומות?', hint: null, explanation: 'בז ערב - רגליים אדומות בולטות', signature_for: ['red_footed_falcon'], signature_strength: 95 },
  { id: 'streaked_belly', text: 'האם יש פספוס אורך (קווים אנכיים) על הבטן?', hint: null, explanation: 'בז עצים - פספוס אורך על הבטן', signature_for: ['hobby'], signature_strength: 90 },
  // שאלה להבדלה בין בז עצים לבז נודד
  { id: 'hobby_features', text: 'האם יש שפם דק + לחי לבנה, ו/או מכנסיים חלודים?', hint: null, explanation: 'בז עצים - שפם דק, לחי לבנה, מכנסיים חלודים. בז נודד - שפם עבה ובולט, ללא מכנסיים חלודים', signature_for: ['hobby'], signature_strength: 50, signature_requires: 'helmet' },
  { id: 'dark_underwing_coverts', text: 'האם סוככות תת-הכנף כהות (מקדימה)?', hint: null, explanation: 'בז חופים - סוככות תת-כנף כהות הן הסימן הכי בולט', signature_for: ['eleanora'], signature_strength: 95, signature_requires: 'helmet' },
  // שאלת התנהגות להבחנה בין בז מצוי לבז אדום
  { id: 'flocking', text: 'האם הדורס נמצא בלהקה או לבד?', hint: null, explanation: 'בז אדום תמיד בלהקות, בז מצוי בודד. נקבות דומות מאוד - התנהגות להקתית היא ההבחנה הקלה ביותר!', signature_for: ['lesser_kestrel'], signature_strength: 95, signature_requires: 'hover' }
];
