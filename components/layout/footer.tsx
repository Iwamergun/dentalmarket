import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { BrandLogo } from '@/components/brand/BrandLogo'

async function getFooterStats() {
  try {
    const supabase = await createClient()

    const [categoriesResult, suppliersResult, productsResult] = await Promise.all([
      supabase.from('categories').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'supplier')
        .eq('is_active', true),
      supabase.from('catalog_products').select('*', { count: 'exact', head: true }).eq('is_active', true),
    ])

    return {
      categoriesCount: categoriesResult.count ?? 0,
      suppliersCount: suppliersResult.count ?? 0,
      productsCount: productsResult.count ?? 0,
    }
  } catch {
    return {
      categoriesCount: 0,
      suppliersCount: 0,
      productsCount: 0,
    }
  }
}

export async function Footer() {
  const { categoriesCount, suppliersCount, productsCount } = await getFooterStats()

  const stats = [
    {
      label: 'Aktif kategori',
      value: `${categoriesCount}+`,
      tone: 'from-primary/14 via-primary/6 to-white',
    },
    {
      label: 'Doğrulanmış satıcı',
      value: `${suppliersCount}+`,
      tone: 'from-secondary/14 via-secondary/6 to-white',
    },
    {
      label: 'Yayındaki ürün',
      value: `${productsCount}+`,
      tone: 'from-accent/18 via-accent/8 to-white',
    },
  ]

  return (
    <footer className="relative mt-20 overflow-hidden border-t border-primary/10 bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.12),_transparent_34%),radial-gradient(circle_at_top_right,_rgba(14,165,233,0.12),_transparent_28%),linear-gradient(180deg,_#f8fbff_0%,_#eef4ff_48%,_#f6f9ff_100%)] text-slate-700">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-[linear-gradient(90deg,rgba(37,99,235,0.14),rgba(99,102,241,0.10),rgba(14,165,233,0.14))] blur-3xl" />
      <div className="container-main relative py-12 md:py-16">
        <div className="mb-8 rounded-[2rem] border border-primary/10 bg-white/82 p-6 shadow-[0_24px_60px_rgba(15,23,42,0.08)] backdrop-blur-xl md:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">Dental procurement, simplified</p>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">Kliniklerin satın alma akışını hızlandıran daha modern bir tedarik katmanı.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600 md:text-base">
                Tedarikçileri, kampanyaları ve ürün keşfini tek bir daha temiz deneyimde bir araya getiriyoruz. Hızlı karar, net görünürlük, daha az operasyon yükü.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[26rem]">
              {stats.map((stat) => (
                <div key={stat.label} className={`rounded-2xl border border-primary/10 bg-gradient-to-br ${stat.tone} px-4 py-4 shadow-sm`}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">{stat.label}</p>
                  <p className="mt-2 text-2xl font-bold text-slate-900">{stat.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_0.8fr_0.8fr_1fr]">
          <div className="rounded-[1.75rem] border border-primary/15 bg-gradient-to-br from-secondary/90 via-primary/85 to-primary/95 px-6 py-7 text-slate-200 shadow-[0_24px_60px_rgba(15,23,42,0.14)]">
            <Link href="/" className="mb-5 flex items-center gap-3">
              <BrandLogo
                variant="full"
                className="h-10 w-auto max-w-full"
              />
            </Link>
            <p className="max-w-md text-sm leading-6 text-slate-300">
              Türkiye&apos;nin dental B2B ticaretini daha hızlı, daha güvenilir ve daha okunabilir bir arayüzle yeniden düzenliyoruz.
            </p>
            <div className="mt-6 flex gap-3">
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-slate-300 transition-all duration-200 hover:border-accent/50 hover:bg-white/14 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-slate-300 transition-all duration-200 hover:border-accent/50 hover:bg-white/14 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z"/>
                </svg>
              </a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-slate-300 transition-all duration-200 hover:border-accent/50 hover:bg-white/14 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/15 bg-white/8 text-slate-300 transition-all duration-200 hover:border-accent/50 hover:bg-white/14 hover:text-white">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
              </a>
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-primary/10 bg-white/82 px-6 py-7 shadow-[0_20px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Ürünler</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/urunler" className="text-slate-600 transition-colors hover:text-primary">
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/kategoriler" className="text-slate-600 transition-colors hover:text-primary">
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/markalar" className="text-slate-600 transition-colors hover:text-primary">
                  Markalar
                </Link>
              </li>
              <li>
                <Link href="/kampanyalar" className="font-medium text-primary transition-colors hover:text-secondary">
                  Kampanyalar
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-primary/10 bg-white/82 px-6 py-7 shadow-[0_20px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">Kurumsal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/hakkimizda" className="text-slate-600 transition-colors hover:text-primary">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-slate-600 transition-colors hover:text-primary">
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="text-slate-600 transition-colors hover:text-primary">
                  KVKK
                </Link>
              </li>
              <li>
                <Link href="/iade-politikasi" className="text-slate-600 transition-colors hover:text-primary">
                  İade Politikası
                </Link>
              </li>
              <li>
                <Link href="/sss" className="text-slate-600 transition-colors hover:text-primary">
                  SSS
                </Link>
              </li>
            </ul>
          </div>

          <div className="rounded-[1.75rem] border border-primary/10 bg-white/82 px-6 py-7 shadow-[0_20px_45px_rgba(15,23,42,0.06)] backdrop-blur-xl">
            <h4 className="mb-4 text-sm font-bold uppercase tracking-[0.2em] text-slate-500">İletişim</h4>
            <ul className="space-y-4 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Mail className="h-4 w-4" />
                </span>
                <span>info@dentalisveris.com</span>
              </li>
              <li className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <Phone className="h-4 w-4" />
                </span>
                <span>+90 (850) 123 45 67</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <MapPin className="h-4 w-4" />
                </span>
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-primary/10 bg-white/55">
        <div className="container-main flex flex-col items-center justify-between gap-4 py-6 text-sm text-slate-500 md:flex-row">
          <p>© {new Date().getFullYear()} DentAlışveriş. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <Link href="/gizlilik-politikasi" className="transition-colors hover:text-primary">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-sartlari" className="transition-colors hover:text-primary">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
