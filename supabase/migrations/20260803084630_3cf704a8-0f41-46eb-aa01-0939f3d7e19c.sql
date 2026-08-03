CREATE TABLE public.bank_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bank_name text NOT NULL,
  account_number text NOT NULL,
  account_holder text NOT NULL,
  note text,
  logo_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.bank_accounts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bank_accounts TO authenticated;
GRANT ALL ON public.bank_accounts TO service_role;

ALTER TABLE public.bank_accounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public read active bank accounts" ON public.bank_accounts
  FOR SELECT USING (is_active OR public.is_staff(auth.uid()));
CREATE POLICY "staff manage bank accounts" ON public.bank_accounts
  FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TRIGGER update_bank_accounts_updated_at
  BEFORE UPDATE ON public.bank_accounts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TABLE public.donation_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  amount numeric NOT NULL,
  payment_method text NOT NULL DEFAULT 'transfer',
  message text,
  proof_image text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.donation_confirmations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.donation_confirmations TO authenticated;
GRANT ALL ON public.donation_confirmations TO service_role;

ALTER TABLE public.donation_confirmations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone submit donation confirmation" ON public.donation_confirmations
  FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "staff read donation confirmations" ON public.donation_confirmations
  FOR SELECT TO authenticated USING (public.is_staff(auth.uid()));
CREATE POLICY "staff update donation confirmations" ON public.donation_confirmations
  FOR UPDATE TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE POLICY "staff delete donation confirmations" ON public.donation_confirmations
  FOR DELETE TO authenticated USING (public.is_staff(auth.uid()));

CREATE TRIGGER update_donation_confirmations_updated_at
  BEFORE UPDATE ON public.donation_confirmations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE POLICY "public upload donation proofs" ON storage.objects
  FOR INSERT TO anon, authenticated
  WITH CHECK (bucket_id = 'media' AND (storage.foldername(name))[1] = 'donation-proofs');

CREATE POLICY "staff read media objects" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'media' AND public.is_staff(auth.uid()));