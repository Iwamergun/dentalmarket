'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import { ProductImageCard } from '@/components/catalog/product-image-card'
import { SortSelect } from '@/components/catalog/sort-select'
import { filterAndSortProducts, parseCatalogFilters } from '@/lib/catalog/filtering'
import type { Category, Brand } from '@/types/catalog.types'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

interface CategoryProductsClientProps {
  products: BestOfferProduct[]
  categories: Category[]
  brands: Brand[]
  currentCategoryId: string
}

export function CategoryProductsClient({ 
  products, 
  categories, 
  brands, 
  currentCategoryId 
}: CategoryProductsClientProps) {
  const searchParams = useSearchParams()

  const filteredProducts = React.useMemo(() => {
    const filters = parseCatalogFilters(searchParams)
    return filterAndSortProducts(products, filters)
  }, [products, searchParams])

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block">
        <div className="sticky top-[160px]">
          <FilterSidebar 
            categories={categories} 
            brands={brands} 
            selectedCategoryId={currentCategoryId}
          />
        </div>
      </aside>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Mobile Filter Button and Sorting */}
        <div className="flex items-center justify-between gap-3">
          {/* Mobile Filter Button (FilterSidebar ships its own dialog) */}
          <div className="w-40 lg:hidden">
            <FilterSidebar 
              categories={categories} 
              brands={brands}
              selectedCategoryId={currentCategoryId}
            />
          </div>

          {/* Results Count */}
          <div className="text-sm text-text-secondary">
            <span className="font-semibold text-primary">{filteredProducts.length}</span> ürün bulundu
          </div>

          {/* Sorting */}
          <div className="hidden sm:block">
            <SortSelect />
          </div>
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductImageCard 
                key={product.id} 
                product={product} 
                href={`/urunler/${product.slug}`}
              />
            ))}
          </div>
        ) : (
          <div className="py-12 text-center">
            <p className="text-text-secondary">Henüz ürün bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </div>
  )
}
