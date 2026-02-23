'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Store,
} from 'lucide-react'

const menuItems = [
  { href: '/supplier/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/supplier/urunler', label: 'Ürünlerim', icon: Package },
  { href: '/supplier/siparisler', label: 'Siparişler', icon: ShoppingCart },
  { href: '/supplier/profil', label: 'Mağaza Profili', icon: Store },
]

export default function SupplierSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-gray-900 text-white">
      <div className="p-6">
        <h1 className="text-xl font-bold">DentalMarket</h1>
        <p className="text-xs text-gray-400 mt-1">Tedarikçi Paneli</p>
      </div>
      <nav className="mt-6">
        {menuItems.map((item) => {
          const isActive = pathname.startsWith(item.href)
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center px-6 py-3 text-gray-300 hover:bg-gray-800 ${
                isActive ? 'bg-gray-800 text-white border-l-4 border-blue-500' : ''
              }`}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
