*** Begin Patch
*** Update File: app/admin/reports/page.tsx
@@
-import AdminMockSection from '@/components/admin/AdminMockSection'
-import { reportsSection } from '@/lib/admin/mock-data'
-import { requireAdminAccess } from '@/lib/auth/require-admin'
-
-export default async function AdminReportsPage() {
-  await requireAdminAccess()
-  return <AdminMockSection section={reportsSection} />
-}
+import AdminMockSection from '@/components/admin/AdminMockSection'
+import { reportsSection } from '@/lib/admin/mock-data'
+import { requireAdminAccess } from '@/lib/auth/require-admin'
+
+export default async function AdminReportsPage() {
+  await requireAdminAccess()
+  return <AdminMockSection section={reportsSection} />
+}
*** End Patch