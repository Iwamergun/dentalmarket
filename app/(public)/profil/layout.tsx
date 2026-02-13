'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { User, Package, MapPin, Heart, Settings, LogOut, Loader2 } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

const profileNavItems = [
  { href: '/profil', label: 'Hesabım', icon: User, exact: true },
  { href: '/profil/siparislerim', label: 'Siparişlerim', icon: Package },
  { href: '/profil/adreslerim', label: 'Adreslerim', icon: MapPin },
  { href: '/profil/favorilerim', label: 'Favorilerim', icon: Heart },
  { href: '/profil/ayarlar', label: 'Ayarlar', icon: Settings },
]

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Auth kontrolü
  useEffect(() => {
    if (!loading && !user) {
      router.push('/giris?redirect=/profil')
    }
  }, [user, loading, router])

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut()
      toast.success('Çıkış yapıldı')
      router.push('/')
    } catch {
      toast.error('Çıkış yapılırken bir hata oluştu')
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border/50 p-4 sticky top-24">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-border/50">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="w-6 h-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold truncate">
                  {user.email?.split('@')[0] || 'Kullanıcı'}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1">
              {profileNavItems.map((item) => {
                const isActive = item.exact 
                  ? pathname === item.href 
                  : pathname.startsWith(item.href)
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                )
              })}
              
              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Çıkış Yap</span>
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="lg:col-span-3">
          {children}
        </main>
      </div>
    </div>
  )
}
