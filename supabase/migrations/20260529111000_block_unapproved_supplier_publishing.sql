-- ============================================================
-- Phase 2 — Block unapproved suppliers from publishing offers
-- ============================================================

CREATE OR REPLACE FUNCTION public.ensure_supplier_can_publish_offer()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  supplier_role text;
  supplier_is_active boolean;
BEGIN
  IF NEW.is_active IS DISTINCT FROM TRUE THEN
    RETURN NEW;
  END IF;

  SELECT role, is_active
  INTO supplier_role, supplier_is_active
  FROM profiles
  WHERE id = NEW.supplier_id;

  IF supplier_role IS NULL THEN
    RAISE EXCEPTION 'SUPPLIER_PROFILE_NOT_FOUND';
  END IF;

  IF supplier_role <> 'depo' THEN
    RAISE EXCEPTION 'SUPPLIER_ROLE_NOT_ALLOWED';
  END IF;

  IF supplier_is_active IS DISTINCT FROM TRUE THEN
    RAISE EXCEPTION 'SUPPLIER_ACCOUNT_PENDING_APPROVAL';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ensure_supplier_can_publish_offer_trigger ON offers;
CREATE TRIGGER ensure_supplier_can_publish_offer_trigger
BEFORE INSERT OR UPDATE ON offers
FOR EACH ROW
EXECUTE FUNCTION public.ensure_supplier_can_publish_offer();
