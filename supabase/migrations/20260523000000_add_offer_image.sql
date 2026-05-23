-- Add offer_image column to offers table so suppliers/depo users can
-- upload a product-specific image for their listing.
ALTER TABLE offers
  ADD COLUMN IF NOT EXISTS offer_image text NULL;
