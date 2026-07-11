'use client'

import { useState } from 'react'
import { ShoppingCart, Loader2, Check } from 'lucide-react'
import { toast } from 'sonner'
import { useCart } from '@/app/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils/cn'

interface AddToCartButtonProps {
  productId: string
  variantId?: string | null
  offerId?: string
  quantity?: number
  productName?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  showIcon?: boolean
  fullWidth?: boolean
  iconOnly?: boolean
}

export function AddToCartButton({
  productId,
  variantId,
  offerId,
  quantity = 1,
  productName,
  className,
  size = 'md',
  variant = 'default',
  showIcon = true,
  fullWidth = false,
  iconOnly = false,
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleAddToCart = async () => {
    if (loading || success) return

    setLoading(true)

    try {
      await addToCart(productId, variantId, quantity, offerId)
      
      setSuccess(true)
      toast.success(
        productName 
          ? `${productName} sepete eklendi` 
          : 'Ürün sepete eklendi',
        {
          description: `${quantity} adet ürün sepetinize eklendi.`,
          action: {
            label: 'Sepete Git',
            onClick: () => window.location.href = '/sepet',
          },
        }
      )

      // Reset success state after 2 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 2000)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Bir hata oluştu'
      toast.error('Sepete eklenemedi', {
        description: message,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      variant={variant}
      size={size}
      className={cn(
        'gap-2 transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2',
        fullWidth && 'w-full',
        iconOnly
          ? cn(
              'h-9 w-9 shrink-0 rounded-xl p-0 sm:h-11 sm:w-11',
              !success && 'bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow-md',
              success && 'bg-success text-white hover:bg-success'
            )
          : cn(
              variant === 'default' && !success && 'h-10 rounded-xl bg-primary text-white shadow-sm hover:bg-primary/90 hover:shadow-md sm:h-11',
              success && 'h-10 rounded-xl bg-success text-white shadow-sm hover:bg-success sm:h-11'
            ),
        className
      )}
      aria-label={iconOnly ? 'Sepete ekle' : undefined}
      title={iconOnly ? 'Sepete ekle' : undefined}
    >
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {!iconOnly && <span>Ekleniyor...</span>}
        </>
      ) : success ? (
        <>
          <Check className="h-4 w-4" />
          {!iconOnly && <span>Eklendi!</span>}
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="h-4 w-4 sm:h-[18px] sm:w-[18px]" />}
          {!iconOnly && <span>Sepete Ekle</span>}
        </>
      )}
    </Button>
  )
}
