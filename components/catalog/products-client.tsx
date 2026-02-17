'use client'

import * as React from 'react'
import { useState } from 'react'
import { Filter } from 'lucide-react'
import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import { ProductGrid } from '@/components/catalog/product-grid'
import { SortSelect } from '@/components/catalog/sort-select'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import type { Category, Brand, ProductWithRelations } from '@/types/catalog.types'

interface ProductsClientProps {
  products: ProductWithRelations[]
  categories: Category[]
  brands: Brand[]
}

export function ProductsClient({ products, categories, brands }: ProductsClientProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
      {/* Desktop Sidebar - Hidden on mobile */}
      <aside className="hidden lg:block">
        <div className="sticky top-[160px]">
          <FilterSidebar categories={categories} brands={brands} />
        </div>
      </aside>

      {/* Main Content */}
      <div className="space-y-6">
        {/* Mobile Filter Button and Sorting */}
        <div className="flex items-center justify-between">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="md">
                  <Filter className="mr-2 h-4 w-4" />
                  Filtrele
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] overflow-y-auto p-0">
                <SheetHeader className="px-6 py-4">
                  <SheetTitle>Filtreler</SheetTitle>
                </SheetHeader>
                <div className="px-6 pb-6">
                  <FilterSidebar categories={categories} brands={brands} />
                </div>
              </SheetContent>
            </Sheet>
          </div>

          {/* Results Count */}
          <div className="text-sm text-text-secondary">
            <span className="font-semibold text-primary">{products.length}</span> ürün bulundu
          </div>

          {/* Sorting */}
          <div className="hidden sm:block">
            <SortSelect />
          </div>
        </div>

        {/* Product Grid */}
        <ProductGrid products={products} />
      </div>
    </div>
  )
}
