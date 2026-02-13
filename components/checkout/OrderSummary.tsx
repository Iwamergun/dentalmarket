'use client'

import Image from 'next/image'
import Link from 'next/link'
import { getImageUrl } from '@/lib/utils/imageHelper'
import type { CartItem } from '@/app/contexts/CartContext'

interface OrderSummaryProps {
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
}

export function OrderSummary({ items, subtotal, shipping, total }: OrderSummaryProps) {
  return (
    <div className="space-y-4">
      {/* Ürün Listesi */}
      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="relative w-16 h-16 flex-shrink-0 bg-white rounded-lg border border-border/50 overflow-hidden">
              <Image
                src={getImageUrl(item.product?.primary_image)}
                alt={item.product?.name || 'Ürün'}
                fill
                className="object-contain p-1"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link 
                href={`/urunler/${item.product?.slug}`}
                className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors"
              >
                {item.product?.name || 'Ürün'}
              </Link>
              {item.variant && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  {item.variant.variant_name}
                </p>
              )}
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs text-muted-foreground">
                  {item.quantity} adet
                </span>
                <span className="text-sm font-semibold">
                  {new Intl.NumberFormat('tr-TR', { 
                    style: 'currency', 
                    currency: 'TRY' 
                  }).format(item.price * item.quantity)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sepet Özeti */}
      <div className="pt-4 border-t border-border/50 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Ara Toplam</span>
          <span>
            {new Intl.NumberFormat('tr-TR', { 
              style: 'currency', 
              currency: 'TRY' 
            }).format(subtotal)}
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Kargo</span>
          <span className={shipping === 0 ? 'text-green-600 font-medium' : ''}>
            {shipping === 0 
              ? 'Ücretsiz' 
              : new Intl.NumberFormat('tr-TR', { 
                  style: 'currency', 
                  currency: 'TRY' 
                }).format(shipping)
            }
          </span>
        </div>
        {shipping === 0 && subtotal > 0 && (
          <p className="text-xs text-green-600">
            ✓ 500₺ üzeri siparişlerde ücretsiz kargo
          </p>
        )}
      </div>

      {/* Toplam */}
      <div className="pt-4 border-t border-border/50">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Toplam</span>
          <span className="text-2xl font-bold text-primary">
            {new Intl.NumberFormat('tr-TR', { 
              style: 'currency', 
              currency: 'TRY' 
            }).format(total)}
          </span>
        </div>
        <p className="text-xs text-muted-foreground mt-1 text-right">
          KDV Dahil
        </p>
      </div>
    </div>
  )
}
