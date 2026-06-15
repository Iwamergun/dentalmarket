'use client'

import * as React from 'react'
import { useSearchParams } from 'next/navigation'
import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import { ProductGrid } from '@/components/catalog/product-grid'
import { SortSelect } from '@/components/catalog/sort-select'
import { filterAndSortProducts, parseCatalogFilters } from '@/lib/catalog/filtering'
import type { Category, Brand } from '@/types/catalog.types'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

interface BrandProductsClientProps {
  products: BestOfferProduct[]
  categories: Category[]
  brands: Brand[]
  currentBrandId: string
}

export function BrandProductsClient({ 
  products, 
  categories, 
  brands, 
  currentBrandId 
}: BrandProductsClientProps) {
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
            selectedBrandId={currentBrandId}
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
              selectedBrandId={currentBrandId}
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
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  )
}
