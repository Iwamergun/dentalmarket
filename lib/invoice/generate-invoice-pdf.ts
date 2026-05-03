import React from 'react'
import { renderToStream } from '@react-pdf/renderer'
import InvoicePDF from '@/components/InvoicePDF'

// ---------------------------------------------------------------------------
// Invoice number generation (code-based, no DB dependency)
// ---------------------------------------------------------------------------

export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const random = Math.random().toString(36).substring(2, 7).toUpperCase()
  return `INV-${year}${month}-${random}`
}

// ---------------------------------------------------------------------------
// Shared types
// ---------------------------------------------------------------------------

export interface ShippingAddress {
  first_name: string
  last_name: string
  phone: string
  email: string
  address: string
  city: string
  district: string
  postal_code: string
  notes?: string | null
}

export interface RawOrderItem {
  id?: string
  product_id: string
  variant_id?: string | null
  quantity: number
  unit_price: number
  total_price: number
  catalog_products?: {
    id: string
    name: string
    sku: string | null
  } | null
}

export interface RawOrder {
  id: string
  order_number: string
  subtotal: number
  shipping_cost: number
  total: number
  shipping_address: string | Record<string, unknown>
  notes?: string | null
}

export interface InvoiceData {
  invoice_number: string
  invoice_date: string
  customer_name: string
  customer_tax_office: string | null
  customer_tax_number: string | null
  customer_address: string
  customer_city: string
  customer_phone: string | null
  customer_email: string | null
  subtotal: number
  discount_amount: number
  shipping_cost: number
  tax_amount: number
  total_amount: number
}

export type MappedItem = {
  id: string | undefined
  product_name: string
  product_sku: string | null
  variant_name: string | null
  unit_price: number
  quantity: number
  tax_rate: number
  total: number
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Parse the shipping_address JSON field (stored as a JSON string in DB). */
export function parseShippingAddress(raw: string | Record<string, unknown>): ShippingAddress {
  if (typeof raw === 'string') {
    return JSON.parse(raw) as ShippingAddress
  }
  return raw as unknown as ShippingAddress
}

/** Build an InvoiceData object from a raw order row. */
export function buildInvoiceData(order: RawOrder, invoiceNumber: string): InvoiceData {
  const addr = parseShippingAddress(order.shipping_address)
  const customerName = `${addr.first_name} ${addr.last_name}`.trim()
  // Estimate embedded 18% VAT amount from the total
  const taxAmount = Math.round((order.total - order.total / 1.18) * 100) / 100

  return {
    invoice_number: invoiceNumber,
    invoice_date: new Date().toISOString(),
    customer_name: customerName,
    customer_tax_office: null,
    customer_tax_number: null,
    customer_address: addr.address,
    customer_city: addr.city,
    customer_phone: addr.phone ?? null,
    customer_email: addr.email ?? null,
    subtotal: order.subtotal,
    discount_amount: 0,
    shipping_cost: order.shipping_cost,
    tax_amount: taxAmount,
    total_amount: order.total,
  }
}

/** Map raw order items (joined with catalog_products) to InvoicePDF-compatible items. */
export function mapOrderItems(items: RawOrderItem[]): MappedItem[] {
  return items.map((item) => ({
    id: item.id,
    product_name:
      item.catalog_products?.name ?? `Ürün ${item.product_id.substring(0, 8)}`,
    product_sku: item.catalog_products?.sku ?? null,
    variant_name: null,
    unit_price: item.unit_price,
    quantity: item.quantity,
    tax_rate: 18,
    total: item.total_price,
  }))
}

// ---------------------------------------------------------------------------
// PDF generation
// ---------------------------------------------------------------------------

/**
 * Render the InvoicePDF component to a Buffer.
 * The `orderMeta` only needs `order_number` and optionally `billing_type`.
 */
export async function generateInvoicePdf(
  invoice: InvoiceData,
  orderMeta: { order_number: string; billing_type?: string },
  items: MappedItem[]
): Promise<Buffer> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfStream = await renderToStream(
    React.createElement(InvoicePDF, {
      invoice,
      order: orderMeta,
      items,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any
  )

  const chunks: Buffer[] = []
  for await (const chunk of pdfStream) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk))
  }
  return Buffer.concat(chunks)
}
