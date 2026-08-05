-- הוספת תגית "כנפיים רחבות ומעוגלות" לקטגוריית צורת כנפיים
INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
SELECT 
  gen_random_uuid(),
  tc.id,
  'כנפיים רחבות ומעוגלות',
  'accipiter',
  true,
  false,
  3
FROM public.tag_categories tc
WHERE tc.name = 'צורת כנפיים';