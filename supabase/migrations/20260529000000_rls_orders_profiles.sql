-- ============================================================
-- Phase 1 — RLS: orders, order_items, profiles, offers
-- ============================================================
-- Bu migration idempotent'tir; DROP POLICY IF EXISTS + CREATE
-- POLICY kalıbını kullanır.

-- ---- orders ------------------------------------------------
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi siparişlerini okuyabilir
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
CREATE POLICY "Users can view own orders" ON orders
    FOR SELECT
    USING (auth.uid() = user_id);

-- Misafir siparişi de oluşturulabilir (user_id NULL olabilir).
-- INSERT, RPC (service role) üzerinden gerçekleştiği için ayrıca
-- bir satır politikasına gerek yoktur; service role RLS'i atlar.

-- Admin tüm siparişleri yönetebilir (profiles.role = 'admin')
DROP POLICY IF EXISTS "Admin can manage all orders" ON orders;
CREATE POLICY "Admin can manage all orders" ON orders
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role = 'admin'
        )
    );

-- Tedarikçiler, kendi tekliflerine ait kalemleri içeren siparişleri okuyabilir
DROP POLICY IF EXISTS "Suppliers can view orders containing their items" ON orders;
CREATE POLICY "Suppliers can view orders containing their items" ON orders
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1
            FROM order_items oi
            JOIN offers o ON o.id = oi.offer_id
            WHERE oi.order_id = orders.id
              AND o.supplier_id = auth.uid()
        )
    );

-- ---- order_items -------------------------------------------
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi siparişlerinin kalemlerini okuyabilir
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
CREATE POLICY "Users can view own order items" ON order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = order_items.order_id
              AND orders.user_id = auth.uid()
        )
    );

-- Admin tüm sipariş kalemlerini yönetebilir
DROP POLICY IF EXISTS "Admin can manage all order items" ON order_items;
CREATE POLICY "Admin can manage all order items" ON order_items
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role = 'admin'
        )
    );

-- Tedarikçiler kendi tekliflerine ait kalemleri okuyabilir
DROP POLICY IF EXISTS "Suppliers can view their own order items" ON order_items;
CREATE POLICY "Suppliers can view their own order items" ON order_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM offers
            WHERE offers.id = order_items.offer_id
              AND offers.supplier_id = auth.uid()
        )
    );

-- ---- profiles ----------------------------------------------
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Her kullanıcı kendi profilini okuyabilir
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Her kullanıcı kendi profilini güncelleyebilir;
-- ancak role sütununu yalnızca admin değiştirebilir.
DROP POLICY IF EXISTS "Users can update own profile non-role fields" ON profiles;
CREATE POLICY "Users can update own profile non-role fields" ON profiles
    FOR UPDATE
    USING (auth.uid() = id)
    WITH CHECK (
        -- role değiştirilmiyorsa izin ver
        role = (SELECT role FROM profiles WHERE id = auth.uid())
        -- YA DA kullanıcı zaten admin ise her şeyi değiştirebilir
        OR EXISTS (
            SELECT 1 FROM profiles p2
            WHERE p2.id = auth.uid() AND p2.role = 'admin'
        )
    );

-- Admin tüm profilleri yönetebilir
DROP POLICY IF EXISTS "Admin can manage all profiles" ON profiles;
CREATE POLICY "Admin can manage all profiles" ON profiles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles p2
            WHERE p2.id = auth.uid() AND p2.role = 'admin'
        )
    );

-- ---- offers ------------------------------------------------
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;

-- Herkes aktif teklifleri okuyabilir
DROP POLICY IF EXISTS "Anyone can view active offers" ON offers;
CREATE POLICY "Anyone can view active offers" ON offers
    FOR SELECT
    USING (is_active = TRUE);

-- Tedarikçiler kendi tekliflerini yönetebilir
DROP POLICY IF EXISTS "Suppliers can manage own offers" ON offers;
CREATE POLICY "Suppliers can manage own offers" ON offers
    FOR ALL
    USING (auth.uid() = supplier_id);

-- Admin tüm teklifleri yönetebilir
DROP POLICY IF EXISTS "Admin can manage all offers" ON offers;
CREATE POLICY "Admin can manage all offers" ON offers
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
              AND profiles.role = 'admin'
        )
    );
