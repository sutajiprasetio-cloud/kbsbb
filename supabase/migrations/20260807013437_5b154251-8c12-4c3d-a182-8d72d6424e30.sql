create or replace function public.slugify_text(input text)
returns text language sql immutable as $$
  select trim(both '-' from regexp_replace(
    regexp_replace(lower(translate(coalesce(input,''), 'àáâãäåèéêëìíîïòóôõöùúûüçñ''`’', 'aaaaaaeeeeiiiiooooouuuucn')), '[^a-z0-9]+', '-', 'g'),
    '-+', '-', 'g'))
$$;

update public.news_posts set slug = public.slugify_text(slug) where slug is distinct from public.slugify_text(slug);
update public.programs set slug = public.slugify_text(slug) where slug is distinct from public.slugify_text(slug);
update public.events set slug = public.slugify_text(slug) where slug is distinct from public.slugify_text(slug);
update public.gallery_items set slug = public.slugify_text(slug) where slug is distinct from public.slugify_text(slug);
update public.donation_campaigns set slug = public.slugify_text(slug) where slug is distinct from public.slugify_text(slug);