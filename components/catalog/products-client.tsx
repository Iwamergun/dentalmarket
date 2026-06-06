'use client'

import * as React from 'react'
import { useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Filter } from 'lucide-react'
import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import { ProductGrid } from '@/components/catalog/product-grid'
import { SortSelect } from '@/components/catalog/sort-select'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { filterAndSortProducts, parseCatalogFilters } from '@/lib/catalog/filtering'
import type { Category, Brand } from '@/types/catalog.types'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

interface ProductsClientProps {
  products: BestOfferProduct[]
  categories: Category[]
  brands: Brand[]
}

export function ProductsClient({ products, categories, brands }: ProductsClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
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
      <div className="space-y-4 sm:space-y-6">
        {categoryChips.length > 0 && (
          <div className="lg:hidden">
            <div className="-mx-4 overflow-x-auto border-y border-border/70 bg-white px-4 py-3 scrollbar-hide sm:mx-0 sm:rounded-2xl sm:border">
              <div className="flex min-w-max gap-2">
                <Link
                  href="/urunler"
                  className="inline-flex h-10 items-center rounded-full border border-primary/20 bg-primary px-4 text-xs font-semibold text-white shadow-sm"
                >
                  Tümü
                </Link>
                {categoryChips.map((category) => (
                  <Link
                    key={category.id}
                    href={`/kategoriler/${category.slug}`}
                    className="inline-flex h-10 items-center rounded-full border border-border bg-white px-4 text-xs font-semibold text-text-secondary shadow-sm transition-colors active:bg-primary/10 active:text-primary"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Filter Button and Sorting */}
        <div className="sticky top-[132px] z-30 -mx-4 border-y border-border/70 bg-background/95 px-4 py-3 backdrop-blur lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-0">
          <div className="flex flex-wrap items-center justify-between gap-3 lg:flex-nowrap">
            {/* Mobile Filter Button */}
            <div className="order-2 grid w-full grid-cols-2 gap-2 lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="md" className="h-11 w-full rounded-2xl border-border bg-white shadow-sm active:scale-[0.98]">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrele
                </Button>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[86dvh] overflow-hidden rounded-t-[2rem] p-0">
                <SheetHeader className="px-5 py-4">
                  <SheetTitle>Filtreler</SheetTitle>
                </SheetHeader>
                <div className="overflow-y-auto px-4 pb-6 pt-4">
                  <FilterSidebar categories={categories} brands={brands} />
                </div>
              </SheetContent>
            </Sheet>

            <div>
              <SortSelect className="h-11 w-full rounded-2xl border-border bg-white text-xs font-semibold shadow-sm" />
            </div>
          </div>

          {/* Results Count */}
          <div className="order-1 w-full shrink-0 text-xs font-medium text-text-secondary sm:text-sm lg:order-none lg:w-auto">
            <span className="font-semibold text-primary">{filteredProducts.length}</span> ürün bulundu
          </div>

          {/* Sorting */}
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
