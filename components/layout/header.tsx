'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { CartButton } from '@/components/cart/CartButton'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { getAuthMetadata, hasAdminAccess } from '@/lib/auth/access'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { Shield, Menu, X, Search, Heart } from 'lucide-react'

const desktopNavItems = [
  { href: '/', label: 'Anasayfa' },
  { href: '/kategoriler', label: 'Kategoriler' },
  { href: '/urunler', label: 'Tüm Ürünler' },
  { href: '/kampanyalar', label: 'Kampanyalar' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/kargo-takibi', label: 'Kargo Takibi' },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const router = useRouter()
  const { user, loading } = useAuth()

  // Check admin role
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false)
        return
      }

      const authMetadata = getAuthMetadata(user)

      const supabase = createClient()
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        setIsAdmin(hasAdminAccess(undefined, authMetadata))
        return
      }

      setIsAdmin(hasAdminAccess(profile?.role, authMetadata))
    }

    checkAdmin()
  }, [user])

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleScroll() {
      const nextScrollOffset = Math.min(window.scrollY, 180)
      setIsScrolled(nextScrollOffset > 24)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const submitSearch = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    router.push(`/urunler?q=${encodeURIComponent(query)}`)
    setIsSearchOpen(false)
    setSearchQuery('')
  }
  const isNavItemActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)

  return (
    <header className="sticky top-0 z-50 border-b border-primary/10 bg-white/75 backdrop-blur">
      <div className="container-main py-3">
        <div
          className={[
            'rounded-full border border-primary/10 bg-white/95 shadow-[0_20px_42px_-30px_rgba(15,23,42,0.6)] transition-all duration-300',
            isScrolled ? 'shadow-[0_24px_48px_-32px_rgba(15,23,42,0.62)]' : '',
          ].join(' ')}
        >
          <div className="flex items-center gap-2 px-3 py-2 md:px-4">
            <Link
              href="/"
              aria-label="DENTALMARKETTR ana sayfa"
              className="flex shrink-0 items-center gap-2 rounded-full border border-primary/10 bg-white px-2.5 py-1.5 text-primary transition hover:border-secondary/35"
            >
              <BrandLogo variant="icon" className="h-8 w-8 shrink-0 md:h-9 md:w-9" />
              <span aria-hidden="true" className="hidden text-xs font-semibold tracking-[0.12em] sm:inline">DENTALMARKETTR</span>
            </Link>

            <div className="hidden min-w-0 flex-1 justify-center px-2 lg:flex">
              <nav className="flex max-w-full items-center gap-1 overflow-x-auto whitespace-nowrap rounded-full border border-primary/10 bg-primary/[0.03] p-1 text-[13px] font-semibold text-primary [scrollbar-width:none]">
                {desktopNavItems.map((item) => {
                  const isActive = isNavItemActive(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={[
                        'rounded-full px-3 py-1.5 transition-colors',
                        isActive ? 'bg-primary text-white shadow-sm' : 'hover:bg-primary/10',
                      ].join(' ')}
                    >
                      {item.label}
                    </Link>
                  )
                })}
              </nav>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="rounded-full border border-primary/10 p-2 text-secondary-text transition hover:border-secondary/35 hover:text-primary md:hidden"
              >
                <Search className="h-5 w-5" />
              </button>

              <form onSubmit={submitSearch} className="hidden xl:flex">
                <label className="relative flex h-10 w-64 items-center rounded-full border border-primary/10 bg-white pl-9 pr-3 shadow-sm transition focus-within:border-secondary/45">
                  <Search className="pointer-events-none absolute left-3 h-4 w-4 text-text-muted" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Ürün ara..."
                    aria-label="Ürün ara"
                    className="h-full w-full bg-transparent text-sm text-body-text placeholder-secondary-text focus:outline-none"
                  />
                </label>
              </form>

              <Link href="/profil/favorilerim" className="hidden rounded-full border border-primary/10 p-2 text-secondary-text transition hover:border-secondary/35 hover:text-primary sm:flex">
                <Heart className="h-5 w-5" />
              </Link>

              <CartButton />

              {loading ? (
                <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
              ) : user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-full border border-primary/10 p-1.5 text-secondary-text transition hover:border-secondary/35 hover:text-primary"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-secondary to-primary shadow-md">
                      <span className="text-white text-sm font-semibold">
                        {user.email?.charAt(0).toUpperCase() || 'U'}
                      </span>
                    </div>
                    <svg 
                      className={`w-4 h-4 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 z-50 mt-3 w-60 overflow-hidden rounded-[1.5rem] border border-primary/10 bg-white py-1.5 text-slate-900 shadow-[0_24px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-950/5 animate-fade-in">
                      <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-br from-primary/8 via-secondary/8 to-transparent" />
                      <div className="relative border-b border-slate-200/80 px-4 py-2.5">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {user.user_metadata?.full_name || 'Kullanıcı'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="relative py-1">
                        <Link
                          href="/profil"
                          onClick={() => setIsProfileOpen(false)}
                          className="mx-2 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-slate-700 transition-colors hover:bg-primary/5 hover:text-primary"
                        >
                          <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profilim
                        </Link>
                        <Link
                          href="/profil/siparislerim"
                          onClick={() => setIsProfileOpen(false)}
                          className="mx-2 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-slate-700 transition-colors hover:bg-primary/5 hover:text-primary"
                        >
                          <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Siparişlerim
                        </Link>
                        <Link
                          href="/profil/favorilerim"
                          onClick={() => setIsProfileOpen(false)}
                          className="mx-2 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-slate-700 transition-colors hover:bg-primary/5 hover:text-primary"
                        >
                          <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Favorilerim
                        </Link>
                        <Link
                          href="/profil/adreslerim"
                          onClick={() => setIsProfileOpen(false)}
                          className="mx-2 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-slate-700 transition-colors hover:bg-primary/5 hover:text-primary"
                        >
                          <svg className="h-5 w-5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Adreslerim
                        </Link>
                      </div>

                      {isAdmin && (
                        <div className="mt-1 border-t border-slate-200/80 pt-1">
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="mx-2 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-slate-700 transition-colors hover:bg-primary/5 hover:text-primary"
                          >
                            <Shield className="h-5 w-5 text-slate-500" />
                            Admin Panel
                          </Link>
                        </div>
                      )}

                      <div className="mt-1 border-t border-slate-200/80 pt-1">
                        <Link
                          href="/cikis"
                          onClick={() => setIsProfileOpen(false)}
                          className="mx-2 flex items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-red-600 transition-colors hover:bg-red-50"
                        >
                          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                          </svg>
                          Çıkış Yap
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  href="/giris" 
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-primary/90"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Giriş Yap</span>
                </Link>
              )}

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-full border border-primary/10 p-2 text-secondary-text transition hover:border-secondary/35 hover:text-primary lg:hidden"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchOpen && (
            <div className="md:hidden pb-4 animate-fade-in">
              <form onSubmit={submitSearch} className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Ürün, marka veya kategori ara..."
                  className="h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 pr-12 text-body-text placeholder-secondary-text shadow-sm backdrop-blur-md transition-all duration-200 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30"
                  autoFocus
                />
                <button
                  type="submit"
                  aria-label="Ara"
                  className="absolute right-2 top-1/2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl bg-primary text-white shadow-sm"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="animate-fade-in lg:hidden">
          <nav className="mx-2 mt-2 rounded-[1.75rem] border border-border/60 bg-white/95 px-4 py-4 shadow-xl backdrop-blur-xl md:mx-4">
            <div className="space-y-2">
              {desktopNavItems.map((item) => {
                const isActive = isNavItemActive(item.href)
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={[
                      'block rounded-2xl px-4 py-3 text-sm font-semibold transition-colors',
                      isActive ? 'bg-primary text-white' : 'text-secondary-text hover:bg-muted hover:text-primary',
                    ].join(' ')}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
