ALTER TABLE public.payment_settings ADD COLUMN IF NOT EXISTS ltc_wallet_address TEXT DEFAULT '';
ALTER TABLE public.payment_settings DROP COLUMN IF EXISTS paystack_public_key;
ALTER TABLE public.payment_settings DROP COLUMN IF EXISTS binance_merchant_id;