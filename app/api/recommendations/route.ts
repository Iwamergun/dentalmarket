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
      brands: { name: string } | null
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
          .select('id, name, slug, primary_image, price, compare_at_price, brand_id, brands(name)')
          .in('primary_category_id', categoryIds)
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(limit)

        if (data && data.length > 0) {
          products = data as unknown as ProductRow[]
          personalized = true
        }
      }
    }

    // Fallback: newest active products
    if (products.length === 0) {
      const { data } = await supabase
        .from('catalog_products')
        .select('id, name, slug, primary_image, price, compare_at_price, brand_id, brands(name)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(limit)

      products = (data ?? []) as unknown as ProductRow[]
    }

    const title = personalized ? 'Size Özel Öneriler' : 'Popüler Ürünler'

    return NextResponse.json({ products, personalized, title })
  } catch (error) {
    console.error('Recommendations API error:', error instanceof Error ? error.message : error)
    return NextResponse.json({ error: 'İstenen veriler alınamadı' }, { status: 500 })
  }
}
