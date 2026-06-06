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
  const stockLabel = product.best_stock != null && product.best_stock > 0 ? 'Stokta' : 'Stok sorunuz'
  const stockClass = product.best_stock != null && product.best_stock > 0 ? 'text-green-700' : 'text-secondary-text'

  return (
    <Card className="group relative flex h-full min-h-[330px] flex-col overflow-hidden rounded-2xl border-border/70 bg-white shadow-sm transition-all active:scale-[0.985] hover:border-primary/30 hover:shadow-premium sm:min-h-[390px]">
      {/* Satıcı sayısı badge - görselin üstünde sol üst */}
      {hasMultipleOffers && (
        <div className="absolute left-2 top-2 z-10 sm:left-3 sm:top-3">
          <span className="inline-flex items-center rounded-full bg-blue-600 px-2 py-1 text-[10px] font-semibold text-white shadow-sm sm:px-2.5 sm:text-xs">
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
              className="object-contain p-2 transition-transform duration-300 group-hover:scale-105 sm:p-3"
              sizes="(max-width: 767px) 50vw, (max-width: 1024px) 33vw, 25vw"
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

        <CardHeader className="px-2.5 pb-1 pt-2 sm:px-5 sm:pt-3">
          <div className="mb-1">
            {product.brand_name && (
              <Badge variant="secondary" className="hidden text-xs sm:inline-flex">{product.brand_name}</Badge>
            )}
          </div>
          <CardTitle className="min-h-[2.5rem] line-clamp-2 text-xs font-semibold leading-5 text-body-text sm:min-h-[2.75rem] sm:text-sm">{product.name}</CardTitle>
        </CardHeader>

        <CardContent className="flex-1 px-2.5 pb-2 pt-0 sm:px-5">
          {/* Fiyat */}
          <div className="mt-1 min-h-[2.2rem]">
            {authLoading ? (
              <div className="h-5 w-16 animate-pulse rounded bg-muted sm:h-6 sm:w-24" />
            ) : !user ? (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/giris') }}
                className="inline-flex max-w-full items-center gap-1 rounded-lg bg-primary/8 px-2 py-1.5 text-[10px] font-semibold leading-tight text-primary transition-colors hover:bg-primary/15 sm:px-3 sm:text-xs"
              >
                <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Fiyat için giriş yapın
              </button>
            ) : hasPrice ? (
              isRange ? (
                <div>
                  <span className="text-sm font-bold text-blue-600 sm:text-lg">
                    {formatPrice(product.price_min!)} – {formatPrice(product.price_max!)}
                  </span>
                </div>
              ) : (
                <span className="text-sm font-bold text-blue-600 sm:text-lg">
                  {formatPrice(product.min_price!)}
                </span>
              )
            ) : (
              <span className="text-[10px] italic text-muted-foreground sm:text-sm">
                Fiyat bilgisi yok
              </span>
            )}
          </div>
          <div className="mt-1 flex min-h-[1.1rem] flex-wrap items-center gap-x-2 gap-y-1 text-[10px] sm:text-xs">
            <span className={stockClass}>{stockLabel}</span>
            {hasMultipleOffers && (
              <span className="text-green-700">
                {product.offer_count} satıcıdan
              </span>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="mt-auto flex items-center gap-2 px-2.5 pb-2.5 pt-0 sm:px-3 sm:pb-4">
        <WishlistButton
          productId={product.id}
          productName={product.name}
          size="sm"
          className="!h-10 !w-auto flex-1 !rounded-xl border-border bg-white shadow-sm active:scale-[0.98] hover:border-red-200 hover:bg-red-50 sm:!h-11"
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
