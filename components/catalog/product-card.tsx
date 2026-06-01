'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { WishlistButton } from '@/components/WishlistButton'
import { formatPrice } from '@/lib/utils/format'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/contexts/AuthContext'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'

interface ProductCardProps {
  product: BestOfferProduct
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const hasMultipleOffers = product.offer_count > 1
  const hasPrice = product.min_price != null && product.min_price > 0
  const isRange = hasMultipleOffers && product.price_min != null && product.price_max != null && product.price_min !== product.price_max

  return (
    <Card className="group relative flex h-full min-h-[190px] flex-col overflow-hidden border-border/70 bg-white shadow-sm transition-all hover:border-primary/30 hover:shadow-premium sm:min-h-[360px]">
      {/* Satıcı sayısı badge - görselin üstünde sol üst */}
      {hasMultipleOffers && (
        <div className="absolute left-1.5 top-1.5 z-10 sm:left-3 sm:top-3">
          <span className="inline-flex items-center rounded-full bg-blue-600 px-1.5 py-0.5 text-[10px] font-semibold text-white shadow-sm sm:px-2.5 sm:py-1 sm:text-xs">
            {product.offer_count} satıcı
          </span>
        </div>
      )}
      
      <Link href={`/urunler/${product.slug}`} className="flex flex-1 flex-col">
        {/* Ürün Görseli */}
        <div className="relative mx-2 mt-2 flex aspect-square items-center justify-center overflow-hidden rounded-2xl bg-gray-50 sm:mx-3 sm:mt-3">
          {product.primary_image ? (
            <Image
              src={getImageUrl(product.primary_image)}
              alt={product.name}
              fill
              className="object-contain p-1.5 transition-transform duration-300 group-hover:scale-105 sm:p-3"
              sizes="(max-width: 430px) 33vw, (max-width: 640px) 25vw, (max-width: 1024px) 33vw, 25vw"
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

        <CardHeader className="pb-1 pt-2 px-2.5 sm:px-6 sm:pt-3">
          <div className="mb-1">
            {product.brand_name && (
              <Badge variant="secondary" className="hidden text-xs sm:inline-flex">{product.brand_name}</Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-xs font-semibold leading-tight sm:text-sm">{product.name}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 px-2.5 pb-1.5 pt-0 sm:px-6 sm:pb-2">
          {/* Fiyat */}
          <div className="mt-2">
            {authLoading ? (
              <div className="h-5 w-16 animate-pulse rounded bg-muted sm:h-6 sm:w-24" />
            ) : !user ? (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/giris') }}
                className="inline-flex max-w-full items-center gap-1 rounded-lg bg-primary/8 px-1.5 py-1 text-[10px] font-semibold text-primary transition-colors hover:bg-primary/15 sm:px-3 sm:py-1.5 sm:text-xs"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Fiyat için giriş yapın
              </button>
            ) : hasPrice ? (
              isRange ? (
                <div>
                  <span className="text-xs font-bold text-blue-600 sm:text-lg">
                    {formatPrice(product.price_min!)} – {formatPrice(product.price_max!)}
                  </span>
                </div>
              ) : (
                <span className="text-xs font-bold text-blue-600 sm:text-lg">
                  {formatPrice(product.min_price!)}
                </span>
              )
            ) : (
              <span className="text-[10px] italic text-muted-foreground sm:text-sm">
                Fiyat bilgisi yok
              </span>
            )}
          </div>
          {/* Satıcı etiketi */}
          {hasMultipleOffers && (
            <div className="mt-1">
              <span className="text-[10px] text-green-700 sm:text-xs">
                {product.offer_count} satıcıdan
              </span>
            </div>
          )}
        </CardContent>
      </Link>

      <CardFooter className="mt-auto flex items-center gap-2 px-2.5 pb-2.5 pt-0 sm:px-3 sm:pb-4">
        <WishlistButton
          productId={product.id}
          productName={product.name}
          size="sm"
          className="!h-10 !w-auto flex-1 !rounded-xl border-border bg-white shadow-sm hover:border-red-200 hover:bg-red-50 sm:!h-11"
        />
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          iconOnly
          className="!w-auto flex-1"
        />
      </CardFooter>
    </Card>
  )
}
