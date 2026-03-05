import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsedLimit = parseInt(searchParams.get('limit') ?? '16', 10)
    const limit = Math.min(isNaN(parsedLimit) ? 16 : parsedLimit, 32)

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    type ProductRaw = {
      id: string
      name: string
      slug: string
      primary_image: string | null
      brand_id: string | null
      default_offer_id: string | null
      brands: { name: string } | null
    }

    type ProductRow = {
      id: string
      name: string
      slug: string
      primary_image: string | null
      price: number | null
      compare_at_price: number | null
      brand_id: string | null
      brands: { name: string } | null
    }

    const PRODUCT_SELECT = 'id, name, slug, primary_image, brand_id, default_offer_id, brands(name)'

    async function attachPrices(rows: ProductRaw[]): Promise<ProductRow[]> {
      const offerIds = rows
        .map((p) => p.default_offer_id)
        .filter((id): id is string => id !== null)

      const priceMap: Record<string, number> = {}
      if (offerIds.length > 0) {
        const { data: offers } = await supabase
          .from('offers')
          .select('id, price')
          .in('id', offerIds)
        if (offers) {
          for (const o of offers) {
            priceMap[o.id] = o.price
          }
        }
      }

      return rows.map((p) => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        primary_image: p.primary_image,
        brand_id: p.brand_id,
        brands: p.brands,
        price: p.default_offer_id != null ? (priceMap[p.default_offer_id] ?? null) : null,
        compare_at_price: null,
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
          .from('catalog_products')
          .select(PRODUCT_SELECT)
          .in('primary_category_id', categoryIds)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (data && data.length > 0) {
          products = await attachPrices(data as unknown as ProductRaw[])
          personalized = true
        }
      }
    }

    // Fallback: newest active products
    if (products.length === 0) {
      const { data } = await supabase
        .from('catalog_products')
        .select(PRODUCT_SELECT)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      products = await attachPrices((data ?? []) as unknown as ProductRaw[])
    }

    const title = personalized ? 'Size Özel Öneriler' : 'Popüler Ürünler'

    return NextResponse.json({ products, personalized, title })
  } catch (error) {
    console.error('Recommendations API error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'İstenen veriler alınamadı' }, { status: 500 })
  }
}
