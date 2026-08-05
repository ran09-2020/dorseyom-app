-- תיקון ושיפור מערכת התגיות
-- 1. מחיקת תגיות שלא עובדות
-- 2. תיקון שמות attr
-- 3. הוספת תגיות חדשות ושימושיות
-- 4. עדכון סדר קטגוריות

-- === שלב 1: מחיקת תגיות שלא עובדות ===

-- מחיקת tag_birds קודם (FK constraint)
DELETE FROM public.tag_birds 
WHERE tag_id IN (
  SELECT id FROM public.tags 
  WHERE attr IN ('belly_streaks', 'chest_band')
);

-- מחיקת התגיות עצמן
DELETE FROM public.tags 
WHERE attr IN ('belly_streaks', 'chest_band');

-- === שלב 2: תיקון attr של על-שת לבן ===
UPDATE public.tags 
SET attr = 'low_white_rump'
WHERE attr = 'white_rump';

-- === שלב 3: הוספת תגיות חדשות ===

-- קבלת ID של קטגוריית סימנים בולטים
WITH cat_markings AS (
  SELECT id FROM public.tag_categories WHERE name = 'סימנים בולטים'
),
cat_behavior AS (
  SELECT id FROM public.tag_categories WHERE name = 'התנהגות'
),
cat_wing_shape AS (
  SELECT id FROM public.tag_categories WHERE name = 'צורת כנפיים'
),

-- הוספת תגיות סימנים בולטים חדשות
insert_markings AS (
  INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
  SELECT gen_random_uuid(), cat_markings.id, label, attr, true, false, sort_order
  FROM cat_markings, (VALUES
    ('כנפיים דו-גוניות', 'two_tone_wings', 20),
    ('ראש בהיר', 'pale_head', 21),
    ('כתם לבן בגב', 'white_back_patch', 22),
    ('סוככות תת-כנף כהות', 'dark_underwing_coverts', 23),
    ('ראש יוני (צוואר ארוך)', 'dove_head', 24),
    ('ירכיים לבנות', 'white_thighs', 25)
  ) AS t(label, attr, sort_order)
  RETURNING id
),

-- הוספת תגית התנהגות חדשה
insert_behavior AS (
  INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
  SELECT gen_random_uuid(), cat_behavior.id, label, attr, true, false, sort_order
  FROM cat_behavior, (VALUES
    ('מופיע בלהקות', 'flocking', 2)
  ) AS t(label, attr, sort_order)
  RETURNING id
)

-- הוספת תגית צורת כנפיים
INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
SELECT gen_random_uuid(), cat_wing_shape.id, label, attr, attr_value, false, sort_order
FROM cat_wing_shape, (VALUES
  ('פרק יד קדימה', 'forward_wrist', true, 2)
) AS t(label, attr, attr_value, sort_order);

-- === שלב 4: עדכון סדר קטגוריות לפי שימושיות ===
-- סדר חדש: גודל, מנח כנפיים, סימנים בולטים, צורת כנפיים, זנב, התנהגות

UPDATE public.tag_categories SET sort_order = 0 WHERE name = 'גודל';
UPDATE public.tag_categories SET sort_order = 1 WHERE name = 'מנח כנפיים (בגלישה)';
UPDATE public.tag_categories SET sort_order = 2 WHERE name = 'סימנים בולטים';
UPDATE public.tag_categories SET sort_order = 3 WHERE name = 'צורת כנפיים';
UPDATE public.tag_categories SET sort_order = 4 WHERE name = 'זנב';
UPDATE public.tag_categories SET sort_order = 5 WHERE name = 'התנהגות';