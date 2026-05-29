ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS categories_public_select ON public.categories;
CREATE POLICY categories_public_select
  ON public.categories
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS brands_public_select ON public.brands;
CREATE POLICY brands_public_select
  ON public.brands
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS catalog_products_public_select ON public.catalog_products;
CREATE POLICY catalog_products_public_select
  ON public.catalog_products
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS offers_public_select ON public.offers;
CREATE POLICY offers_public_select
  ON public.offers
  FOR SELECT
  TO anon, authenticated
  USING (is_active = true);
