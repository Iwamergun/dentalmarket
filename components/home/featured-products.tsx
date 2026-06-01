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
    <section className="rounded-[2rem] border border-border/60 bg-white/80 px-5 py-10 shadow-subtle backdrop-blur-sm md:px-8 md:py-12">
      <div>
        <div className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-text">Ürün seçkisi</p>
          <h2 className="mt-3 text-3xl font-bold text-body-text md:text-4xl">Öne Çıkan Ürünler</h2>
          <p className="mt-3 text-base text-secondary-text md:text-lg">En çok tercih edilen ürünleri daha sade bir kart sistemiyle keşfedin.</p>
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {displayProducts.map((product, index) => {
            const { price, discount, stock } = getProductData(index)
            const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price
            const isLowStock = stock < 10
            
            return (
              <div
                key={product.id}
                className="group flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-border/70 bg-white shadow-subtle transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-premium"
              >
                {/* Image */}
                <div className="relative m-3 aspect-square overflow-hidden rounded-[1.5rem] bg-muted">
                  <Link href={`/urunler/${product.slug}`} className="block h-full w-full">
                    {product.primary_image ? (
                      <Image
                        src={getImageUrl(product.primary_image)}
                        alt={product.name}
                        fill
                        className="rounded-[1.35rem] object-contain p-4 transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-[1.35rem] bg-muted">
                        <ShoppingCart className="w-16 h-16 text-secondary-text" />
                      </div>
                    )}
                  </Link>
                  
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-3 left-3 rounded-full border border-white/80 bg-destructive px-3 py-1.5 text-xs font-semibold text-white shadow-md">
                      %{discount} İndirim
                    </div>
                  )}
                  
                </div>

                {/* Content */}
                <div className="flex flex-1 flex-col p-5">
                  {/* Brand */}
                  {product.brand_id && (
                    <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">Premium Brand</p>
                  )}

                  {/* Title */}
                  <Link href={`/urunler/${product.slug}`}>
                    <h3 className="mb-3 min-h-[3rem] line-clamp-2 font-semibold text-body-text transition-colors group-hover:text-primary">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
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
                    <span className="text-xs text-secondary-text ml-1 font-medium">(4.0)</span>
                  </div>

                  {/* Price */}
                  <div className="mb-4">
                    {authLoading ? (
                      <div className="h-8 w-32 animate-pulse rounded bg-muted" />
                    ) : !user ? (
                      <button
                        type="button"
                        onClick={() => router.push('/giris')}
                        className="inline-flex items-center gap-1 rounded-full bg-primary/8 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/15"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Fiyat için giriş yapın
                      </button>
                    ) : (
                      <>
                        {discount > 0 && (
                          <p className="text-sm text-secondary-text line-through mb-1">
                            {formatPrice(price)}
                          </p>
                        )}
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(discountedPrice)}
                        </p>
                      </>
                    )}
                  </div>

                  {/* Stock Info */}
                  <div className="mb-4">
                    {isLowStock ? (
                      <p className="inline-block rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
                        Son {stock} Ürün!
                      </p>
                    ) : (
                      <p className="inline-block rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
                        Stokta ({stock} adet)
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex items-center gap-2 pt-4">
                    <button
                      type="button"
                      onClick={() => handleToggleWishlist(product.id)}
                      className={`flex h-12 flex-1 items-center justify-center rounded-2xl border bg-white shadow-sm transition-all duration-200 ${
                        isInWishlist(product.id)
                          ? 'border-destructive/25 text-destructive'
                          : 'border-border text-secondary-text hover:border-destructive/25 hover:bg-destructive/5 hover:text-destructive'
                      }`}
                      aria-label={isInWishlist(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                      title={isInWishlist(product.id) ? 'Favorilerden çıkar' : 'Favorilere ekle'}
                    >
                      <Heart className={`h-5 w-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                    </button>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={loadingStates[product.id]}
                      className="flex h-12 flex-1 items-center justify-center rounded-2xl bg-primary text-white shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50"
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
