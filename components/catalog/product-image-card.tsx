'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils/format'
import { useAuth } from '@/app/contexts/AuthContext'
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

  const CardContent = () => (
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
          <div className="flex h-full w-full items-center justify-center bg-slate-50">
            <div className="text-center">
              <svg className="mx-auto h-12 w-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="mt-2 block text-sm text-slate-400">Resim Yok</span>
            </div>
          </div>
        )}
        {hasMultipleOffers && (
          <span className="absolute right-2 top-2 rounded-full border border-primary/20 bg-white px-2 py-0.5 text-[11px] font-semibold text-primary">
            {product.offer_count} satıcı
          </span>
        )}
      </div>
      <div className={productCardStyles.content}>
        {product.brand_name && (
          <p className={productCardStyles.brand}>{product.brand_name}</p>
        )}
        <h3 className={productCardStyles.name}>{product.name}</h3>
        {product.sku && (
          <p className={productCardStyles.meta}>SKU: {product.sku}</p>
        )}
        {product.short_description && (
          <p className="line-clamp-2 text-sm text-slate-500">{product.short_description}</p>
        )}
        {/* Price */}
        <div className="mt-2">
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
            showRange ? (
              <span className={productCardStyles.price}>
                {formatPrice(product.price_min!)} – {formatPrice(product.price_max!)}
              </span>
            ) : (
              <span className={productCardStyles.price}>
                {formatPrice(product.min_price)}
              </span>
            )
          ) : (
            <span className={productCardStyles.emptyPrice}>Fiyat bilgisi yok</span>
          )}
        </div>
        {hasMultipleOffers && (
          <p className={productCardStyles.meta}>{product.offer_count} satıcıdan teklif</p>
        )}
      </div>
    </>
  )

  if (href) {
    return (
      <Link 
        href={href}
        className={productCardStyles.surface}
      >
        <CardContent />
      </Link>
    )
  }

  return (
    <div className={productCardStyles.surface}>
      <CardContent />
    </div>
  )
}
