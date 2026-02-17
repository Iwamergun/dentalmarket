'use client'

import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { CartButton } from '@/components/cart/CartButton'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Shield, Phone, Mail, Menu, X, Search } from 'lucide-react'

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const { user, loading } = useAuth()

  // Check admin role
  useEffect(() => {
    async function checkAdmin() {
      if (!user) {
        setIsAdmin(false)
        return
      }
      const supabase = createClient()
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      setIsAdmin(profile?.role === 'admin')
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

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      {/* Top Info Bar */}
      <div className="bg-primary text-white">
        <div className="container-main">
          <div className="flex h-10 items-center justify-between text-sm">
            <div className="hidden md:flex items-center gap-6">
              <a href="tel:+908501234567" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <Phone className="w-4 h-4" />
                <span>+90 (850) 123 45 67</span>
              </a>
              <a href="mailto:info@dentalmarket.com" className="flex items-center gap-1.5 hover:text-accent transition-colors">
                <Mail className="w-4 h-4" />
                <span>info@dentalmarket.com</span>
              </a>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <Link href="/hakkimizda" className="hover:text-accent transition-colors">
                Hakkımızda
              </Link>
              <Link href="/iletisim" className="hover:text-accent transition-colors">
                İletişim
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="border-b border-border">
        <div className="container-main">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
                <span className="text-white font-bold text-lg">DM</span>
              </div>
              <span className="hidden sm:block text-xl font-bold text-primary">
                Dental<span className="text-secondary">Market</span>
              </span>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-xl">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Ürün, marka veya kategori ara..."
                  className="w-full h-10 pl-4 pr-12 rounded-lg bg-background border border-border text-text-primary placeholder-text-muted focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-all duration-200"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-text-muted hover:text-secondary transition-colors">
                  <Search className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {/* Mobile Search Toggle */}
              <button 
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-secondary hover:bg-background transition-all duration-200"
              >
                <Search className="w-6 h-6" />
              </button>

              {/* Cart */}
              <CartButton />

              {/* Account / Auth */}
              {loading ? (
                <div className="w-10 h-10 rounded-lg bg-background animate-pulse" />
              ) : user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 p-2 rounded-lg text-text-secondary hover:text-secondary hover:bg-background transition-all duration-200"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
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
                    <div className="absolute right-0 mt-2 w-56 bg-white border border-border rounded-xl shadow-premium py-2 z-50 animate-fade-in">
                      <div className="px-4 py-3 border-b border-border">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {user.user_metadata?.full_name || 'Kullanıcı'}
                        </p>
                        <p className="text-xs text-text-muted truncate">
                          {user.email}
                        </p>
                      </div>

                      <div className="py-1">
                        <Link
                          href="/profil"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-secondary hover:bg-background transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Profilim
                        </Link>
                        <Link
                          href="/profil/siparislerim"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-secondary hover:bg-background transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                          Siparişlerim
                        </Link>
                        <Link
                          href="/profil/favorilerim"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-secondary hover:bg-background transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                          Favorilerim
                        </Link>
                        <Link
                          href="/profil/adreslerim"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-secondary hover:bg-background transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Adreslerim
                        </Link>
                      </div>

                      {isAdmin && (
                        <div className="border-t border-border pt-1 mt-1">
                          <Link
                            href="/admin/dashboard"
                            onClick={() => setIsProfileOpen(false)}
                            className="flex items-center gap-3 px-4 py-2.5 text-text-secondary hover:text-secondary hover:bg-background transition-colors"
                          >
                            <Shield className="w-5 h-5" />
                            Admin Panel
                          </Link>
                        </div>
                      )}

                      <div className="border-t border-border pt-1 mt-1">
                        <Link
                          href="/cikis"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-red-500 hover:bg-red-500/10 transition-colors"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-white font-medium hover:bg-secondary-dark transition-all duration-200"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Giriş Yap</span>
                </Link>
              )}

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-lg text-text-secondary hover:text-secondary hover:bg-background transition-all duration-200 lg:hidden"
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
                className="w-full h-10 px-4 rounded-lg bg-background border border-border text-text-primary placeholder-text-muted focus:border-secondary focus:outline-none transition-all duration-200"
                autoFocus
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden border-t border-border bg-white animate-fade-in">
          <nav className="container-main py-4 space-y-2">
            <Link href="/kategoriler" className="block px-4 py-3 rounded-lg text-text-secondary hover:text-secondary hover:bg-background transition-all duration-200">
              Kategoriler
            </Link>
            <Link href="/markalar" className="block px-4 py-3 rounded-lg text-text-secondary hover:text-secondary hover:bg-background transition-all duration-200">
              Markalar
            </Link>
            <Link href="/urunler" className="block px-4 py-3 rounded-lg text-text-secondary hover:text-secondary hover:bg-background transition-all duration-200">
              Tüm Ürünler
            </Link>
            <Link href="/kampanyalar" className="block px-4 py-3 rounded-lg text-accent hover:bg-accent/5 transition-all duration-200">
              Kampanyalar
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
