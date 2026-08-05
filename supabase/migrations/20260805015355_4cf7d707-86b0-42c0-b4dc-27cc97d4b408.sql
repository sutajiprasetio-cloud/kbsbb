CREATE OR REPLACE FUNCTION public.slugify(_txt text)
RETURNS text
LANGUAGE sql
IMMUTABLE
SET search_path = public
AS $$
  SELECT trim(both '-' from regexp_replace(regexp_replace(lower(coalesce(_txt,'')), '[^a-z0-9]+', '-', 'g'), '-+', '-', 'g'))
$$;

ALTER TABLE public.events ADD COLUMN IF NOT EXISTS slug text;
ALTER TABLE public.gallery_items ADD COLUMN IF NOT EXISTS slug text;

UPDATE public.events SET slug = NULLIF(public.slugify(title),'') WHERE slug IS NULL;
UPDATE public.gallery_items SET slug = NULLIF(public.slugify(coalesce(title,'dokumentasi')),'') WHERE slug IS NULL;

-- de-duplicate
UPDATE public.events e SET slug = e.slug || '-' || left(e.id::text, 6)
WHERE EXISTS (SELECT 1 FROM public.events o WHERE o.slug = e.slug AND o.id <> e.id AND o.created_at < e.created_at);
UPDATE public.gallery_items g SET slug = g.slug || '-' || left(g.id::text, 6)
WHERE EXISTS (SELECT 1 FROM public.gallery_items o WHERE o.slug = g.slug AND o.id <> g.id AND o.created_at < g.created_at);

CREATE OR REPLACE FUNCTION public.ensure_slug()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE base text; candidate text; i int := 1;
BEGIN
  base := NULLIF(public.slugify(coalesce(NEW.slug, NEW.title, '')), '');
  IF base IS NULL THEN base := 'item'; END IF;
  candidate := base;
  LOOP
    EXECUTE format('SELECT 1 FROM public.%I WHERE slug = $1 AND id <> $2 LIMIT 1', TG_TABLE_NAME)
      USING candidate, NEW.id;
    IF NOT FOUND THEN EXIT; END IF;
    i := i + 1;
    candidate := base || '-' || i;
  END LOOP;
  NEW.slug := candidate;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS events_ensure_slug ON public.events;
CREATE TRIGGER events_ensure_slug BEFORE INSERT OR UPDATE ON public.events
FOR EACH ROW EXECUTE FUNCTION public.ensure_slug();

DROP TRIGGER IF EXISTS gallery_items_ensure_slug ON public.gallery_items;
CREATE TRIGGER gallery_items_ensure_slug BEFORE INSERT OR UPDATE ON public.gallery_items
FOR EACH ROW EXECUTE FUNCTION public.ensure_slug();

CREATE UNIQUE INDEX IF NOT EXISTS events_slug_key ON public.events (slug);
CREATE UNIQUE INDEX IF NOT EXISTS gallery_items_slug_key ON public.gallery_items (slug);