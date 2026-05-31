import { requireAdminAccess } from '@/lib/auth/require-admin'
import AdminCampaignsManager from '@/components/admin/AdminCampaignsManager'

export default async function AdminCampaignsPage() {
  await requireAdminAccess()

  return <AdminCampaignsManager />
}
