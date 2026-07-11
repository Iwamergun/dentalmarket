'use client'

import { ProductCard } from '@/components/catalog/product-card'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

interface RelatedProductsProps {
  products: BestOfferProduct[]
  currentProductId: string
}

export function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  const filteredProducts = products.filter(p => p.id !== currentProductId).slice(0, 4)

  if (filteredProducts.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
