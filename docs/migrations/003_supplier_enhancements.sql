-- Profiles tablosuna supplier alanları ekle
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS store_slug VARCHAR(100) UNIQUE;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS store_description TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS store_logo_url TEXT;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS tax_number VARCHAR(20);

-- catalog_products tablosuna supplier_id, price ve stok ekle (yoksa)
ALTER TABLE catalog_products ADD COLUMN IF NOT EXISTS supplier_id UUID REFERENCES profiles(id);
ALTER TABLE catalog_products ADD COLUMN IF NOT EXISTS price DECIMAL(12, 2) DEFAULT 0;
ALTER TABLE catalog_products ADD COLUMN IF NOT EXISTS compare_at_price DECIMAL(12, 2);
ALTER TABLE catalog_products ADD COLUMN IF NOT EXISTS stock_quantity INTEGER DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_catalog_products_supplier_id ON catalog_products(supplier_id);

-- Supplier kendi ürünlerini yönetebilir RLS
CREATE POLICY "Suppliers can manage own products" ON catalog_products
    FOR ALL
    USING (
        auth.uid() = supplier_id
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
