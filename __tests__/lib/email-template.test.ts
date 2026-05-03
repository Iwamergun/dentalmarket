import { describe, it, expect } from 'vitest'
import { buildOrderConfirmationEmail } from '@/lib/email/templates/order-confirmation'

const baseData = {
  orderNumber: 'DA-TEST-001',
  customerName: 'Ahmet Yılmaz',
  paymentMethod: 'bank_transfer',
  subtotal: 200,
  shippingCost: 15,
  total: 215,
  items: [
    {
      product_name: 'Diş Fırçası Pro',
      product_sku: 'DF-PRO-001',
      variant_name: null,
      quantity: 2,
      unit_price: 75,
      total: 150,
    },
    {
      product_name: 'Diş Macunu',
      product_sku: null,
      variant_name: 'Naneli',
      quantity: 1,
      unit_price: 50,
      total: 50,
    },
  ],
  notes: null,
  invoiceNumber: 'INV-202506-TEST1',
}

describe('buildOrderConfirmationEmail', () => {
  it('html ve text alanlarını döndürmeli', () => {
    const result = buildOrderConfirmationEmail(baseData)
    expect(result).toHaveProperty('html')
    expect(result).toHaveProperty('text')
  })

  it('html sipariş numarasını içermeli', () => {
    const { html } = buildOrderConfirmationEmail(baseData)
    expect(html).toContain('DA-TEST-001')
  })

  it('html müşteri adını içermeli', () => {
    const { html } = buildOrderConfirmationEmail(baseData)
    expect(html).toContain('Ahmet Yılmaz')
  })

  it('html fatura numarasını içermeli', () => {
    const { html } = buildOrderConfirmationEmail(baseData)
    expect(html).toContain('INV-202506-TEST1')
  })

  it('ürün adları html içinde yer almalı', () => {
    const { html } = buildOrderConfirmationEmail(baseData)
    expect(html).toContain('Diş Fırçası Pro')
    expect(html).toContain('Diş Macunu')
  })

  it('havale ödeme yönteminde uyarı bloğu olmalı', () => {
    const { html } = buildOrderConfirmationEmail(baseData)
    expect(html).toContain('Havale')
  })

  it('kredi kartı ödemesinde havale uyarısı olmamalı', () => {
    const { html } = buildOrderConfirmationEmail({
      ...baseData,
      paymentMethod: 'credit_card',
    })
    expect(html).not.toContain('Havale / EFT Bildirimi')
  })

  it('ücretsiz kargo gösterilmeli (shippingCost = 0)', () => {
    const { html } = buildOrderConfirmationEmail({ ...baseData, shippingCost: 0 })
    expect(html).toContain('Ücretsiz')
  })

  it('fatura numarası yoksa ilgili satır bulunmamalı', () => {
    const { html } = buildOrderConfirmationEmail({ ...baseData, invoiceNumber: null })
    expect(html).not.toContain('Fatura No:')
  })

  it('text formatı sipariş numarasını içermeli', () => {
    const { text } = buildOrderConfirmationEmail(baseData)
    expect(text).toContain('DA-TEST-001')
  })

  it('text formatı ürün adlarını içermeli', () => {
    const { text } = buildOrderConfirmationEmail(baseData)
    expect(text).toContain('Diş Fırçası Pro')
  })
})
