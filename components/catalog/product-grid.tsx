import { ProductCard } from './product-card'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

interface ProductGridProps {
  products: BestOfferProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Henüz ürün bulunmamaktadır.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:grid-cols-4 md:gap-3 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
