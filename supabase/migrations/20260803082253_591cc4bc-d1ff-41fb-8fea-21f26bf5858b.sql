ALTER TABLE public.programs ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'cover';
ALTER TABLE public.news_posts ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'cover';
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'cover';
ALTER TABLE public.testimonials ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'cover';
ALTER TABLE public.partners ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'contain';
ALTER TABLE public.events ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'cover';
ALTER TABLE public.team_members ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'cover';
ALTER TABLE public.donation_campaigns ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'cover';
ALTER TABLE public.about_content ADD COLUMN IF NOT EXISTS display_mode text NOT NULL DEFAULT 'cover';

CREATE TABLE IF NOT EXISTS public.impact_stats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  value text NOT NULL DEFAULT '',
  title text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Users',
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.impact_stats TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.impact_stats TO authenticated;
GRANT ALL ON public.impact_stats TO service_role;

ALTER TABLE public.impact_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active impact stats" ON public.impact_stats
  FOR SELECT USING (is_active OR public.is_staff(auth.uid()));
CREATE POLICY "staff manage impact stats" ON public.impact_stats
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER update_impact_stats_updated_at BEFORE UPDATE ON public.impact_stats
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

INSERT INTO public.impact_stats (value, title, icon, sort_order) VALUES
  ('500+', 'Penerima Manfaat', 'Users', 1),
  ('15+', 'Program Sosial', 'HandHeart', 2),
  ('1.200+', 'Donatur', 'Heart', 3),
  ('20+', 'Mitra Kolaborasi', 'Building2', 4);

INSERT INTO public.site_settings (key, value) VALUES ('homepage', '{"show_impact_stats": true}'::jsonb)
ON CONFLICT (key) DO UPDATE SET value = public.site_settings.value || '{"show_impact_stats": true}'::jsonb;