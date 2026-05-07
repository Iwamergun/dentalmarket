import AdminMockSection from '@/components/admin/AdminMockSection'
import { categoriesSection } from '@/lib/admin/mock-data'
import { requireAdminAccess } from '@/lib/auth/require-admin'

export default async function AdminCategoriesPage() {
  await requireAdminAccess()
  return <AdminMockSection section={categoriesSection} />
}
