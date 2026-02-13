'use client'

import { useState } from 'react'
import { ReviewList } from './ReviewList'
import { ReviewForm } from './ReviewForm'

interface ProductReviewsProps {
  productId: string
}

export function ProductReviews({ productId }: ProductReviewsProps) {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleReviewSubmitted = () => {
    // ReviewList'i yenile
    setRefreshKey(prev => prev + 1)
  }

  return (
    <div className="space-y-8">
      {/* Yorum Listesi */}
      <ReviewList key={refreshKey} productId={productId} />

      {/* Yorum Formu */}
      <ReviewForm productId={productId} onReviewSubmitted={handleReviewSubmitted} />
    </div>
  )
}
