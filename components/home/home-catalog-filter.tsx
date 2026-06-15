'use client'

import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import type { Brand, Category } from '@/types/catalog.types'

interface HomeCatalogFilterProps {
  categories: Category[]
  brands: Brand[]
}

export function HomeCatalogFilter({ categories, brands }: HomeCatalogFilterProps) {
  return (
    <div className="w-full lg:w-80 lg:flex-shrink-0">
      <div className="lg:hidden">
        <div className="rounded-[28px] border border-border bg-white/90 p-5 shadow-card backdrop-blur">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Hizli Katalog</p>
          <h2 className="mt-2 text-2xl font-bold text-primary">Filtreleyip urun listesine gecin</h2>
          <p className="mt-2 text-sm text-text-secondary">
            Kategori, marka ve fiyat secip dogrudan urunler sayfasinda sonuclari gorun.
          </p>

          <div className="mt-4">
            <FilterSidebar categories={categories} brands={brands} applyPath="/urunler" />
          </div>
        </div>
      </div>

      <aside className="hidden lg:block">
        <div className="sticky top-[132px] space-y-4">
          <div className="rounded-[32px] border border-primary/10 bg-white p-6 shadow-card">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Hizli Katalog</p>
            <h2 className="mt-2 text-2xl font-bold text-primary">Dogru urune daha hizli ulasin</h2>
            <p className="mt-3 text-sm leading-6 text-text-secondary">
              Ana sayfada filtreyi bir on izleme gibi kullanin; uyguladiginiz secimler sizi dogrudan urunler listesine tasir.
            </p>
          </div>

          <FilterSidebar categories={categories} brands={brands} applyPath="/urunler" />
        </div>
      </aside>
    </div>
  )
}
