import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params

    console.log('=== ORDER DETAIL API START ===')
    console.log('Order ID:', id)

    // 1. Order bilgilerini al (profiles ile JOIN)
    console.log('Fetching order...')
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

    console.log('Order fetched:', order ? 'success' : 'not found')
    if (orderError) {
      console.error('Order Error:', orderError)
    }

    if (orderError || !order) {
      return NextResponse.json(
        { success: false, error: 'Sipariş bulunamadı' },
        { status: 404 }
      )
    }

    // 2. Order items'ları al (ürün bilgileriyle birlikte)
    console.log('Fetching order items...')
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

    console.log('Order items fetched:', orderItems?.length || 0)
    if (itemsError) {
      console.error('=== ORDER ITEMS ERROR ===')
      console.error('Message:', itemsError.message)
      console.error('Code:', itemsError.code)
      console.error('Details:', itemsError.details)
      console.error('Hint:', itemsError.hint)
      console.error('========================')
    }

    if (itemsError) {
      return NextResponse.json(
        { success: false, error: 'Ürünler yüklenemedi' },
        { status: 500 }
      )
    }

    // 3. Response
    console.log('Returning success response')
    console.log('=== ORDER DETAIL API END ===')

    const orderData = Object.assign({}, order, { items: orderItems || [] })

    return NextResponse.json({
      success: true,
      data: {
        order: orderData,
      },
    })
  } catch (error: unknown) {
    console.error('=== CATCH ERROR ===')
    console.error('Error:', error)
    if (error instanceof Error) {
      console.error('Stack:', error.stack)
    }
    console.error('===================')

    const message =
      error instanceof Error ? error.message : 'Bilinmeyen bir hata oluştu'
    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    )
  }
}
