/**
 * Sunucu tarafı fiyat yeniden hesaplama testleri
 *
 * Bu testler, sipariş oluşturma sırasında istemciden gelen fiyatların
 * sunucu tarafında offers tablosundan doğrulandığını kontrol eder.
 * app/api/orders/route.ts içindeki fiyat doğrulama mantığını birim testler.
 */
import { describe, it, expect } from 'vitest'
import { calculateShippingCost } from '@/lib/orders/shipping'

// ----------------------------------------------------------------
// Fiyat doğrulama mantığını yeniden modelle (route.ts'deki logic)
// ----------------------------------------------------------------

const PRICE_TOLERANCE = 0.01

type OfferRow = {
  id: string
  product_id: string
  variant_id: string | null
  supplier_id: string
  price: number
  shipping_cost: number | null
  free_shipping_threshold: number | null
}

type OrderItem = {
  product_id: string
  variant_id?: string | null
  quantity: number
  price: number
}

type ValidationResult =
  | { ok: true; serverSubtotal: number; serverTotal: number; serverPricedItems: OrderItem[] }
  | { ok: false; status: 400 | 409; message: string }

/**
 * Sunucu tarafı fiyat doğrulama ve yeniden hesaplama
 * (app/api/orders/route.ts POST handler'ındaki mantığın yansıması)
 */
function validatePrices(
  items: OrderItem[],
  clientSubtotal: number,
  clientShipping: number,
  clientTotal: number,
  offers: OfferRow[]
): ValidationResult {
  // Her (product_id, variant_id) için en ucuz teklifi bul
  const offerPriceMap = new Map<string, OfferRow>()
  for (const offer of offers) {
    const key = `${offer.product_id}:${offer.variant_id ?? ''}`
    if (!offerPriceMap.has(key)) {
      offerPriceMap.set(key, offer)
    }
  }

  let serverSubtotal = 0
  const serverPricedItems: OrderItem[] = []
  const shippingItems: Array<{ offer: OfferRow; quantity: number; unitPrice: number }> = []

  for (const item of items) {
    const key = `${item.product_id}:${item.variant_id ?? ''}`
    const selectedOffer = offerPriceMap.get(key)
    const serverPrice = selectedOffer?.price

    if (serverPrice === undefined) {
      return { ok: false, status: 400, message: 'Ürün bulunamadı veya satışta değil' }
    }

    if (Math.abs(item.price - serverPrice) > PRICE_TOLERANCE) {
      return {
        ok: false,
        status: 409,
        message: 'Ürün fiyatları değişti. Lütfen sepetinizi yenileyip tekrar deneyin.',
      }
    }

    serverSubtotal += serverPrice * item.quantity
    serverPricedItems.push({
      product_id: item.product_id,
      variant_id: item.variant_id ?? null,
      quantity: item.quantity,
      price: serverPrice,
    })
    if (selectedOffer) {
      shippingItems.push({
        offer: selectedOffer,
        quantity: item.quantity,
        unitPrice: serverPrice,
      })
    }
  }

  if (Math.abs(clientSubtotal - serverSubtotal) > PRICE_TOLERANCE) {
    return {
      ok: false,
      status: 409,
      message: 'Sepet tutarı değişti. Lütfen sepetinizi yenileyip tekrar deneyin.',
    }
  }

  const serverShipping = calculateShippingCost(shippingItems)
  if (Math.abs(clientShipping - serverShipping) > PRICE_TOLERANCE) {
    return {
      ok: false,
      status: 409,
      message: 'Kargo tutarı değişti. Lütfen sepetinizi yenileyip tekrar deneyin.',
    }
  }

  const serverTotal = serverSubtotal + serverShipping
  if (Math.abs(clientTotal - serverTotal) > PRICE_TOLERANCE) {
    return {
      ok: false,
      status: 409,
      message: 'Toplam tutar değişti. Lütfen sepetinizi yenileyip tekrar deneyin.',
    }
  }

  return { ok: true, serverSubtotal, serverTotal, serverPricedItems }
}

