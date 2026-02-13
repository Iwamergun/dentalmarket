'use client'

import { StarRating } from './StarRating'

interface RatingSummaryProps {
  averageRating: number
  totalReviews: number
  ratingDistribution: {
    5: number
    4: number
    3: number
    2: number
    1: number
  }
}

export function RatingSummary({
  averageRating,
  totalReviews,
  ratingDistribution,
}: RatingSummaryProps) {
  const maxCount = Math.max(...Object.values(ratingDistribution), 1)

  return (
    <div className="bg-background-card rounded-xl border border-border p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">Değerlendirmeler</h3>
      
      <div className="flex flex-col sm:flex-row gap-6">
        {/* Ortalama Puan */}
        <div className="flex flex-col items-center justify-center sm:pr-6 sm:border-r border-border">
          <span className="text-5xl font-bold text-text-primary">
            {averageRating.toFixed(1)}
          </span>
          <StarRating rating={averageRating} size="md" className="mt-2" />
          <span className="text-sm text-text-secondary mt-2">
            {totalReviews} değerlendirme
          </span>
        </div>

        {/* Yıldız Dağılımı */}
        <div className="flex-1 space-y-2">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = ratingDistribution[star as keyof typeof ratingDistribution]
            const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0
            const barWidth = maxCount > 0 ? (count / maxCount) * 100 : 0

            return (
              <div key={star} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm text-text-secondary">{star}</span>
                  <StarRating rating={1} maxRating={1} size="sm" />
                </div>
                <div className="flex-1 h-2 bg-background-deep rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
                <span className="text-sm text-text-muted w-12 text-right">
                  {percentage.toFixed(0)}%
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
