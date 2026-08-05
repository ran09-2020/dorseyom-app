-- Add is_lead column to mark lead photos for each bird
ALTER TABLE public.photos ADD COLUMN is_lead BOOLEAN DEFAULT false;

-- Create index for faster lead photo lookups
CREATE INDEX idx_photos_is_lead ON public.photos(bird_id, is_lead) WHERE is_lead = true;