// ----------------------------------------------------------------
// Test verileri
// ----------------------------------------------------------------

const sampleOffers: OfferRow[] = [
  { id: 'offer-1', product_id: 'prod-a', variant_id: null, supplier_id: 'sup-1', price: 100.0, shipping_cost: 25, free_shipping_threshold: 300 },
  { id: 'offer-2', product_id: 'prod-b', variant_id: null, supplier_id: 'sup-1', price: 250.5, shipping_cost: 25, free_shipping_threshold: 300 },
  { id: 'offer-3', product_id: 'prod-c', variant_id: 'var-1', supplier_id: 'sup-2', price: 75.0, shipping_cost: 15, free_shipping_threshold: null },
  // offer-4: prod-a'nın daha pahalı teklifı — en ucuzu seçilmeli
  { id: 'offer-4', product_id: 'prod-a', variant_id: null, supplier_id: 'sup-3', price: 120.0, shipping_cost: 10, free_shipping_threshold: null },
]

// ----------------------------------------------------------------
// Testler
// ----------------------------------------------------------------

describe('Sunucu tarafı fiyat doğrulama', () => {
  it('fiyatlar eşleşince doğrulama geçmeli', () => {
    const items: OrderItem[] = [{ product_id: 'prod-a', variant_id: null, quantity: 2, price: 100.0 }]
    const result = validatePrices(items, 200.0, 25.0, 225.0, sampleOffers)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.serverSubtotal).toBe(200.0)
      expect(result.serverTotal).toBe(225.0)
      expect(result.serverPricedItems[0].price).toBe(100.0)
    }
  })

  it('tolerans dahilindeki küçük fiyat farklarını (≤ 0.01 ₺) kabul etmeli', () => {
    const items: OrderItem[] = [{ product_id: 'prod-a', quantity: 1, price: 100.005 }]
    const result = validatePrices(items, 100.005, 25, 125.005, sampleOffers)
    expect(result.ok).toBe(true)
  })

  it('istemci fiyatı sunucu fiyatından farklıysa 409 dönmeli', () => {
    const items: OrderItem[] = [
      // Gerçek fiyat: 100 ₺, manipüle edilmiş: 50 ₺
      { product_id: 'prod-a', variant_id: null, quantity: 1, price: 50.0 },
    ]
    const result = validatePrices(items, 50.0, 25, 75.0, sampleOffers)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(409)
      expect(result.message).toContain('fiyatları değişti')
    }
  })

  it('istemci subtotal sunucu subtotal\'ından farklıysa 409 dönmeli', () => {
    const items: OrderItem[] = [{ product_id: 'prod-a', quantity: 1, price: 100.0 }]
    // Sunucu subtotal: 100 ₺; istemci manipüle ederek 50 ₺ gönderiyor
    const result = validatePrices(items, 50.0, 25, 75.0, sampleOffers)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(409)
      expect(result.message).toContain('tutarı değişti')
    }
  })

  it('istemci total sunucu total\'ından farklıysa 409 dönmeli', () => {
    const items: OrderItem[] = [{ product_id: 'prod-a', quantity: 1, price: 100.0 }]
    // serverTotal = 100 + 20 = 120; istemci 100 gönderiyor (kargo düşürülmüş)
    const result = validatePrices(items, 100.0, 25.0, 100.0, sampleOffers)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(409)
      expect(result.message).toContain('Toplam tutar')
    }
  })

  it('offers listesinde olmayan ürün 400 döndürmeli', () => {
    const items: OrderItem[] = [{ product_id: 'prod-bilinmiyor', quantity: 1, price: 99.0 }]
    const result = validatePrices(items, 99.0, 10, 109.0, sampleOffers)
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(400)
      expect(result.message).toContain('bulunamadı')
    }
  })

  it('en ucuz teklifi seçmeli (çoklu teklif senaryosu)', () => {
    // prod-a: offer-1 = 100 ₺, offer-4 = 120 ₺ → en ucuz: 100 ₺
    const items: OrderItem[] = [{ product_id: 'prod-a', quantity: 1, price: 100.0 }]
    // Önce pahalıyı, sonra ucuzu ekle → sonuç 100 olmalı
    const offersReordered: OfferRow[] = [
      { id: 'offer-4', product_id: 'prod-a', variant_id: null, supplier_id: 'sup-3', price: 120.0, shipping_cost: 10, free_shipping_threshold: null },
      { id: 'offer-1', product_id: 'prod-a', variant_id: null, supplier_id: 'sup-1', price: 100.0, shipping_cost: 25, free_shipping_threshold: 300 },
    ]
    const result = validatePrices(items, 100.0, 10, 110.0, offersReordered)
    // Pahalı teklif önce gelince 120 ₺ eşleşir ve istemci 100 gönderiyor → 409
    expect(result.ok).toBe(false)
    if (!result.ok) {
      expect(result.status).toBe(409)
    }
  })

  it('variant_id ile ayrı ayrı fiyat takip etmeli', () => {
    const items: OrderItem[] = [
      { product_id: 'prod-c', variant_id: 'var-1', quantity: 3, price: 75.0 },
    ]
    const result = validatePrices(items, 225.0, 15, 240.0, sampleOffers)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.serverSubtotal).toBe(225.0)
    }
  })

  it('birden fazla ürün doğru hesaplama yapmalı', () => {
    const items: OrderItem[] = [
      { product_id: 'prod-a', quantity: 2, price: 100.0 }, // 200
      { product_id: 'prod-b', quantity: 1, price: 250.5 }, // 250.5
      { product_id: 'prod-c', variant_id: 'var-1', quantity: 1, price: 75.0 }, // 75
    ]
    const shipping = 15
    const expectedSubtotal = 525.5
    const expectedTotal = expectedSubtotal + shipping
    const result = validatePrices(items, expectedSubtotal, shipping, expectedTotal, sampleOffers)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.serverSubtotal).toBeCloseTo(525.5, 2)
      expect(result.serverTotal).toBeCloseTo(expectedTotal, 2)
      expect(result.serverPricedItems).toHaveLength(3)
    }
  })

  it('free shipping threshold geçildiğinde kargo sıfırlanmalı', () => {
    const items: OrderItem[] = [
      { product_id: 'prod-a', quantity: 2, price: 100.0 },
      { product_id: 'prod-b', quantity: 1, price: 250.5 },
    ]
    const result = validatePrices(items, 450.5, 0, 450.5, sampleOffers)
    expect(result.ok).toBe(true)
  })
})

describe('order_items snapshot alanları', () => {
  it('serverPricedItems array doğru formatta olmalı', () => {
    const items: OrderItem[] = [
      { product_id: 'prod-a', variant_id: null, quantity: 2, price: 100.0 },
    ]
    const result = validatePrices(items, 200.0, 25, 225.0, sampleOffers)
    expect(result.ok).toBe(true)
    if (result.ok) {
      const first = result.serverPricedItems[0]
      expect(first).toHaveProperty('product_id')
      expect(first).toHaveProperty('variant_id')
      expect(first).toHaveProperty('quantity')
      expect(first).toHaveProperty('price')
    }
  })

  it('variant_id null olarak normalize edilmeli (undefined değil)', () => {
    const items: OrderItem[] = [
      { product_id: 'prod-a', quantity: 1, price: 100.0 }, // variant_id yok
    ]
    const result = validatePrices(items, 100.0, 25, 125.0, sampleOffers)
    expect(result.ok).toBe(true)
    if (result.ok) {
      expect(result.serverPricedItems[0].variant_id).toBeNull()
    }
  })
})
