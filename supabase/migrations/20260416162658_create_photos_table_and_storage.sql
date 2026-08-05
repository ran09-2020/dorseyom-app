-- טבלת צילומים
CREATE TABLE public.photos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  bird_id TEXT NOT NULL,
  family TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  photographer TEXT DEFAULT 'רענן ארבל',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- אינדקסים לחיפוש מהיר
CREATE INDEX idx_photos_bird_id ON public.photos(bird_id);
CREATE INDEX idx_photos_family ON public.photos(family);

-- הפעלת RLS
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- כולם יכולים לצפות בצילומים (גלריה ציבורית)
CREATE POLICY "Anyone can view photos"
  ON public.photos
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- רק המנהל יכול להוסיף צילומים
CREATE POLICY "Admin can insert photos"
  ON public.photos
  FOR INSERT
  TO authenticated
  WITH CHECK ((select auth.jwt() ->> 'email') = 'raanan.arbel@gmail.com');

-- רק המנהל יכול לעדכן צילומים
CREATE POLICY "Admin can update photos"
  ON public.photos
  FOR UPDATE
  TO authenticated
  USING ((select auth.jwt() ->> 'email') = 'raanan.arbel@gmail.com')
  WITH CHECK ((select auth.jwt() ->> 'email') = 'raanan.arbel@gmail.com');

-- רק המנהל יכול למחוק צילומים
CREATE POLICY "Admin can delete photos"
  ON public.photos
  FOR DELETE
  TO authenticated
  USING ((select auth.jwt() ->> 'email') = 'raanan.arbel@gmail.com');

-- יצירת באקט לאחסון צילומים (ציבורי לצפייה)
INSERT INTO storage.buckets (id, name, public)
VALUES ('photos', 'photos', true);

-- כולם יכולים לצפות בצילומים
CREATE POLICY "Anyone can view photo files"
  ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'photos');

-- רק המנהל יכול להעלות צילומים
CREATE POLICY "Admin can upload photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'photos' AND
    (select auth.jwt() ->> 'email') = 'raanan.arbel@gmail.com'
  );

-- רק המנהל יכול למחוק צילומים
CREATE POLICY "Admin can delete photo files"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'photos' AND
    (select auth.jwt() ->> 'email') = 'raanan.arbel@gmail.com'
  );