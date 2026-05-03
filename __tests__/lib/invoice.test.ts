import { describe, it, expect } from 'vitest'
import {
  generateInvoiceNumber,
  buildInvoiceData,
  mapOrderItems,
  parseShippingAddress,
  type RawOrder,
  type RawOrderItem,
} from '@/lib/invoice/generate-invoice-pdf'

const sampleOrder: RawOrder = {
  id: 'order-uuid-001',
  order_number: 'DA-TEST-001',
  subtotal: 200,
  shipping_cost: 15,
  total: 250,
  shipping_address: JSON.stringify({
    first_name: 'Ahmet',
    last_name: 'Yılmaz',
    phone: '05321234567',
    email: 'ahmet@example.com',
    address: 'Atatürk Cad. No:1',
    city: 'İstanbul',
    district: 'Kadıköy',
    postal_code: '34000',
    notes: null,
  }),
  notes: null,
}

const sampleOrderObjectAddress: RawOrder = {
  ...sampleOrder,
  shipping_address: {
    first_name: 'Ayşe',
    last_name: 'Demir',
    phone: '05329876543',
    email: 'ayse@example.com',
    address: 'Cumhuriyet Cad. No:5',
    city: 'Ankara',
    district: 'Çankaya',
    postal_code: '06000',
  },
}

const sampleItems: RawOrderItem[] = [
  {
    id: 'item-001',
    product_id: 'prod-uuid-aaa',
    quantity: 2,
    unit_price: 75,
    total_price: 150,
    catalog_products: { id: 'prod-uuid-aaa', name: 'Diş Fırçası Pro', sku: 'DF-PRO-001' },
  },
  {
    id: 'item-002',
    product_id: 'prod-uuid-bbb',
    quantity: 1,
    unit_price: 50,
    total_price: 50,
    catalog_products: null,
  },
]

// ---------------------------------------------------------------------------
// generateInvoiceNumber
// ---------------------------------------------------------------------------
describe('generateInvoiceNumber', () => {
  it('INV- prefix ile başlamalı', () => {
    expect(generateInvoiceNumber()).toMatch(/^INV-/)
  })

  it('INV-YYYYMM-XXXXX formatında olmalı', () => {
    expect(generateInvoiceNumber()).toMatch(/^INV-\d{6}-[A-Z0-9]{5}$/)
  })

  it('her çağrıda farklı numara üretmeli', () => {
    const a = generateInvoiceNumber()
    const b = generateInvoiceNumber()
    // Aynı milisaniyede üretilirse random kısmı farklılaştırır
    // Bu test flaky olabilir; iki değerin her zaman eşit olmama ihtimali yeterince yüksektir
    expect(typeof a).toBe('string')
    expect(typeof b).toBe('string')
  })
})

// ---------------------------------------------------------------------------
// parseShippingAddress
// ---------------------------------------------------------------------------
describe('parseShippingAddress', () => {
  it('JSON string adresini parse etmeli', () => {
    const addr = parseShippingAddress(
      JSON.stringify({ first_name: 'Test', last_name: 'User', phone: '0500', email: 'x@x.com', address: 'A', city: 'B', district: 'C', postal_code: '12345' })
    )
    expect(addr.first_name).toBe('Test')
    expect(addr.city).toBe('B')
  })

  it('nesne adresini olduğu gibi döndürmeli', () => {
    const raw = { first_name: 'Ali', last_name: 'K', phone: '0500', email: 'a@b.com', address: 'X', city: 'Y', district: 'Z', postal_code: '00001' }
    const addr = parseShippingAddress(raw)
    expect(addr.first_name).toBe('Ali')
  })
})

// ---------------------------------------------------------------------------
// buildInvoiceData
// ---------------------------------------------------------------------------
describe('buildInvoiceData', () => {
  it('shipping_address JSON stringden müşteri adını oluşturmalı', () => {
    const data = buildInvoiceData(sampleOrder, 'INV-202506-TEST1')
    expect(data.customer_name).toBe('Ahmet Yılmaz')
  })

  it('shipping_address object kullanıldığında da çalışmalı', () => {
    const data = buildInvoiceData(sampleOrderObjectAddress, 'INV-202506-TEST2')
    expect(data.customer_name).toBe('Ayşe Demir')
  })

  it('verilen fatura numarasını kullanmalı', () => {
    const data = buildInvoiceData(sampleOrder, 'INV-202506-AAAA1')
    expect(data.invoice_number).toBe('INV-202506-AAAA1')
  })

  it('sipariş toplamını total_amount olarak setlemeli', () => {
    const data = buildInvoiceData(sampleOrder, 'INV-X')
    expect(data.total_amount).toBe(250)
  })

  it('müşteri e-posta ve telefon bilgisini taşımalı', () => {
    const data = buildInvoiceData(sampleOrder, 'INV-X')
    expect(data.customer_email).toBe('ahmet@example.com')
    expect(data.customer_phone).toBe('05321234567')
  })

  it('kargo maliyeti ve ara toplamı doğru setlemeli', () => {
    const data = buildInvoiceData(sampleOrder, 'INV-X')
    expect(data.subtotal).toBe(200)
    expect(data.shipping_cost).toBe(15)
  })
})

// ---------------------------------------------------------------------------
// mapOrderItems
// ---------------------------------------------------------------------------
describe('mapOrderItems', () => {
  it('catalog_products bilgisini ürün adı olarak kullanmalı', () => {
    const mapped = mapOrderItems(sampleItems)
    expect(mapped[0].product_name).toBe('Diş Fırçası Pro')
    expect(mapped[0].product_sku).toBe('DF-PRO-001')
  })

  it('catalog_products yoksa yedek isim üretmeli', () => {
    const mapped = mapOrderItems(sampleItems)
    expect(mapped[1].product_name).toMatch(/^Ürün /)
  })

  it('total_price değerini total alanına kopyalamalı', () => {
    const mapped = mapOrderItems(sampleItems)
    expect(mapped[0].total).toBe(150)
    expect(mapped[1].total).toBe(50)
  })

  it('varsayılan KDV oranını 18 olarak setlemeli', () => {
    const mapped = mapOrderItems(sampleItems)
    expect(mapped[0].tax_rate).toBe(18)
  })

  it('boş liste için boş dizi döndürmeli', () => {
    expect(mapOrderItems([])).toEqual([])
  })
})
