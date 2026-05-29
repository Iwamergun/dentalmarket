import { describe, expect, it } from 'vitest'
import { calculateShippingCost } from '@/lib/orders/shipping'

describe('calculateShippingCost', () => {
  it('tedarikçi bazlı kargo ücretini toplamalı', () => {
    const total = calculateShippingCost([
      {
        offer: { supplier_id: 'sup-1', shipping_cost: 20, free_shipping_threshold: null },
        quantity: 1,
        unitPrice: 100,
      },
      {
        offer: { supplier_id: 'sup-2', shipping_cost: 15, free_shipping_threshold: null },
        quantity: 2,
        unitPrice: 50,
      },
    ])

    expect(total).toBe(35)
  })

  it('aynı tedarikçi için eşik aşılınca kargo almamalı', () => {
    const total = calculateShippingCost([
      {
        offer: { supplier_id: 'sup-1', shipping_cost: 25, free_shipping_threshold: 300 },
        quantity: 2,
        unitPrice: 150,
      },
      {
        offer: { supplier_id: 'sup-1', shipping_cost: 25, free_shipping_threshold: 300 },
        quantity: 1,
        unitPrice: 50,
      },
    ])

    expect(total).toBe(0)
  })
})
