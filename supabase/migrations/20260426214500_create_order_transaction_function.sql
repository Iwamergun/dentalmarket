CREATE OR REPLACE FUNCTION create_order_transaction(
    p_order_id UUID,
    p_order_number TEXT,
    p_user_id UUID,
    p_status TEXT,
    p_payment_status TEXT,
    p_payment_method TEXT,
    p_subtotal NUMERIC,
    p_shipping_cost NUMERIC,
    p_total NUMERIC,
    p_shipping_address JSONB,
    p_notes TEXT,
    p_items JSONB
)
RETURNS TABLE (
    order_id UUID,
    order_number TEXT,
    status TEXT,
    payment_method TEXT,
    total NUMERIC
)
LANGUAGE plpgsql
AS $$
DECLARE
    item_record JSONB;
    matched_offer RECORD;
    item_product_id UUID;
    item_variant_id UUID;
    item_quantity INTEGER;
    item_price NUMERIC;
BEGIN
    INSERT INTO orders (
        id,
        order_number,
        user_id,
        subtotal,
        discount,
        shipping_cost,
        tax,
        total,
        shipping_address,
        billing_address,
        status,
        payment_status,
        customer_note
    )
    VALUES (
        p_order_id,
        p_order_number,
        p_user_id,
        p_subtotal,
        0,
        p_shipping_cost,
        GREATEST(p_total - p_subtotal - p_shipping_cost, 0),
        p_total,
        p_shipping_address,
        jsonb_build_object(
            'full_name', COALESCE(p_shipping_address ->> 'full_name', ''),
            'type', 'individual',
            'address', COALESCE(p_shipping_address ->> 'address', ''),
            'district', COALESCE(p_shipping_address ->> 'district', ''),
            'city', COALESCE(p_shipping_address ->> 'city', ''),
            'postal_code', COALESCE(p_shipping_address ->> 'postal_code', ''),
            'company_name', NULL,
            'tax_office', NULL,
            'tax_number', NULL
        ),
        p_status::order_status,
        p_payment_status,
        p_notes
    );

    FOR item_record IN SELECT * FROM jsonb_array_elements(p_items)
    LOOP
        item_product_id := (item_record ->> 'product_id')::UUID;
        item_variant_id := NULLIF(item_record ->> 'variant_id', '')::UUID;
        item_quantity := (item_record ->> 'quantity')::INTEGER;
        item_price := (item_record ->> 'price')::NUMERIC;

        SELECT id, stock_quantity, min_order_quantity
        INTO matched_offer
        FROM offers
        WHERE product_id = item_product_id
          AND is_active = TRUE
          AND (
            (item_variant_id IS NOT NULL AND variant_id = item_variant_id)
            OR (item_variant_id IS NULL AND variant_id IS NULL)
          )
        ORDER BY price ASC, created_at ASC
        LIMIT 1
        FOR UPDATE;

        IF matched_offer IS NULL THEN
            RAISE EXCEPTION 'ACTIVE_OFFER_NOT_FOUND';
        END IF;

        IF matched_offer.stock_quantity < item_quantity THEN
            RAISE EXCEPTION 'INSUFFICIENT_STOCK';
        END IF;

        IF matched_offer.min_order_quantity > item_quantity THEN
            RAISE EXCEPTION 'MIN_ORDER_QUANTITY_NOT_MET';
        END IF;

        INSERT INTO order_items (
            order_id,
            product_id,
            variant_id,
            quantity,
            unit_price,
            total_price
        )
        VALUES (
            p_order_id,
            item_product_id,
            item_variant_id,
            item_quantity,
            item_price,
            item_price * item_quantity
        );

        UPDATE offers
        SET stock_quantity = stock_quantity - item_quantity
        WHERE id = matched_offer.id;
    END LOOP;

    RETURN QUERY
    SELECT
        p_order_id,
        p_order_number,
        p_status,
        p_payment_method,
        p_total;
END;
$$;

GRANT EXECUTE ON FUNCTION create_order_transaction(
    UUID,
    TEXT,
    UUID,
    TEXT,
    TEXT,
    TEXT,
    NUMERIC,
    NUMERIC,
    NUMERIC,
    JSONB,
    TEXT,
    JSONB
) TO anon, authenticated;