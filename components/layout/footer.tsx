import Link from 'next/link'
import { Mail, MapPin, Phone } from 'lucide-react'
import { BrandLogo } from '@/components/brand/BrandLogo'

const productLinks = [
  { href: '/urunler', label: 'Tüm Ürünler' },
  { href: '/kategoriler', label: 'Kategoriler' },
  { href: '/markalar', label: 'Markalar' },
  { href: '/kampanyalar', label: 'Kampanyalar' },
]

const corporateLinks = [
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
  { href: '/sss', label: 'SSS' },
  { href: '/kvkk', label: 'KVKK' },
  { href: '/iade-politikasi', label: 'İade Politikası' },
]

const legalLinks = [
  { href: '/gizlilik-politikasi', label: 'Gizlilik Politikası' },
  { href: '/kullanim-sartlari', label: 'Kullanım Koşulları' },
]

export async function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-700">
      <div className="container-main py-10 md:py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-[1.4fr_0.75fr_0.75fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center">
              <BrandLogo variant="full" className="h-10 w-auto max-w-full" />
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              Türkiye&apos;nin dental B2B alışveriş platformu. Klinikler, tedarikçiler ve dental ürünler için hızlı ve güvenilir pazar yeri.
            </p>
            <div className="mt-5 flex gap-3">
              <a href="#" aria-label="Facebook" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary/30 hover:text-primary">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="#" aria-label="Instagram" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary/30 hover:text-primary">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition-colors hover:border-primary/30 hover:text-primary">
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Ürünler</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {productLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-600 transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Kurumsal</h3>
            <ul className="mt-4 space-y-3 text-sm">
              {corporateLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-slate-600 transition-colors hover:text-primary">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">İletişim</h3>
            <ul className="mt-4 space-y-4 text-sm text-slate-600">
              <li className="flex items-center gap-3">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                <span>info@dentalisveris.com</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                <span>+90 (850) 123 45 67</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-200 bg-slate-50">
        <div className="container-main flex flex-col items-center justify-between gap-3 py-5 text-xs text-slate-500 md:flex-row md:text-sm">
          <p>© {new Date().getFullYear()} DentAlışveriş. Tüm hakları saklıdır.</p>
          <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
            {legalLinks.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-primary">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
