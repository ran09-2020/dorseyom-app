import { Bird } from '@/data/birds';

export interface SimilarityWarning {
  birds: string[];
  birdNames: string[];
  family: string;
  keyDifferences: string[];
}

export interface DetailedComparison {
  birdIds: string[];
  birdNames: string[];
  commonFeatures: string[];
  distinguishingFeatures: { name: string; feature: string }[];
}

export interface PreQuestionWarning {
  pairIds: string[];
  pairNames: string[];
  title: string;
  message: string;
  behaviorQuestion: string;
  behaviorQuestionId: string;
  yesAnswer: { label: string; resultBirdId: string };
  noAnswer: { label: string };
}

/**
 * זוגות דומים שצריך להציג אזהרה לפני שאלה שמפרידה ביניהם
 */
const SEPARATING_QUESTIONS: Record<string, { pair: string[]; warning: PreQuestionWarning }> = {
  'spotted_back': {
    pair: ['common_kestrel', 'lesser_kestrel'],
    warning: {
      pairIds: ['common_kestrel', 'lesser_kestrel'],
      pairNames: ['בז מצוי', 'בז אדום'],
      title: '⚠️ טיפ חשוב!',
      message: 'בז מצוי ובז אדום דומים מאוד.\nנקבות כמעט זהות - קשות להבחנה!\n\n🔑 ההבחנה הקלה ביותר - התנהגות:',
      behaviorQuestion: 'האם הבז מעופף או מקנן בקבוצות/במושבות?',
      behaviorQuestionId: 'flocking',
      yesAnswer: { label: '✅ כן - בז אדום', resultBirdId: 'lesser_kestrel' },
      noAnswer: { label: '✖ לא / לא בטוח → המשך לשאלת הגב' }
    }
  }
};

/**
 * בודק אם השאלה הבאה תפריד בין זוג דומה ידוע
 */
export function getPreQuestionWarning(questionId: string, candidates: string[]): PreQuestionWarning | null {
  const config = SEPARATING_QUESTIONS[questionId];
  if (!config) return null;
  
  // בדוק אם שני הדורסים מהזוג נמצאים במועמדים
  const bothInCandidates = config.pair.every(id => candidates.includes(id));
  if (!bothInCandidates) return null;
  
  return config.warning;
}

/**
 * קבוצות ידועות של דורסים דומים עם סימנים משותפים ומבדילים
 */
