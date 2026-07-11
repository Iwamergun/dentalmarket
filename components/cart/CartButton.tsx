'use client'

import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'

export function CartButton() {
  const { itemCount, loading } = useCart()

  return (
    <Link 
      href="/sepet" 
      className="relative inline-flex rounded-full border border-slate-200 bg-white p-1.5 text-secondary-text transition duration-200 hover:border-primary/30 hover:text-primary md:p-2"
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
