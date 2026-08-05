
-- הוספת עמודת תיאור לטבלת עריכות דורסים
ALTER TABLE public.bird_overrides ADD COLUMN IF NOT EXISTS description TEXT;