export const KNOWN_SIMILAR_GROUPS: Record<string, DetailedComparison> = {
  // === 4 עקבים ===
  'common_buzzard+long_legged+rough_legged+steppe_buzzard': {
    birdIds: ['common_buzzard', 'long_legged', 'rough_legged', 'steppe_buzzard'],
    birdNames: ['עקב חורף', 'עקב עיטי', 'עקב מכנסיים', 'עקב מזרחי'],
    commonFeatures: [
      'כתם כהה בפרק הכנף',
      'חלונות בהירים בכנף',
      'שפת זרימה שחורה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב עיטי', feature: 'זנב בהיר מלמעלה, מכנסיים כהים, הגדול ביותר' },
      { name: 'עקב חורף', feature: 'זנב עם הרבה פסים דקים' },
      { name: 'עקב מזרחי', feature: 'זנב חלודי מפוספס' },
      { name: 'עקב מכנסיים', feature: 'זנב לבן עם פס שחור רחב בקצה' }
    ]
  },
  // === 3 עקבים ===
  'common_buzzard+long_legged+steppe_buzzard': {
    birdIds: ['common_buzzard', 'long_legged', 'steppe_buzzard'],
    birdNames: ['עקב חורף', 'עקב עיטי', 'עקב מזרחי'],
    commonFeatures: [
      'V רדוד בגלישה',
      'כתם כהה בפרק הכנף',
      'שפת זרימה כהה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב עיטי', feature: 'זנב בהיר מלמעלה, מכנסיים כהים, הגדול בין השלושה' },
      { name: 'עקב חורף', feature: 'זנב עם הרבה פסים דקים' },
      { name: 'עקב מזרחי', feature: 'זנב חלודי מפוספס' }
    ]
  },
  'common_buzzard+long_legged+rough_legged': {
    birdIds: ['common_buzzard', 'long_legged', 'rough_legged'],
    birdNames: ['עקב חורף', 'עקב עיטי', 'עקב מכנסיים'],
    commonFeatures: [
      'כתם כהה בפרק הכנף',
      'חלונות בהירים בכנף',
      'שפת זרימה שחורה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב עיטי', feature: 'זנב בהיר מלמעלה, מכנסיים כהים, הגדול ביותר' },
      { name: 'עקב חורף', feature: 'זנב עם הרבה פסים דקים' },
      { name: 'עקב מכנסיים', feature: 'זנב לבן עם פס שחור רחב בקצה' }
    ]
  },
  'common_buzzard+rough_legged+steppe_buzzard': {
    birdIds: ['common_buzzard', 'rough_legged', 'steppe_buzzard'],
    birdNames: ['עקב חורף', 'עקב מכנסיים', 'עקב מזרחי'],
    commonFeatures: [
      'כתם כהה בפרק הכנף',
      'חלונות בהירים בכנף',
      'שפת זרימה שחורה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב חורף', feature: 'זנב עם הרבה פסים דקים' },
      { name: 'עקב מכנסיים', feature: 'זנב לבן עם פס שחור רחב בקצה' },
      { name: 'עקב מזרחי', feature: 'זנב חלודי מפוספס' }
    ]
  },
  'long_legged+rough_legged+steppe_buzzard': {
    birdIds: ['long_legged', 'rough_legged', 'steppe_buzzard'],
    birdNames: ['עקב עיטי', 'עקב מכנסיים', 'עקב מזרחי'],
    commonFeatures: [
      'כתם כהה בפרק הכנף',
      'חלונות בהירים בכנף',
      'שפת זרימה שחורה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב עיטי', feature: 'זנב בהיר מלמעלה, מכנסיים כהים, הגדול ביותר' },
      { name: 'עקב מכנסיים', feature: 'זנב לבן עם פס שחור רחב בקצה' },
      { name: 'עקב מזרחי', feature: 'זנב חלודי מפוספס' }
    ]
  },
  'common_buzzard+long_legged': {
    birdIds: ['common_buzzard', 'long_legged'],
    birdNames: ['עקב חורף', 'עקב עיטי'],
    commonFeatures: [
      'V רדוד בגלישה',
      'כתם כהה בפרק הכנף',
      'שפת זרימה כהה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב עיטי', feature: 'זנב בהיר מלמעלה, מכנסיים כהים, גדול יותר' },
      { name: 'עקב חורף', feature: 'זנב עם הרבה פסים דקים, קטן יותר' }
    ]
  },
  'common_buzzard+steppe_buzzard': {
    birdIds: ['common_buzzard', 'steppe_buzzard'],
    birdNames: ['עקב חורף', 'עקב מזרחי'],
    commonFeatures: [
      'V רדוד בגלישה',
      'כתם כהה בפרק הכנף',
      'סהר בהיר על החזה',
      'שפת זרימה כהה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב חורף', feature: 'זנב עם הרבה פסים דקים' },
      { name: 'עקב מזרחי', feature: 'זנב חלודי מפוספס' }
    ]
  },
  'long_legged+steppe_buzzard': {
    birdIds: ['long_legged', 'steppe_buzzard'],
    birdNames: ['עקב עיטי', 'עקב מזרחי'],
    commonFeatures: [
      'V רדוד בגלישה',
      'כתם כהה בפרק הכנף',
      'שפת זרימה כהה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב עיטי', feature: 'זנב בהיר מלמעלה, מכנסיים כהים, גדול יותר' },
      { name: 'עקב מזרחי', feature: 'זנב חלוד אחיד, קטן יותר' }
    ]
  },
  // === זוגות עם עקב מכנסיים ===
  'common_buzzard+rough_legged': {
    birdIds: ['common_buzzard', 'rough_legged'],
    birdNames: ['עקב חורף', 'עקב מכנסיים'],
    commonFeatures: [
      'כתם כהה בפרק הכנף',
      'חלונות בהירים בכנף',
      'שפת זרימה שחורה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב חורף', feature: 'זנב עם הרבה פסים דקים' },
      { name: 'עקב מכנסיים', feature: 'זנב לבן עם פס שחור רחב בקצה, מרחף הרבה' }
    ]
  },
  'long_legged+rough_legged': {
    birdIds: ['long_legged', 'rough_legged'],
    birdNames: ['עקב עיטי', 'עקב מכנסיים'],
    commonFeatures: [
      'כתם כהה בפרק הכנף',
      'חלונות בהירים בכנף',
      'שפת זרימה שחורה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב עיטי', feature: 'זנב בהיר מלמעלה, מכנסיים כהים, גדול יותר' },
      { name: 'עקב מכנסיים', feature: 'זנב לבן עם פס שחור רחב בקצה, מרחף הרבה' }
    ]
  },
  'rough_legged+steppe_buzzard': {
    birdIds: ['rough_legged', 'steppe_buzzard'],
    birdNames: ['עקב מכנסיים', 'עקב מזרחי'],
    commonFeatures: [
      'כתם כהה בפרק הכנף',
      'חלונות בהירים בכנף',
      'שפת זרימה שחורה ("מסגרת")'
    ],
    distinguishingFeatures: [
      { name: 'עקב מכנסיים', feature: 'זנב לבן עם פס שחור רחב בקצה, מרחף הרבה' },
      { name: 'עקב מזרחי', feature: 'זנב חלודי מפוספס' }
    ]
  },
  // === בזים קטנים מרחפים ===
  'common_kestrel+lesser_kestrel': {
    birdIds: ['common_kestrel', 'lesser_kestrel'],
    birdNames: ['בז מצוי', 'בז אדום'],
    commonFeatures: [
      'קטן ומרחף',
      'נקבות כמעט זהות - קשות מאוד להבחנה!'
    ],
    distinguishingFeatures: [
      { name: 'בז אדום', feature: 'תמיד בלהקות! זכר עם גב חלוד נקי' },
      { name: 'בז מצוי', feature: 'בודד! זכר עם גב מנוקד בשחור' }
    ]
  }
};

