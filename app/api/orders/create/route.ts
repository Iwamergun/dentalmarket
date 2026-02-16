import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Auth kontrolü
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      console.log('Auth error:', authError)
      return NextResponse.json(
        { error: 'Oturum açmanız gerekiyor' },
        { status: 401 }
      )
    }

    // Body'den verileri al
    const body = await request.json()
    const {
      cart_items,
      shipping_info,
      billing_info,
      shipping_cost = 0,
      notes,
    } = body

    // Discount opsiyonel - negatif veya NaN ise 0 yap
    const discount_amount = Math.max(0, parseFloat(body.discount_amount || 0) || 0)

    if (!cart_items || cart_items.length === 0) {
      return NextResponse.json(
        { error: 'Sepet boş olamaz' },
        { status: 400 }
      )
    }

    if (!shipping_info) {
      return NextResponse.json(
        { error: 'Teslimat bilgileri gereklidir' },
        { status: 400 }
      )
    }

    console.log('Sipariş oluşturuluyor, user:', user.id)
    console.log('Cart items:', cart_items.length)

    // 1. Sipariş numarası oluştur
    const { data: orderNumberData, error: orderNumberError } = await supabase.rpc('generate_order_number')

    if (orderNumberError) {
      console.log('Order number generation error:', orderNumberError)
      return NextResponse.json(
        { error: 'Sipariş numarası oluşturulamadı' },
        { status: 500 }
      )
    }

    const order_number = orderNumberData as string
    console.log('Generated order number:', order_number)

    // 2. Subtotal hesapla
    const subtotal = cart_items.reduce(
      (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
      0
    )

    // 3. KDV hesapla (%20)
    const taxRate = 0.20
    const taxableAmount = subtotal - discount_amount + shipping_cost
    const tax = taxableAmount * taxRate
    const total = taxableAmount + tax

    console.log('Subtotal:', subtotal)
    console.log('Taxable amount:', taxableAmount)
    console.log('Tax:', tax)
    console.log('Discount:', discount_amount)
    console.log('Shipping cost:', shipping_cost)
    console.log('Total:', total)

    // 5. orders tablosuna INSERT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderError } = await (supabase as any)
      .from('orders')
      .insert({
        order_number,
        user_id: user.id,
        subtotal,
        discount: parseFloat(discount_amount.toFixed(2)),
        shipping_cost,
        tax,
        total,
        status: 'pending',
        payment_status: 'pending',
        // Shipping bilgileri (JSONB)
        shipping_address: {
          full_name: shipping_info.full_name,
          phone: shipping_info.phone,
          email: shipping_info.email,
          address: shipping_info.address,
          city: shipping_info.city,
          district: shipping_info.district,
          postal_code: shipping_info.postal_code,
        },
        // Billing bilgileri (JSONB)
        billing_address: {
          type: billing_info?.type || 'individual',
          full_name: billing_info?.full_name || shipping_info.full_name,
          company_name: billing_info?.company_name || null,
          tax_office: billing_info?.tax_office || null,
          tax_number: billing_info?.tax_number || null,
          address: billing_info?.address || shipping_info.address,
          city: billing_info?.city || shipping_info.city,
          district: billing_info?.district || shipping_info.district,
          postal_code: billing_info?.postal_code || shipping_info.postal_code,
        },
        customer_note: notes || null,
      })
      .select('id, order_number, total, status')
      .single()

    if (orderError) {
      console.log('Order insert error:', orderError)
      return NextResponse.json(
        { error: 'Sipariş oluşturulamadı', details: orderError.message },
        { status: 500 }
      )
    }

    console.log('Order created:', order.id)

    // 6. order_items tablosuna INSERT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const orderItems = cart_items.map((item: any) => {
      const itemSubtotal = parseFloat(item.price) * item.quantity
      const itemTaxAmount = itemSubtotal * taxRate
      const itemTotalPrice = itemSubtotal + itemTaxAmount

      return {
        order_id: order.id,
        product_id: item.product_id,
        variant_id: item.variant_id || null,
        product_name: item.product?.name || 'Ürün Adı',
        product_sku: item.product?.sku || '',
        variant_name: item.variant_name || null,
        quantity: item.quantity,
        unit_price: parseFloat(item.price).toFixed(2),
        total_price: itemTotalPrice.toFixed(2),
      }
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: itemsError } = await (supabase as any)
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.log('Order items insert error:', itemsError)
      return NextResponse.json(
        { error: 'Sipariş kalemleri oluşturulamadı', details: itemsError.message },
        { status: 500 }
      )
    }

    console.log('Order items created:', orderItems.length)

    // 7. Sepeti temizle
    if (cart_items.length > 0 && cart_items[0].cart_id) {
      const cartId = cart_items[0].cart_id
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: cartDeleteError } = await (supabase as any)
        .from('cart_items')
        .delete()
        .eq('cart_id', cartId)

      if (cartDeleteError) {
        console.log('Cart items delete error:', cartDeleteError)
        // Sepet temizleme hatası siparişi engellemez
      } else {
        console.log('Cart cleared for cart_id:', cartId)
      }
    }

    // 8. Fatura oluşturma API'sini trigger et (async, beklemeden)
    try {
      const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      fetch(`${siteUrl}/api/invoices/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order_id: order.id }),
      }).catch((err) => {
        console.log('Invoice generation trigger error (non-blocking):', err)
      })
      console.log('Invoice generation triggered for order:', order.id)
    } catch (invoiceError) {
      console.log('Invoice trigger error (non-blocking):', invoiceError)
    }

    // 9. Response döndür
    console.log('Order completed successfully:', order.order_number)

    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        order_number: order.order_number,
        total: order.total,
        status: order.status,
      },
    })
  } catch (error) {
    console.log('Order create error:', error)
    return NextResponse.json(
      { error: 'Sipariş oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}
