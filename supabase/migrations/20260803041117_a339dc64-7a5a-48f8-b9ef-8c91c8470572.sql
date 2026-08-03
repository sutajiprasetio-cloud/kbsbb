ALTER TABLE public.hero_slides
  ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'cover';

ALTER TABLE public.hero_slides
  ADD CONSTRAINT hero_slides_display_mode_check
  CHECK (display_mode IN ('cover', 'contain', 'fill'));