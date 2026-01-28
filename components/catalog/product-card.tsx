import Link from 'next/link'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ProductWithRelations } from '@/types/catalog.types'

interface ProductCardProps {
  product: ProductWithRelations
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/urunler/${product.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
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
        <CardFooter>
          {product.sku && (
            <span className="text-xs text-gray-500">SKU: {product.sku}</span>
          )}
        </CardFooter>
      </Card>
    </Link>
  )
}
