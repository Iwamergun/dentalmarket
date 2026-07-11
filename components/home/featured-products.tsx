'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'
import { useAuth } from '@/app/contexts/AuthContext'
import { useWishlist } from '@/app/contexts/WishlistContext'
import { formatPrice } from '@/lib/utils/format'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { toast } from 'sonner'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'
import { productCardStyles } from '@/components/catalog/product-card-styles'

interface FeaturedProductsProps {
  products: BestOfferProduct[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { addToCart } = useCart()
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  // Use first 8 products (changed to 6 for better 3-column grid)
  const displayProducts = products.slice(0, 6)

  const handleAddToCart = async (product: BestOfferProduct) => {
    setLoadingStates(prev => ({ ...prev, [product.id]: true }))
    try {
      await addToCart(product.id, null, 1)
      toast.success('Ürün sepete eklendi')
    } catch (error) {
      toast.error('Bir hata oluştu')
      console.error(error)
    } finally {
      setLoadingStates(prev => ({ ...prev, [product.id]: false }))
    }
  }

  const handleToggleWishlist = async (productId: string) => {
    const isInWishlist = wishlistItems.some(item => item.product_id === productId)
    
    if (isInWishlist) {
      await removeFromWishlist(productId)
      toast.success('Favorilerden çıkarıldı')
    } else {
      await addToWishlist(productId)
      toast.success('Favorilere eklendi')
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId)
  }

  // TODO: Replace with actual price and stock from product offers
  // Mock data - would come from offers in real scenario
  const getProductData = (index: number) => {
    const prices = [1250, 890, 2340, 670, 1890, 450]
    const discounts = [20, 0, 15, 0, 25, 10]
    const stocks = [45, 12, 78, 3, 156, 89]
    
    return {
      price: prices[index % prices.length],
      discount: discounts[index % discounts.length],
      stock: stocks[index % stocks.length],
    }
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white px-4 py-8 md:px-6 md:py-10">
      <div>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Ürün seçkisi</p>
          <h2 className="mt-2 text-2xl font-bold text-slate-900 md:text-3xl">Öne Çıkan Ürünler</h2>
          <p className="mt-2 text-sm text-slate-500 md:text-base">En çok tercih edilen ürünleri sade kart düzeniyle keşfedin.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {displayProducts.map((product, index) => {
            const { price, discount, stock } = getProductData(index)
            const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price
            const isLowStock = stock < 10
            
            return (
              <div
                key={product.id}
                className={`group min-h-[380px] ${productCardStyles.surface}`}
              >
                {/* Image */}
                <div className={productCardStyles.imageWrap}>
                  <Link href={`/urunler/${product.slug}`} className="block h-full w-full">
                    {product.primary_image ? (
                      <Image
                        src={getImageUrl(product.primary_image)}
                        alt={product.name}
                        fill
                        className={productCardStyles.image}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[1.35rem] bg-muted">
                        <ShoppingCart className="w-16 h-16 text-secondary-text" />
                      </div>
                    )}
                  </Link>
                  
                  {discount > 0 && <div className="absolute left-2 top-2 rounded-full border border-destructive/20 bg-white px-2 py-0.5 text-[11px] font-semibold text-destructive">%{discount}</div>}
                  
                </div>

                {/* Content */}
                <div className={productCardStyles.content}>
                  {/* Brand */}
                  {product.brand_id && (
                    <p className={productCardStyles.brand}>Premium Brand</p>
                  )}

                  {/* Title */}
                  <Link href={`/urunler/${product.slug}`}>
                    <h3 className={productCardStyles.name}>
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="mb-2 flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4
                            ? 'text-warning fill-warning'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-1 text-xs text-slate-500">(4.0)</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {authLoading ? (
                      <div className="h-8 w-32 animate-pulse rounded bg-muted" />
                    ) : !user ? (
                      <button
                        type="button"
                        onClick={() => router.push('/giris')}
                        className={productCardStyles.authPrompt}
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Fiyat için giriş yapın
                      </button>
                    ) : (
                      <>
                        {discount > 0 && (
                          <p className="mb-1 text-sm text-slate-500 line-through">
                            {formatPrice(price)}
                          </p>
                        )}
                        <p className={productCardStyles.price}>
                          {formatPrice(discountedPrice)}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Stock Info */}
                  <div className="mb-4">
                    {isLowStock ? (
                      <p className="inline-block rounded-full border border-destructive/20 bg-destructive/5 px-2.5 py-1 text-xs font-medium text-destructive">
                        Son {stock} Ürün!
                      </p>
                    ) : (
                      <p className="inline-block rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                        Stokta ({stock} adet)
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`flex h-10 flex-1 items-center justify-center rounded-lg border bg-white transition-all duration-200 ${
                        isInWishlist(product.id)
                          ? 'border-destructive/25 text-destructive'
                          : 'border-slate-200 text-slate-500 hover:border-destructive/25 hover:bg-destructive/5 hover:text-destructive'
                      }`}
                      aria-label={isInWishlist(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                      title={isInWishlist(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={loadingStates[product.id]}
                      className="flex h-10 flex-1 items-center justify-center rounded-lg bg-primary text-white transition-colors duration-200 hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="Sepete ekle"
                      title="Sepete ekle"
                    >
                      {loadingStates[product.id] ? (
                        <span className="h-5 w-5 animate-pulse rounded-full bg-white/70" />
                      ) : (
                        <ShoppingCart className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/urunler"
            className="inline-flex h-12 items-center gap-2 rounded-2xl bg-primary px-8 text-sm font-semibold text-white shadow-premium transition-all duration-200 hover:bg-primary/90"
          >
            Tüm Ürünleri Gör
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
