
-- טבלה לשמירת עריכות של דורסים (דריסות על הנתונים הסטטיים)
CREATE TABLE public.bird_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bird_id TEXT NOT NULL UNIQUE, -- מזהה הציפור (מפתח ב-BIRDS)
  name TEXT, -- שם מעודכן (null = השתמש בברירת המחדל)
  features JSONB, -- מערך קריטריונים מעודכן (null = השתמש בברירת המחדל)
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_by TEXT -- מייל המעדכן
);

-- אינדקס לחיפוש מהיר לפי מזהה ציפור
CREATE INDEX idx_bird_overrides_bird_id ON public.bird_overrides(bird_id);

-- RLS - רק למנהל
ALTER TABLE public.bird_overrides ENABLE ROW LEVEL SECURITY;

-- מדיניות קריאה - כולם יכולים לקרוא (הנתונים ציבוריים)
CREATE POLICY "Anyone can read bird overrides"
  ON public.bird_overrides
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- מדיניות כתיבה - רק משתמשים מחוברים (הבדיקה אם מנהל תהיה בקוד)
CREATE POLICY "Authenticated users can insert bird overrides"
  ON public.bird_overrides
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update bird overrides"
  ON public.bird_overrides
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete bird overrides"
  ON public.bird_overrides
  FOR DELETE
  TO authenticated
  USING (true);

-- טריגר לעדכון updated_at
CREATE OR REPLACE FUNCTION public.update_bird_overrides_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_bird_overrides_updated_at 
  BEFORE UPDATE ON public.bird_overrides
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bird_overrides_updated_at();
