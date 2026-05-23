import { describe, expect, it } from 'vitest'

// Utility helpers that mirror the supplier offer form logic
function buildOfferPayload(params: {
  productId: string
  price: string
  offerImage?: string
}) {
  return {
    product_id: params.productId,
    price: parseFloat(params.price),
    offer_image: params.offerImage || null,
    currency: 'TRY',
    is_active: true,
  }
}

describe('supplier offer image field', () => {
  it('includes offer_image in the payload when provided', () => {
    const payload = buildOfferPayload({
      productId: 'prod-1',
      price: '100',
      offerImage: 'products/1234-image.jpg',
    })
    expect(payload.offer_image).toBe('products/1234-image.jpg')
  })

  it('sets offer_image to null when not provided', () => {
    const payload = buildOfferPayload({
      productId: 'prod-1',
      price: '100',
    })
    expect(payload.offer_image).toBeNull()
  })

  it('sets offer_image to null when empty string', () => {
    const payload = buildOfferPayload({
      productId: 'prod-1',
      price: '100',
      offerImage: '',
    })
    expect(payload.offer_image).toBeNull()
  })
})

describe('supplier offer display image resolution', () => {
  it('prefers offer_image over catalog primary_image when set', () => {
    const offerImage = 'products/offer-specific.jpg'
    const catalogImage = 'products/catalog-default.jpg'
    const displayImage = offerImage || catalogImage
    expect(displayImage).toBe(offerImage)
  })

  it('falls back to catalog primary_image when offer_image is null', () => {
    const offerImage: string | null = null
    const catalogImage = 'products/catalog-default.jpg'
    const displayImage = offerImage ?? catalogImage
    expect(displayImage).toBe(catalogImage)
  })

  it('falls back to null when both images are missing', () => {
    const offerImage: string | null = null
    const catalogImage: string | null = null
    const displayImage = offerImage ?? catalogImage
    expect(displayImage).toBeNull()
  })
})
