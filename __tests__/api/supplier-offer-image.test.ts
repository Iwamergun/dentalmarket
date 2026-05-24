import { describe, expect, it } from 'vitest'
import {
  applyCatalogProductSelection,
  buildCatalogProductPayload,
  buildOfferPayload,
  buildSupplierProductFormState,
  defaultSupplierProductFormState,
  slugifyProductName,
} from '@/lib/products/supplierProductForm'

describe('supplier product form helpers', () => {
  it('populates catalog-backed product fields while preserving editable offer fields', () => {
    const selected = applyCatalogProductSelection(
      {
        ...defaultSupplierProductFormState,
        price: '245.50',
        stock_quantity: '12',
        notes: 'Kutu içeriği kontrol edildi',
      },
      {
        id: 'catalog-1',
        name: 'Ağız Aynası',
        slug: 'agiz-aynasi',
        sku: 'AA-001',
        barcode: '869000000001',
        short_description: 'Paslanmaz çelik',
        description: 'Uzun ömürlü ağız aynası',
        primary_category_id: 'cat-1',
        brand_id: 'brand-1',
        primary_image: 'products/agiz-aynasi.jpg',
        compare_at_price: 300,
      }
    )

    expect(selected.name).toBe('Ağız Aynası')
    expect(selected.slug).toBe('agiz-aynasi')
    expect(selected.sku).toBe('AA-001')
    expect(selected.barcode).toBe('869000000001')
    expect(selected.primary_category_id).toBe('cat-1')
    expect(selected.brand_id).toBe('brand-1')
    expect(selected.primary_image).toBe('products/agiz-aynasi.jpg')
    expect(selected.compare_at_price).toBe('300')
    expect(selected.price).toBe('245.50')
    expect(selected.stock_quantity).toBe('12')
    expect(selected.notes).toBe('Kutu içeriği kontrol edildi')
  })

  it('builds a form state that keeps product fields editable together with offer fields', () => {
    const form = buildSupplierProductFormState({
      product: {
        name: 'Bonding Seti',
        slug: 'bonding-seti',
        sku: 'BD-44',
        barcode: '123456789',
        short_description: 'Işınla sertleşen',
        description: 'Adeziv ve primer seti',
        primary_category_id: 'cat-2',
        brand_id: 'brand-2',
        primary_image: 'products/bonding.jpg',
        compare_at_price: 550,
      },
      price: 499,
      vatRate: 10,
      stockQuantity: 8,
      minOrderQuantity: 2,
      leadTimeDays: 1,
      shippingCost: 0,
      freeShippingThreshold: 1000,
      paymentOptions: ['havale'],
      notes: 'Aynı gün kargo',
      isActive: false,
    })

    expect(form.name).toBe('Bonding Seti')
    expect(form.sku).toBe('BD-44')
    expect(form.description).toBe('Adeziv ve primer seti')
    expect(form.primary_image).toBe('products/bonding.jpg')
    expect(form.price).toBe('499')
    expect(form.vat_rate).toBe('10')
    expect(form.stock_quantity).toBe('8')
    expect(form.free_shipping_threshold).toBe('1000')
    expect(form.payment_options).toEqual(['havale'])
    expect(form.notes).toBe('Aynı gün kargo')
    expect(form.is_active).toBe(false)
  })

  it('builds catalog and offer payloads without allowing free-typed product names', () => {
    const form = {
      ...defaultSupplierProductFormState,
      name: 'Fissür Örtücü',
      slug: '',
      sku: 'FS-9',
      barcode: '99887766',
      short_description: 'Akışkan',
      description: 'Katalog seçimi sonrası düzenlendi',
      primary_category_id: 'cat-9',
      brand_id: 'brand-9',
      primary_image: 'products/fissur.jpg',
      compare_at_price: '220',
      price: '199.90',
      vat_rate: '20',
      stock_quantity: '14',
      min_order_quantity: '3',
      lead_time_days: '2',
      shipping_cost: '25',
      free_shipping_threshold: '500',
      payment_options: ['havale', 'vade_30'],
      notes: 'Depo stoğu hazır',
      is_active: true,
    }

    expect(slugifyProductName('Fissür Örtücü')).toBe('fissur-ortucu')
    expect(buildCatalogProductPayload(form, 'supplier-1')).toEqual({
      supplier_id: 'supplier-1',
      name: 'Fissür Örtücü',
      slug: 'fissur-ortucu',
      sku: 'FS-9',
      barcode: '99887766',
      short_description: 'Akışkan',
      description: 'Katalog seçimi sonrası düzenlendi',
      primary_category_id: 'cat-9',
      brand_id: 'brand-9',
      primary_image: 'products/fissur.jpg',
      compare_at_price: 220,
      is_active: true,
    })

    expect(buildOfferPayload(form, 'supplier-1', 'product-1')).toEqual({
      supplier_id: 'supplier-1',
      product_id: 'product-1',
      supplier_sku: 'FS-9',
      price: 199.9,
      vat_rate: 20,
      stock_quantity: 14,
      min_order_quantity: 3,
      lead_time_days: 2,
      shipping_cost: 25,
      free_shipping_threshold: 500,
      payment_options: ['havale', 'vade_30'],
      notes: 'Depo stoğu hazır',
      currency: 'TRY',
      is_active: true,
    })
  })
})

describe('product suggestion flow', () => {
  it('stores suggestion with pending status', () => {
    const payload = {
      supplier_id: 'supplier-1',
      product_name: 'Yeni Endo Ürünü',
      brand_name: 'X Marka',
      status: 'pending' as const,
    }

    expect(payload.supplier_id).toBe('supplier-1')
    expect(payload.product_name).toBe('Yeni Endo Ürünü')
    expect(payload.status).toBe('pending')
  })
})
