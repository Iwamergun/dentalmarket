import { ProductCard } from './product-card'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

interface ProductGridProps {
  products: BestOfferProduct[]
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white py-12 text-center">
        <p className="text-sm text-slate-500">Henüz ürün bulunmamaktadır.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 xl:grid-cols-4 2xl:grid-cols-5">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
