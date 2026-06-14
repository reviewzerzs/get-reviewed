
-- Orders: remove public read & update; keep guest insert only
DROP POLICY IF EXISTS "Anyone can read orders" ON public.orders;
DROP POLICY IF EXISTS "App can update order status" ON public.orders;

-- Payment settings: remove public write; keep public read (wallet address shown at checkout)
DROP POLICY IF EXISTS "Anyone can update payment settings" ON public.payment_settings;
DROP POLICY IF EXISTS "Anyone can upsert payment settings" ON public.payment_settings;
