'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { formatPrice } from '@/lib/utils/format'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/cart'
import { WishlistButton } from '@/components/WishlistButton'
import { useAuth } from '@/app/contexts/AuthContext'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

interface RelatedProductsProps {
  products: BestOfferProduct[]
  currentProductId: string
}

export function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  // Mevcut ürünü listeden çıkar
  const filteredProducts = products.filter(p => p.id !== currentProductId).slice(0, 4)
  
  if (filteredProducts.length === 0) return null

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold mb-6">Benzer Ürünler</h2>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {filteredProducts.map((product) => {
          const hasMultipleOffers = product.offer_count > 1
          return (
            <Link 
              key={product.id}
              href={`/urunler/${product.slug}`}
              className="group block"
            >
              <div className="overflow-hidden rounded-2xl border border-border/70 bg-white shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-premium">
                {/* Ürün Resmi */}
                <div className="relative m-3 aspect-square overflow-hidden rounded-2xl bg-white">
                  <Image
                    src={getImageUrl(product.primary_image)}
                    alt={product.name}
                    fill
                    className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                  />
                  {hasMultipleOffers && (
                    <span className="absolute top-2 right-2 bg-primary/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
                      {product.offer_count} satıcı
                    </span>
                  )}
                </div>
                
                {/* Ürün Bilgileri */}
                <div className="p-4 space-y-2">
                  {product.brand_name && (
                    <Badge variant="secondary" className="text-[10px]">{product.brand_name}</Badge>
                  )}
                  <h3 className="font-semibold text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  {authLoading ? (
                    <div className="h-5 w-20 animate-pulse rounded bg-muted" />
                  ) : !user ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        router.push('/giris')
                      }}
                      className="inline-flex items-center gap-1 rounded-lg bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Fiyat için giriş yapın
                    </button>
                  ) : product.min_price != null ? (
                    <p className="text-sm font-bold text-primary">{formatPrice(product.min_price)}</p>
                  ) : (
                    <p className="text-xs italic text-muted-foreground">Fiyat bilgisi yok</p>
                  )}
                  
                  <div className="flex items-center gap-2 pt-1" onClick={(e) => e.preventDefault()}>
                    <WishlistButton
                      productId={product.id}
                      productName={product.name}
                      size="sm"
                      className="!h-10 !w-auto flex-1 !rounded-xl border-border bg-white shadow-sm hover:border-red-200 hover:bg-red-50"
                    />
                    <AddToCartButton
                      productId={product.id}
                      productName={product.name}
                      iconOnly
                      className="!h-10 !w-auto flex-1"
                    />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
