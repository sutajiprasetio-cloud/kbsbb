
ALTER TABLE public.donations
  ADD COLUMN IF NOT EXISTS donor_phone text,
  ADD COLUMN IF NOT EXISTS is_anonymous boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS message text;

CREATE OR REPLACE FUNCTION public.sync_campaign_raised()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  cid uuid;
BEGIN
  FOR cid IN SELECT unnest(ARRAY[NEW.campaign_id, CASE WHEN TG_OP <> 'INSERT' THEN OLD.campaign_id END])
  LOOP
    IF cid IS NOT NULL THEN
      UPDATE public.donation_campaigns c
      SET raised_amount = COALESCE((
        SELECT SUM(d.amount) FROM public.donations d
        WHERE d.campaign_id = cid AND d.status = 'confirmed'
      ), 0)
      WHERE c.id = cid;
    END IF;
  END LOOP;
  RETURN NULL;
END;
$$;

DROP TRIGGER IF EXISTS donations_sync_campaign_raised ON public.donations;
CREATE TRIGGER donations_sync_campaign_raised
AFTER INSERT OR UPDATE OR DELETE ON public.donations
FOR EACH ROW EXECUTE FUNCTION public.sync_campaign_raised();

CREATE OR REPLACE FUNCTION public.campaign_stats()
RETURNS TABLE (campaign_id uuid, donor_count bigint, confirmed_total numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT d.campaign_id,
         COUNT(*)::bigint,
         COALESCE(SUM(d.amount), 0)
  FROM public.donations d
  WHERE d.status = 'confirmed' AND d.campaign_id IS NOT NULL
  GROUP BY d.campaign_id
$$;

CREATE OR REPLACE FUNCTION public.public_donations(_campaign_id uuid DEFAULT NULL, _limit int DEFAULT 20)
RETURNS TABLE (id uuid, donor_name text, amount numeric, message text, created_at timestamptz)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT d.id,
         CASE WHEN d.is_anonymous THEN 'Anonymous' ELSE d.donor_name END,
         d.amount,
         d.message,
         d.created_at
  FROM public.donations d
  WHERE d.status = 'confirmed'
    AND (_campaign_id IS NULL OR d.campaign_id = _campaign_id)
  ORDER BY d.created_at DESC
  LIMIT LEAST(COALESCE(_limit, 20), 100)
$$;

GRANT EXECUTE ON FUNCTION public.campaign_stats() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.public_donations(uuid, int) TO anon, authenticated;
