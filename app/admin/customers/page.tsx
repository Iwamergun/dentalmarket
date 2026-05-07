import AdminMockSection from '@/components/admin/AdminMockSection'
import { customersSection } from '@/lib/admin/mock-data'
import { requireAdminAccess } from '@/lib/auth/require-admin'

export default async function AdminCustomersPage() {
  await requireAdminAccess()
  return <AdminMockSection section={customersSection} />
}
