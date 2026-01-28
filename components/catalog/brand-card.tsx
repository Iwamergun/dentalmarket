import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Brand } from '@/types/catalog.types'

interface BrandCardProps {
  brand: Brand
}

export function BrandCard({ brand }: BrandCardProps) {
  return (
    <Link href={`/markalar/${brand.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">{brand.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-500">Markanın ürünlerini görüntüle</p>
        </CardContent>
      </Card>
    </Link>
  )
}
