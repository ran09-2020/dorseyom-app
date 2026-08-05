import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { QUESTIONS, Question } from '@/data/questions';
import { BIRDS } from '@/data/birds';

export interface QuestionWithOverrides extends Question {
  isOverridden?: boolean;
  isDisabled?: boolean;
}

export interface QuestionStats {
  questionId: string;
  yesCount: number;
  noCount: number;
  nullCount: number;
  yesBirds: string[];
  noBirds: string[];
}

// חישוב סטטיסטיקות לכל שאלה - כמה דורסים עונים כן/לא
export function calculateQuestionStats(): QuestionStats[] {
  return QUESTIONS.map(q => {
    const yesBirds: string[] = [];
    const noBirds: string[] = [];
    let nullCount = 0;

    Object.entries(BIRDS).forEach(([birdId, bird]) => {
      const attrValue = bird.attrs[q.id];
      if (attrValue === true) {
        yesBirds.push(birdId);
      } else if (attrValue === false) {
        noBirds.push(birdId);
      } else {
        nullCount++;
      }
    });

    return {
      questionId: q.id,
      yesCount: yesBirds.length,
      noCount: noBirds.length,
      nullCount,
      yesBirds,
      noBirds
    };
  });
}

// בדיקת "בריאות" שאלה - האם היא שימושית
export interface QuestionHealth {
  isHealthy: boolean;
  warnings: string[];
}

export function checkQuestionHealth(stats: QuestionStats): QuestionHealth {
  const warnings: string[] = [];

  if (stats.yesCount === 0) {
    warnings.push('אף דורס לא עונה "כן" - השאלה לא תעזור לזהות');
  }
  if (stats.noCount === 0) {
    warnings.push('אף דורס לא עונה "לא" - השאלה לא תעזור לסנן');
  }
  if (stats.yesCount === 1) {
    warnings.push('רק דורס אחד עונה "כן" - שאלה מאוד ספציפית');
  }
  if (stats.yesCount > 35) {
    warnings.push('רוב הדורסים עונים "כן" - שאלה לא מפלה מספיק');
  }

  return {
    isHealthy: warnings.length === 0,
    warnings
  };
}

export function useQuestionsWithOverrides() {
  const [questions, setQuestions] = useState<QuestionWithOverrides[]>(QUESTIONS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchOverrides() {
      if (!supabase) {
        setLoading(false);
        return;
      }

      try {
        const { data: overrides } = await supabase
          .from('question_overrides')
          .select('*');

        if (overrides && overrides.length > 0) {
          const mergedQuestions = QUESTIONS.map(q => {
            const override = overrides.find(o => o.question_id === q.id);
            if (override) {
              return {
                ...q,
                text: override.text || q.text,
                hint: override.hint !== undefined ? override.hint : q.hint,
                explanation: override.explanation || q.explanation,
                isOverridden: true,
                isDisabled: override.is_disabled || false
              };
            }
            return { ...q, isOverridden: false, isDisabled: false };
          });

          setQuestions(mergedQuestions);
        }
      } catch (error) {
        console.error('Error fetching question overrides:', error);
      }

      setLoading(false);
    }

    fetchOverrides();
  }, []);

  return { questions, loading };
}
