'use client'

import Link from 'next/link'
import type { Product } from '@/types/catalog.types'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { WishlistButton } from '@/components/WishlistButton'
import { ImageIcon } from 'lucide-react'
import { productCardStyles } from '@/components/catalog/product-card-styles'

interface ProductCardHomeProps {
  product: Product
  featured?: boolean
}

export function ProductCardHome({ product, featured = false }: ProductCardHomeProps) {
  return (
    <div
      className={`${productCardStyles.surface} ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      <WishlistButton
        productId={product.id}
        productName={product.name}
        size="sm"
        className={productCardStyles.wishlistOverlay}
      />
      <Link href={`/urunler/${product.slug}`} className={productCardStyles.link}>
        <div className={`${productCardStyles.imageWrap} ${
          featured ? 'md:aspect-[4/3]' : ''
        }`}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <ImageIcon className="h-8 w-8" strokeWidth={1.5} />
          </div>
        </div>

        <div className={productCardStyles.content}>
          {product.sku && (
            <span className={productCardStyles.brand}>SKU: {product.sku}</span>
          )}

          <h3 className={productCardStyles.name}>
            {product.name}
          </h3>

          {product.short_description && (
            <p className="line-clamp-2 text-xs text-slate-500">
              {product.short_description}
            </p>
          )}
        </div>
      </Link>

      <div className={productCardStyles.actions}>
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          className={productCardStyles.primaryAction}
        />
      </div>
    </div>
  )
}
