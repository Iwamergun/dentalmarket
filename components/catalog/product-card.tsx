'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
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
  const inStock = product.best_stock != null && product.best_stock > 0

  return (
    <Card className="flex h-full flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-none">
      <Link href={`/urunler/${product.slug}`} className="flex flex-1 flex-col">
        {/* Ürün Görseli */}
        <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-gray-50">
          {product.primary_image ? (
            <Image
              src={getImageUrl(product.primary_image)}
              alt={product.name}
              fill
              className="object-contain p-2"
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-300">
              <svg className="h-10 w-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="mt-1 text-xs text-gray-400">Görsel Yok</span>
            </div>
          )}
        </div>

        <CardContent className="flex flex-1 flex-col gap-1 px-3 pb-2 pt-2.5">
          {/* Marka */}
          {product.brand_name && (
            <p className="truncate text-xs text-muted-foreground">{product.brand_name}</p>
          )}

          {/* Ürün adı */}
          <p className="line-clamp-2 text-sm font-medium leading-snug text-gray-900">{product.name}</p>

          {/* Fiyat */}
          <div className="mt-1 min-h-[1.75rem]">
            {authLoading ? (
              <div className="h-5 w-16 animate-pulse rounded bg-muted" />
            ) : !user ? (
              <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); router.push('/giris') }}
                className="inline-flex items-center gap-1 rounded-md bg-primary/8 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/15"
              >
                <svg className="h-3 w-3 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Fiyat için giriş yapın
              </button>
            ) : hasPrice ? (
              <span className="text-base font-bold text-gray-900">
                {isRange
                  ? `${formatPrice(product.price_min!)} – ${formatPrice(product.price_max!)}`
                  : formatPrice(product.min_price!)}
              </span>
            ) : (
              <span className="text-xs italic text-muted-foreground">Fiyat bilgisi yok</span>
            )}
          </div>

          {/* Stok + satıcı sayısı */}
          <p className="text-xs text-muted-foreground">
            <span className={inStock ? 'text-green-700' : undefined}>
              {inStock ? 'Stokta' : 'Stok sorunuz'}
            </span>
            {hasMultipleOffers && (
              <span> · {product.offer_count} satıcı</span>
            )}
          </p>
        </CardContent>
      </Link>

      <CardFooter className="flex items-center gap-2 px-3 pb-3 pt-0">
        <WishlistButton
          productId={product.id}
          productName={product.name}
          size="sm"
        />
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          iconOnly
          className="flex-1"
        />
      </CardFooter>
    </Card>
  )
}
