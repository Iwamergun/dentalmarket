import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Category } from '@/types/catalog.types'

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <Link href={`/kategoriler/${category.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">{category.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {category.description && (
            <p className="line-clamp-3 text-sm text-gray-600">
              {category.description}
            </p>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
