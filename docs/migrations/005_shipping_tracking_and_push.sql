-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 005: Shipping tracking columns & push_subscriptions table
-- Apply via Supabase Dashboard → SQL Editor, or `supabase db push`.
-- ─────────────────────────────────────────────────────────────────────────────

-- 1. Add shipping/cargo tracking columns to orders table
ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS tracking_number    TEXT,
  ADD COLUMN IF NOT EXISTS shipping_provider  TEXT,
  ADD COLUMN IF NOT EXISTS shipped_at         TIMESTAMPTZ;

COMMENT ON COLUMN orders.tracking_number   IS 'Kargo takip numarası';
COMMENT ON COLUMN orders.shipping_provider IS 'Kargo firması (örn. Yurtiçi Kargo, MNG Kargo)';
COMMENT ON COLUMN orders.shipped_at        IS 'Kargoya verilme tarihi';

-- 2. Create push_subscriptions table for Web Push notifications
CREATE TABLE IF NOT EXISTS push_subscriptions (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  endpoint    TEXT        NOT NULL UNIQUE,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE SET NULL,
  subscription JSONB      NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE push_subscriptions IS 'Web Push notification subscriptions (PushSubscription JSON)';

-- Index for fast user-based lookup when sending targeted notifications
CREATE INDEX IF NOT EXISTS idx_push_subscriptions_user_id
  ON push_subscriptions (user_id)
  WHERE user_id IS NOT NULL;

-- RLS: only the owning user (or service role) can read their own subscription
ALTER TABLE push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own push subscriptions"
  ON push_subscriptions
  FOR ALL
  USING (user_id = auth.uid() OR user_id IS NULL)
  WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
