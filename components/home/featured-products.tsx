'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, ShoppingCart, Star } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'
import { useWishlist } from '@/app/contexts/WishlistContext'
import { formatPrice } from '@/lib/utils/format'
import { toast } from 'sonner'
import type { Product } from '@/types/catalog.types'

interface FeaturedProductsProps {
  products: Product[]
}

export function FeaturedProducts({ products }: FeaturedProductsProps) {
  const { addItem } = useCart()
  const { items: wishlistItems, addItem: addToWishlist, removeItem: removeFromWishlist } = useWishlist()
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})

  // Use first 8 products
  const displayProducts = products.slice(0, 8)

  const handleAddToCart = async (product: Product) => {
    setLoadingStates(prev => ({ ...prev, [product.id]: true }))
    try {
      await addItem(product.id, 1)
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
      const wishlistItem = wishlistItems.find(item => item.product_id === productId)
      if (wishlistItem) {
        await removeFromWishlist(wishlistItem.id)
        toast.success('Favorilerden çıkarıldı')
      }
    } else {
      await addToWishlist(productId)
      toast.success('Favorilere eklendi')
    }
  }

  const isInWishlist = (productId: string) => {
    return wishlistItems.some(item => item.product_id === productId)
  }

  // Mock price function - would come from offers in real scenario
  const getProductPrice = (product: Product) => {
    // This is a placeholder - actual price would come from product.offers
    return 1250 // Mock price
  }

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-main">
        <div className="text-center mb-10">
          <h2 className="section-title">Öne Çıkan Ürünler</h2>
          <p className="section-subtitle">
            En çok tercih edilen ürünler
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => {
            const price = getProductPrice(product)
            
            return (
              <div
                key={product.id}
                className="group card-base overflow-hidden"
              >
                {/* Image */}
                <div className="relative aspect-square bg-background overflow-hidden">
                  <Link href={`/urunler/${product.slug}`}>
                    {product.primary_image ? (
                      <Image
                        src={product.primary_image}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-background-elevated">
                        <ShoppingCart className="w-12 h-12 text-text-muted" />
                      </div>
                    )}
                  </Link>
                  
                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleToggleWishlist(product.id)}
                    className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
                      isInWishlist(product.id)
                        ? 'bg-red-500 text-white'
                        : 'bg-white/80 text-text-muted hover:text-red-500'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Brand */}
                  {product.brand_id && (
                    <p className="text-xs text-text-muted mb-1">Marka</p>
                  )}

                  {/* Title */}
                  <Link href={`/urunler/${product.slug}`}>
                    <h3 className="font-medium text-text-primary mb-2 line-clamp-2 group-hover:text-secondary transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < 4
                            ? 'text-accent fill-accent'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="text-xs text-text-muted ml-1">(4.0)</span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-primary">
                        {formatPrice(price)}
                      </p>
                    </div>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingStates[product.id]}
                    className="w-full py-2 bg-secondary text-white font-medium rounded-lg hover:bg-secondary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loadingStates[product.id] ? (
                      <span className="text-sm">Ekleniyor...</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-4 h-4" />
                        <span className="text-sm">Sepete Ekle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/urunler"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-light transition-all duration-200"
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
