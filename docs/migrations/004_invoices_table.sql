-- 004 – Invoices Table Migration
-- Fatura tablosu ve ilgili objeler

-- -----------------------------------------------------------------------
-- invoices tablosu
-- -----------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS invoices (
    id                  UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id            UUID         NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    invoice_number      VARCHAR(50)  UNIQUE NOT NULL,
    invoice_date        TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    customer_name       VARCHAR(255) NOT NULL,
    customer_tax_office VARCHAR(255),
    customer_tax_number VARCHAR(50),
    customer_address    TEXT,
    customer_city       VARCHAR(100),
    customer_phone      VARCHAR(50),
    customer_email      VARCHAR(255),
    subtotal            DECIMAL(12, 2) NOT NULL DEFAULT 0,
    discount_amount     DECIMAL(12, 2) NOT NULL DEFAULT 0,
    shipping_cost       DECIMAL(12, 2) NOT NULL DEFAULT 0,
    tax_amount          DECIMAL(12, 2) NOT NULL DEFAULT 0,
    total_amount        DECIMAL(12, 2) NOT NULL DEFAULT 0,
    pdf_url             TEXT,
    pdf_generated_at    TIMESTAMPTZ,
    notes               TEXT,
    created_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- -----------------------------------------------------------------------
-- Indexes
-- -----------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_invoices_order_id       ON invoices(order_id);
CREATE INDEX IF NOT EXISTS idx_invoices_invoice_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_created_at     ON invoices(created_at DESC);

-- -----------------------------------------------------------------------
-- updated_at trigger
-- -----------------------------------------------------------------------
CREATE OR REPLACE FUNCTION update_invoices_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_invoices_updated_at ON invoices;

CREATE TRIGGER trigger_invoices_updated_at
    BEFORE UPDATE ON invoices
    FOR EACH ROW
    EXECUTE FUNCTION update_invoices_updated_at();

-- -----------------------------------------------------------------------
-- Row Level Security
-- -----------------------------------------------------------------------
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Kullanıcılar kendi siparişlerine ait faturaları görebilir
CREATE POLICY "Users can view own invoices" ON invoices
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM orders
            WHERE orders.id = invoices.order_id
            AND orders.user_id = auth.uid()
        )
    );

-- Admin / tedarikçi tüm faturaları yönetebilir
CREATE POLICY "Admin can manage all invoices" ON invoices
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role IN ('admin', 'supplier')
        )
    );

-- Service-role (sunucu tarafı) tüm işlemleri yapabilir
CREATE POLICY "Service role can manage invoices" ON invoices
    FOR ALL
    USING (auth.role() = 'service_role');

-- -----------------------------------------------------------------------
-- Supabase Storage bucket for invoice PDFs
-- (Run manually in the Supabase Dashboard > Storage if not present)
-- -----------------------------------------------------------------------
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('invoices', 'invoices', true)
-- ON CONFLICT (id) DO NOTHING;

COMMENT ON TABLE invoices IS 'Otomatik oluşturulan sipariş faturaları';
COMMENT ON COLUMN invoices.invoice_number IS 'INV-YYYYMM-XXXXX formatında benzersiz fatura numarası';
COMMENT ON COLUMN invoices.pdf_url        IS 'Supabase Storage üzerindeki PDF dosyasının public URL''si';
