-- Add sort_order column to photos table
ALTER TABLE public.photos ADD COLUMN sort_order INTEGER DEFAULT 0;

-- Initialize sort_order based on created_at (oldest = lowest number)
WITH ordered AS (
  SELECT id, ROW_NUMBER() OVER (ORDER BY created_at ASC) as rn
  FROM public.photos
)
UPDATE public.photos p
SET sort_order = o.rn
FROM ordered o
WHERE p.id = o.id;

-- Create index for efficient ordering
CREATE INDEX idx_photos_sort_order ON public.photos(sort_order);