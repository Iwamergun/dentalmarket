'use client'

import * as React from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import { ProductGrid } from '@/components/catalog/product-grid'
import { SortSelect } from '@/components/catalog/sort-select'
import { filterAndSortProducts, parseCatalogFilters } from '@/lib/catalog/filtering'
import type { Category, Brand } from '@/types/catalog.types'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

interface ProductsClientProps {
  products: BestOfferProduct[]
  categories: Category[]
  brands: Brand[]
}

export function ProductsClient({ products, categories, brands }: ProductsClientProps) {
  const searchParams = useSearchParams()
  const categoryChips = React.useMemo(
    () => categories.filter((category) => !category.parent_id).slice(0, 12),
    [categories]
  )

  const filteredProducts = React.useMemo(() => {
    const filters = parseCatalogFilters(searchParams)
    return filterAndSortProducts(products, filters)
  }, [products, searchParams])

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-[300px_1fr] lg:gap-8 xl:gap-10">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block">
        <div className="sticky top-[160px]">
          <FilterSidebar categories={categories} brands={brands} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="space-y-3">
        {categoryChips.length > 0 && (
          <div className="lg:hidden">
            <div className="-mx-4 overflow-x-auto border-y border-border/70 bg-white px-4 py-3 scrollbar-hide sm:mx-0 sm:rounded-2xl sm:border">
              <div className="flex min-w-max gap-2">
                <Link
                  href="/urunler"
                  className="inline-flex h-9 items-center rounded-full border border-primary/20 bg-primary px-3 text-xs font-semibold text-white shadow-sm"
                >
                  Tümü
                </Link>
                {categoryChips.map((category) => (
                  <Link
                    key={category.id}
                    href={`/kategoriler/${category.slug}`}
                    className="inline-flex h-9 items-center rounded-full border border-border bg-white px-3 text-xs font-semibold text-text-secondary shadow-sm transition-colors active:bg-primary/10 active:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Filter Button and Sorting — NOT sticky, scrolls with content */}
        <div className="lg:p-0">
          <div className="flex flex-wrap items-center justify-between gap-2 lg:flex-nowrap">
            {/* Mobile Filter Button + Sort (visible only on mobile/tablet) */}
            <div className="flex w-full gap-2 lg:hidden">
              <FilterSidebar categories={categories} brands={brands} />
              <SortSelect className="h-9 flex-1 rounded-xl border-border bg-white text-xs font-semibold shadow-sm" />
            </div>

            {/* Results Count */}
            <div className="w-full shrink-0 text-xs font-medium text-text-secondary sm:text-sm lg:w-auto">
              <span className="font-semibold text-primary">{filteredProducts.length}</span> ürün bulundu
            </div>

            {/* Sorting — desktop only */}
            <div className="hidden lg:block">
              <SortSelect />
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={filteredProducts} />
      </div>
    </div>
  )
}
