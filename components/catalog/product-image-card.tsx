'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { formatPrice } from '@/lib/utils/format'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

// Cloudflare R2 base URL - environment variable'dan al veya default kullan
const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_BASE_URL || 'https://pub-35567da7efa344c29c0a5bdbf4cb2563.r2.dev'

interface ProductImageCardProps {
  product: BestOfferProduct
  href?: string
}

export function ProductImageCard({ product, href }: ProductImageCardProps) {
  const [imageError, setImageError] = useState(false)
  
  const hasImage = product.primary_image && !imageError
  const imageUrl = hasImage ? `${R2_BASE_URL}/${product.primary_image}` : null
  const hasMultipleOffers = product.offer_count > 1
  const showRange = hasMultipleOffers && product.price_min != null && product.price_max != null && product.price_min !== product.price_max

  const CardContent = () => (
    <>
      <div className="relative w-full h-48 bg-gray-100">
        {imageUrl ? (
          <Image 
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <div className="text-center">
              <svg className="w-12 h-12 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-400 text-sm mt-2 block">Resim Yok</span>
            </div>
          </div>
        )}
        {hasMultipleOffers && (
          <span className="absolute top-2 right-2 bg-primary/90 text-white text-[10px] font-semibold px-1.5 py-0.5 rounded-full">
            {product.offer_count} satıcı
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-center gap-2 mb-1">
          {product.brand_name && (
            <Badge variant="secondary" className="text-[10px]">{product.brand_name}</Badge>
          )}
        </div>
        <h3 className="font-semibold text-lg line-clamp-2">{product.name}</h3>
        {product.sku && (
          <p className="text-sm text-gray-600 mt-1">SKU: {product.sku}</p>
        )}
        {product.short_description && (
          <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.short_description}</p>
        )}
        {/* Price */}
        <div className="mt-2">
          {product.min_price != null ? (
            showRange ? (
              <span className="text-base font-bold text-primary">
                {formatPrice(product.price_min!)} – {formatPrice(product.price_max!)}
              </span>
            ) : (
              <span className="text-base font-bold text-primary">
                {formatPrice(product.min_price)}
              </span>
            )
          ) : (
            <span className="text-xs text-muted-foreground italic">Fiyat bilgisi yok</span>
          )}
        </div>
        {hasMultipleOffers && (
          <div className="mt-1">
            <Badge variant="outline" className="text-[10px] text-blue-600 border-blue-200 bg-blue-50 px-1.5 py-0">
              📦 {product.offer_count} depo
            </Badge>
          </div>
        )}
      </div>
    </>
  )

  if (href) {
    return (
      <Link 
        href={href}
        className="block border rounded-lg overflow-hidden hover:shadow-lg transition bg-white"
      >
        <CardContent />
      </Link>
    )
  }

  return (
    <div className="border rounded-lg overflow-hidden hover:shadow-lg transition bg-white">
      <CardContent />
    </div>
  )
}
