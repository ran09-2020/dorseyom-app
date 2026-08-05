-- טבלת קטגוריות תיוגים
CREATE TABLE public.tag_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- טבלת תגים
CREATE TABLE public.tags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES public.tag_categories(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  attr TEXT NOT NULL,
  attr_value BOOLEAN NOT NULL DEFAULT true,
  has_custom_list BOOLEAN NOT NULL DEFAULT false,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- טבלת רשימות דורסים מותאמות לתגים
CREATE TABLE public.tag_birds (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tag_id UUID NOT NULL REFERENCES public.tags(id) ON DELETE CASCADE,
  bird_id TEXT NOT NULL,
  note TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- אינדקסים
CREATE INDEX idx_tags_category_id ON public.tags(category_id);
CREATE INDEX idx_tags_sort_order ON public.tags(sort_order);
CREATE INDEX idx_tag_birds_tag_id ON public.tag_birds(tag_id);
CREATE INDEX idx_tag_birds_sort_order ON public.tag_birds(sort_order);
CREATE INDEX idx_tag_categories_sort_order ON public.tag_categories(sort_order);

-- טריגר לעדכון updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_tag_categories_updated_at BEFORE UPDATE
  ON public.tag_categories FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tags_updated_at BEFORE UPDATE
  ON public.tags FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_tag_birds_updated_at BEFORE UPDATE
  ON public.tag_birds FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- RLS
ALTER TABLE public.tag_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tag_birds ENABLE ROW LEVEL SECURITY;

-- מדיניות קריאה לכולם
CREATE POLICY "Allow public read access on tag_categories"
  ON public.tag_categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access on tags"
  ON public.tags FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Allow public read access on tag_birds"
  ON public.tag_birds FOR SELECT
  TO anon, authenticated
  USING (true);

-- מדיניות כתיבה למשתמשים מאומתים
CREATE POLICY "Allow authenticated insert on tag_categories"
  ON public.tag_categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on tag_categories"
  ON public.tag_categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on tag_categories"
  ON public.tag_categories FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on tags"
  ON public.tags FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on tags"
  ON public.tags FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on tags"
  ON public.tags FOR DELETE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated insert on tag_birds"
  ON public.tag_birds FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update on tag_birds"
  ON public.tag_birds FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on tag_birds"
  ON public.tag_birds FOR DELETE
  TO authenticated
  USING (true);