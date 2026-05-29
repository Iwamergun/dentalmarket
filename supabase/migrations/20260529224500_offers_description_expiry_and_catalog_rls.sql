ALTER TABLE public.offers
  ADD COLUMN IF NOT EXISTS description text NULL,
  ADD COLUMN IF NOT EXISTS expiry_date date NULL;

ALTER TABLE public.catalog_products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view catalog products" ON public.catalog_products;
DROP POLICY IF EXISTS "Anyone can view active catalog products" ON public.catalog_products;
DROP POLICY IF EXISTS "catalog_products_select_all" ON public.catalog_products;
CREATE POLICY "catalog_products_select_all" ON public.catalog_products
  FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Only admins can insert catalog products" ON public.catalog_products;
DROP POLICY IF EXISTS "catalog_products_admin_insert" ON public.catalog_products;
CREATE POLICY "catalog_products_admin_insert" ON public.catalog_products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can update catalog products" ON public.catalog_products;
DROP POLICY IF EXISTS "catalog_products_admin_update" ON public.catalog_products;
CREATE POLICY "catalog_products_admin_update" ON public.catalog_products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Only admins can delete catalog products" ON public.catalog_products;
DROP POLICY IF EXISTS "catalog_products_admin_delete" ON public.catalog_products;
CREATE POLICY "catalog_products_admin_delete" ON public.catalog_products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view active offers" ON public.offers;
DROP POLICY IF EXISTS "offers_select_active" ON public.offers;
CREATE POLICY "offers_select_active" ON public.offers
  FOR SELECT
  USING (is_active = true);

DROP POLICY IF EXISTS "Suppliers can manage own offers" ON public.offers;
DROP POLICY IF EXISTS "offers_supplier_insert_own" ON public.offers;
CREATE POLICY "offers_supplier_insert_own" ON public.offers
  FOR INSERT
  WITH CHECK (
    supplier_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('depo', 'supplier')
    )
  );

DROP POLICY IF EXISTS "offers_supplier_update_own" ON public.offers;
CREATE POLICY "offers_supplier_update_own" ON public.offers
  FOR UPDATE
  USING (
    supplier_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('depo', 'supplier')
    )
  )
  WITH CHECK (
    supplier_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('depo', 'supplier')
    )
  );

DROP POLICY IF EXISTS "offers_supplier_delete_own" ON public.offers;
CREATE POLICY "offers_supplier_delete_own" ON public.offers
  FOR DELETE
  USING (
    supplier_id = auth.uid()
    AND EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role IN ('depo', 'supplier')
    )
  );

DROP POLICY IF EXISTS "Admin can manage all offers" ON public.offers;
DROP POLICY IF EXISTS "offers_admin_manage_all" ON public.offers;
CREATE POLICY "offers_admin_manage_all" ON public.offers
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM public.profiles p
      WHERE p.id = auth.uid()
        AND p.role = 'admin'
    )
  );
