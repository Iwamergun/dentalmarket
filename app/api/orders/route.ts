import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
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

type CreateOrderTransactionClient = {
  rpc: (
    fn: 'create_order_transaction',
    args: {
      p_order_id: string
      p_order_number: string
      p_user_id: string | null
      p_status: string
      p_payment_status: string
      p_payment_method: string
      p_subtotal: number
      p_shipping_cost: number
      p_total: number
      p_shipping_address: Record<string, unknown>
      p_notes: string | null
      p_items: Array<{
        product_id: string
        variant_id: string | null
        quantity: number
        price: number
      }>
    }
  ) => Promise<{
    data: Array<{
      order_id: string
      order_number: string
      status: string
      payment_method: string
      total: number
    }> | null
    error: { message: string } | null
  }>
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
    const adminSupabase = createAdminClient()
    
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
    const orderStatus = paymentMethod === 'cash_on_delivery' ? 'confirmed' : 'pending'

    const rpcClient = adminSupabase as unknown as CreateOrderTransactionClient
    const shippingAddressPayload = {
      full_name: `${address.firstName} ${address.lastName}`.trim(),
      phone: address.phone,
      email: address.email,
      address: address.address,
      city: address.city,
      district: address.district,
      postal_code: address.postalCode,
    } as Record<string, unknown>
    const rpcItems = items.map((item) => ({
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      price: item.price,
    }))

    const { data: transactionResult, error: transactionError } = await rpcClient.rpc(
      'create_order_transaction',
      {
        p_order_id: orderId,
        p_order_number: orderNumber,
        p_user_id: user?.id || null,
        p_status: orderStatus,
        p_payment_status: 'pending',
        p_payment_method: paymentMethod,
        p_subtotal: subtotal,
        p_shipping_cost: shipping,
        p_total: total,
        p_shipping_address: shippingAddressPayload,
        p_notes: address.notes || null,
        p_items: rpcItems,
      }
    )

    if (transactionError) {
      console.error('Order transaction error:', transactionError.message)

      if (transactionError.message.includes('INSUFFICIENT_STOCK')) {
        return NextResponse.json(
          { error: 'Sipariş sırasında stok değişti. Lütfen sepetinizi yenileyip tekrar deneyin.' },
          { status: 409 }
        )
      }

      if (transactionError.message.includes('MIN_ORDER_QUANTITY_NOT_MET')) {
        return NextResponse.json(
          { error: 'Bazı ürünlerde minimum sipariş miktarı sağlanmıyor.' },
          { status: 400 }
        )
      }

      if (transactionError.message.includes('ACTIVE_OFFER_NOT_FOUND')) {
        return NextResponse.json(
          { error: 'Ürün bulunamadı veya satışta değil' },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: 'Sipariş oluşturulamadı' },
        { status: 500 }
      )
    }

    const createdOrder = transactionResult?.[0]

    if (!createdOrder) {
      return NextResponse.json(
        { error: 'Sipariş sonucu alınamadı' },
        { status: 500 }
      )
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

    const invoiceOrderItems = items.map((item) => ({
      product_id: item.product_id,
      variant_id: item.variant_id || null,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity,
    }))

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
      const productIds = [...new Set(invoiceOrderItems.map((item) => item.product_id))]
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: products } = await (adminSupabase as any)
        .from('catalog_products')
        .select('id, name, sku')
        .in('id', productIds)
      const productMap: Record<string, { name: string; sku: string | null }> = {}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      for (const p of (products ?? []) as any[]) {
        productMap[p.id] = { name: p.name, sku: p.sku }
      }

      const mappedItems = mapOrderItems(
        invoiceOrderItems.map((i) => ({
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
        id: createdOrder.order_id,
        orderNumber: createdOrder.order_number,
        status: createdOrder.status,
        total: createdOrder.total,
        paymentMethod,
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
