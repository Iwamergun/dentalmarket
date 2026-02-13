'use client'

import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AddToCartButton } from '@/components/cart/AddToCartButton'
import { WishlistButton } from '@/components/WishlistButton'
import type { ProductWithRelations } from '@/types/catalog.types'

interface ProductCardProps {
  product: ProductWithRelations
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="h-full flex flex-col transition-shadow hover:shadow-md relative group">
      {/* Wishlist Button */}
      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <WishlistButton 
          productId={product.id} 
          productName={product.name}
          size="sm"
        />
      </div>
      
      <Link href={`/urunler/${product.slug}`} className="flex-1">
        <CardHeader>
          <div className="mb-2 flex items-center justify-between">
            {product.brand && (
              <Badge variant="secondary">{product.brand.name}</Badge>
            )}
          </div>
          <CardTitle className="line-clamp-2 text-lg">{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {product.short_description && (
            <p className="line-clamp-3 text-sm text-gray-600">
              {product.short_description}
            </p>
          )}
        </CardContent>
      </Link>
      <CardFooter className="flex flex-col gap-3 pt-0">
        {product.sku && (
          <span className="text-xs text-gray-500 self-start">SKU: {product.sku}</span>
        )}
        <AddToCartButton 
          productId={product.id}
          productName={product.name}
          fullWidth
        />
      </CardFooter>
    </Card>
  )
}