/**
 * בודק אם יש קבוצה ידועה של דורסים דומים
 */
export function getDetailedComparison(candidates: string[]): DetailedComparison | null {
  if (candidates.length < 2 || candidates.length > 4) return null;
  
  const sorted = [...candidates].sort();
  const key = sorted.join('+');
  
  return KNOWN_SIMILAR_GROUPS[key] || null;
}

/**
 * מחפש קבוצה ידועה של דורסים דומים בתוך רשימת מועמדים גדולה יותר
 * מחזיר את הקבוצה הגדולה ביותר שנמצאה (מעדיף 3 על 2)
 */
export function findKnownGroupInCandidates(candidates: string[]): DetailedComparison | null {
  if (candidates.length <= 4) return null; // לא צריך קיצור דרך אם יש 4 או פחות
  
  // מחפש קודם קבוצות של 4
  for (const [key, group] of Object.entries(KNOWN_SIMILAR_GROUPS)) {
    if (group.birdIds.length === 4) {
      const allInCandidates = group.birdIds.every(id => candidates.includes(id));
      if (allInCandidates) {
        return group;
      }
    }
  }
  
  // אם לא נמצאה קבוצה של 4, מחפש קבוצות של 3
  for (const [key, group] of Object.entries(KNOWN_SIMILAR_GROUPS)) {
    if (group.birdIds.length === 3) {
      const allInCandidates = group.birdIds.every(id => candidates.includes(id));
      if (allInCandidates) {
        return group;
      }
    }
  }
  
  // אם לא נמצאה קבוצה של 3, מחפש קבוצות של 2
  for (const [key, group] of Object.entries(KNOWN_SIMILAR_GROUPS)) {
    if (group.birdIds.length === 2) {
      const allInCandidates = group.birdIds.every(id => candidates.includes(id));
      if (allInCandidates) {
        return group;
      }
    }
  }
  
  return null;
}

