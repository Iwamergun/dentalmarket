import type { BestOfferProduct } from '@/lib/supabase/queries/products'

export type CatalogSortOption = 'newest' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc'

export interface CatalogFilters {
  query: string
  categoryIds: string[]
  brandIds: string[]
  minPrice: number | null
  maxPrice: number | null
  minRating: number | null
  inStockOnly: boolean
  sort: CatalogSortOption
}

export interface FilterableBestOfferProduct extends BestOfferProduct {
  category_ids?: string[]
  rating_avg?: number | null
  review_count?: number
}

/**
 * Narrow type compatible with real URLSearchParams and test doubles.
 * Some mocks only implement `get`, so `getAll` stays optional.
 */
type SearchParamsLike = Pick<URLSearchParams, 'get'> & Partial<Pick<URLSearchParams, 'getAll'>>

export function parseCatalogFilters(searchParams: SearchParamsLike): CatalogFilters {
  const parseIds = (key: string) => {
    const values = typeof searchParams.getAll === 'function'
      ? searchParams.getAll(key)
      : [searchParams.get(key)].filter((value): value is string => Boolean(value))

    return values
      .flatMap((value) => value.split(','))
      .map((item) => item.trim())
      .filter(Boolean)
  }

  const parseNumber = (value: string | null) => {
    if (!value) return null
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : null
  }

  const sort = (searchParams.get('sort') as CatalogSortOption | null) || 'newest'

  return {
    query: (searchParams.get('q') || '').trim(),
    categoryIds: parseIds('category'),
    brandIds: parseIds('brand'),
    minPrice: parseNumber(searchParams.get('minPrice')),
    maxPrice: parseNumber(searchParams.get('maxPrice')),
    minRating: parseNumber(searchParams.get('minRating')),
    inStockOnly: searchParams.get('inStock') === 'true',
    sort,
  }
}

export function filterAndSortProducts(
  products: FilterableBestOfferProduct[],
  filters: CatalogFilters
): FilterableBestOfferProduct[] {
  const normalizedQuery = filters.query.toLocaleLowerCase('tr')

  const filteredProducts = products.filter((product) => {
    const categoryIds = new Set(product.category_ids || [])

    if (normalizedQuery) {
      const searchableText = [
        product.name,
        product.sku,
        product.brand_name,
        product.category_name,
        product.short_description,
      ]
        .filter(Boolean)
        .join(' ')
        .toLocaleLowerCase('tr')

      if (!searchableText.includes(normalizedQuery)) return false
    }

    if (product.primary_category_id) {
      categoryIds.add(product.primary_category_id)
    }

    if (filters.categoryIds.length > 0) {
      const matchesCategory = filters.categoryIds.some((categoryId) => categoryIds.has(categoryId))
      if (!matchesCategory) return false
    }

    if (filters.brandIds.length > 0) {
      if (!product.brand_id || !filters.brandIds.includes(product.brand_id)) {
        return false
      }
    }

    const price = product.min_price ?? product.price_min

    if (filters.minPrice != null && (price == null || price < filters.minPrice)) {
      return false
    }

    if (filters.maxPrice != null && (price == null || price > filters.maxPrice)) {
      return false
    }

    if (filters.minRating != null) {
      const rating = product.rating_avg ?? 0
      if (rating < filters.minRating) {
        return false
      }
    }

    if (filters.inStockOnly) {
      const stock = product.best_stock ?? 0
      if (stock <= 0) {
        return false
      }
    }

    return true
  })

  return filteredProducts.sort((leftProduct, rightProduct) => {
    switch (filters.sort) {
      case 'price-asc':
        return (leftProduct.min_price ?? Number.POSITIVE_INFINITY) - (rightProduct.min_price ?? Number.POSITIVE_INFINITY)
      case 'price-desc':
        return (rightProduct.min_price ?? Number.NEGATIVE_INFINITY) - (leftProduct.min_price ?? Number.NEGATIVE_INFINITY)
      case 'name-asc':
        return leftProduct.name.localeCompare(rightProduct.name, 'tr')
      case 'name-desc':
        return rightProduct.name.localeCompare(leftProduct.name, 'tr')
      case 'newest':
      default:
        return 0
    }
  })
}