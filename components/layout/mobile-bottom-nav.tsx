'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, Grid2x2, Heart, ShoppingCart, UserRound } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'
import { useAuth } from '@/app/contexts/AuthContext'

const navItems = [
  { href: '/', label: 'Ana Sayfa', icon: House },
  { href: '/kategoriler', label: 'Kategoriler', icon: Grid2x2 },
  { href: '/profil/favorilerim', label: 'Favoriler', icon: Heart },
  { href: '/sepet', label: 'Sepet', icon: ShoppingCart },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { itemCount, loading: cartLoading } = useCart()
  const { user } = useAuth()

  const profileHref = user ? '/profil' : '/giris'

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#E5E7EB] bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2 shadow-[0_-18px_36px_-24px_rgba(15,23,42,0.35)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 rounded-t-[22px] border border-[#E5E7EB] bg-[#F8FAFC] p-1.5">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'relative flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-medium transition-colors',
                isActive ? 'bg-white text-[#2563EB]' : 'text-slate-600',
              ].join(' ')}
            >
              <Icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.href === '/sepet' && !cartLoading && itemCount > 0 && (
                <span className="absolute right-2 top-1 min-w-4 rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          )
        })}

        <Link
          href={profileHref}
          className={[
            'flex flex-col items-center justify-center gap-1 rounded-2xl px-1 py-2 text-[11px] font-medium transition-colors',
            pathname === '/profil' || pathname.startsWith('/profil/') || pathname === '/giris'
              ? 'bg-white text-[#2563EB]'
              : 'text-slate-600',
          ].join(' ')}
        >
          <UserRound className="h-4 w-4" />
          <span>Profil</span>
        </Link>
      </div>
    </nav>
  )
}
