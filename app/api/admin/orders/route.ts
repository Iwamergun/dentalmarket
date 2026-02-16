import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    // 1. Query params al ve parse et
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = (page - 1) * limit
    const status = searchParams.get('status')
    const payment_status = searchParams.get('payment_status')
    const search = searchParams.get('search')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    // 2. Supabase client oluştur
    const supabase = await createClient()

    // 3. Query builder
    let query = supabase
      .from('orders')
      .select(`
        *,
        profiles:user_id (
          company_name,
          phone
        )
      `, { count: 'exact' })

    // 4. Filters ekle
    if (status) query = query.eq('status', status)
    if (payment_status) query = query.eq('payment_status', payment_status)
    if (search) {
      query = query.or(`order_number.ilike.%${search}%,customer_email.ilike.%${search}%`)
    }
    if (startDate) query = query.gte('created_at', startDate)
    if (endDate) query = query.lte('created_at', endDate)

    // 5. Order, limit, offset
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // 6. Execute
    const { data: orders, error, count } = await query

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 500 }
      )
    }

    if (!orders) {
      return NextResponse.json({
        success: true,
        data: {
          orders: [],
          pagination: {
            page,
            limit,
            total: 0,
            totalPages: 0,
          },
        },
      })
    }

    // 7. Her sipariş için order_items count ekle
    const ordersWithItemCount = await Promise.all(
      (orders as Record<string, unknown>[]).map(async (order) => {
        const { count: itemCount } = await supabase
          .from('order_items')
          .select('*', { count: 'exact', head: true })
          .eq('order_id', order.id as string)

        return { ...order, items_count: itemCount || 0 }
      })
    )

    // 8. Response
    return NextResponse.json({
      success: true,
      data: {
        orders: ordersWithItemCount,
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit),
        },
      },
    })
  } catch (error) {
    console.error('Admin orders API error:', error)
    return NextResponse.json(
      { success: false, error: 'Siparişler yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}
