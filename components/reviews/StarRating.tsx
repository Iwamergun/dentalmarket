'use client'

import { Star } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: 'sm' | 'md' | 'lg'
  interactive?: boolean
  onRatingChange?: (rating: number) => void
  className?: string
}

export function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onRatingChange,
  className,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = (index: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(index + 1)
    }
  }

  return (
    <div className={cn('flex items-center gap-0.5', className)}>
      {Array.from({ length: maxRating }).map((_, index) => {
        const filled = index < Math.floor(rating)
        const partial = index === Math.floor(rating) && rating % 1 > 0
        const partialWidth = partial ? `${(rating % 1) * 100}%` : '0%'

        return (
          <button
            key={index}
            type="button"
            onClick={() => handleClick(index)}
            disabled={!interactive}
            className={cn(
              'relative',
              interactive && 'cursor-pointer hover:scale-110 transition-transform',
              !interactive && 'cursor-default'
            )}
          >
            {/* Empty star (background) */}
            <Star
              className={cn(
                sizeClasses[size],
                'text-gray-300'
              )}
            />
            {/* Filled star (overlay) */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ width: filled ? '100%' : partialWidth }}
            >
              <Star
                className={cn(
                  sizeClasses[size],
                  'text-yellow-400 fill-yellow-400'
                )}
              />
            </div>
          </button>
        )
      })}
    </div>
  )
}
