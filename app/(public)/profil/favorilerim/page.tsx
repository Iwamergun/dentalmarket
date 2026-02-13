'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { 
  Heart, ShoppingCart, Trash2, Loader2, 
  RefreshCw, AlertCircle, Package
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/app/contexts/AuthContext'
import { useWishlist } from '@/app/contexts/WishlistContext'
import { useCart } from '@/app/contexts/CartContext'
import { getImageUrl } from '@/lib/utils/imageHelper'

export default function FavorilerimPage() {
  const { user, loading: authLoading } = useAuth()
  const { items, loading, error, removeFromWishlist, refreshWishlist } = useWishlist()
  const { addToCart } = useCart()
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)

  // Sayfa yüklendiğinde favorileri yenile
  useEffect(() => {
    if (!authLoading) {
      refreshWishlist()
    }
  }, [authLoading, refreshWishlist])

  // Sepete ekle
  const handleAddToCart = async (productId: string, productName: string) => {
    setAddingToCartId(productId)
    try {
      await addToCart(productId)
      toast.success(`"${productName}" sepete eklendi`)
    } catch {
      toast.error('Sepete eklenirken bir hata oluştu')
    } finally {
      setAddingToCartId(null)
    }
  }

  // Favorilerden çıkar
  const handleRemove = async (productId: string, productName: string) => {
    setRemovingId(productId)
    try {
      await removeFromWishlist(productId)
      toast.success(`"${productName}" favorilerden çıkarıldı`)
    } catch {
      toast.error('Favorilerden çıkarılırken bir hata oluştu')
    } finally {
      setRemovingId(null)
    }
  }

  // Loading skeleton
  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        <div>
          <div className="h-8 w-40 bg-background-card rounded animate-pulse mb-2" />
          <div className="h-5 w-64 bg-background-card rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-background-card rounded-xl border border-border p-4 h-80 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Favorilerim</h1>
          <p className="text-text-secondary">Beğendiğiniz ürünleri kaydedin</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={refreshWishlist} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Favorilerim</h1>
          <p className="text-text-secondary">
            {items.length > 0 
              ? `${items.length} ürün favorilerinizde`
              : 'Beğendiğiniz ürünleri kaydedin'
            }
          </p>
        </div>
        {items.length > 0 && (
          <Button onClick={refreshWishlist} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            Yenile
          </Button>
        )}
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div className="bg-background-card rounded-xl border border-border p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
            <Heart className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Favori ürününüz yok
          </h2>
          <p className="text-text-secondary mb-6 max-w-md mx-auto">
            Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca ulaşabilirsiniz.
          </p>
          <Link href="/urunler">
            <Button className="gap-2">
              <Package className="w-4 h-4" />
              Ürünleri Keşfet
            </Button>
          </Link>
        </div>
      ) : (
        /* Products Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => {
            const product = item.product
            
            return (
              <div 
                key={item.id} 
                className="bg-background-card rounded-xl border border-border overflow-hidden hover:border-primary/30 transition-colors group"
              >
                {/* Image */}
                <Link href={`/urunler/${product?.slug || item.product_id}`}>
                  <div className="aspect-square relative bg-background-deep">
                    <Image
                      src={getImageUrl(product?.primary_image)}
                      alt={product?.name || 'Ürün'}
                      fill
                      className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
                    />
                    
                    {/* Remove Button - Top Right */}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        handleRemove(item.product_id, product?.name || 'Ürün')
                      }}
                      disabled={removingId === item.product_id}
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-colors shadow-sm disabled:opacity-50"
                      title="Favorilerden çıkar"
                    >
                      {removingId === item.product_id ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Heart className="w-5 h-5 fill-current" />
                      )}
                    </button>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-4">
                  {/* Brand */}
                  {product?.brand && (
                    <Badge variant="secondary" className="mb-2">
                      {product.brand.name}
                    </Badge>
                  )}

                  {/* Name */}
                  <Link href={`/urunler/${product?.slug || item.product_id}`}>
                    <h3 className="font-medium text-text-primary line-clamp-2 mb-2 hover:text-primary transition-colors">
                      {product?.name || 'Ürün bilgisi yükleniyor...'}
                    </h3>
                  </Link>

                  {/* Description */}
                  {product?.short_description && (
                    <p className="text-sm text-text-secondary line-clamp-2 mb-3">
                      {product.short_description}
                    </p>
                  )}

                  {/* SKU */}
                  {product?.sku && (
                    <p className="text-xs text-text-muted mb-3">
                      SKU: {product.sku}
                    </p>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAddToCart(item.product_id, product?.name || 'Ürün')}
                      disabled={addingToCartId === item.product_id}
                      className="flex-1 gap-2"
                      size="sm"
                    >
                      {addingToCartId === item.product_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <ShoppingCart className="w-4 h-4" />
                      )}
                      Sepete Ekle
                    </Button>
                    <button
                      onClick={() => handleRemove(item.product_id, product?.name || 'Ürün')}
                      disabled={removingId === item.product_id}
                      className="p-2 rounded-lg border border-border text-text-muted hover:text-red-500 hover:border-red-500/30 hover:bg-red-500/5 transition-colors disabled:opacity-50"
                      title="Favorilerden çıkar"
                    >
                      {removingId === item.product_id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Login Prompt for Guests */}
      {!user && items.length > 0 && (
        <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
          <Heart className="w-10 h-10 mx-auto mb-3 text-primary" />
          <h3 className="font-semibold text-text-primary mb-2">
            Favorilerinizi Kaydetmek İster misiniz?
          </h3>
          <p className="text-text-secondary text-sm mb-4">
            Giriş yaparak favorilerinizi farklı cihazlardan da görüntüleyebilirsiniz.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/giris">
              <Button variant="outline">Giriş Yap</Button>
            </Link>
            <Link href="/kayit">
              <Button>Üye Ol</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
