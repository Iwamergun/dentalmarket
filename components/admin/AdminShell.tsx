'use client'

import { useState } from 'react'
import type { User } from '@supabase/supabase-js'
import AdminHeader from '@/components/admin/AdminHeader'
import AdminSidebar from '@/components/admin/AdminSidebar'

interface AdminShellProps {
  user: User
  children: React.ReactNode
}

export default function AdminShell({ user, children }: AdminShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(118,59,255,0.10),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(249,115,22,0.10),_transparent_24%),oklch(var(--background))]">
      <AdminSidebar
        mobileOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader
          user={user}
          onMenuToggle={() => setMobileMenuOpen((current) => !current)}
        />
        <main className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6 xl:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}