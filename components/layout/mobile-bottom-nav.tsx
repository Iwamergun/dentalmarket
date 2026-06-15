'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { House, Package, Heart, ShoppingCart, UserRound } from 'lucide-react'
import { useCart } from '@/app/contexts/CartContext'
import { useAuth } from '@/app/contexts/AuthContext'

const navItems = [
  { href: '/', label: 'Ana Sayfa', icon: House },
  { href: '/urunler', label: 'Ürünler', icon: Package },
  { href: '/profil/favorilerim', label: 'Favoriler', icon: Heart },
  { href: '/sepet', label: 'Sepet', icon: ShoppingCart },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const { itemCount, loading: cartLoading } = useCart()
  const { user } = useAuth()

  const profileHref = user ? '/profil' : '/giris'
  const profileActive = pathname === '/profil' || pathname.startsWith('/profil/') || pathname === '/giris'

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200/90 bg-white/95 px-3 pb-[calc(env(safe-area-inset-bottom)+12px)] pt-2 shadow-[0_-18px_45px_-24px_rgba(30,41,59,0.32)] backdrop-blur md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 rounded-t-[24px] border border-slate-200/90 bg-gradient-to-b from-white via-slate-50 to-[#F8FAFC] p-1.5 shadow-[0_10px_30px_-24px_rgba(37,99,235,0.25)]">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={[
                'relative flex h-[62px] flex-col items-center justify-center gap-1 rounded-2xl border border-transparent px-1.5 py-2 text-[11px] font-semibold leading-none transition-all duration-200',
                isActive
                  ? 'border-secondary/20 bg-gradient-to-br from-secondary/15 to-accent/10 text-primary ring-1 ring-secondary/20 shadow-[0_8px_20px_-10px_rgba(37,99,235,0.45)]'
                  : 'text-slate-500',
              ].join(' ')}
            >
              <span
                className={[
                  'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
                  isActive ? 'bg-secondary/10' : 'bg-transparent active:bg-slate-100',
                ].join(' ')}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span>{item.label}</span>
              {item.href === '/sepet' && !cartLoading && itemCount > 0 && (
                <span className="absolute right-2.5 top-1.5 min-w-4 rounded-full bg-gradient-to-br from-red-500 to-rose-500 px-1 text-[10px] font-semibold text-white shadow-[0_6px_14px_-8px_rgba(244,63,94,0.9)]">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
          )
        })}

        <Link
          href={profileHref}
          className={[
            'flex h-[62px] flex-col items-center justify-center gap-1 rounded-2xl border border-transparent px-1.5 py-2 text-[11px] font-semibold leading-none transition-all duration-200',
            profileActive
              ? 'border-secondary/20 bg-gradient-to-br from-secondary/15 to-accent/10 text-primary ring-1 ring-secondary/20 shadow-[0_8px_20px_-10px_rgba(37,99,235,0.45)]'
              : 'text-slate-500',
          ].join(' ')}
        >
          <span
            className={[
              'flex h-9 w-9 items-center justify-center rounded-xl transition-colors',
              profileActive ? 'bg-secondary/10' : 'bg-transparent active:bg-slate-100',
            ].join(' ')}
          >
            <UserRound className="h-4 w-4" />
          </span>
          <span>Profil</span>
        </Link>
      </div>
    </nav>
  )
}
