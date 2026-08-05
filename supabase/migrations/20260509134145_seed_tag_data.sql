-- הכנסת קטגוריות עם UUIDs
WITH inserted_categories AS (
  INSERT INTO public.tag_categories (id, name, sort_order) VALUES
    (gen_random_uuid(), 'סימנים בולטים', 0),
    (gen_random_uuid(), 'גודל', 1),
    (gen_random_uuid(), 'מנח כנפיים (בגלישה)', 2),
    (gen_random_uuid(), 'צורת כנפיים', 3),
    (gen_random_uuid(), 'זנב', 4),
    (gen_random_uuid(), 'התנהגות', 5)
  RETURNING id, name
),
-- מיפוי קטגוריות לשמות
cat_markings AS (SELECT id FROM inserted_categories WHERE name = 'סימנים בולטים'),
cat_size AS (SELECT id FROM inserted_categories WHERE name = 'גודל'),
cat_wing_posture AS (SELECT id FROM inserted_categories WHERE name = 'מנח כנפיים (בגלישה)'),
cat_wing_shape AS (SELECT id FROM inserted_categories WHERE name = 'צורת כנפיים'),
cat_tail AS (SELECT id FROM inserted_categories WHERE name = 'זנב'),
cat_behavior AS (SELECT id FROM inserted_categories WHERE name = 'התנהגות'),

-- הכנסת תגים - סימנים בולטים
inserted_markings AS (
  INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
  SELECT gen_random_uuid(), cat_markings.id, label, attr, attr_value, has_custom_list, sort_order
  FROM cat_markings, (VALUES
    ('כתפיים שחורות', 'black_shoulders', true, false, 0),
    ('כתפיים לבנות', 'white_shoulders', true, false, 1),
    ('פנסים (כתמי לבן)', 'lanterns', true, false, 2),
    ('קסדה/שפם שחור', 'helmet', true, false, 3),
    ('ראש ינשופי', 'owl_head', true, false, 4),
    ('זקן שחור', 'beard', true, false, 5),
    ('כיפה/עורף חלוד', 'rusty_cap', true, false, 6),
    ('מכנסיים חלודים/אדומים', 'rusty_trousers', true, false, 7),
    ('אפור אחיד', 'uniform_grey', true, false, 8),
    ('גב מנוקד', 'spotted_back', true, false, 9),
    ('פרק יד כהה', 'carpal', true, true, 10),
    ('שפת זרימה שחורה "מסגרת"', 'trailing_edge', true, true, 11),
    ('על-שת לבן', 'white_rump', true, true, 12),
    ('פסי רוחב על הבטן', 'belly_bars', true, true, 13),
    ('פספוס אורך על הבטן', 'belly_streaks', true, true, 14),
    ('פס בהיר לרוחב החזה', 'chest_band', true, true, 15)
  ) AS t(label, attr, attr_value, has_custom_list, sort_order)
  RETURNING id, attr
),

-- הכנסת תגים - גודל
inserted_size AS (
  INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
  SELECT gen_random_uuid(), cat_size.id, label, attr, attr_value, false, sort_order
  FROM cat_size, (VALUES
    ('ענק (מעל נשר)', 'giant', true, 0),
    ('גדול (נשר/עיט גדול)', 'very_large', true, 1),
    ('בינוני (עיט בינוני)', '_medium', true, 2),
    ('קטן (בגודל בז)', 'small', true, 3)
  ) AS t(label, attr, attr_value, sort_order)
  RETURNING id, attr
),

-- הכנסת תגים - מנח כנפיים
inserted_wing_posture AS (
  INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
  SELECT gen_random_uuid(), cat_wing_posture.id, label, attr, attr_value, false, sort_order
  FROM cat_wing_posture, (VALUES
    ('V עמוק (בגלישה)', 'deep_v', true, 0),
    ('V רדוד (בגלישה)', 'shallow_v', true, 1),
    ('שטוח (בגלישה)', 'flat_wings', true, 2),
    ('שמוטות (בגלישה)', 'drooping', true, 3),
    ('כנף כפופה (בגלישה)', 'kinked_wing', true, 4)
  ) AS t(label, attr, attr_value, sort_order)
  RETURNING id, attr
),

