import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils/imageHelper'
import type { Product } from '@/types/catalog.types'
import { AddToCartButton } from '@/components/cart'

interface RelatedProductsProps {
  products: Product[]
  currentProductId: string
}

export function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  // Mevcut ürünü listeden çıkar
  const filteredProducts = products.filter(p => p.id !== currentProductId).slice(0, 4)
  
  if (filteredProducts.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <Link 
            key={product.id}
            href={`/urunler/${product.slug}`}
            className="group block"
          >
            <div className="bg-card border border-border/50 rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-lg transition-all duration-300">
              {/* Ürün Resmi */}
              <div className="relative aspect-square bg-white">
                <Image
                  src={getImageUrl(product.primary_image)}
                  alt={product.name}
                  fill
                  className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              {/* Ürün Bilgileri */}
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                
                <div onClick={(e) => e.preventDefault()}>
                  <AddToCartButton
                    productId={product.id}
                    productName={product.name}
                    size="sm"
                    fullWidth
                  />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
