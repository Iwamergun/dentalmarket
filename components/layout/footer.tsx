import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Dental Market</h3>
            <p className="text-sm text-gray-600">
              Diş hekimliği ürünleri ve ekipmanları için önde gelen B2B e-ticaret platformu
            </p>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Ürünler</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/urunler" className="text-gray-600 hover:text-primary">
                  Tüm Ürünler
                </Link>
              </li>
              <li>
                <Link href="/kategoriler" className="text-gray-600 hover:text-primary">
                  Kategoriler
                </Link>
              </li>
              <li>
                <Link href="/markalar" className="text-gray-600 hover:text-primary">
                  Markalar
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">Kurumsal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hakkimizda" className="text-gray-600 hover:text-primary">
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link href="/iletisim" className="text-gray-600 hover:text-primary">
                  İletişim
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-semibold">İletişim</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>Email: info@dentalmarket.com</li>
              <li>Tel: +90 (XXX) XXX XX XX</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-200 pt-8 text-center text-sm text-gray-600">
          © {new Date().getFullYear()} Dental Market. Tüm hakları saklıdır.
        </div>
      </div>
    </footer>
  )
}
