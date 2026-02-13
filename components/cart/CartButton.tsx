'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'

export function CartButton() {
  const { itemCount, loading } = useCart()

  return (
    <Link 
      href="/sepet" 
      className="relative p-2 rounded-lg text-text-secondary hover:text-primary hover:bg-background-card transition-all duration-200"
      aria-label={`Sepet${itemCount > 0 ? ` (${itemCount} ürün)` : ''}`}
    >
      <ShoppingCart className="w-6 h-6" />
      {!loading && itemCount > 0 && (
        <span className="absolute -top-1 -right-1 min-w-5 h-5 px-1 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-scale-in">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  )
}
