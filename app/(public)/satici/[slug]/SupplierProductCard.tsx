'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { ShoppingCart, Loader2, Check, Truck, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/app/contexts/AuthContext'
import { useCart } from '@/app/contexts/CartContext'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { formatPrice } from '@/lib/utils/format'
import { toast } from 'sonner'
import { productCardStyles } from '@/components/catalog/product-card-styles'

interface SupplierProductCardProps {
  offer: {
    id: string
    price: number
    stock_quantity: number | null
    lead_time_days: number | null
    shipping_cost: number | null
    payment_options: string[] | null
    product: {
      id: string
      name: string
      slug: string
      primary_image: string | null
      short_description: string | null
      sku: string | null
      brand_name: string | null
    }
  }
}

export function SupplierProductCard({ offer }: SupplierProductCardProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart } = useCart()

  const { product } = offer
  const isInStock = offer.stock_quantity === null || offer.stock_quantity > 0

  const handleAddToCart = async () => {
    if (!isInStock) return
    setIsAdding(true)
    try {
      await addToCart(product.id, null, 1, offer.id)
      setIsAdded(true)
      toast.success(`"${product.name}" sepete eklendi`)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error('Sepete ekleme hatası:', error)
      toast.error('Ürün sepete eklenemedi')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className={`min-h-[380px] ${productCardStyles.surface}`}>
      {/* Image */}
      <Link href={`/urunler/${product.slug}`} className="block">
        <div className={productCardStyles.imageWrap}>
          <Image
            src={getImageUrl(product.primary_image)}
            alt={product.name}
            fill
            className={productCardStyles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        </div>
      </Link>

      {/* Info */}
      <div className={productCardStyles.content}>
        {product.brand_name && (
          <p className={productCardStyles.brand}>{product.brand_name}</p>
        )}

        <Link href={`/urunler/${product.slug}`} className="block">
          <h3 className={productCardStyles.name}>
            {product.name}
          </h3>
        </Link>

        {product.sku && (
          <p className={productCardStyles.meta}>SKU: {product.sku}</p>
        )}

        {/* Price */}
        <div className="mt-2">
          {authLoading ? (
            <div className="h-7 w-24 animate-pulse rounded bg-muted" />
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
            <p className={productCardStyles.price}>{formatPrice(offer.price)}</p>
          )}
        </div>

        {/* Meta */}
        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
          {offer.stock_quantity != null && (
            <span>Stok: {offer.stock_quantity}</span>
          )}
          {offer.lead_time_days != null && (
            <span className="flex items-center gap-0.5">
              <Clock className="w-3 h-3" />
              {offer.lead_time_days === 0 ? 'Aynı gün' : `${offer.lead_time_days} gün`}
            </span>
          )}
          {user && offer.shipping_cost != null && (
            <span className="flex items-center gap-0.5">
              <Truck className="w-3 h-3" />
              {offer.shipping_cost === 0 ? 'Ücretsiz' : formatPrice(offer.shipping_cost)}
            </span>
          )}
        </div>

        {/* Add to Cart */}
        <div className="mt-auto pt-3">
          {isInStock ? (
            <Button
              size="sm"
              className="h-10 w-full gap-1.5 rounded-lg bg-primary text-white hover:bg-primary/90"
              onClick={handleAddToCart}
              disabled={isAdding || isAdded}
            >
              {isAdding ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  Eklendi
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  Sepete Ekle
                </>
              )}
            </Button>
          ) : (
            <Badge variant="danger" className="w-full justify-center py-1 text-xs">Stokta Yok</Badge>
          )}
        </div>
      </div>
    </div>
  )
}
