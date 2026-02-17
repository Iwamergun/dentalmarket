'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'
import { useWishlist } from '@/app/contexts/WishlistContext'
import { formatPrice } from '@/lib/utils/format'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { toast } from 'sonner'
import type { Product } from '@/types/catalog.types'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addToCart } = useCart()
  const { items: wishlistItems, addToWishlist, removeFromWishlist } = useWishlist()
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  // Use first 8 products (changed to 6 for better 3-column grid)
  const displayProducts = products.slice(0, 6)

  const handleAddToCart = async (product: Product) => {
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
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-extrabold text-body-text mb-3">Öne Çıkan Ürünler</h2>
          <p className="text-secondary-text text-lg">
            En çok tercih edilen ürünler
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayProducts.map((product, index) => {
            const { price, discount, stock } = getProductData(index)
            const discountedPrice = discount > 0 ? price * (1 - discount / 100) : price
            const isLowStock = stock < 10
            
            return (
              <div
                key={product.id}
                className="group bg-gradient-to-br from-white to-muted/30 border-2 border-border rounded-2xl overflow-hidden hover:shadow-2xl hover:border-primary/40 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative aspect-square bg-muted overflow-hidden">
                  <Link href={`/urunler/${product.slug}`}>
                    {product.primary_image ? (
                      <Image
                        src={getImageUrl(product.primary_image)}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <ShoppingCart className="w-16 h-16 text-secondary-text" />
                      </div>
                    )}
                  </Link>
                  
                  {/* Discount Badge */}
                  {discount > 0 && (
                    <div className="absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r from-destructive to-destructive/80 text-white text-xs font-bold rounded-lg border-2 border-white shadow-lg">
                      %{discount} İndirim
                    </div>
                  )}
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleToggleWishlist(product.id)}
                    className={`absolute top-3 right-3 p-2.5 rounded-xl bg-white/95 backdrop-blur shadow-md transition-all duration-200 ${
                      isInWishlist(product.id)
                        ? 'text-destructive scale-110'
                        : 'text-secondary-text hover:text-destructive hover:scale-110'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-5">
                  {/* Brand */}
                  {product.brand_id && (
                    <p className="text-[10px] font-bold text-primary uppercase tracking-[0.15em] mb-2">PREMIUM BRAND</p>
                  )}

                  {/* Title */}
                  <Link href={`/urunler/${product.slug}`}>
                    <h3 className="font-bold text-body-text mb-3 line-clamp-2 group-hover:text-primary transition-colors min-h-[3rem]">
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
                    {discount > 0 && (
                      <p className="text-sm text-secondary-text line-through mb-1">
                        {formatPrice(price)}
                      </p>
                    )}
                    <p className="text-2xl font-extrabold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                      {formatPrice(discountedPrice)}
                    </p>
                  </div>

                  {/* Stock Info */}
                  <div className="mb-4">
                    {isLowStock ? (
                      <p className="text-xs text-destructive font-bold bg-destructive/10 px-2.5 py-1 rounded-full inline-block animate-pulse">
                        Son {stock} Ürün!
                      </p>
                    ) : (
                      <p className="text-xs text-success font-bold bg-success/10 px-2.5 py-1 rounded-full inline-block">
                        Stokta ({stock} adet)
                      </p>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingStates[product.id]}
                    className="w-full bg-gradient-to-r from-accent via-warning to-accent hover:from-warning hover:via-accent hover:to-warning text-white font-bold rounded-xl h-12 border-2 border-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingStates[product.id] ? (
                      <span>Ekleniyor...</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span>Sepete Ekle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-200"
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
