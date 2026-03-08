'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ShoppingCart, Loader2, Check, Truck, Star, Clock, Package, Store } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/app/contexts/CartContext'
import { formatPrice } from '@/lib/utils/format'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { toast } from 'sonner'
import type { ProductOffer } from '@/lib/supabase/queries/products'

const PAYMENT_LABELS: Record<string, string> = {
  havale: 'Havale/EFT',
  kredi_karti: 'Kredi Kartı',
  vade_30: '30 Gün Vade',
  vade_60: '60 Gün Vade',
  vade_90: '90 Gün Vade',
}

interface SupplierOfferCardProps {
  offer: ProductOffer
  productId: string
  productName: string
  isBest?: boolean
}

export function SupplierOfferCard({ offer, productId, productName, isBest }: SupplierOfferCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const { addToCart } = useCart()

  const isInStock = offer.stock_quantity === null || offer.stock_quantity > 0

  const handleAddToCart = async () => {
    if (!isInStock) return
    setIsAdding(true)
    try {
      await addToCart(productId, null, 1, offer.offer_id)
      setIsAdded(true)
      toast.success(`"${productName}" sepete eklendi (${offer.supplier_name ?? 'Satıcı'})`)
      setTimeout(() => setIsAdded(false), 2000)
    } catch (error) {
      console.error('Sepete ekleme hatası:', error)
      toast.error('Ürün sepete eklenemedi')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className={`relative border rounded-xl p-4 transition-all ${isBest ? 'border-primary bg-primary/5 shadow-md' : 'border-border hover:border-primary/50 hover:shadow-sm'}`}>
      {isBest && (
        <Badge className="absolute -top-2.5 left-4 bg-primary text-white text-xs">En İyi Fiyat</Badge>
      )}

      <div className="flex items-start gap-4">
        {/* Supplier logo / avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center overflow-hidden">
          {offer.supplier_logo ? (
            <img src={getImageUrl(offer.supplier_logo)} alt={offer.supplier_name ?? ''} className="w-full h-full object-cover" />
          ) : (
            <Package className="w-6 h-6 text-muted-foreground" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-foreground truncate">{offer.supplier_name ?? 'Satıcı'}</span>
            {offer.supplier_rating != null && offer.supplier_rating > 0 && (
              <span className="flex items-center gap-0.5 text-sm text-amber-600">
                <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                {offer.supplier_rating.toFixed(1)}
                {offer.supplier_total_ratings != null && (
                  <span className="text-muted-foreground text-xs">({offer.supplier_total_ratings})</span>
                )}
              </span>
            )}
          </div>

          {/* Meta row */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-muted-foreground">
            {offer.lead_time_days != null && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {offer.lead_time_days === 0 ? 'Aynı gün' : `${offer.lead_time_days} iş günü`}
              </span>
            )}
            {offer.shipping_cost != null && (
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" />
                {offer.shipping_cost === 0 ? 'Ücretsiz kargo' : `Kargo: ${formatPrice(offer.shipping_cost)}`}
              </span>
            )}
            {offer.min_order_quantity != null && offer.min_order_quantity > 1 && (
              <span>Min. {offer.min_order_quantity} adet</span>
            )}
          </div>

          {/* Payment options */}
          {offer.payment_options && offer.payment_options.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {offer.payment_options.map((opt) => (
                <Badge key={opt} variant="secondary" className="text-[10px] px-1.5 py-0">
                  {PAYMENT_LABELS[opt] ?? opt}
                </Badge>
              ))}
            </div>
          )}

          {/* Notes */}
          {offer.notes && (
            <p className="text-xs text-muted-foreground mt-1 italic line-clamp-1">{offer.notes}</p>
          )}
        </div>

        {/* Price + CTA */}
        <div className="flex flex-col items-end gap-2 flex-shrink-0">
          <span className="text-xl font-bold text-primary">{formatPrice(offer.price)}</span>

          {!isInStock ? (
            <Badge variant="danger" className="text-xs">Stokta Yok</Badge>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={handleAddToCart}
                disabled={isAdding || isAdded}
                className="gap-1.5"
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
              {offer.supplier_slug && (
                <Link
                  href={`/satici/${offer.supplier_slug}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium border border-border rounded-md hover:bg-muted transition-colors"
                >
                  <Store className="w-4 h-4" />
                  Satıcıyı Gör
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
