import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { renderToStream } from '@react-pdf/renderer'
import InvoicePDF from '@/components/InvoicePDF'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

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

    // Body'den order_id al
    const body = await request.json()
    const { order_id } = body

    if (!order_id) {
      return NextResponse.json(
        { error: 'order_id gereklidir' },
        { status: 400 }
      )
    }

    // Sipariş bilgilerini çek
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderError } = await (supabase as any)
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      return NextResponse.json(
        { error: 'Siparis bulunamadi', details: orderError?.message },
        { status: 404 }
      )
    }

    // Sipariş kalemlerini çek (catalog_products ile birlikte)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: orderItems, error: itemsError } = await (supabase as any)
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
        { error: 'Siparis kalemleri alinamadi', details: itemsError.message },
        { status: 500 }
      )
    }

    // Fatura numarası oluştur
    const { data: invoiceNumberData, error: invoiceNumberError } = await supabase.rpc('generate_invoice_number')

    if (invoiceNumberError) {
      return NextResponse.json(
        { error: 'Fatura numarasi olusturulamadi', details: invoiceNumberError.message },
        { status: 500 }
      )
    }

    const invoice_number = invoiceNumberData as string

    // Müşteri adını billing_type'a göre belirle
    const customer_name =
      order.billing_type === 'corporate' && order.billing_company_name
        ? order.billing_company_name
        : order.billing_full_name || order.shipping_full_name

    // invoices tablosuna INSERT
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: invoice, error: invoiceError } = await (supabase as any)
      .from('invoices')
      .insert({
        order_id: order.id,
        invoice_number,
        invoice_date: new Date().toISOString(),
        customer_name,
        customer_tax_office: order.billing_tax_office || null,
        customer_tax_number: order.billing_tax_number || null,
        customer_address: order.billing_address || order.shipping_address,
        customer_city: order.billing_city || order.shipping_city,
        customer_phone: order.shipping_phone || null,
        customer_email: order.shipping_email || null,
        subtotal: order.subtotal,
        discount_amount: order.discount_amount || 0,
        shipping_cost: order.shipping_cost || 0,
        tax_amount: order.tax_amount,
        total_amount: order.total_amount,
        notes: order.notes || null,
      })
      .select('*')
      .single()

    if (invoiceError || !invoice) {
      return NextResponse.json(
        { error: 'Fatura kaydı olusturulamadi', details: invoiceError?.message },
        { status: 500 }
      )
    }

    // PDF oluştur
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pdfStream = await renderToStream(
      React.createElement(InvoicePDF, {
        invoice,
        order,
        items: orderItems || [],
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any
    )

    // PDF'i buffer'a çevir
    const chunks: Buffer[] = []
    for await (const chunk of pdfStream) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
    }
    const pdfBuffer = Buffer.concat(chunks)

    // Supabase Storage'a yükle
    const fileName = `invoices/${invoice.invoice_number}.pdf`

    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      return NextResponse.json(
        { error: 'PDF yuklenemedi', details: uploadError.message },
        { status: 500 }
      )
    }

    // Public URL al
    const { data: urlData } = supabase.storage
      .from('invoices')
      .getPublicUrl(fileName)

    const pdfUrl = urlData.publicUrl

    // invoices kaydını güncelle
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error: updateError } = await (supabase as any)
      .from('invoices')
      .update({
        pdf_url: pdfUrl,
        pdf_generated_at: new Date().toISOString(),
      })
      .eq('id', invoice.id)

    if (updateError) {
      // PDF oluşturuldu ama kayıt güncellenemedi - kritik değil
    }

    // Response döndür
    return NextResponse.json({
      success: true,
      invoice: {
        id: invoice.id,
        invoice_number: invoice.invoice_number,
        pdf_url: pdfUrl,
      },
    })
  } catch (error) {
    console.error('Invoice generation error:', error instanceof Error ? error.message : error)
    return NextResponse.json(
      { error: 'Fatura olusturulurken bir hata olustu' },
      { status: 500 }
    )
  }
}
