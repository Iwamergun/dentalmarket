import AdminMockSection from '@/components/admin/AdminMockSection'
import { brandsSection } from '@/lib/admin/mock-data'
import { requireAdminAccess } from '@/lib/auth/require-admin'

export default async function AdminBrandsPage() {
  await requireAdminAccess()
  return <AdminMockSection section={brandsSection} />
}
