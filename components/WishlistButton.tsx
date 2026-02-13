'use client'

import { useState } from 'react'
import { Heart, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils/cn'
import { useWishlist } from '@/app/contexts/WishlistContext'

interface WishlistButtonProps {
  productId: string
  productName?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export function WishlistButton({ 
  productId, 
  productName,
  className,
  size = 'md',
  showLabel = false 
}: WishlistButtonProps) {
  const { isInWishlist, toggleWishlist } = useWishlist()
  const [loading, setLoading] = useState(false)
  
  const isFavorite = isInWishlist(productId)

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    setLoading(true)
    try {
      await toggleWishlist(productId)
      
      if (isFavorite) {
        toast.success(productName ? `"${productName}" favorilerden çıkarıldı` : 'Favorilerden çıkarıldı')
      } else {
        toast.success(productName ? `"${productName}" favorilere eklendi` : 'Favorilere eklendi')
      }
    } catch {
      toast.error('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

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

  if (showLabel) {
    return (
      <button
        onClick={handleToggle}
        disabled={loading}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all',
          'border disabled:opacity-50 disabled:cursor-not-allowed',
          isFavorite
            ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100'
            : 'bg-background-card border-border text-text-secondary hover:border-primary/30 hover:text-primary',
          className
        )}
      >
        {loading ? (
          <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
        ) : (
          <Heart 
            className={cn(
              iconSizes[size],
              isFavorite && 'fill-current'
            )} 
          />
        )}
        <span className="text-sm">
          {isFavorite ? 'Favorilerde' : 'Favorilere Ekle'}
        </span>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={loading}
      className={cn(
        'flex items-center justify-center rounded-full transition-all',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeClasses[size],
        isFavorite
          ? 'bg-red-50 text-red-500 hover:bg-red-100'
          : 'bg-background-card text-text-muted hover:text-red-500 hover:bg-red-50 border border-border',
        className
      )}
      title={isFavorite ? 'Favorilerden çıkar' : 'Favorilere ekle'}
    >
      {loading ? (
        <Loader2 className={cn(iconSizes[size], 'animate-spin')} />
      ) : (
        <Heart 
          className={cn(
            iconSizes[size],
            isFavorite && 'fill-current'
          )} 
        />
      )}
    </button>
  )
}
