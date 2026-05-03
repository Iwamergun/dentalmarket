import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { checkoutSchema } from '@/lib/validations/checkout'
import { z } from 'zod'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import {
  generateInvoiceNumber,
  buildInvoiceData,
  mapOrderItems,
  generateInvoicePdf,
  type RawOrder,
  type RawOrderItem,
} from '@/lib/invoice/generate-invoice-pdf'
import { sendEmail, isEmailConfigured } from '@/lib/email/mailer'
import { buildOrderConfirmationEmail } from '@/lib/email/templates/order-confirmation'

// Sipariş oluşturma request şeması
const createOrderSchema = z.object({
  address: checkoutSchema.shape.address,
  paymentMethod: checkoutSchema.shape.paymentMethod,
  items: z.array(z.object({
    product_id: z.string(),
    variant_id: z.string().nullable().optional(),
    quantity: z.number().min(1),
    price: z.number(),
  })).min(1, 'Sepet boş olamaz'),
  subtotal: z.number(),
  shipping: z.number(),
  total: z.number(),
})

// Sipariş numarası oluştur
function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DA-${timestamp}-${random}`
}

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const limiter = rateLimit(`orders:${ip}`, { limit: 5, windowMs: 60_000 })
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const supabase = await createClient()
    
    // Kullanıcı kontrolü (opsiyonel - misafir siparişi de olabilir)
    const { data: { user } } = await supabase.auth.getUser()
    
    // Request body'yi parse et
    const body = await request.json()
    
    // Validation
    const validationResult = createOrderSchema.safeParse(body)
    if (!validationResult.success) {
      return NextResponse.json(
        { 
          error: 'Validation hatası', 
          details: validationResult.error.flatten().fieldErrors 
        },
        { status: 400 }
      )
    }

    const { address, paymentMethod, items, subtotal, shipping, total } = validationResult.data

    // Sipariş numarası ve ID oluştur
    const orderNumber = generateOrderNumber()
    const orderId = crypto.randomUUID()

    // Sipariş durumunu belirle
    const orderStatus = paymentMethod === 'credit_card' ? 'pending' : 
                        paymentMethod === 'bank_transfer' ? 'awaiting_payment' : 'confirmed'

    // Offer tipi
    type OfferStock = { stock_quantity: number; min_order_quantity: number }

    // Stok kontrolü yap
    for (const item of items) {
      let query = supabase
        .from('offers')
        .select('stock_quantity, min_order_quantity')
        .eq('product_id', item.product_id)
        .eq('is_active', true)
      
      if (item.variant_id) {
        query = query.eq('variant_id', item.variant_id)
      } else {
        query = query.is('variant_id', null)
      }

      const { data } = await query.single()
      const offer = data as OfferStock | null
      
      if (!offer) {
        return NextResponse.json(
          { error: `Ürün bulunamadı veya satışta değil` },
          { status: 400 }
        )
      }

      if ((offer.stock_quantity || 0) < item.quantity) {
        return NextResponse.json(
          { error: `Yetersiz stok. Mevcut: ${offer.stock_quantity || 0} adet` },
          { status: 400 }
        )
      }
    }

    // Sipariş verisini hazırla
    const orderData = {
      id: orderId,
      order_number: orderNumber,
      user_id: user?.id || null,
      status: orderStatus,
      payment_status: 'pending',
      payment_method: paymentMethod,
      subtotal,
      shipping_cost: shipping,
      total,
      shipping_address: JSON.stringify({
        first_name: address.firstName,
        last_name: address.lastName,
        phone: address.phone,
        email: address.email,
        address: address.address,
        city: address.city,
        district: address.district,
        postal_code: address.postalCode,
        notes: address.notes || null,
      }),
      notes: address.notes || null,
    }

    // Sipariş kalemlerini hazırla
    const orderItemsData = items.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

    // Siparişi veritabanına kaydet
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: orderError } = await (supabase as any)
      .from('orders')
      .insert(orderData)
    
    if (orderError) {
      // Tablo yoksa geç (development), varsa hata döndür
      if (!orderError.message?.includes('does not exist')) {
        return NextResponse.json(
          { error: 'Sipariş oluşturulamadı' },
          { status: 500 }
        )
      }
    }

    // Offer tipi (stok güncelleme için)
    type OfferWithId = { id: string; stock_quantity: number }

    // Sipariş kalemleri ve stok güncelleme
    if (!orderError) {
      // Sipariş kalemlerini kaydet
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any).from('order_items').insert(orderItemsData)

      // Stokları güncelle
      for (const item of items) {
        let updateQuery = supabase
          .from('offers')
          .select('id, stock_quantity')
          .eq('product_id', item.product_id)
          .eq('is_active', true)
        
        if (item.variant_id) {
          updateQuery = updateQuery.eq('variant_id', item.variant_id)
        } else {
          updateQuery = updateQuery.is('variant_id', null)
        }

        const { data } = await updateQuery.single()
        const offer = data as OfferWithId | null
        
        if (offer) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          await (supabase as any)
            .from('offers')
            .update({ stock_quantity: (offer.stock_quantity || 0) - item.quantity })
            .eq('id', offer.id)
        }
      }
    }

    // Order response objesi
    const order = {
      id: orderId,
      order_number: orderNumber,
      status: orderStatus,
      payment_method: paymentMethod,
      total,
    }

    // Sepeti temizle (kullanıcı giriş yaptıysa)
    if (user) {
      // Cart'ı bul ve temizle
      const { data: cart } = await supabase
        .from('cart')
        .select('id')
        .eq('user_id', user.id)
        .single() as { data: { id: string } | null }
      
      if (cart) {
        await supabase
          .from('cart_items')
          .delete()
          .eq('cart_id', cart.id)
      }
    }

    // -----------------------------------------------------------------------
    // Fatura oluştur ve onay e-postası gönder (hata olursa sipariş etkilenmez)
    // -----------------------------------------------------------------------
    let invoiceNumber: string | null = null
    try {
      const invNumber = generateInvoiceNumber()
      invoiceNumber = invNumber

      const rawOrder: RawOrder = {
        id: orderId,
        order_number: orderNumber,
        subtotal,
        shipping_cost: shipping,
        total,
        shipping_address: {
          first_name: address.firstName,
          last_name: address.lastName,
          phone: address.phone,
          email: address.email,
          address: address.address,
          city: address.city,
          district: address.district,
          postal_code: address.postalCode,
          notes: address.notes ?? null,
        },
        notes: address.notes ?? null,
      }

      const invoiceData = buildInvoiceData(rawOrder, invNumber)

      // Fetch product names for the invoice (best-effort; falls back to product_id prefix)
      const productIds = [...new Set(orderItemsData.map((i) => i.product_id))]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: products } = await (supabase as any)
        .from('catalog_products')
        .select('id, name, sku')
        .in('id', productIds)
      const productMap: Record<string, { name: string; sku: string | null }> = {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const p of (products ?? []) as any[]) {
        productMap[p.id] = { name: p.name, sku: p.sku }
      }

      const mappedItems = mapOrderItems(
        orderItemsData.map((i) => ({
          product_id: i.product_id,
          variant_id: i.variant_id,
          quantity: i.quantity,
          unit_price: i.unit_price,
          total_price: i.total_price,
          catalog_products: productMap[i.product_id]
            ? { id: i.product_id, ...productMap[i.product_id] }
            : null,
        })) as RawOrderItem[]
      )

      // Generate PDF
      const pdfBuffer = await generateInvoicePdf(
        invoiceData,
        { order_number: orderNumber, billing_type: 'individual' },
        mappedItems
      )

      // Persist invoice record (optional – skipped if table does not exist)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      await (supabase as any)
        .from('invoices')
        .insert({
          order_id: orderId,
          invoice_number: invoiceData.invoice_number,
          invoice_date: invoiceData.invoice_date,
          customer_name: invoiceData.customer_name,
          customer_tax_office: invoiceData.customer_tax_office,
          customer_tax_number: invoiceData.customer_tax_number,
          customer_address: invoiceData.customer_address,
          customer_city: invoiceData.customer_city,
          customer_phone: invoiceData.customer_phone,
          customer_email: invoiceData.customer_email,
          subtotal: invoiceData.subtotal,
          discount_amount: invoiceData.discount_amount,
          shipping_cost: invoiceData.shipping_cost,
          tax_amount: invoiceData.tax_amount,
          total_amount: invoiceData.total_amount,
          notes: rawOrder.notes ?? null,
        })

      // Send confirmation email with PDF attachment
      if (isEmailConfigured() && address.email) {
        const emailPayload = buildOrderConfirmationEmail({
          orderNumber,
          customerName: `${address.firstName} ${address.lastName}`,
          paymentMethod,
          subtotal,
          shippingCost: shipping,
          total,
          items: mappedItems.map((mi) => ({
            product_name: mi.product_name,
            product_sku: mi.product_sku,
            variant_name: mi.variant_name,
            quantity: mi.quantity,
            unit_price: mi.unit_price,
            total: mi.total,
          })),
          notes: address.notes ?? null,
          invoiceNumber: invNumber,
        })

        await sendEmail({
          to: address.email,
          subject: `Sipariş Onayı – ${orderNumber} | Dent Alışveriş`,
          html: emailPayload.html,
          text: emailPayload.text,
          attachments: [
            {
              filename: `fatura-${invNumber}.pdf`,
              content: pdfBuffer,
              contentType: 'application/pdf',
            },
          ],
        })
      }
    } catch (invoiceEmailError) {
      // Invoice / email errors must not fail the order creation
      console.error(
        'Invoice/email error (non-fatal):',
        invoiceEmailError instanceof Error
          ? invoiceEmailError.message
          : invoiceEmailError
      )
    }

    // Başarılı yanıt
    return NextResponse.json({
      success: true,
      order: {
        id: order.id,
        orderNumber: order.order_number,
        status: order.status,
        total: order.total,
        paymentMethod: order.payment_method,
        invoiceNumber,
      },
      message: getOrderMessage(paymentMethod),
    })
    
  } catch (error) {
    console.error('Order API Error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Sipariş işlenirken bir hata oluştu' },
      { status: 500 }
    )
  }
}

function getOrderMessage(paymentMethod: string): string {
  switch (paymentMethod) {
    case 'credit_card':
      return 'Siparişiniz alındı. Ödeme sayfasına yönlendiriliyorsunuz...'
    case 'bank_transfer':
      return 'Siparişiniz alındı. Havale bilgileri e-posta adresinize gönderildi.'
    case 'cash_on_delivery':
      return 'Siparişiniz onaylandı. Teslimat sırasında ödeme yapabilirsiniz.'
    default:
      return 'Siparişiniz başarıyla oluşturuldu.'
  }
}
