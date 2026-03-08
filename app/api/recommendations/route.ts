import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsedLimit = parseInt(searchParams.get('limit') ?? '16', 10)
    const limit = Math.min(isNaN(parsedLimit) ? 16 : parsedLimit, 32)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    type ProductRow = {
      id: string
      name: string
      slug: string
      primary_image: string | null
      price: number | null
      compare_at_price: number | null
      brand_id: string | null
      brand_name: string | null
      offer_count: number
      price_min: number | null
      price_max: number | null
    }

    const VIEW_TABLE = 'v_product_best_offer' as 'catalog_products'
    const VIEW_SELECT = 'id, name, slug, primary_image, brand_id, brand_name, min_price, offer_count, price_min, price_max'

    function mapRows(rows: Record<string, unknown>[]): ProductRow[] {
      return rows.map((r) => ({
        id: r.id as string,
        name: r.name as string,
        slug: r.slug as string,
        primary_image: (r.primary_image as string | null) ?? null,
        price: r.min_price != null ? Number(r.min_price) : null,
        compare_at_price: null,
        brand_id: (r.brand_id as string | null) ?? null,
        brand_name: (r.brand_name as string | null) ?? null,
        offer_count: Number(r.offer_count ?? 0),
        price_min: r.price_min != null ? Number(r.price_min) : null,
        price_max: r.price_max != null ? Number(r.price_max) : null,
      }))
    }

    let products: ProductRow[] = []
    let personalized = false

    if (user) {
      // Fetch product IDs from the user's recent orders
      const { data: recentOrders } = await supabase
        .from('orders')
        .select('id')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5)

      const orderIds: string[] = (recentOrders ?? []).map((o) => o.id)

      let categoryIds: string[] = []
      if (orderIds.length > 0) {
        const { data: orderItems } = await supabase
          .from('order_items')
          .select('product_id')
          .in('order_id', orderIds)
          .limit(20)

        const productIds = (orderItems ?? []).map((i) => i.product_id)

        if (productIds.length > 0) {
          const { data: categoryData } = await supabase
            .from('catalog_products')
            .select('primary_category_id')
            .in('id', productIds)
            .not('primary_category_id', 'is', null)

          if (categoryData) {
            categoryIds = [
              ...new Set(
                categoryData
                  .map((p) => p.primary_category_id)
                  .filter((id): id is string => id !== null)
              ),
            ]
          }
        }
      }

      if (categoryIds.length > 0) {
        const { data } = await supabase
          .from(VIEW_TABLE)
          .select(VIEW_SELECT)
          .in('primary_category_id', categoryIds)
          .eq('is_active', true)
          .order('min_price', { ascending: true, nullsFirst: false })
          .limit(limit)

        if (data && data.length > 0) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          products = mapRows(data as any)
          personalized = true
        }
      }
    }

    // Fallback: newest active products
    if (products.length === 0) {
      const { data } = await supabase
        .from(VIEW_TABLE)
        .select(VIEW_SELECT)
        .eq('is_active', true)
        .order('min_price', { ascending: true, nullsFirst: false })
        .limit(limit)

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      products = mapRows((data ?? []) as any)
    }

    const title = personalized ? 'Size Özel Öneriler' : 'Popüler Ürünler'

    return NextResponse.json({ products, personalized, title })
  } catch (error) {
    console.error('Recommendations API error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'İstenen veriler alınamadı' }, { status: 500 })
  }
}
