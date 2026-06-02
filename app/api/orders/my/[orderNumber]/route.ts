import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

type OrderRow = {
  id: string
  user_id: string | null
  order_number: string
  status: string
  payment_status: string
  payment_method: string
  subtotal: number
  shipping_cost: number
  total: number
  shipping_address: unknown
  notes: string | null
  created_at: string
  updated_at?: string | null
}

type OrderItemRow = {
  id: string
  product_id: string
  variant_id: string | null
  quantity: number
  unit_price: number
  total_price: number
}

type OrderItemWithProduct = OrderItemRow & {
  product: {
    id: string
    name: string
    slug: string
    primary_image: string | null
  } | null
}

function getShippingEmail(shippingAddress: unknown) {
  if (!shippingAddress) return null

  if (typeof shippingAddress === 'string') {
    try {
      const parsed = JSON.parse(shippingAddress) as { email?: string | null }
      return typeof parsed.email === 'string' ? parsed.email.trim().toLowerCase() : null
    } catch {
      return null
    }
  }

  if (typeof shippingAddress === 'object' && shippingAddress !== null && 'email' in shippingAddress) {
    const email = (shippingAddress as { email?: string | null }).email
    return typeof email === 'string' ? email.trim().toLowerCase() : null
  }

  return null
}

function normalizeOrderForDetail(order: OrderRow) {
  return {
    ...order,
    updated_at: order.updated_at || order.created_at,
  }
}

async function getOrderByNumberWithAdmin(orderNumber: string) {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { order: null, adminSupabase: null }
  }

  try {
    const adminSupabase = createAdminClient()
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminSupabase as any)
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .maybeSingle()

    if (error) {
      console.error('My order detail admin lookup error:', error.message)
      return { order: null, adminSupabase: null }
    }

    return { order: data as OrderRow | null, adminSupabase }
  } catch (error) {
    console.error('My order detail admin lookup failed:', error)
    return { order: null, adminSupabase: null }
  }
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    const { orderNumber } = await params
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Oturum açmanız gerekiyor' }, { status: 401 })
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: orderData, error: orderError } = await (supabase as any)
      .from('orders')
      .select('*')
      .eq('order_number', orderNumber)
      .maybeSingle()

    if (orderError) {
      throw orderError
    }

    let order = orderData as OrderRow | null
    let orderItemsClient: unknown = supabase

    if (!order) {
      const adminLookup = await getOrderByNumberWithAdmin(orderNumber)
      order = adminLookup.order
      orderItemsClient = adminLookup.adminSupabase || supabase
    }

    if (!order) {
      return NextResponse.json({ error: 'Sipariş bulunamadı' }, { status: 404 })
    }

    const normalizedUserEmail = user.email?.trim().toLowerCase()
    const canAccessByUserId = order.user_id === user.id
    const canAccessByEmail =
      order.status === 'pending' &&
      Boolean(normalizedUserEmail) &&
      getShippingEmail(order.shipping_address) === normalizedUserEmail

    if (!canAccessByUserId && !canAccessByEmail) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı veya bu siparişe erişim yetkiniz yok.' },
        { status: 403 }
      )
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: itemsData, error: itemsError } = await (orderItemsClient as any)
      .from('order_items')
      .select('id, product_id, variant_id, quantity, unit_price, total_price')
      .eq('order_id', order.id)

    if (itemsError) {
      throw itemsError
    }

    const orderItems = (itemsData ?? []) as OrderItemRow[]

    let itemsWithProducts: OrderItemWithProduct[] = orderItems.map((item) => ({
      ...item,
      product: null,
    }))

    if (orderItems.length > 0) {
      const productIds = orderItems.map((item) => item.product_id)
      const { data: productsData, error: productsError } = await supabase
        .from('catalog_products')
        .select('id, name, slug, primary_image')
        .in('id', productIds)

      if (productsError) {
        throw productsError
      }

      const productsMap = new Map(
        (productsData ?? []).map((product) => [product.id, product])
      )

      itemsWithProducts = orderItems.map((item) => ({
        ...item,
        product: productsMap.get(item.product_id) || null,
      }))
    }

    return NextResponse.json({
      order: normalizeOrderForDetail(order),
      orderItems: itemsWithProducts,
    })
  } catch (error) {
    console.error('My order detail API error:', error)
    return NextResponse.json(
      { error: 'Sipariş detayları yüklenirken bir hata oluştu.' },
      { status: 500 }
    )
  }
}