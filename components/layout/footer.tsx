import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-gradient-to-br from-primary via-primary-light to-secondary text-white border-t-4 border-accent">
      {/* Main Footer */}
      <div className="container-main py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-6 group">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent via-purple to-teal flex items-center justify-center shadow-glow-accent group-hover:scale-110 transition-transform duration-300">
                <span className="text-white font-extrabold text-xl">DM</span>
              </div>
              <span className="text-2xl font-extrabold text-white">
                Dental<span className="text-accent">Market</span>
              </span>
            </Link>
            <p className="text-base text-gray-200 max-w-sm mb-6 leading-relaxed">
              Türkiye&apos;nin <span className="font-bold text-accent-light">önde gelen</span> dental B2B e-ticaret platformu. 
              Diş hekimleri ve klinikler için <span className="font-bold text-accent-light">güvenilir tedarik</span> ortağınız.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {[
                { icon: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
                { icon: 'M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.39 18.592.026 11.985.026L12.017 0z' },
                { icon: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z' },
                { icon: 'M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z' },
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-12 h-12 rounded-xl bg-white/10 border-2 border-white/20 flex items-center justify-center text-gray-300 hover:text-accent hover:bg-accent/20 hover:border-accent hover:shadow-glow-accent transition-all duration-300 transform hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d={social.icon} />
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Ürünler</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/urunler" className="text-gray-300 hover:text-accent transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/kategoriler" className="text-gray-300 hover:text-accent transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/markalar" className="text-gray-300 hover:text-accent transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
                  Markalar
                </Link>
              </li>
              <li>
                <Link href="/kampanyalar" className="text-accent hover:text-accent-light transition-colors font-bold flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  🎉 Kampanyalar
                </Link>
              </li>
            </ul>
          </div>

          {/* Corporate */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">Kurumsal</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/hakkimizda" className="text-gray-300 hover:text-accent transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-300 hover:text-accent transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                  İletişim
                </Link>
              </li>
              <li>
                <Link href="/kvkk" className="text-gray-300 hover:text-accent transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                  KVKK
                </Link>
              </li>
              <li>
                <Link href="/iade-politikasi" className="text-gray-300 hover:text-accent transition-colors font-medium flex items-center gap-2 group">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple opacity-0 group-hover:opacity-100 transition-opacity" />
                  İade Politikası
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-6 text-lg">İletişim</h4>
            <ul className="space-y-4 text-sm text-gray-300">
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/20 border-2 border-accent flex items-center justify-center text-accent flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span className="font-medium">info@dentalmarket.com</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple/20 border-2 border-purple flex items-center justify-center text-purple-light flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span className="font-medium">+90 (850) 123 45 67</span>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal/20 border-2 border-teal flex items-center justify-center text-teal-light flex-shrink-0">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span className="font-medium">İstanbul, Türkiye</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t-2 border-white/20 bg-primary-dark/50">
        <div className="container-main py-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-300">
          <p className="font-medium">© {new Date().getFullYear()} <span className="text-accent font-bold">Dental Market</span>. Tüm hakları saklıdır.</p>
          <div className="flex items-center gap-6">
            <Link href="/gizlilik" className="hover:text-accent transition-colors font-medium">
              Gizlilik Politikası
            </Link>
            <Link href="/kullanim-kosullari" className="hover:text-accent transition-colors font-medium">
              Kullanım Koşulları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