/**
 * בודק אם יש דורסים דומים ומחזיר אזהרה עם ההבדלים העיקריים
 */
export function getSimilarityWarning(
  candidates: string[],
  birdsData: Record<string, Bird>
): SimilarityWarning | null {
  // רק אם יש 2-3 מועמדים
  if (candidates.length < 2 || candidates.length > 3) {
    return null;
  }

  // בדיקה אם כולם מאותה משפחה
  const families = candidates.map(id => birdsData[id]?.family).filter(Boolean);
  const uniqueFamilies = [...new Set(families)];
  
  // אם לא כולם מאותה משפחה, אין צורך באזהרה
  if (uniqueFamilies.length !== 1) {
    return null;
  }

  const family = uniqueFamilies[0];
  const birdNames = candidates.map(id => birdsData[id]?.name || id);
  
  // חילוץ ההבדלים העיקריים מ-diff_desc
  const keyDifferences: string[] = [];
  
  candidates.forEach(id => {
    const bird = birdsData[id];
    if (bird?.diff_desc) {
      // לוקחים את המשפט הראשון או עד הנקודה הראשונה
      const firstSentence = bird.diff_desc.split('.')[0].trim();
      if (firstSentence) {
        keyDifferences.push(`**${bird.name}**: ${firstSentence}`);
      }
    }
  });

  // אם אין הבדלים מתועדים, אין צורך באזהרה
  if (keyDifferences.length < 2) {
    return null;
  }

  return {
    birds: candidates,
    birdNames,
    family,
    keyDifferences
  };
}

/**
 * זוגות דורסים ידועים כקשים להבחנה עם ההבדל העיקרי ביניהם
 */
export const KNOWN_SIMILAR_PAIRS: Record<string, { pair: [string, string]; hint: string }> = {
  'steppe_eagle+spotted_eagle': {
    pair: ['steppe_eagle', 'spotted_eagle'],
    hint: 'עיט ערבות: שפה צהובה ארוכה שעוברת מעבר לעין. עיט חורש: שפה קצרה.'
  },
  'common_buzzard+steppe_buzzard': {
    pair: ['common_buzzard', 'steppe_buzzard'],
    hint: 'עקב חורף: זנב מפוספס בהרבה פסים. עקב מזרחי: זנב חלוד אחיד.'
  },
  'hen_harrier+pallid_harrier': {
    pair: ['hen_harrier', 'pallid_harrier'],
    hint: 'זרון תכול: קצות כנף שחורות רחבות. זרון שדות: קצות כנף שחורות צרות וחדות.'
  },
  'bearded_vulture+egyptian_vulture': {
    pair: ['bearded_vulture', 'egyptian_vulture'],
    hint: 'פרס: "זקן" שחור מתחת למקור, גוף כתום. רחם: אין זקן, פנים צהובות חשופות.'
  },
  'common_kestrel+lesser_kestrel': {
    pair: ['common_kestrel', 'lesser_kestrel'],
    hint: '⚠️ נקבות דומות מאוד וקשות להבחנה!\n\n🔑 ההבחנה הקלה ביותר - התנהגות:\n• בז אדום - תמיד בלהקות\n• בז מצוי - בודד\n\n👁️ הבחנה לפי מראה (זכרים בלבד):\n• בז מצוי: גב מנוקד בשחור\n• בז אדום: גב חלוד נקי'
  }
};

/**
 * בודק אם יש זוג ידוע של דורסים דומים
 */
export function getKnownPairHint(candidates: string[]): string | null {
  if (candidates.length !== 2) return null;
  
  const sorted = [...candidates].sort();
  const key = sorted.join('+');
  
  return KNOWN_SIMILAR_PAIRS[key]?.hint || null;
}
