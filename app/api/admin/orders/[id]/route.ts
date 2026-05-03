import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const VALID_ORDER_STATUSES = [
  'pending',
  'processing',
  'paid',
  'shipped',
  'delivered',
  'cancelled',
] as const

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request)
    const limiter = rateLimit(`admin-order-patch:${ip}`, { limit: 30, windowMs: 60_000 })
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const { id } = await params
    const body = await request.json()

    const { status, tracking_number, shipping_provider, shipped_at } = body

    // Build update payload — only include defined fields
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updatePayload: Record<string, any> = { updated_at: new Date().toISOString() }

    if (status !== undefined) {
      if (!VALID_ORDER_STATUSES.includes(status)) {
        return NextResponse.json(
          { success: false, error: 'Geçersiz sipariş durumu' },
          { status: 400 }
        )
      }
      updatePayload.status = status
    }

    if (tracking_number !== undefined) updatePayload.tracking_number = tracking_number || null
    if (shipping_provider !== undefined) updatePayload.shipping_provider = shipping_provider || null
    if (shipped_at !== undefined) updatePayload.shipped_at = shipped_at || null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: updatedOrder, error: updateError } = await (supabase as any)
      .from('orders')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (updateError) {
      return NextResponse.json(
        { success: false, error: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: { order: updatedOrder } })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
    console.error('Admin order PATCH error:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const ip = getClientIp(request)
    const limiter = rateLimit(`admin-order-detail:${ip}`, { limit: 30, windowMs: 60_000 })
    if (!limiter.success) {
      return NextResponse.json(
        { success: false, error: 'Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const supabase = await createClient()

    // Auth kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Admin rol kontrolü
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (!profile || profile.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Bu işlem için yetkiniz yok' },
        { status: 403 }
      )
    }

    const { id } = await params

    // 1. Order bilgilerini al (profiles ile JOIN)
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select(`
        *,
        profiles:user_id (
          company_name,
          phone,
          tax_number
        )
      `)
      .eq('id', id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    // 2. Order items'ları al (ürün bilgileriyle birlikte)
    const { data: orderItems, error: itemsError } = await supabase
      .from('order_items')
      .select(`
        *,
        catalog_products (
          id,
          name,
          sku,
          primary_image
        )
      `)
      .eq('order_id', id)
      .order('created_at', { ascending: true })

    if (itemsError) {
      return NextResponse.json(
        { success: false, error: 'Ürünler yüklenemedi' },
        { status: 500 }
      )
    }

    // 3. Response
    const orderData = Object.assign({}, order, { items: orderItems || [] })

    return NextResponse.json({
      success: true,
      data: {
        order: orderData,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
    console.error('Admin order detail error:', message)
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
