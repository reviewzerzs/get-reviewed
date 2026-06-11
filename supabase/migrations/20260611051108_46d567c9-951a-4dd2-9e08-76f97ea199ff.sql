GRANT UPDATE ON public.orders TO anon, authenticated;
CREATE POLICY "App can update order status" ON public.orders FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);