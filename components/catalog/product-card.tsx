'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { WishlistButton } from '@/components/WishlistButton'
import { ImageIcon } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'
import { productCardStyles } from '@/components/catalog/product-card-styles'

interface ProductCardProps {
  product: BestOfferProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const hasMultipleOffers = product.offer_count > 1
  const hasPrice = product.min_price != null && product.min_price > 0
  const isRange = hasMultipleOffers && product.price_min != null && product.price_max != null && product.price_min !== product.price_max
  const inStock = product.best_stock != null && product.best_stock > 0
  const hasReviews = product.rating_avg != null && product.review_count != null && product.review_count > 0

  return (
    <Card className={productCardStyles.surface}>
      <WishlistButton
        productId={product.id}
        productName={product.name}
        size="sm"
        className={productCardStyles.wishlistOverlay}
      />
      <Link href={`/urunler/${product.slug}`} className={productCardStyles.link}>
        <div className={productCardStyles.imageWrap}>
          {product.primary_image ? (
            <Image
              src={getImageUrl(product.primary_image)}
              alt={product.name}
              fill
              className={productCardStyles.image}
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-300">
              <ImageIcon className="h-10 w-10" strokeWidth={1.5} />
              <span className="mt-1 text-xs text-slate-400">Görsel Yok</span>
            </div>
          )}
        </div>

        <CardContent className={productCardStyles.content}>
          {product.brand_name && (
            <p className={productCardStyles.brand} title={product.brand_name}>{product.brand_name}</p>
          )}

          <h3 className={productCardStyles.name}>{product.name}</h3>

          {hasReviews && (
            <p className={productCardStyles.rating}>
              ★ {product.rating_avg!.toFixed(1)} · {product.review_count} değerlendirme
            </p>
          )}

          <div className="min-h-[1.75rem]">
            {authLoading ? (
              <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            ) : !user ? (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/giris') }}
                className={productCardStyles.authPrompt}
              >
                <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Fiyat için giriş yapın
              </button>
            ) : hasPrice ? (
              <div className={productCardStyles.priceRow}>
                <span className={productCardStyles.price}>
                  {isRange
                    ? `${formatPrice(product.price_min!)} – ${formatPrice(product.price_max!)}`
                    : formatPrice(product.min_price!)}
                </span>
              </div>
            ) : (
              <span className={productCardStyles.emptyPrice}>Fiyat bilgisi yok</span>
            )}
          </div>

          <p className={productCardStyles.stockMeta}>
            <span className={inStock ? productCardStyles.stockDot : productCardStyles.stockDotMuted} />
            <span className={inStock ? 'text-green-700' : ''}>
              {inStock
                ? `Stokta${product.best_stock != null ? ` · ${product.best_stock} adet` : ''}`
                : 'Stok sorunuz'}
            </span>
            {hasMultipleOffers && <span>· {product.offer_count} satıcı</span>}
          </p>
        </CardContent>
      </Link>

      <CardFooter className={productCardStyles.actions}>
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          className={productCardStyles.primaryAction}
        />
      </CardFooter>
    </Card>
  )
}
