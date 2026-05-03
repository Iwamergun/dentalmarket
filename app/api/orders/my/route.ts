import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type OrderRow = {
  id: string
  order_number: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: number
  shipping_cost: number
  total: number
  created_at: string
  updated_at: string
  shipping_address?: { email?: string | null } | string | null
}

function getShippingEmail(shippingAddress: OrderRow['shipping_address']) {
  if (!shippingAddress) return null

  if (typeof shippingAddress === 'string') {
    try {
      const parsed = JSON.parse(shippingAddress) as { email?: string | null }
      return typeof parsed.email === 'string' ? parsed.email.trim().toLowerCase() : null
    } catch {
      return null
    }
  }

  return typeof shippingAddress.email === 'string'
    ? shippingAddress.email.trim().toLowerCase()
    : null
}

export async function GET() {
  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })
    }

    const adminSupabase = createAdminClient()
    const selectClause = `
      id,
      order_number,
      status,
      payment_status,
      payment_method,
      subtotal,
      shipping_cost,
      total,
      created_at,
      updated_at,
      shipping_address
    `

    const ownedOrdersPromise = adminSupabase
      .from('orders')
      .select(selectClause)
      .eq('user_id', user.id)

    const normalizedUserEmail = user.email?.trim().toLowerCase()
    const pendingOrdersByEmailPromise = normalizedUserEmail
      ? adminSupabase
          .from('orders')
          .select(selectClause)
          .eq('status', 'pending')
          .filter('shipping_address->>email', 'eq', normalizedUserEmail)
      : Promise.resolve({ data: [], error: null })

    const [ownedOrdersResult, pendingOrdersResult] = await Promise.all([
      ownedOrdersPromise,
      pendingOrdersByEmailPromise,
    ])

    if (ownedOrdersResult.error) {
      throw ownedOrdersResult.error
    }

    if (pendingOrdersResult.error) {
      throw pendingOrdersResult.error
    }

    const orderMap = new Map<string, OrderRow>()

    ;((ownedOrdersResult.data ?? []) as OrderRow[]).forEach((order) => {
      orderMap.set(order.id, order)
    })

    ;((pendingOrdersResult.data ?? []) as OrderRow[]).forEach((order) => {
      if (!normalizedUserEmail) return

      const shippingEmail = getShippingEmail(order.shipping_address)
      if (shippingEmail === normalizedUserEmail) {
        orderMap.set(order.id, order)
      }
    })

    const orders = Array.from(orderMap.values()).sort(
      (leftOrder, rightOrder) =>
        new Date(rightOrder.created_at).getTime() - new Date(leftOrder.created_at).getTime()
    )

    const ordersWithCount = await Promise.all(
      orders.map(async (order) => {
        const { count, error } = await adminSupabase
          .from('order_items')
          .select('*', { count: 'exact', head: true })
          .eq('order_id', order.id)

        if (error) {
          throw error
        }

        return {
          ...order,
          items_count: count || 0,
        }
      })
    )

    return NextResponse.json({ orders: ordersWithCount })
  } catch (error) {
    console.error('My orders API error:', error)
    return NextResponse.json(
      { error: 'Siparişler yüklenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}