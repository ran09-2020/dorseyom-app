
-- טבלה לשמירת עריכות של שאלות
CREATE TABLE public.question_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question_id TEXT NOT NULL UNIQUE, -- מזהה השאלה (id ב-QUESTIONS)
  text TEXT, -- ניסוח מעודכן (null = השתמש בברירת המחדל)
  hint TEXT, -- רמז מעודכן
  is_disabled BOOLEAN DEFAULT false, -- האם השאלה מושבתת
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by TEXT
);

-- אינדקס לחיפוש מהיר
CREATE INDEX idx_question_overrides_question_id ON public.question_overrides(question_id);

-- RLS
ALTER TABLE public.question_overrides ENABLE ROW LEVEL SECURITY;

-- מדיניות קריאה - כולם יכולים לקרוא
CREATE POLICY "Anyone can read question overrides"
  ON public.question_overrides
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- מדיניות כתיבה - רק משתמשים מחוברים
CREATE POLICY "Authenticated users can insert question overrides"
  ON public.question_overrides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update question overrides"
  ON public.question_overrides
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete question overrides"
  ON public.question_overrides
  FOR DELETE
  TO authenticated
  USING (true);

-- טריגר לעדכון updated_at
CREATE TRIGGER update_question_overrides_updated_at 
  BEFORE UPDATE ON public.question_overrides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bird_overrides_updated_at();
