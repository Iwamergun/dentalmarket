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
    <div className="grid grid-cols-3 gap-2 min-[430px]:grid-cols-4 sm:grid-cols-3 sm:gap-4 lg:grid-cols-3 lg:gap-6 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
