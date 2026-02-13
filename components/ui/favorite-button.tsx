'use client'

import { useState } from 'react'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { useFavorites } from '@/hooks/useFavorites'
import { cn } from '@/lib/utils/cn'

interface FavoriteButtonProps {
  productId: string
  productName?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'icon' | 'button'
  className?: string
}

export function FavoriteButton({
  productId,
  productName,
  size = 'md',
  variant = 'icon',
  className,
}: FavoriteButtonProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const [isAnimating, setIsAnimating] = useState(false)
  
  const isActive = isFavorite(productId)

  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsAnimating(true)
    const newState = toggleFavorite(productId)
    
    if (newState) {
      toast.success(productName ? `${productName} favorilere eklendi` : 'Favorilere eklendi')
    } else {
      toast.success('Favorilerden kaldırıldı')
    }
    
    setTimeout(() => setIsAnimating(false), 300)
  }

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={cn(
          'flex items-center justify-center rounded-full transition-all duration-200',
          'bg-white dark:bg-gray-800 shadow-md hover:shadow-lg',
          'hover:scale-110 active:scale-95',
          sizeClasses[size],
          isActive && 'bg-red-50 dark:bg-red-950',
          className
        )}
        aria-label={isActive ? 'Favorilerden kaldır' : 'Favorilere ekle'}
      >
        <Heart
          className={cn(
            iconSizes[size],
            'transition-all duration-200',
            isActive ? 'fill-red-500 text-red-500' : 'text-gray-400 hover:text-red-400',
            isAnimating && 'scale-125'
          )}
        />
      </button>
    )
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        'flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200',
        'border font-medium text-sm',
        isActive 
          ? 'bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800 text-red-600'
          : 'bg-background border-border hover:border-primary/50 text-muted-foreground hover:text-foreground',
        className
      )}
      aria-label={isActive ? 'Favorilerden kaldır' : 'Favorilere ekle'}
    >
      <Heart
        className={cn(
          'w-4 h-4 transition-all duration-200',
          isActive && 'fill-red-500 text-red-500',
          isAnimating && 'scale-125'
        )}
      />
      <span>{isActive ? 'Favorilerde' : 'Favorilere Ekle'}</span>
    </button>
  )
}
