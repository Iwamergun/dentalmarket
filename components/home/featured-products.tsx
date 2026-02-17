'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, ShoppingCart, Star, TrendingUp } from 'lucide-react'
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

  // TODO: Replace with actual price from product offers
  // Mock price function - would come from offers in real scenario
  const getProductPrice = () => {
    // This is a placeholder - actual price would come from product.offers
    return 1250 // Mock price
  }

  // Discount percentage for display (TODO: Get from actual product discount data)
  const MOCK_DISCOUNT_PERCENT = 20
  const MOCK_ORIGINAL_PRICE_MULTIPLIER = 1.25 // Original price = current price * 1.25 (20% off)

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container-main">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-accent/10 to-purple/10 rounded-full mb-4">
            <TrendingUp className="w-5 h-5 text-accent" />
            <span className="text-sm font-bold text-accent">EN ÇOK SATANLAR</span>
          </div>
          <h2 className="section-title">
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Öne Çıkan Ürünler
            </span>
          </h2>
          <p className="section-subtitle">
            En çok <span className="font-bold text-accent">tercih edilen</span> ürünler
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {displayProducts.map((product) => {
            const price = getProductPrice()
            
            return (
              <div
                key={product.id}
                className="group relative card-base overflow-hidden"
              >
                {/* Best Seller Badge */}
                <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-gradient-to-r from-accent to-accent-light text-white text-xs font-bold rounded-full shadow-lg">
                  ÇOK SATANLAR
                </div>

                {/* Image */}
                <div className="relative aspect-square bg-background overflow-hidden">
                  <Link href={`/urunler/${product.slug}`}>
                    {product.primary_image ? (
                      <Image
                        src={product.primary_image.startsWith('/') ? product.primary_image : `/${product.primary_image}`}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-background-elevated">
                        <ShoppingCart className="w-12 h-12 text-text-muted" />
                      </div>
                    )}
                  </Link>
                  
                  {/* Wishlist Button - Vibrant */}
                  <button
                    onClick={() => handleToggleWishlist(product.id)}
                    className={`absolute top-3 right-3 z-10 p-2.5 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110 ${
                      isInWishlist(product.id)
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white shadow-lg'
                        : 'bg-white/90 text-text-muted hover:text-red-500 shadow-md'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Brand */}
                  {product.brand_id && (
                    <p className="text-xs text-text-muted font-medium mb-1">Premium Marka</p>
                  )}

                  {/* Title */}
                  <Link href={`/urunler/${product.slug}`}>
                    <h3 className="font-bold text-text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {/* Rating - TODO: Replace with actual product rating from database */}
                  <div className="flex items-center gap-1 mb-3">
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
                    <span className="text-xs text-text-muted ml-1 font-medium">(4.0)</span>
                  </div>

                  {/* Price - Premium Display */}
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="text-xl font-extrabold bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
                        {formatPrice(price)}
                      </p>
                      <p className="text-xs text-text-muted line-through">
                        {formatPrice(price * MOCK_ORIGINAL_PRICE_MULTIPLIER)}
                      </p>
                    </div>
                    <div className="px-2 py-1 bg-gradient-to-r from-success/10 to-success/20 rounded-full">
                      <span className="text-xs font-bold text-success">-{MOCK_DISCOUNT_PERCENT}%</span>
                    </div>
                  </div>

                  {/* Add to Cart Button - Premium */}
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={loadingStates[product.id]}
                    className="w-full py-3 bg-gradient-to-r from-accent to-accent-light text-white font-bold rounded-xl hover:shadow-glow-accent transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transform hover:scale-105"
                  >
                    {loadingStates[product.id] ? (
                      <span className="text-sm">Ekleniyor...</span>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5" />
                        <span className="text-sm">Sepete Ekle</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* View All Button */}
        <div className="text-center mt-10">
          <Link
            href="/urunler"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-primary to-primary-light text-white font-bold rounded-xl hover:shadow-premium transition-all duration-300 transform hover:scale-105"
          >
            <span>Tüm Ürünleri Gör</span>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
