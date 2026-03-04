import { describe, it, expect } from 'vitest'
import { z } from 'zod'

// Sipariş validasyon şeması
const orderItemSchema = z.object({
  product_id: z.string().min(1, 'Ürün ID zorunludur'),
  quantity: z.number().int().positive('Miktar pozitif olmalıdır'),
  price: z.number().positive('Fiyat pozitif olmalıdır'),
})

const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1, 'En az bir ürün olmalıdır'),
  payment_method: z.enum(['credit_card', 'bank_transfer', 'cash_on_delivery'], {
    error: 'Geçersiz ödeme yöntemi',
  }),
  shipping_address_id: z.string().min(1, 'Teslimat adresi zorunludur').optional(),
})

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `DA-${timestamp}-${random}`
}

describe('orders-validation', () => {
  it('boş items array\'i reddedilmeli', () => {
    const result = createOrderSchema.safeParse({
      items: [],
      payment_method: 'credit_card',
    })
    expect(result.success).toBe(false)
  })

  it('geçersiz payment_method reddedilmeli', () => {
    const result = createOrderSchema.safeParse({
      items: [{ product_id: 'p1', quantity: 1, price: 100 }],
      payment_method: 'invalid_method',
    })
    expect(result.success).toBe(false)
  })

  it('negatif quantity reddedilmeli', () => {
    const result = createOrderSchema.safeParse({
      items: [{ product_id: 'p1', quantity: -1, price: 100 }],
      payment_method: 'credit_card',
    })
    expect(result.success).toBe(false)
  })

  it('geçerli sipariş verisi kabul edilmeli', () => {
    const result = createOrderSchema.safeParse({
      items: [{ product_id: 'p1', quantity: 2, price: 150.5 }],
      payment_method: 'bank_transfer',
    })
    expect(result.success).toBe(true)
  })

  it('sipariş numarası DA- prefix ile başlamalı', () => {
    const orderNumber = generateOrderNumber()
    expect(orderNumber).toMatch(/^DA-/)
  })
})
