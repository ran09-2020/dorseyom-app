-- תיקון תגים: הוספת red_trousers ותיקון white_rump ל-low_white_rump

-- 1. הוספת תג "מכנסיים אדומים" (red_trousers) - נפרד מ-rusty_trousers
INSERT INTO public.tags (category_id, label, attr, attr_value, has_custom_list, sort_order)
SELECT 
  (SELECT id FROM public.tag_categories WHERE name = 'סימנים בולטים'),
  'מכנסיים אדומים',
  'red_trousers',
  true,
  true,
  8
WHERE NOT EXISTS (SELECT 1 FROM public.tags WHERE attr = 'red_trousers');

-- 2. הוספת רשימת הדורסים עם מכנסיים אדומים
INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
SELECT t.id, bird_id, note, sort_order
FROM public.tags t, (VALUES
  ('hobby', 'מכנסיים חלודים', 0),
  ('red_footed_falcon', 'מכנסיים ורגליים אדומות (זכר)', 1)
) AS birds(bird_id, note, sort_order)
WHERE t.attr = 'red_trousers'
AND NOT EXISTS (
  SELECT 1 FROM public.tag_birds tb 
  WHERE tb.tag_id = t.id AND tb.bird_id = birds.bird_id
);

-- 3. עדכון תג "על-שת לבן" להשתמש ב-low_white_rump במקום white_rump
UPDATE public.tags 
SET attr = 'low_white_rump'
WHERE attr = 'white_rump';