-- הכנסת תגים - צורת כנפיים
inserted_wing_shape AS (
  INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
  SELECT gen_random_uuid(), cat_wing_shape.id, label, attr, attr_value, false, sort_order
  FROM cat_wing_shape, (VALUES
    ('מחודדות (בז)', 'pointed_wings', true, 0),
    ('רחבות עם אצבעות', 'pointed_wings_broad', false, 1)
  ) AS t(label, attr, attr_value, sort_order)
  RETURNING id, attr
),

-- הכנסת תגים - זנב
inserted_tail AS (
  INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
  SELECT gen_random_uuid(), cat_tail.id, label, attr, attr_value, has_custom_list, sort_order
  FROM cat_tail, (VALUES
    ('מעויין', 'diamond_tail', true, false, 0),
    ('מזלגי עמוק', 'forked', true, false, 1),
    ('משולש/מזלגי רדוד', 'forked_shallow', true, false, 2),
    ('קצר ומרובע', 'short_square', true, false, 3),
    ('זנב בהיר מלמעלה', 'pale_tail', true, false, 4),
    ('פסי רוחב על הזנב', 'tail_bars_many', true, true, 5)
  ) AS t(label, attr, attr_value, has_custom_list, sort_order)
  RETURNING id, attr
),

-- הכנסת תגים - התנהגות
inserted_behavior AS (
  INSERT INTO public.tags (id, category_id, label, attr, attr_value, has_custom_list, sort_order)
  SELECT gen_random_uuid(), cat_behavior.id, label, attr, attr_value, false, sort_order
  FROM cat_behavior, (VALUES
    ('מרפרף במקום', 'hover', true, 0),
    ('ליד מים', 'near_water', true, 1)
  ) AS t(label, attr, attr_value, sort_order)
  RETURNING id, attr
),

-- מיפוי תגים לציפורים מותאמות
tag_belly_bars AS (SELECT id FROM inserted_markings WHERE attr = 'belly_bars'),
tag_carpal AS (SELECT id FROM inserted_markings WHERE attr = 'carpal'),
tag_chest_band AS (SELECT id FROM inserted_markings WHERE attr = 'chest_band'),
tag_trailing_edge AS (SELECT id FROM inserted_markings WHERE attr = 'trailing_edge'),
tag_white_rump AS (SELECT id FROM inserted_markings WHERE attr = 'white_rump'),
tag_belly_streaks AS (SELECT id FROM inserted_markings WHERE attr = 'belly_streaks'),
tag_tail_bars AS (SELECT id FROM inserted_tail WHERE attr = 'tail_bars_many'),

-- פסי רוחב על הבטן
insert_belly_bars AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_belly_bars.id, bird_id, note, sort_order
  FROM tag_belly_bars, (VALUES
    ('sparrowhawk', NULL, 0),
    ('levant_sparrowhawk', '(בוגרים)', 1),
    ('goshawk', '(בוגרים)', 2),
    ('snake_eagle', NULL, 3),
    ('barbary_falcon', '(בוגר)', 4),
    ('peregrine', '(בוגר)', 5)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
),

-- פרק יד כהה
insert_carpal AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_carpal.id, bird_id, note, sort_order
  FROM tag_carpal, (VALUES
    ('steppe', '(בוגר)', 0),
    ('bonelli', NULL, 1),
    ('rough_legged', NULL, 2),
    ('long_legged', NULL, 3),
    ('common_buzzard', NULL, 4),
    ('snake_eagle', NULL, 5)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
),

-- פס בהיר לרוחב החזה
insert_chest_band AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_chest_band.id, bird_id, note, sort_order
  FROM tag_chest_band, (VALUES
    ('common_buzzard', '(מאפיין)', 0),
    ('steppe_buzzard', '(מופע חלודי - מאפיין)', 1)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
),

