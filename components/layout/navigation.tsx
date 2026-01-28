import Link from 'next/link'

export function Navigation() {
  return (
    <nav className="flex items-center space-x-6">
      <Link href="/urunler" className="text-gray-700 hover:text-primary">
        Ürünler
      </Link>
      <Link href="/kategoriler" className="text-gray-700 hover:text-primary">
        Kategoriler
      </Link>
      <Link href="/markalar" className="text-gray-700 hover:text-primary">
        Markalar
      </Link>
      <Link href="/dashboard" className="text-gray-700 hover:text-primary">
        Kontrol Paneli
      </Link>
    </nav>
  )
}
