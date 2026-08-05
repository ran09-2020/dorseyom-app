-- הוספת הרשאת קריאה פתוחה לטבלאות התוכן

-- bird_overrides - הרשאת קריאה לכולם
CREATE POLICY "Allow public read access on bird_overrides"
ON public.bird_overrides
FOR SELECT
TO anon, authenticated
USING (true);

-- question_overrides - הרשאת קריאה לכולם
CREATE POLICY "Allow public read access on question_overrides"
ON public.question_overrides
FOR SELECT
TO anon, authenticated
USING (true);

-- photos - הרשאת קריאה לכולם
CREATE POLICY "Allow public read access on photos"
ON public.photos
FOR SELECT
TO anon, authenticated
USING (true);