-- שפת זרימה שחורה
insert_trailing_edge AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_trailing_edge.id, bird_id, note, sort_order
  FROM tag_trailing_edge, (VALUES
    ('rough_legged', NULL, 0),
    ('long_legged', NULL, 1),
    ('common_buzzard', NULL, 2),
    ('steppe_buzzard', NULL, 3),
    ('snake_eagle', NULL, 4)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
),

-- על-שת לבן
insert_white_rump AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_white_rump.id, bird_id, note, sort_order
  FROM tag_white_rump, (VALUES
    ('hen_harrier', NULL, 0),
    ('montagu_harrier', NULL, 1),
    ('pallid_harrier', NULL, 2),
    ('lesser_spotted', 'U לבן', 3),
    ('imperial', 'U בהיר (צעירים ומתבגרים)', 4),
    ('greater_spotted', 'U לבן', 5),
    ('steppe', 'U לבן (חלק מהבוגרים והצעירים)', 6),
    ('tawny', 'U בהיר (חלק מהבוגרים והצעירים)', 7)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
),

-- פספוס אורך על הבטן
insert_belly_streaks AS (
  INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
  SELECT tag_belly_streaks.id, bird_id, note, sort_order
  FROM tag_belly_streaks, (VALUES
    ('hen_harrier', 'בוגרות וצעירים', 0),
    ('montagu_harrier', 'בוגרות', 1),
    ('pallid_harrier', 'בוגרות', 2),
    ('levant_sparrowhawk', 'צעירים', 3),
    ('goshawk', 'צעירים', 4),
    ('common_kestrel', 'נקבות', 5),
    ('hobby', NULL, 6),
    ('eleanora', NULL, 7),
    ('peregrine', 'צעירים', 8),
    ('merlin', NULL, 9),
    ('lanner', 'צעירים', 10),
    ('bonelli', 'בוגרים', 11)
  ) AS t(bird_id, note, sort_order)
  RETURNING id
)

-- פסי רוחב על הזנב
INSERT INTO public.tag_birds (tag_id, bird_id, note, sort_order)
SELECT tag_tail_bars.id, bird_id, note, sort_order
FROM tag_tail_bars, (VALUES
  ('snake_eagle', 'פס עבה בקצה + שני פסים דקים בבסיס (מאפיין)', 0),
  ('osprey', 'צעיר: עדינים. בוגר: פס רחב בקצה + עדינים בבסיס', 1),
  ('imperial', 'בוגר: פס עבה בקצה + פספוס עדין בבסיס', 2),
  ('short_toed', '3-4 פסים כהים', 3),
  ('bonelli', 'בוגר: פס שחור עבה בקצה. צעיר: פספוס צפוף', 4),
  ('hen_harrier', 'צעירים ונקבה: 4 פסים, עבה בקצה', 5),
  ('montagu_harrier', '4 פסים, עבה בקצה', 6),
  ('pallid_harrier', '3-4 פסים. זכרים: אפורים בהירים', 7),
  ('rough_legged', 'פס עבה בקצה + 2-5 עדינים', 8),
  ('long_legged', 'בוגר מופע כהה: פס שחור עבה בקצה', 9),
  ('common_buzzard', 'בוגר: פס עבה בקצה + עדינים צפופים. צעיר: עדינים בלבד', 10),
  ('steppe_buzzard', 'פס בהיר בשפה + פס שחור בולט צמוד', 11),
  ('sparrowhawk', NULL, 12),
  ('levant_sparrowhawk', '5 פסי רוחב', 13),
  ('goshawk', NULL, 14),
  ('lesser_kestrel', 'כל הבזים', 15),
  ('common_kestrel', 'כל הבזים', 16),
  ('red_footed_falcon', 'כל הבזים', 17),
  ('merlin', 'כל הבזים', 18),
  ('peregrine', 'כל הבזים', 19),
  ('barbary_falcon', 'כל הבזים', 20),
  ('hobby', 'כל הבזים', 21),
  ('lanner', 'כל הבזים', 22),
  ('sooty_falcon', 'כל הבזים', 23),
  ('eleanora', 'כל הבזים', 24),
  ('saker', 'כל הבזים', 25)
) AS t(bird_id, note, sort_order);