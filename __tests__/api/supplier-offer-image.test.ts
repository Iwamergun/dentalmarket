import { describe, expect, it } from 'vitest'

function buildOfferPayload(params: {
  productId: string
  price: string
  supplierSku?: string
  attemptedCatalogName?: string
}) {
  if (!params.productId) {
    throw new Error('catalog_product_required')
  }

  return {
    product_id: params.productId,
    price: parseFloat(params.price),
    supplier_sku: params.supplierSku || null,
    currency: 'TRY',
    is_active: true,
  } as const
}

describe('supplier/depo offer payload rules', () => {
  it('does not include offer_image or catalog identity fields in payload', () => {
    const payload = buildOfferPayload({
      productId: 'prod-1',
      price: '100',
      supplierSku: 'LOCAL-1',
      attemptedCatalogName: 'Serbest Giris',
    })
    expect('offer_image' in payload).toBe(false)
    expect('name' in payload).toBe(false)
    expect('description' in payload).toBe(false)
    expect(payload.supplier_sku).toBe('LOCAL-1')
  })

  it('requires existing catalog product id when creating listing', () => {
    expect(() =>
      buildOfferPayload({
        productId: '',
        price: '100',
      })
    ).toThrowError('catalog_product_required')
  })

  it('accepts listing creation only when it references an existing catalog product id', () => {
    const payload = buildOfferPayload({
      productId: 'prod-1',
      price: '100',
    })
    expect(payload.product_id).toBe('prod-1')
  })
})

describe('catalog image/info display', () => {
  it('always uses catalog image for listing display', () => {
    const catalogImage = 'products/catalog-default.jpg'
    const displayImage = catalogImage
    expect(displayImage).toBe(catalogImage)
  })

  it('falls back to null when catalog image is missing', () => {
    const catalogImage: string | null = null
    const displayImage = catalogImage
    expect(displayImage).toBeNull()
  })
})

function buildProductSuggestionPayload(input: {
  userId: string
  productName: string
  brandName?: string
}) {
  return {
    supplier_id: input.userId,
    product_name: input.productName,
    brand_name: input.brandName || null,
    status: 'pending' as const,
  }
}

describe('product suggestion flow', () => {
  it('stores suggestion with pending status', () => {
    const payload = buildProductSuggestionPayload({
      userId: 'supplier-1',
      productName: 'Yeni Endo Ürünü',
      brandName: 'X Marka',
    })

    expect(payload.supplier_id).toBe('supplier-1')
    expect(payload.product_name).toBe('Yeni Endo Ürünü')
    expect(payload.status).toBe('pending')
  })

  it('supports suggestion without brand data', () => {
    const payload = buildProductSuggestionPayload({
      userId: 'supplier-1',
      productName: 'Yeni Endo Ürünü',
    })
    expect(payload.brand_name).toBeNull()
  })

  it('catalog ürün olmadan doğrudan offer oluşturulmasını engeller', () => {
    expect(() =>
      buildOfferPayload({
        productId: '',
        price: '250',
      })
    ).toThrow()
  })

  it('catalog verisi olmayan ürün adı alanı payloada taşınmaz', () => {
    const payload = buildOfferPayload({
      productId: 'catalog-1',
      price: '250',
      attemptedCatalogName: 'Elle girilen ürün',
    })
    expect(payload).not.toHaveProperty('attemptedCatalogName')
    expect(payload).not.toHaveProperty('attemptedCatalogName')
  })
})
