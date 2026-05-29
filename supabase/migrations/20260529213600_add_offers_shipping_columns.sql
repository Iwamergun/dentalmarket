ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS shipping_cost numeric NULL;

ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS free_shipping_threshold numeric NULL;
