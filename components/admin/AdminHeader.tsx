'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { LogOut, Home, Search, ShieldCheck, Menu } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import type { Database } from '@/types/database.types'
import NotificationBell from '@/components/notifications/NotificationBell'

interface AdminHeaderProps {
  user: User
  onMenuToggle?: () => void
}

export default function AdminHeader({ user, onMenuToggle }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/giris')
    router.refresh()
  }

  return (
    // sticky only on lg+ (desktop sidebar layout); on mobile it scrolls away
    <header className="z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl lg:sticky lg:top-0">
      <div className="flex flex-col gap-4 px-4 py-4 md:px-6 xl:px-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onMenuToggle}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-border/60 bg-card/80 text-body-text shadow-subtle lg:hidden"
                aria-label="Menüyü aç"
              >
                <Menu className="h-5 w-5" />
              </button>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-secondary-text">
              Admin Control Center
            </p>
            </div>
            <h2 className="mt-2 text-2xl font-semibold text-foreground">
              Hoş geldiniz, yönetim paneli hazır.
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="hidden min-w-[280px] items-center gap-3 rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-secondary-text shadow-subtle md:flex">
              <Search className="h-4 w-4" />
              <span className="text-sm">Sipariş, ürün veya müşteri ara...</span>
            </div>

            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-card/80 px-4 py-3 text-sm font-medium text-body-text shadow-subtle transition-colors hover:border-secondary/40"
              title="Ana Sayfaya Dön"
            >
              <Home className="h-4 w-4" />
              <span className="hidden md:inline">Ana Sayfa</span>
            </Link>

            <NotificationBell />

            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card/90 px-4 py-3 shadow-subtle">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-secondary to-accent text-sm font-semibold text-white">
                {(user.email?.[0] ?? 'A').toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">{user.email}</p>
                <p className="mt-1 inline-flex items-center gap-1 text-xs text-secondary-text">
                  <ShieldCheck className="h-3.5 w-3.5 text-success" />
                  Admin yetkisi aktif
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 text-destructive transition-colors hover:bg-destructive hover:text-white"
              title="Çıkış Yap"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
