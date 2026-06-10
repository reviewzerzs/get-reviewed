
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_email TEXT NOT NULL,
  amount NUMERIC(12,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  gateway TEXT NOT NULL CHECK (gateway IN ('stripe','paystack','binance')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','Paid','failed','cancelled')),
  gateway_reference TEXT,
  platform TEXT,
  quantity INTEGER,
  crypto_asset TEXT,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.orders TO anon, authenticated;
GRANT ALL ON public.orders TO service_role;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can create orders" ON public.orders FOR INSERT TO anon, authenticated WITH CHECK (true);
CREATE POLICY "Anyone can read orders" ON public.orders FOR SELECT TO anon, authenticated USING (true);

CREATE TABLE public.payment_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  stripe_public_key TEXT DEFAULT '',
  paystack_public_key TEXT DEFAULT 'pk_test_paystack',
  binance_merchant_id TEXT DEFAULT '',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT singleton CHECK (id = 1)
);
GRANT SELECT, INSERT, UPDATE ON public.payment_settings TO anon, authenticated;
GRANT ALL ON public.payment_settings TO service_role;
ALTER TABLE public.payment_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read payment settings" ON public.payment_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Anyone can upsert payment settings" ON public.payment_settings FOR INSERT TO anon, authenticated WITH CHECK (id = 1);
CREATE POLICY "Anyone can update payment settings" ON public.payment_settings FOR UPDATE TO anon, authenticated USING (id = 1) WITH CHECK (id = 1);

INSERT INTO public.payment_settings (id) VALUES (1) ON CONFLICT DO NOTHING;

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER orders_set_updated_at BEFORE UPDATE ON public.orders FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
CREATE TRIGGER payment_settings_set_updated_at BEFORE UPDATE ON public.payment_settings FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
