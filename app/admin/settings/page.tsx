import AdminMockSection from '@/components/admin/AdminMockSection'
import { settingsSection } from '@/lib/admin/mock-data'
import { requireAdminAccess } from '@/lib/auth/require-admin'

export default async function AdminSettingsPage() {
  await requireAdminAccess()
  return <AdminMockSection section={settingsSection} />
}
