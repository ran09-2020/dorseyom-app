-- Add link fields to bird_overrides table
ALTER TABLE public.bird_overrides 
ADD COLUMN IF NOT EXISTS link1_url TEXT,
ADD COLUMN IF NOT EXISTS link1_label TEXT,
ADD COLUMN IF NOT EXISTS link2_url TEXT,
ADD COLUMN IF NOT EXISTS link2_label TEXT;