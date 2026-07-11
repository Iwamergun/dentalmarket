'use client'

import Link from 'next/link'
import type { Product } from '@/types/catalog.types'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { WishlistButton } from '@/components/WishlistButton'
import { productCardStyles } from '@/components/catalog/product-card-styles'

interface ProductCardHomeProps {
  product: Product
  featured?: boolean
}

export function ProductCardHome({ product, featured = false }: ProductCardHomeProps) {
  return (
    <div
      className={`group min-h-[380px] ${productCardStyles.surface} ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Clickable area for product details */}
      <Link href={`/urunler/${product.slug}`} className={productCardStyles.link}>
        {/* Image Placeholder */}
        <div className={`relative m-3 flex items-center justify-center overflow-hidden rounded-lg bg-slate-50 ${
          featured ? 'aspect-square md:aspect-auto md:h-64' : 'aspect-square'
        }`}>
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/15">
            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
        </div>

        {/* Content */}
        <div className={productCardStyles.content}>
          {product.sku && (
            <span className={productCardStyles.meta}>SKU: {product.sku}</span>
          )}
          
          <h3 className={productCardStyles.name}>
            {product.name}
          </h3>
          
          {product.short_description && (
            <p className="line-clamp-2 flex-1 text-sm text-slate-500">
              {product.short_description}
            </p>
          )}
        </div>
      </Link>
      
      {/* Add to Cart Button - Outside Link to prevent nesting issues */}
      <div className={productCardStyles.actions}>
        <WishlistButton
          productId={product.id}
          productName={product.name}
          size="sm"
          className={`!w-auto flex-1 ${productCardStyles.quietAction}`}
        />
        <AddToCartButton
          productId={product.id}
          productName={product.name}
          iconOnly
          className={`!w-auto flex-1 ${productCardStyles.primaryAction}`}
        />
      </div>
    </div>
  )
}
