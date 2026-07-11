'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ImageIcon } from 'lucide-react'
import { formatPrice } from '@/lib/utils/format'
import { useAuth } from '@/app/contexts/AuthContext'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { WishlistButton } from '@/components/WishlistButton'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'
import { productCardStyles } from '@/components/catalog/product-card-styles'

// Cloudflare R2 base URL - environment variable'dan al veya default kullan
const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_BASE_URL || 'https://pub-35567da7efa344c29c0a5bdbf4cb2563.r2.dev'

interface ProductImageCardProps {
  product: BestOfferProduct
  href?: string
}

export function ProductImageCard({ product, href }: ProductImageCardProps) {
  const [imageError, setImageError] = useState(false)
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const hasImage = product.primary_image && !imageError
  const imageUrl = hasImage ? `${R2_BASE_URL}/${product.primary_image}` : null
  const hasMultipleOffers = product.offer_count > 1
  const showRange = hasMultipleOffers && product.price_min != null && product.price_max != null && product.price_min !== product.price_max
  const inStock = product.best_stock != null && product.best_stock > 0
  const hasReviews = product.rating_avg != null && product.review_count != null && product.review_count > 0

  const CardPreview = () => (
    <>
      <div className={productCardStyles.imageWrap}>
        {imageUrl ? (
          <Image 
            src={imageUrl}
            alt={product.name}
            fill
            className={productCardStyles.image}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-400">
            <ImageIcon className="h-10 w-10" strokeWidth={1.5} />
          </div>
        )}
      </div>
      <div className={productCardStyles.content}>
        {product.brand_name && (
          <p className={productCardStyles.brand}>{product.brand_name}</p>
        )}
        <h3 className={productCardStyles.name}>{product.name}</h3>
        {hasReviews && (
          <p className={productCardStyles.rating}>
            ★ {product.rating_avg!.toFixed(1)} · {product.review_count} değerlendirme
          </p>
        )}
        {product.sku && (
          <p className={productCardStyles.meta}>SKU: {product.sku}</p>
        )}
        <div className="min-h-[1.75rem]">
          {authLoading ? (
            <div className="h-6 w-24 animate-pulse rounded bg-muted" />
          ) : !user ? (
            <button
              type="button"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/giris') }}
              className={productCardStyles.authPrompt}
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Fiyat için giriş yapın
            </button>
          ) : product.min_price != null ? (
            <div className={productCardStyles.priceRow}>
              {showRange ? (
                <span className={productCardStyles.price}>
                  {formatPrice(product.price_min!)} – {formatPrice(product.price_max!)}
                </span>
              ) : (
                <span className={productCardStyles.price}>
                  {formatPrice(product.min_price)}
                </span>
              )}
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
      </div>
    </>
  )

  const preview = href ? (
    <Link href={href} className={productCardStyles.link}>
      <CardPreview />
    </Link>
  ) : (
    <CardPreview />
  )

  if (href) {
    return (
      <div className={productCardStyles.surface}>
        <WishlistButton
          productId={product.id}
          productName={product.name}
          size="sm"
          className={productCardStyles.wishlistOverlay}
        />
        {preview}
        <div className={productCardStyles.actions}>
          <AddToCartButton productId={product.id} productName={product.name} className={productCardStyles.primaryAction} />
        </div>
      </div>
    )
  }

  return (
    <div className={productCardStyles.surface}>
      <WishlistButton
        productId={product.id}
        productName={product.name}
        size="sm"
        className={productCardStyles.wishlistOverlay}
      />
      {preview}
      <div className={productCardStyles.actions}>
        <AddToCartButton productId={product.id} productName={product.name} className={productCardStyles.primaryAction} />
      </div>
    </div>
  )
}
