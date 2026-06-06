import { describe, expect, it } from 'vitest'
import { filterAndSortProducts, parseCatalogFilters, type FilterableBestOfferProduct } from '@/lib/catalog/filtering'

const products: FilterableBestOfferProduct[] = [
  {
    id: 'p-1',
    name: 'Ayna Seti',
    slug: 'ayna-seti',
    primary_image: null,
    sku: null,
    short_description: null,
    is_active: true,
    brand_id: 'brand-a',
    brand_name: 'Brand A',
    primary_category_id: 'cat-root',
    category_name: 'Kok Kategori',
    min_price: 100,
    best_supplier_id: null,
    best_stock: 12,
    best_lead_time: null,
    best_shipping_cost: null,
    offer_count: 1,
    price_min: 100,
    price_max: 100,
    category_ids: ['cat-root', 'cat-child'],
    rating_avg: 4.6,
    review_count: 8,
  },
  {
    id: 'p-2',
    name: 'Bonding Kit',
    slug: 'bonding-kit',
    primary_image: null,
    sku: null,
    short_description: null,
    is_active: true,
    brand_id: 'brand-b',
    brand_name: 'Brand B',
    primary_category_id: 'cat-other',
    category_name: 'Diger',
    min_price: 250,
    best_supplier_id: null,
    best_stock: 0,
    best_lead_time: null,
    best_shipping_cost: null,
    offer_count: 1,
    price_min: 250,
    price_max: 250,
    category_ids: ['cat-other'],
    rating_avg: 3.5,
    review_count: 2,
  },
]

describe('parseCatalogFilters', () => {
  it('URL parametrelerini filtre nesnesine cevirir', () => {
    const params = new URLSearchParams('q=ayna&category=cat-root,cat-child&brand=brand-a&minPrice=50&maxPrice=150&minRating=4&inStock=true&sort=price-asc')

    expect(parseCatalogFilters(params)).toEqual({
      query: 'ayna',
      categoryIds: ['cat-root', 'cat-child'],
      brandIds: ['brand-a'],
      minPrice: 50,
      maxPrice: 150,
      minRating: 4,
      inStockOnly: true,
      sort: 'price-asc',
    })
  })
})

describe('filterAndSortProducts', () => {
  it('kategori, marka, fiyat, rating ve stok filtrelerini birlikte uygular', () => {
    const filtered = filterAndSortProducts(products, {
      query: '',
      categoryIds: ['cat-child'],
      brandIds: ['brand-a'],
      minPrice: 90,
      maxPrice: 120,
      minRating: 4,
      inStockOnly: true,
      sort: 'newest',
    })

    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.id).toBe('p-1')
  })

  it('alfabetik siralamayi uygular', () => {
    const filtered = filterAndSortProducts(products, {
      query: '',
      categoryIds: [],
      brandIds: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStockOnly: false,
      sort: 'name-desc',
    })

    expect(filtered.map((product) => product.name)).toEqual(['Bonding Kit', 'Ayna Seti'])
  })

  it('q parametresi ile urun, marka ve kategori metninde arama yapar', () => {
    const filtered = filterAndSortProducts(products, {
      query: 'kok kategori',
      categoryIds: [],
      brandIds: [],
      minPrice: null,
      maxPrice: null,
      minRating: null,
      inStockOnly: false,
      sort: 'newest',
    })

    expect(filtered.map((product) => product.id)).toEqual(['p-1'])
  })
})