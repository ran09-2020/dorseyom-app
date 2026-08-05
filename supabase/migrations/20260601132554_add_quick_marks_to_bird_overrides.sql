-- הוספת עמודת quick_marks לטבלת bird_overrides
ALTER TABLE public.bird_overrides 
ADD COLUMN quick_marks JSONB DEFAULT NULL;