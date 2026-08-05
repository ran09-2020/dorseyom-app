-- Add new columns to bird_overrides for region/season management
ALTER TABLE public.bird_overrides 
ADD COLUMN IF NOT EXISTS regions text[] DEFAULT NULL,
ADD COLUMN IF NOT EXISTS season_status text[] DEFAULT NULL,
ADD COLUMN IF NOT EXISTS rarity text DEFAULT NULL,
ADD COLUMN IF NOT EXISTS migration_common boolean DEFAULT NULL;