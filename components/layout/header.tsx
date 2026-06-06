'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useRef, useEffect } from 'react'
import { CartButton } from '@/components/cart/CartButton'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { getAuthMetadata, hasAdminAccess } from '@/lib/auth/access'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { Shield, Menu, X, Search, Heart, ChevronDown, Home, Grid2X2, PackageSearch, Megaphone, PhoneCall, Truck } from 'lucide-react'

const desktopNavItems = [
  { href: '/', label: 'Anasayfa' },
  { href: '/kategoriler', label: 'Kategoriler' },
  { href: '/urunler', label: 'Tüm Ürünler' },
  { href: '/kampanyalar', label: 'Kampanyalar' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/kargo-takibi', label: 'Kargo Takibi' },
] as const

type MegaMenuLink = {
  href: string
  label: string
  description: string
  icon: typeof Home
}

const navMetaByHref = {
  '/': {
    description: 'Dental tedarikte öne çıkan ürünler ve güncel fırsatlar.',
    icon: Home,
  },
  '/kategoriler': {
    description: 'Uzmanlık alanına göre kategorileri hızlıca keşfedin.',
    icon: Grid2X2,
  },
  '/urunler': {
    description: 'Klinik ve laboratuvar ihtiyaçları için kapsamlı ürün listesi.',
    icon: PackageSearch,
  },
  '/kampanyalar': {
    description: 'B2B alıma özel kampanya ve teklifleri yakalayın.',
    icon: Megaphone,
  },
  '/iletisim': {
    description: 'Ekibimizle iletişime geçin, teklif ve destek alın.',
    icon: PhoneCall,
  },
  '/kargo-takibi': {
    description: 'Siparişlerinizi tek ekrandan canlı takip edin.',
    icon: Truck,
  },
} as const

const megaMenuLinksByHref: Record<(typeof desktopNavItems)[number]['href'], MegaMenuLink[]> = {
  '/': [
    { href: '/urunler', label: 'Ürün kataloğu', description: 'Tüm dental ürünleri filtreleyerek inceleyin.', icon: PackageSearch },
    { href: '/kampanyalar', label: 'Kampanyalar', description: 'Güncel fırsatları ve avantajlı teklifleri görün.', icon: Megaphone },
    { href: '/markalar', label: 'Markalar', description: 'Tedarik edilen markaları tek ekranda karşılaştırın.', icon: Grid2X2 },
    { href: '/kategoriler', label: 'Kategoriler', description: 'Klinik ve laboratuvar ihtiyaçlarına göre gezinin.', icon: Grid2X2 },
    { href: '/sss', label: 'Yardım merkezi', description: 'Satın alma ve üyelik sorularına hızlı yanıt alın.', icon: PhoneCall },
    { href: '/hakkimizda', label: 'Hakkımızda', description: 'DentAlışveriş yaklaşımını ve hizmet modelini okuyun.', icon: Home },
  ],
  '/kategoriler': [
    { href: '/kategoriler', label: 'Tüm kategoriler', description: 'Ana kategori ağacını ve alt başlıkları keşfedin.', icon: Grid2X2 },
    { href: '/urunler?sort=name-asc', label: 'A-Z ürün listesi', description: 'Katalogdaki ürünleri ada göre sıralayın.', icon: PackageSearch },
    { href: '/urunler?inStock=true', label: 'Stoktakiler', description: 'Hemen temin edilebilen ürünleri listeleyin.', icon: Truck },
    { href: '/markalar', label: 'Markaya göre gez', description: 'Kategori seçmeden marka sayfalarına geçin.', icon: Grid2X2 },
    { href: '/kampanyalar', label: 'Kategori fırsatları', description: 'İhtiyaç alanlarına göre kampanyaları yakalayın.', icon: Megaphone },
    { href: '/iletisim', label: 'Teklif desteği', description: 'Aradığınız kategori için ekiple iletişime geçin.', icon: PhoneCall },
  ],
  '/urunler': [
    { href: '/urunler', label: 'Tüm ürünler', description: 'Katalogdaki tüm ürünleri ve teklifleri görüntüleyin.', icon: PackageSearch },
    { href: '/urunler?sort=price-asc', label: 'En uygun fiyat', description: 'Ürünleri düşük fiyattan yükseğe sıralayın.', icon: Megaphone },
    { href: '/urunler?sort=price-desc', label: 'Premium seçenekler', description: 'Yüksek fiyatlı ürünleri önce inceleyin.', icon: Shield },
    { href: '/urunler?inStock=true', label: 'Stokta olanlar', description: 'Satın almaya hazır tekliflere hızlıca ulaşın.', icon: Truck },
    { href: '/markalar', label: 'Markalar', description: 'Ürünleri tedarikçi markalar üzerinden keşfedin.', icon: Grid2X2 },
    { href: '/kategoriler', label: 'Kategori filtresi', description: 'Ürün aramasına kategori ağacından başlayın.', icon: Grid2X2 },
  ],
  '/kampanyalar': [
    { href: '/kampanyalar', label: 'Tüm kampanyalar', description: 'Güncel kampanya vitrinine geçin.', icon: Megaphone },
    { href: '/urunler?sort=price-asc', label: 'Fiyat avantajı', description: 'Uygun fiyatlı ürünleri katalogda sıralayın.', icon: PackageSearch },
    { href: '/urunler?inStock=true', label: 'Hemen gönderim', description: 'Stoklu ürün fırsatlarına odaklanın.', icon: Truck },
    { href: '/markalar', label: 'Marka fırsatları', description: 'Marka sayfalarından teklifleri değerlendirin.', icon: Grid2X2 },
    { href: '/odeme', label: 'Ödeme seçenekleri', description: 'Satın alma öncesi ödeme akışını inceleyin.', icon: Shield },
    { href: '/iletisim', label: 'Toplu alım', description: 'Klinik ve kurum alımları için destek isteyin.', icon: PhoneCall },
  ],
  '/iletisim': [
    { href: '/iletisim', label: 'İletişim formu', description: 'Satış, destek ve teklif taleplerinizi iletin.', icon: PhoneCall },
    { href: '/sss', label: 'Sık sorulanlar', description: 'En yaygın sorulara hızlı yanıt bulun.', icon: Grid2X2 },
    { href: '/hakkimizda', label: 'Hakkımızda', description: 'Platform ve hizmet kapsamı hakkında bilgi alın.', icon: Home },
    { href: '/kargo-takibi', label: 'Kargo takibi', description: 'Siparişinizin teslimat durumunu sorgulayın.', icon: Truck },
    { href: '/iade-politikasi', label: 'İade politikası', description: 'İade ve değişim koşullarını okuyun.', icon: Shield },
    { href: '/gizlilik-politikasi', label: 'Gizlilik', description: 'Kişisel veri ve gizlilik esaslarını inceleyin.', icon: Shield },
  ],
  '/kargo-takibi': [
    { href: '/kargo-takibi', label: 'Kargo sorgula', description: 'Gönderi durumunu takip numarasıyla kontrol edin.', icon: Truck },
    { href: '/profil/siparislerim', label: 'Siparişlerim', description: 'Hesabınızdaki sipariş geçmişine gidin.', icon: PackageSearch },
    { href: '/sss', label: 'Teslimat yardımı', description: 'Kargo ve teslimat sorularına yanıt alın.', icon: Grid2X2 },
    { href: '/iletisim', label: 'Destek al', description: 'Teslimat sorunları için ekibe ulaşın.', icon: PhoneCall },
    { href: '/iade-politikasi', label: 'İade süreci', description: 'Teslimat sonrası iade adımlarını inceleyin.', icon: Shield },
    { href: '/odeme', label: 'Ödeme bilgileri', description: 'Sipariş öncesi ödeme seçeneklerini görün.', icon: Shield },
  ],
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isTabletNavOpen, setIsTabletNavOpen] = useState(false)
  const [activeMegaHref, setActiveMegaHref] = useState<string | null>(null)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const profileRef = useRef<HTMLDivElement>(null)
  const tabletNavRef = useRef<HTMLDivElement>(null)
  const desktopNavRef = useRef<HTMLDivElement>(null)
  const mobileSearchInputRef = useRef<HTMLInputElement>(null)
  const searchPanelInputRef = useRef<HTMLInputElement>(null)
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

      if (tabletNavRef.current && !tabletNavRef.current.contains(event.target as Node)) {
        setIsTabletNavOpen(false)
      }

      if (desktopNavRef.current && !desktopNavRef.current.contains(event.target as Node)) {
        setActiveMegaHref(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    function handleScroll() {
      setIsScrolled(window.scrollY > 24)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isSearchOpen) return

    window.requestAnimationFrame(() => {
      searchPanelInputRef.current?.focus()
      mobileSearchInputRef.current?.focus()
    })
  }, [isSearchOpen])

  const submitSearch = (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault()
    const query = searchQuery.trim()
    if (!query) return
    router.push(`/urunler?q=${encodeURIComponent(query)}`)
    setIsSearchOpen(false)
    setSearchQuery('')
  }
  const isNavItemActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const activeMegaItem = activeMegaHref ? desktopNavItems.find((item) => item.href === activeMegaHref) : undefined
  const activeMegaLinks = activeMegaItem ? megaMenuLinksByHref[activeMegaItem.href] : []

  useEffect(() => {
    setIsMenuOpen(false)
    setIsTabletNavOpen(false)
    setActiveMegaHref(null)
    setIsSearchOpen(false)
  }, [pathname])

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur">
      <div className="container-main py-3 md:py-4">
        <div
          className={[
            'rounded-[20px] border border-slate-200/80 bg-white/90 shadow-[0_14px_40px_-24px_rgba(15,23,42,0.3)] transition-all duration-300',
            isScrolled ? 'border-slate-200 shadow-[0_24px_52px_-30px_rgba(15,23,42,0.34)]' : '',
          ].join(' ')}
        >
          <div className="relative flex min-h-[68px] items-center gap-2 px-3 py-2 md:min-h-[76px] md:px-5">
            <Link
              href="/"
              aria-label="Dentalışveriş ana sayfa"
              className="flex shrink-0 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-primary transition duration-200 hover:border-primary/30 hover:bg-primary/[0.03]"
            >
              <BrandLogo variant="icon" className="h-8 w-8 shrink-0" />
              <span aria-hidden="true" className="hidden text-xs font-semibold tracking-[0.1em] text-slate-800 sm:inline">Dentalışveriş</span>
            </Link>

            <div
              ref={desktopNavRef}
              className="relative hidden min-w-0 flex-1 justify-center px-2 lg:flex"
              onMouseLeave={() => setActiveMegaHref(null)}
            >
              <nav className="flex max-w-full items-center gap-1 rounded-2xl border border-slate-200 bg-slate-50/80 px-1.5 py-1.5 text-[13px] font-semibold text-slate-700">
                {desktopNavItems.map((item) => {
                  const isActive = isNavItemActive(item.href)

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? 'page' : undefined}
                      onMouseEnter={() => setActiveMegaHref(item.href)}
                      onFocus={() => setActiveMegaHref(item.href)}
                      className={[
                        'group relative rounded-xl px-3.5 py-2 transition-all duration-200',
                        isActive
                          ? 'bg-white text-primary shadow-[0_8px_20px_-12px_rgba(37,99,235,0.55)]'
                          : 'text-slate-700 hover:bg-white hover:text-primary',
                      ].join(' ')}
                    >
                      {item.label}
                      <span
                        aria-hidden="true"
                        className={[
                          'absolute inset-x-3 -bottom-[2px] h-0.5 rounded-full bg-primary transition-opacity duration-200',
                          isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-60',
                        ].join(' ')}
                      />
                    </Link>
                  )
                })}
              </nav>

              {activeMegaItem && (
                <div
                  className="pointer-events-none absolute left-1/2 top-[calc(100%+14px)] z-50 w-[min(92vw,860px)] -translate-x-1/2 translate-y-0 opacity-100 transition-all duration-250"
                  onMouseEnter={() => {
                    if (activeMegaHref) setActiveMegaHref(activeMegaHref)
                  }}
                >
                  <div className="pointer-events-auto grid grid-cols-1 gap-4 rounded-[20px] border border-slate-200 bg-white p-5 shadow-[0_34px_72px_-34px_rgba(15,23,42,0.35)] xl:grid-cols-[260px_1fr]">
                    <div className="rounded-2xl border border-primary/10 bg-gradient-to-b from-primary/10 to-primary/5 p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary/80">One Cikan Alan</p>
                      <h3 className="mt-2 text-lg font-semibold text-slate-900">{activeMegaItem.label}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-slate-600">
                        {navMetaByHref[activeMegaItem.href as keyof typeof navMetaByHref]?.description}
                      </p>
                      <Link
                        href={activeMegaItem.href}
                        className="mt-4 inline-flex items-center rounded-full border border-primary/20 bg-white px-4 py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        {activeMegaItem.label} sayfasina git
                      </Link>
                    </div>

                    <div className="grid grid-cols-2 gap-3 xl:grid-cols-3">
                      {activeMegaLinks.map((link) => {
                        const Icon = link.icon

                        return (
                          <Link
                            key={`${activeMegaItem.href}-${link.href}`}
                            href={link.href}
                            className="group rounded-2xl border border-slate-200 bg-slate-50/70 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:bg-primary/[0.05]"
                          >
                            <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-white text-primary shadow-sm ring-1 ring-slate-200/80">
                              <Icon className="h-4 w-4" />
                            </span>
                            <p className="mt-2 text-sm font-semibold text-slate-900">{link.label}</p>
                            <p className="mt-1 text-xs leading-relaxed text-slate-600">{link.description}</p>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="relative ml-2 hidden md:block lg:hidden" ref={tabletNavRef}>
              <button
                type="button"
                onClick={() => setIsTabletNavOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition duration-200 hover:border-primary/30 hover:text-primary"
              >
                Menü
                <ChevronDown className={['h-4 w-4 transition-transform duration-200', isTabletNavOpen ? 'rotate-180' : ''].join(' ')} />
              </button>

              {isTabletNavOpen && (
                <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-64 rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_24px_50px_-30px_rgba(15,23,42,0.32)]">
                  {desktopNavItems.map((item) => {
                    const isActive = isNavItemActive(item.href)
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setIsTabletNavOpen(false)}
                        className={[
                          'mb-1 block rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors last:mb-0',
                          isActive ? 'bg-primary text-white' : 'text-slate-700 hover:bg-primary/10 hover:text-primary',
                        ].join(' ')}
                      >
                        {item.label}
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="ml-auto flex items-center gap-2">
              <button 
                onClick={() => {
                  setIsSearchOpen((prev) => !prev)
                }}
                className={[
                  'rounded-full border border-slate-200 bg-white p-2 text-secondary-text transition duration-200 hover:border-primary/30 hover:text-primary',
                  isScrolled ? 'inline-flex' : 'xl:hidden',
                ].join(' ')}
                aria-label="Arama panelini aç"
                aria-expanded={isSearchOpen}
              >
                <Search className="h-5 w-5" />
              </button>

              <form onSubmit={submitSearch} className={isScrolled ? 'hidden xl:hidden' : 'hidden xl:flex'}>
                <label className="relative flex h-10 w-64 items-center rounded-full border border-slate-200 bg-white pl-9 pr-3 shadow-sm transition duration-200 focus-within:border-primary/40">
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

              <Link
                href="/profil/favorilerim"
                className="hidden rounded-full border border-slate-200 bg-white p-2 text-secondary-text transition duration-200 hover:border-primary/30 hover:text-primary sm:flex"
              >
                <Heart className="h-5 w-5" />
              </Link>

              {!user && !loading && (
                <Link
                  href="/kayit"
                  className="hidden h-10 items-center rounded-full border border-primary/30 bg-white px-4 text-sm font-semibold text-primary transition duration-200 hover:bg-primary/[0.06] lg:inline-flex"
                >
                  Kayit Ol
                </Link>
              )}

              <CartButton />

              {loading ? (
                <div className="w-10 h-10 rounded-xl bg-muted animate-pulse" />
              ) : user ? (
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 rounded-full border border-slate-200 bg-white p-1.5 text-secondary-text transition duration-200 hover:border-primary/30 hover:text-primary"
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
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-white shadow-sm transition duration-200 hover:bg-primary/90"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span className="hidden sm:inline">Giriş Yap</span>
                </Link>
              )}

              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="rounded-full border border-slate-200 bg-white p-2 text-secondary-text transition duration-200 hover:border-primary/30 hover:text-primary md:hidden"
                aria-label="Mobil menü"
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Search Card */}
          {(!isScrolled || isSearchOpen) && (
          <div className="border-t border-slate-200/70 bg-slate-50/90 p-3 md:hidden">
            <form onSubmit={submitSearch} className="relative rounded-[22px] border border-slate-200 bg-white p-2 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.35)]">
              <input
                ref={mobileSearchInputRef}
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Ürün, marka veya kategori ara..."
                className="h-11 w-full rounded-2xl bg-transparent px-4 pr-24 text-sm text-body-text placeholder-secondary-text focus:outline-none"
                autoFocus={isSearchOpen}
              />
              <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Aramayı temizle"
                    onClick={() => setSearchQuery('')}
                    className="inline-flex h-8 items-center rounded-xl border border-slate-200 px-2 text-xs font-semibold text-slate-600"
                  >
                    Temizle
                  </button>
                )}
                <button
                  type="submit"
                  aria-label="Ara"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-sm"
                >
                  <Search className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
          )}

          {isScrolled && isSearchOpen && (
            <div className="hidden border-t border-slate-200/70 bg-slate-50/90 p-3 md:block">
              <form onSubmit={submitSearch} className="mx-auto max-w-xl">
                <label className="relative flex h-12 items-center rounded-2xl border border-slate-200 bg-white pl-10 pr-3 shadow-[0_12px_28px_-18px_rgba(15,23,42,0.35)] transition duration-200 focus-within:border-primary/40">
                  <Search className="pointer-events-none absolute left-4 h-4 w-4 text-text-muted" />
                  <input
                    ref={searchPanelInputRef}
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Ürün, marka veya kategori ara..."
                    aria-label="Ürün ara"
                    className="h-full w-full bg-transparent pr-24 text-sm text-body-text placeholder-secondary-text focus:outline-none"
                  />
                  <div className="absolute inset-y-0 right-3 flex items-center gap-2">
                    {searchQuery && (
                      <button
                        type="button"
                        aria-label="Aramayı temizle"
                        onClick={() => setSearchQuery('')}
                        className="inline-flex h-8 items-center rounded-xl border border-slate-200 px-2 text-xs font-semibold text-slate-600"
                      >
                        Temizle
                      </button>
                    )}
                    <button
                      type="submit"
                      aria-label="Ara"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-white shadow-sm"
                    >
                      <Search className="h-4 w-4" />
                    </button>
                  </div>
                </label>
              </form>
            </div>
          )}
        </div>
      </div>

      {isMenuOpen && (
        <div className="animate-fade-in md:hidden">
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
