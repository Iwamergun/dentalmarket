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
  updated_at?: string | null
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

function normalizeOrderForList(order: OrderRow) {
  return {
    ...order,
    updated_at: order.updated_at || order.created_at,
  }
}

async function getPendingOrdersByEmail(normalizedUserEmail: string | undefined, selectClause: string) {
  if (!normalizedUserEmail || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [] as OrderRow[]
  }

  try {
    const adminSupabase = createAdminClient()
    const { data, error } = await adminSupabase
      .from('orders')
      .select(selectClause)
      .eq('status', 'pending')
      .filter('shipping_address->>email', 'eq', normalizedUserEmail)

    if (error) {
      console.error('Pending orders email lookup error:', error.message)
      return []
    }

    return (data ?? []) as unknown as OrderRow[]
  } catch (error) {
    console.error('Pending orders email lookup failed:', error)
    return []
  }
}

async function getOwnedOrdersWithAdmin(userId: string, selectClause: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return [] as OrderRow[]
  }

  try {
    const adminSupabase = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminSupabase as any)
      .from('orders')
      .select(selectClause)
      .eq('user_id', userId)

    if (error) {
      console.error('Owned orders admin lookup error:', error.message)
      return []
    }

    return (data ?? []) as OrderRow[]
  } catch (error) {
    console.error('Owned orders admin lookup failed:', error)
    return []
  }
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
      shipping_address
    `

    const { data: ownedOrdersData, error: ownedOrdersError } = await supabase
      .from('orders')
      .select(selectClause)
      .eq('user_id', user.id)

    if (ownedOrdersError) {
      console.error('Owned orders lookup error:', ownedOrdersError.message)
    }

    const normalizedUserEmail = user.email?.trim().toLowerCase()
    const [ownedOrdersFallback, pendingOrdersByEmail] = await Promise.all([
      ownedOrdersError ? getOwnedOrdersWithAdmin(user.id, selectClause) : Promise.resolve([] as OrderRow[]),
      getPendingOrdersByEmail(normalizedUserEmail, selectClause),
    ])

    const orderMap = new Map<string, OrderRow>()

    ;((ownedOrdersError ? ownedOrdersFallback : ownedOrdersData ?? []) as OrderRow[]).forEach((order) => {
      orderMap.set(order.id, order)
    })

    pendingOrdersByEmail.forEach((order) => {
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
        const { count, error } = await supabase
          .from('order_items')
          .select('*', { count: 'exact', head: true })
          .eq('order_id', order.id)

        if (error) {
          console.error('Order item count lookup error:', error.message)
        }

        return {
          ...normalizeOrderForList(order),
          items_count: error ? 0 : count || 0,
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