import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import SupplierSidebar from '@/components/supplier/SupplierSidebar'
import SupplierHeader from '@/components/supplier/SupplierHeader'
import { getAuthMetadata, hasSupplierPanelAccess } from '@/lib/auth/access'

export default async function SupplierLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component'te set çalışmayabilir
          }
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/giris')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, is_active')
    .eq('id', user.id)
    .single()

  if (!profile || !hasSupplierPanelAccess(profile.role, getAuthMetadata(user))) {
    redirect('/')
  }

  return (
    <div className="flex h-screen bg-gray-100">
      <SupplierSidebar />
      <div className="flex flex-1 flex-col">
        <SupplierHeader user={user} />
        {profile?.is_active === false ? (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-3 text-sm text-amber-800">
            Hesabınız onay bekliyor. Onaylanana kadar yeni teklif yayınlayamazsınız.
          </div>
        ) : null}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
