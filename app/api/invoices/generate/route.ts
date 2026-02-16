import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import React from 'react'
import { renderToStream } from '@react-pdf/renderer'
import InvoicePDF from '@/components/InvoicePDF'

export async function POST(request: NextRequest) {
  try {
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

    console.log('Fatura olusturuluyor, order_id:', order_id)

    // Sipariş bilgilerini çek
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: order, error: orderError } = await (supabase as any)
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .single()

    if (orderError || !order) {
      console.log('Order fetch error:', orderError)
      return NextResponse.json(
        { error: 'Siparis bulunamadi', details: orderError?.message },
        { status: 404 }
      )
    }

    console.log('Order fetched:', order.order_number)

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
      console.log('Order items fetch error:', itemsError)
      return NextResponse.json(
        { error: 'Siparis kalemleri alinamadi', details: itemsError.message },
        { status: 500 }
      )
    }

    console.log('Order items fetched:', orderItems?.length || 0)

    // Fatura numarası oluştur
    const { data: invoiceNumberData, error: invoiceNumberError } = await supabase.rpc('generate_invoice_number')

    if (invoiceNumberError) {
      console.log('Invoice number generation error:', invoiceNumberError)
      return NextResponse.json(
        { error: 'Fatura numarasi olusturulamadi', details: invoiceNumberError.message },
        { status: 500 }
      )
    }

    const invoice_number = invoiceNumberData as string
    console.log('Generated invoice number:', invoice_number)

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
      console.log('Invoice insert error:', invoiceError)
      return NextResponse.json(
        { error: 'Fatura kaydı olusturulamadi', details: invoiceError?.message },
        { status: 500 }
      )
    }

    console.log('Invoice created:', invoice.id)

    // PDF oluştur
    console.log('PDF olusturuluyor...')

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

    console.log('PDF olusturuldu, boyut:', pdfBuffer.length, 'bytes')

    // Supabase Storage'a yükle
    const fileName = `invoices/${invoice.invoice_number}.pdf`

    const { error: uploadError } = await supabase.storage
      .from('invoices')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      })

    if (uploadError) {
      console.log('PDF upload error:', uploadError)
      return NextResponse.json(
        { error: 'PDF yuklenemedi', details: uploadError.message },
        { status: 500 }
      )
    }

    console.log('PDF yuklendi:', fileName)

    // Public URL al
    const { data: urlData } = supabase.storage
      .from('invoices')
      .getPublicUrl(fileName)

    const pdfUrl = urlData.publicUrl

    console.log('PDF URL:', pdfUrl)

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
      console.log('Invoice update error:', updateError)
      // PDF oluşturuldu ama kayıt güncellenemedi - kritik değil
    }

    console.log('Fatura basariyla olusturuldu:', invoice.invoice_number)

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
    console.log('Invoice generate error:', error)
    return NextResponse.json(
      { error: 'Fatura olusturulurken bir hata olustu' },
      { status: 500 }
    )
  }
}
