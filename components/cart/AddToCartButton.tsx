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
  quantity?: number
  productName?: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'outline' | 'ghost'
  showIcon?: boolean
  fullWidth?: boolean
}

export function AddToCartButton({
  productId,
  variantId,
  quantity = 1,
  productName,
  className,
  size = 'md',
  variant = 'default',
  showIcon = true,
  fullWidth = false,
}: AddToCartButtonProps) {
  const { addToCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleAddToCart = async () => {
    if (loading || success) return

    setLoading(true)

    try {
      await addToCart(productId, variantId, quantity)
      
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
        'gap-2 transition-all duration-300',
        fullWidth && 'w-full',
        success && 'bg-green-600 hover:bg-green-600',
        className
      )}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Ekleniyor...</span>
        </>
      ) : success ? (
        <>
          <Check className="w-4 h-4" />
          <span>Eklendi!</span>
        </>
      ) : (
        <>
          {showIcon && <ShoppingCart className="w-4 h-4" />}
          <span>Sepete Ekle</span>
        </>
      )}
    </Button>
  )
}
