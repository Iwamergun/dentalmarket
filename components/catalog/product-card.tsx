'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { WishlistButton } from '@/components/WishlistButton'
import { formatPrice } from '@/lib/utils/format'
import { getImageUrl } from '@/lib/utils/imageHelper'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

interface ProductCardProps {
  product: BestOfferProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const hasMultipleOffers = product.offer_count > 1
  const hasPrice = product.min_price != null && product.min_price > 0
  const isRange = hasMultipleOffers && product.price_min != null && product.price_max != null && product.price_min !== product.price_max

  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-md relative group overflow-hidden">
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <WishlistButton 
          productId={product.id} 
          productName={product.name}
          size="sm"
        />
      </div>

      {/* Satıcı sayısı badge - görselin üstünde sol üst */}
      {hasMultipleOffers && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center rounded-full bg-blue-600 px-2.5 py-1 text-xs font-semibold text-white shadow-sm">
            {product.offer_count} satıcı
          </span>
        </div>
      )}
      
      <Link href={`/urunler/${product.slug}`} className="flex-1 flex flex-col">
        {/* Ürün Görseli */}
        <div className="relative w-full aspect-square bg-gray-50 flex items-center justify-center">
          {product.primary_image ? (
            <Image
              src={getImageUrl(product.primary_image)}
              alt={product.name}
              fill
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs mt-1">Görsel Yok</span>
            </div>
          )}
        </div>

        <CardHeader className="pb-1 pt-3">
          <div className="mb-1">
            {product.brand_name && (
              <Badge variant="secondary" className="text-xs">{product.brand_name}</Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-sm font-semibold leading-tight">{product.name}</CardTitle>
        </CardHeader>

        <CardContent className="pb-2 pt-0 flex-1">
          {/* Fiyat */}
          <div className="mt-2">
            {hasPrice ? (
              isRange ? (
                <div>
                  <span className="text-lg font-bold text-blue-600">
                    {formatPrice(product.price_min!)} – {formatPrice(product.price_max!)}
                  </span>
                </div>
              ) : (
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(product.min_price!)}
                </span>
              )
            ) : (
              <span className="text-sm text-muted-foreground italic">
                Fiyat için iletişime geçin
              </span>
            )}
          </div>
          {/* Satıcı etiketi */}
          {hasMultipleOffers && (
            <div className="mt-1">
              <span className="text-xs text-green-700">
                {product.offer_count} satıcıdan
              </span>
            </div>
          )}
        </CardContent>
      </Link>

      <CardFooter className="pt-0 pb-4 px-4">
        <AddToCartButton 
          productId={product.id}
          productName={product.name}
          fullWidth
        />
      </CardFooter>
    </Card>
  )
}
