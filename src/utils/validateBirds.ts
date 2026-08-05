import { BIRDS } from '@/data/birds';

export interface ValidationResult {
  isValid: boolean;
  duplicatePairs: Array<{ bird1: string; bird2: string; sharedAttrs: string[] }>;
  uniqueBirds: string[];
  problematicBirds: string[];
}

/**
 * בודק אם כל הציפורים ניתנות לזיהוי ייחודי
 * מחזיר רשימת זוגות עם תכונות זהות
 */
export function validateBirdIdentification(): ValidationResult {
  const birdKeys = Object.keys(BIRDS);
  const duplicatePairs: ValidationResult['duplicatePairs'] = [];
  const problematicBirds = new Set<string>();

  // בדיקת כל זוג אפשרי
  for (let i = 0; i < birdKeys.length; i++) {
    for (let j = i + 1; j < birdKeys.length; j++) {
      const bird1Key = birdKeys[i];
      const bird2Key = birdKeys[j];
      const bird1 = BIRDS[bird1Key];
      const bird2 = BIRDS[bird2Key];

      // בדיקה אם התכונות זהות
      const attrs1 = bird1.attrs;
      const attrs2 = bird2.attrs;
      
      let identical = true;
      const sharedAttrs: string[] = [];

      for (const key of Object.keys(attrs1)) {
        // השווה רק תכונות שאינן null בשתי הציפורים
        if (attrs1[key] !== null && attrs2[key] !== null) {
          if (attrs1[key] !== attrs2[key]) {
            identical = false;
            break;
          }
          if (attrs1[key] === true) {
            sharedAttrs.push(key);
          }
        }
      }

      // אם כל התכונות הלא-null זהות, זה בעייתי
      if (identical) {
        duplicatePairs.push({
          bird1: `${bird1.name} (${bird1Key})`,
          bird2: `${bird2.name} (${bird2Key})`,
          sharedAttrs
        });
        problematicBirds.add(bird1Key);
        problematicBirds.add(bird2Key);
      }
    }
  }

  const uniqueBirds = birdKeys.filter(k => !problematicBirds.has(k));

  return {
    isValid: duplicatePairs.length === 0,
    duplicatePairs,
    uniqueBirds,
    problematicBirds: Array.from(problematicBirds)
  };
}

/**
 * מדפיס דוח מפורט על מצב הזיהוי
 */
export function printValidationReport(): void {
  const result = validateBirdIdentification();
  
  console.log('=== דוח בדיקת זיהוי דורסים ===\n');
  console.log(`סה"כ מינים: ${Object.keys(BIRDS).length}`);
  console.log(`מינים ייחודיים: ${result.uniqueBirds.length}`);
  console.log(`זוגות בעייתיים: ${result.duplicatePairs.length}\n`);

  if (result.isValid) {
    console.log('✅ כל הציפורים ניתנות לזיהוי ייחודי!');
  } else {
    console.log('❌ נמצאו זוגות בלתי ניתנים להבחנה:\n');
    result.duplicatePairs.forEach(pair => {
      console.log(`  • ${pair.bird1} ↔ ${pair.bird2}`);
      console.log(`    תכונות משותפות (true): ${pair.sharedAttrs.join(', ') || 'אין'}`);
    });
  }
}

/**
 * מציג את כל התכונות המבדילות של ציפור מסוימת
 */
export function getBirdDistinguishingFeatures(birdKey: string): { trueAttrs: string[]; falseAttrs: string[] } {
  const bird = BIRDS[birdKey];
  if (!bird) return { trueAttrs: [], falseAttrs: [] };

  const trueAttrs: string[] = [];
  const falseAttrs: string[] = [];

  for (const [key, value] of Object.entries(bird.attrs)) {
    if (value === true) trueAttrs.push(key);
    if (value === false) falseAttrs.push(key);
  }

  return { trueAttrs, falseAttrs };
}

/**
 * מוצא את התכונה הכי מבדילה לקבוצת ציפורים
 */
export function findBestDistinguishingQuestion(candidates: string[]): string | null {
  if (candidates.length <= 1) return null;

  const allAttrs = Object.keys(BIRDS[candidates[0]].attrs);
  let bestAttr: string | null = null;
  let bestScore = -1;

  for (const attr of allAttrs) {
    const yesCount = candidates.filter(c => BIRDS[c].attrs[attr] === true).length;
    const noCount = candidates.filter(c => BIRDS[c].attrs[attr] === false).length;

    // אם כולם אותו דבר, לא מבדיל
    if (yesCount === 0 || noCount === 0) continue;

    // ציון = מינימום בין כן ולא (איזון מקסימלי)
    const score = Math.min(yesCount, noCount);
    if (score > bestScore) {
      bestScore = score;
      bestAttr = attr;
    }
  }

  return bestAttr;
}
