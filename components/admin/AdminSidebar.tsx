'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  Users,
  FolderTree,
  Tag,
  BarChart3,
  Settings,
  Warehouse,
  MessageSquarePlus,
  X,
} from 'lucide-react'
import { BrandLogo } from '@/components/brand/BrandLogo'

const menuGroups = [
  {
    title: 'Genel Bakış',
    items: [
      { href: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { href: '/admin/reports', label: 'Raporlar', icon: BarChart3 },
    ],
  },
  {
    title: 'Ticari Operasyon',
    items: [
      { href: '/admin/orders', label: 'Siparişler', icon: ShoppingCart },
      { href: '/admin/products', label: 'Ürünler', icon: Package },
      { href: '/admin/stock', label: 'Stok Yönetimi', icon: Warehouse },
    ],
  },
  {
    title: 'Katalog ve CRM',
    items: [
      { href: '/admin/customers', label: 'Müşteriler', icon: Users },
      { href: '/admin/categories', label: 'Kategoriler', icon: FolderTree },
      { href: '/admin/brands', label: 'Markalar', icon: Tag },
      { href: '/admin/product-suggestions', label: 'Ürün Önerileri', icon: MessageSquarePlus },
      { href: '/admin/settings', label: 'Ayarlar', icon: Settings },
    ],
  },
]

interface AdminSidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

export default function AdminSidebar({ mobileOpen = false, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  const renderSidebarContent = () => (
    <div className="flex h-full flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm">
            <BrandLogo
              variant="icon"
              className="h-11 w-11 shrink-0"
            />
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/45">
                Spark Admin
              </p>
              <h1 className="mt-1 text-lg font-semibold text-white">Dent Alışveriş</h1>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white/70 lg:hidden"
            aria-label="Menüyü kapat"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className="mt-4 text-sm leading-6 text-white/55">
          Operasyon, sipariş ve stok akışını tek yüzeyden yönetin.
        </p>
      </div>

      <nav className="mt-4 flex-1 space-y-6 overflow-y-auto px-4 pb-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <p className="px-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/35">
              {group.title}
            </p>
            <div className="mt-2 space-y-1">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href)
                const Icon = item.icon

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={
                      isActive
                        ? 'group flex items-center gap-3 rounded-2xl border border-secondary/30 bg-gradient-to-r from-secondary/20 to-accent/10 px-4 py-3 text-white shadow-lg shadow-secondary/10'
                        : 'group flex items-center gap-3 rounded-2xl px-4 py-3 text-white/70 transition-colors hover:bg-white/6 hover:text-white'
                    }
                  >
                    <div
                      className={
                        isActive
                          ? 'flex h-10 w-10 items-center justify-center rounded-2xl bg-white/10 text-white'
                          : 'flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-white/70 transition-colors group-hover:bg-white/10 group-hover:text-white'
                      }
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="truncate text-xs text-white/45">
                        {item.href.replace('/admin/', '').replace('/', ' / ') || 'genel görünüm'}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-white/10 px-6 py-5">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/8 to-white/4 px-4 py-4">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/45">
            Sistem Notu
          </p>
          <p className="mt-2 text-sm leading-6 text-white/65">
            Yeni Spark yüzeyi daha yüksek kontrast ve daha net aksiyon odaklı navigasyon sunar.
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      <aside className="sticky top-0 hidden h-screen w-72 shrink-0 border-r border-border/60 bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(22,28,45,0.96))] text-white shadow-2xl lg:block">
        {renderSidebarContent()}
      </aside>

      {mobileOpen ? (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Menüyü kapat"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <aside className="relative z-10 h-full w-[88vw] max-w-sm border-r border-border/60 bg-[linear-gradient(180deg,rgba(17,24,39,0.98),rgba(22,28,45,0.96))] text-white shadow-2xl">
            {renderSidebarContent()}
          </aside>
        </div>
      ) : null}
    </>
  )
}
