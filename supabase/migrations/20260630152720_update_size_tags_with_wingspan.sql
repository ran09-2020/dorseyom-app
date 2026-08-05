-- עדכון תגיות גודל לפי מוטת כנפיים
-- מחיקת תגיות הגודל הישנות והוספת חדשות עם רשימות מותאמות

-- 1. מחיקת רשומות tag_birds עבור תגיות גודל ישנות (אם יש)
DELETE FROM public.tag_birds 
WHERE tag_id IN (
  SELECT id FROM public.tags 
  WHERE attr IN ('giant', 'very_large', '_medium', 'small', 'large_eagle', 'medium_large')
);

-- 2. מחיקת תגיות הגודל הישנות
DELETE FROM public.tags 
WHERE attr IN ('giant', 'very_large', '_medium', 'small', 'large_eagle', 'medium_large');

-- 3. קבלת ה-ID של קטגוריית גודל
WITH size_category AS (
  SELECT id FROM public.tag_categories WHERE name = 'גודל'
),

-- 4. הכנסת תגיות גודל חדשות עם רשימות מותאמות
inserted_size_tags AS (
  INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
  SELECT gen_random_uuid(), size_category.id, label, attr, true, true, sort_order
  FROM size_category, (VALUES
    ('ענק (240-285 ס"מ)', 'size_giant', 0),
    ('גדול מאוד (185-225 ס"מ)', 'size_very_large', 1),
    ('גדול (177-178 ס"מ)', 'size_large', 2),
    ('בינוני-גדול (165-170 ס"מ)', 'size_medium_large', 3),
    ('בינוני (85-155 ס"מ)', 'size_medium', 4),
    ('קטן (פחות מ-85 ס"מ)', 'size_small', 5)
  ) AS t(label, attr, sort_order)
  RETURNING id, attr
),

-- מיפוי תגיות לשמות
tag_giant AS (SELECT id FROM inserted_size_tags WHERE attr = 'size_giant'),
tag_very_large AS (SELECT id FROM inserted_size_tags WHERE attr = 'size_very_large'),
tag_large AS (SELECT id FROM inserted_size_tags WHERE attr = 'size_large'),
tag_medium_large AS (SELECT id FROM inserted_size_tags WHERE attr = 'size_medium_large'),
tag_medium AS (SELECT id FROM inserted_size_tags WHERE attr = 'size_medium'),
tag_small AS (SELECT id FROM inserted_size_tags WHERE attr = 'size_small'),

-- 5. הכנסת דורסים לקטגוריית ענק (240-285 ס"מ)
insert_giant AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_giant.id, bird_id, note, sort_order
  FROM tag_giant, (VALUES
    ('cinereous_vulture', '285 ס"מ', 0),
    ('lappet_faced', '280 ס"מ', 1),
    ('lammergeier', '275 ס"מ', 2),
    ('griffon', '265 ס"מ', 3),
    ('white_tail', '240 ס"מ', 4)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
),

-- 6. הכנסת דורסים לקטגוריית גדול מאוד (185-225 ס"מ)
insert_very_large AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_very_large.id, bird_id, note, sort_order
  FROM tag_very_large, (VALUES
    ('golden', '225 ס"מ', 0),
    ('imperial', '205 ס"מ', 1),
    ('steppe', '190 ס"מ', 2),
    ('tawny', '185 ס"מ', 3)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
),

-- 7. הכנסת דורסים לקטגוריית גדול (177-178 ס"מ)
insert_large AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_large.id, bird_id, note, sort_order
  FROM tag_large, (VALUES
    ('short_toed', '178 ס"מ', 0),
    ('greater_spotted', '177 ס"מ', 1)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
),

-- 8. הכנסת דורסים לקטגוריית בינוני-גדול (165-170 ס"מ)
insert_medium_large AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_medium_large.id, bird_id, note, sort_order
  FROM tag_medium_large, (VALUES
    ('egyptian', '170 ס"מ', 0),
    ('lesser_spotted', '168 ס"מ', 1),
    ('osprey', '167 ס"מ', 2),
    ('bonelli', '165 ס"מ', 3),
    ('red_kite', '165 ס"מ', 4)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
),

-- 9. הכנסת דורסים לקטגוריית בינוני (85-155 ס"מ)
insert_medium AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_medium.id, bird_id, note, sort_order
  FROM tag_medium, (VALUES
    ('black_kite', '155 ס"מ', 0),
    ('long_legged', '135-150 ס"מ', 1),
    ('common_buzzard', '135-150 ס"מ', 2),
    ('steppe_buzzard', '135-150 ס"מ', 3),
    ('rough_legged', '135-150 ס"מ', 4),
    ('snake_eagle', '135-150 ס"מ', 5),
    ('marsh_harrier', '115-140 ס"מ', 6),
    ('booted', '135 ס"מ', 7),
    ('goshawk', '93-127 ס"מ', 8),
    ('saker', '105-129 ס"מ', 9),
    ('hen_harrier', '97-118 ס"מ', 10),
    ('pallid_harrier', '97-118 ס"מ', 11),
    ('montagu_harrier', '96-116 ס"מ', 12),
    ('peregrine', '89-113 ס"מ', 13),
    ('lanner', '95-105 ס"מ', 14),
    ('eleanora', '87-104 ס"מ', 15),
    ('barbary_falcon', '76-98 ס"מ', 16),
    ('sooty_falcon', '78-90 ס"מ', 17),
    ('black_shouldered', '85 ס"מ', 18)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
)

-- 10. הכנסת דורסים לקטגוריית קטן (פחות מ-85 ס"מ)
INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
SELECT tag_small.id, bird_id, note, sort_order
FROM tag_small, (VALUES
  ('hobby', '70-84 ס"מ', 0),
  ('sparrowhawk', '58-80 ס"מ', 1),
  ('common_kestrel', '68-78 ס"מ', 2),
  ('levant_sparrowhawk', '63-76 ס"מ', 3),
  ('red_footed_falcon', '65-76 ס"מ', 4),
  ('lesser_kestrel', '63-72 ס"מ', 5),
  ('merlin', '55-69 ס"מ', 6)
) AS t(bird_id, note, sort_order);