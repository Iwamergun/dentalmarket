-- ============================================================
-- Phase 2 — B2B onboarding, role defaults, supplier slug rules
-- ============================================================

-- 1) Legacy / empty roles -> clinic
UPDATE profiles
SET role = 'clinic'
WHERE role IS NULL
   OR btrim(role) = ''
   OR lower(role) NOT IN ('admin', 'depo', 'clinic');

-- 2) TR slug helpers
CREATE OR REPLACE FUNCTION public.slugify_tr(value text)
RETURNS text
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT trim(both '-' FROM regexp_replace(
    translate(replace(lower(coalesce(value, '')), 'i̇', 'i'), 'çğıöşü', 'cgiosu'),
    '[^a-z0-9]+',
    '-',
    'g'
  ));
$$;

CREATE OR REPLACE FUNCTION public.generate_unique_store_slug(base_slug text, profile_id uuid DEFAULT NULL)
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  candidate text;
  normalized_base text;
  suffix integer := 1;
BEGIN
  normalized_base := NULLIF(public.slugify_tr(base_slug), '');
  IF normalized_base IS NULL THEN
    normalized_base := 'depo';
  END IF;

  candidate := normalized_base;

  LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM profiles p
      WHERE p.store_slug = candidate
        AND (profile_id IS NULL OR p.id <> profile_id)
    ) THEN
      RETURN candidate;
    END IF;

    suffix := suffix + 1;
    candidate := normalized_base || '-' || suffix;
  END LOOP;
END;
$$;

-- 3) Profile normalization trigger
CREATE OR REPLACE FUNCTION public.normalize_profile_onboarding_fields()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.role := COALESCE(NULLIF(btrim(NEW.role), ''), 'clinic');

  IF NEW.role NOT IN ('admin', 'depo', 'clinic') THEN
    NEW.role := 'clinic';
  END IF;

  IF NEW.tax_number IS NOT NULL AND NEW.tax_number !~ '^[0-9]{10}$' THEN
    RAISE EXCEPTION 'INVALID_TAX_NUMBER';
  END IF;

  IF TG_OP = 'INSERT' THEN
    IF NEW.role = 'clinic' AND NEW.is_active IS NULL THEN
      NEW.is_active := TRUE;
    ELSIF NEW.role = 'depo' AND NEW.is_active IS NULL THEN
      NEW.is_active := FALSE;
    END IF;
  END IF;

  IF NEW.role = 'depo' THEN
    IF NEW.store_slug IS NULL
      OR btrim(NEW.store_slug) = ''
      OR TG_OP = 'INSERT'
      OR NEW.company_name IS DISTINCT FROM OLD.company_name
    THEN
      NEW.store_slug := public.generate_unique_store_slug(COALESCE(NEW.company_name, 'depo'), NEW.id);
    END IF;
  ELSE
    NEW.store_slug := NULL;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS normalize_profile_onboarding_fields_trigger ON profiles;
CREATE TRIGGER normalize_profile_onboarding_fields_trigger
BEFORE INSERT OR UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION public.normalize_profile_onboarding_fields();

-- 4) Existing depo rows: ensure deterministic unique slug
WITH depo_rows AS (
  SELECT
    p.id,
    COALESCE(NULLIF(public.slugify_tr(p.company_name), ''), 'depo') AS base_slug,
    row_number() OVER (
      PARTITION BY COALESCE(NULLIF(public.slugify_tr(p.company_name), ''), 'depo')
      ORDER BY p.created_at, p.id
    ) AS seq
  FROM profiles p
  WHERE p.role = 'depo'
)
UPDATE profiles p
SET store_slug = CASE
  WHEN d.seq = 1 THEN d.base_slug
  ELSE d.base_slug || '-' || d.seq
END
FROM depo_rows d
WHERE p.id = d.id;

-- 5) Role-based activation defaults (only if not active yet)
UPDATE profiles
SET is_active = TRUE
WHERE role = 'clinic' AND is_active IS DISTINCT FROM TRUE;

UPDATE profiles
SET is_active = FALSE
WHERE role = 'depo' AND is_active IS NULL;

-- 6) Unique index for store_slug
CREATE UNIQUE INDEX IF NOT EXISTS profiles_store_slug_unique_idx
  ON profiles (store_slug)
  WHERE store_slug IS NOT NULL;
