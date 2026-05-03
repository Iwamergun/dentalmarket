import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'
import {
  generateInvoiceNumber,
  buildInvoiceData,
  mapOrderItems,
  generateInvoicePdf,
  type RawOrderItem,
  type RawOrder,
} from '@/lib/invoice/generate-invoice-pdf'

export async function POST(request: NextRequest) {
  try {
    const ip = getClientIp(request)
    const limiter = rateLimit(`invoices:${ip}`, { limit: 3, windowMs: 60_000 })
    if (!limiter.success) {
      return NextResponse.json(
        { error: 'Çok fazla istek gönderdiniz. Lütfen bir dakika bekleyin.' },
        { status: 429, headers: { 'Retry-After': '60' } }
      )
    }

    const supabase = await createClient()

    // Parse body
    const body = await request.json()
    const { order_id } = body

    if (!order_id) {
      return NextResponse.json(
        { error: 'order_id gereklidir' },
        { status: 400 }
      )
    }

    // Fetch the order
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderError } = await (supabase as any)
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Sipariş bulunamadı', details: orderError?.message },
        { status: 404 }
      )
    }

    // Fetch order items joined with product info
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rawItems, error: itemsError } = await (supabase as any)
      .from('order_items')
      .select(`
        *,
        catalog_products (
          id,
          name,
          sku
        )
      `)
      .eq('order_id', order_id)

    if (itemsError) {
      return NextResponse.json(
        { error: 'Sipariş kalemleri alınamadı', details: itemsError.message },
        { status: 500 }
      )
    }

    // Generate invoice number
    const invoiceNumber = generateInvoiceNumber()

    // Build structured invoice data from the actual orders schema
    const invoiceData = buildInvoiceData(order as RawOrder, invoiceNumber)

    // Map items to InvoicePDF-compatible format
    const items = mapOrderItems((rawItems ?? []) as RawOrderItem[])

    // Generate PDF
    let pdfBuffer: Buffer
    try {
      pdfBuffer = await generateInvoicePdf(
        invoiceData,
        { order_number: order.order_number, billing_type: 'individual' },
        items
      )
    } catch (pdfError) {
      console.error(
        'PDF generation error:',
        pdfError instanceof Error ? pdfError.message : pdfError
      )
      return NextResponse.json(
        { error: 'PDF oluşturulamadı' },
        { status: 500 }
      )
    }

    // Persist invoice record (optional – gracefully skipped if table does not exist)
    let invoiceId: string | null = null
    let pdfUrl: string | null = null

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: invoice, error: invoiceError } = await (supabase as any)
      .from('invoices')
      .insert({
        order_id: order.id,
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
        notes: order.notes ?? null,
      })
      .select('id')
      .single()

    if (!invoiceError && invoice) {
      invoiceId = invoice.id as string

      // Upload PDF to Supabase Storage
      const fileName = `invoices/${invoiceData.invoice_number}.pdf`
      const { error: uploadError } = await supabase.storage
        .from('invoices')
        .upload(fileName, pdfBuffer, {
          contentType: 'application/pdf',
          upsert: true,
        })

      if (!uploadError) {
        const { data: urlData } = supabase.storage
          .from('invoices')
          .getPublicUrl(fileName)
        pdfUrl = urlData.publicUrl

        // Update invoice record with the PDF URL
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase as any)
          .from('invoices')
          .update({
            pdf_url: pdfUrl,
            pdf_generated_at: new Date().toISOString(),
          })
          .eq('id', invoiceId)
      }
    }

    return NextResponse.json({
      success: true,
      invoice: {
        id: invoiceId,
        invoice_number: invoiceData.invoice_number,
        pdf_url: pdfUrl,
      },
    })
  } catch (error) {
    console.error(
      'Invoice generation error:',
      error instanceof Error ? error.message : error
    )
    return NextResponse.json(
      { error: 'Fatura oluşturulurken bir hata oluştu' },
      { status: 500 }
    )
  }
}
