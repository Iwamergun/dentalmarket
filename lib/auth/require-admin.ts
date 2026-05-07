import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAuthMetadata, hasAdminAccess } from '@/lib/auth/access'

export async function requireAdminAccess() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/giris')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!hasAdminAccess(profile?.role, getAuthMetadata(user))) {
    redirect('/')
  }

  return { user, profile }
}
