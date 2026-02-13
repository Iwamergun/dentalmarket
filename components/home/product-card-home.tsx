'use client'

import Link from 'next/link'
import type { Product } from '@/types/catalog.types'
import { AddToCartButton } from '@/components/cart/AddToCartButton'

interface ProductCardHomeProps {
  product: Product
  featured?: boolean
}

export function ProductCardHome({ product, featured = false }: ProductCardHomeProps) {
  return (
    <div
      className={`group card-base overflow-hidden flex flex-col ${
        featured ? 'md:col-span-2 md:row-span-2' : ''
      }`}
    >
      {/* Clickable area for product details */}
      <Link href={`/urunler/${product.slug}`} className="flex-1 flex flex-col">
        {/* Image Placeholder */}
        <div className={`relative bg-background-elevated flex items-center justify-center ${
          featured ? 'aspect-square md:aspect-auto md:h-64' : 'aspect-square'
        }`}>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <svg className="w-8 h-8 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
          
          {/* Quick View Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200">
            <span className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-200">
              İncele
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          {product.sku && (
            <span className="text-xs text-text-muted mb-1">SKU: {product.sku}</span>
          )}
          
          <h3 className="font-medium text-text-primary line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {product.name}
          </h3>
          
          {product.short_description && (
            <p className="mt-2 text-sm text-text-secondary line-clamp-2 flex-1">
              {product.short_description}
            </p>
          )}
        </div>
      </Link>
      
      {/* Add to Cart Button - Outside Link to prevent nesting issues */}
      <div className="px-4 pb-4">
        <AddToCartButton 
          productId={product.id}
          productName={product.name}
          fullWidth
          size="sm"
        />
      </div>
    </div>
  )
}
