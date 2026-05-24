'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { CartButton } from '@/components/cart/CartButton'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { getAuthMetadata, hasAdminAccess } from '@/lib/auth/access'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { Shield, Phone, Mail, Menu, X, Search, Heart, Sparkles } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
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

  const headerHeight = isScrolled ? 'h-14 md:h-[3.85rem]' : 'h-[4.5rem] md:h-[4.75rem]'
  const glowStyle = {
    opacity: isScrolled ? 0.55 : 0.8,
  }

  return (
    <header className="sticky top-0 z-50 px-2 pt-2 transition-all duration-300 md:px-4">
      {/* Top Bar */}
      <div
        className={[
          'overflow-hidden rounded-t-[1.75rem] border border-white/10 bg-primary/90 text-white shadow-[inset_0_-1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-all duration-300',
          isScrolled ? 'pointer-events-none max-h-0 translate-y-[-8px] border-transparent opacity-0' : 'max-h-16 opacity-100',
        ].join(' ')}
      >
        <div className="container-main">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="hidden md:flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="font-medium">Diş Hekimleri İçin Premium B2B Dental Platform</span>
            </div>
            <div className="hidden md:flex items-center gap-6 ml-auto">
              <a href="tel:+908501234567" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                <span>+90 (850) 123 45 67</span>
              </a>
              <a href="mailto:info@dentalisveris.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@dentalisveris.com</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header - White */}
      <div
        className={[
          'rounded-[1.75rem] border shadow-[0_16px_40px_rgba(15,23,42,0.08)] transition-colors duration-300',
          isScrolled
            ? 'border-white/60 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.10)]'
            : 'border-border/60 bg-white',
        ].join(' ')}
      >
        <div className="container-main relative rounded-[inherit]">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]">
            <div className="absolute inset-x-[12%] top-[-4.5rem] h-28 rounded-full bg-gradient-to-r from-secondary/12 via-accent/18 to-primary/12 blur-3xl transition-opacity duration-300" style={glowStyle} />
          </div>
          <div className={['relative flex items-center justify-between gap-4 transition-all duration-300', headerHeight].join(' ')}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 shrink-0">
              <BrandLogo
                variant="icon"
                className="h-12 w-12 shrink-0 sm:hidden"
              />
              <BrandLogo
                variant="full"
                className="hidden h-10 w-auto sm:block md:h-11"
              />
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Ürün, marka veya kategori ara..."
                  className="h-12 w-full rounded-2xl border border-white/50 bg-white/70 pl-5 pr-14 text-body-text placeholder-secondary-text shadow-sm backdrop-blur-md transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
                />
                <button className="absolute right-2 top-1/2 inline-flex h-9 -translate-y-1/2 items-center justify-center rounded-xl bg-primary px-4 text-white shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-lg">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Toggle */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="rounded-2xl border border-transparent p-2.5 text-secondary-text transition-all duration-200 hover:border-white/40 hover:bg-white/50 hover:text-primary md:hidden"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Favorites */}
              <Link href="/profil/favorilerim" className="hidden rounded-2xl border border-transparent p-2.5 text-secondary-text transition-all duration-200 hover:border-white/40 hover:bg-white/50 hover:text-primary sm:flex">
                <Heart className="w-6 h-6" />
              </Link>

              {/* Cart */}
              <CartButton />

              {/* Account / Auth */}
              {loading ? (
                <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
              ) : user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-2xl border border-transparent p-2 text-secondary-text transition-all duration-200 hover:border-white/40 hover:bg-white/50 hover:text-primary"
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
                  className="inline-flex h-10 items-center gap-2 rounded-2xl bg-primary px-5 text-white font-bold shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-xl"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Giriş Yap</span>
                </Link>
              )}

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-2xl border border-transparent p-2.5 text-secondary-text transition-all duration-200 hover:border-white/40 hover:bg-white/50 hover:text-primary lg:hidden"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {isSearchOpen && (
            <div className="md:hidden pb-4 animate-fade-in">
              <input
                type="text"
                placeholder="Ürün, marka veya kategori ara..."
                className="h-11 w-full rounded-2xl border border-white/50 bg-white/75 px-4 text-body-text placeholder-secondary-text backdrop-blur-md transition-all duration-200 focus:border-primary focus:outline-none"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="animate-fade-in lg:hidden">
          <nav className="mx-2 mt-2 rounded-[1.75rem] border border-border/60 bg-white/84 px-4 py-4 shadow-xl backdrop-blur-xl md:mx-4">
            <div className="space-y-2">
              <Link href="/kategoriler" className="block rounded-2xl px-4 py-3 font-medium text-secondary-text transition-all duration-200 hover:bg-muted hover:text-primary">
                Kategoriler
              </Link>
              <Link href="/markalar" className="block rounded-2xl px-4 py-3 font-medium text-secondary-text transition-all duration-200 hover:bg-muted hover:text-primary">
                Markalar
              </Link>
              <Link href="/urunler" className="block rounded-2xl px-4 py-3 font-medium text-secondary-text transition-all duration-200 hover:bg-muted hover:text-primary">
                Tüm Ürünler
              </Link>
              <Link href="/kampanyalar" className="block rounded-2xl px-4 py-3 font-bold text-accent transition-all duration-200 hover:bg-accent/10">
                Kampanyalar
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
