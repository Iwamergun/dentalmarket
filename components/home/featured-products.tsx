'use client'

import Link from 'next/link'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'
import { ProductCard } from '@/components/catalog/product-card'

interface FeaturedProductsProps {
  products: BestOfferProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const displayProducts = products.slice(0, 6)

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 py-8 md:px-6 md:py-10">
      <div>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Ürün seçkisi</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Öne Çıkan Ürünler</h2>
          <p className="mt-2 text-sm text-slate-500 md:text-base">En çok tercih edilen ürünleri sade kart düzeniyle keşfedin.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {displayProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/urunler"
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-primary px-6 text-sm font-semibold text-white transition-colors duration-200 hover:bg-primary/90"
          >
            Tüm Ürünleri Gör
          </Link>
        </div>
      </div>
    </section>
  )
}
