import AdminTaxonomyManager from '@/components/admin/AdminTaxonomyManager'
import { requireAdminAccess } from '@/lib/auth/require-admin'
import { createClient } from '@/lib/supabase/server'

export default async function AdminBrandsPage() {
  await requireAdminAccess()
  const supabase = await createClient()
  const { data: brands } = await supabase
    .from('brands')
    .select('id, name, slug, seo_title, seo_description, canonical_url, noindex, is_active, created_at')
    .order('name', { ascending: true })

  return (
    <AdminTaxonomyManager
      kind="brands"
      title="Markalar"
      description="Ürün kataloglarında kullanılacak markaları oluşturun ve yayın durumunu yönetin."
      initialRows={brands ?? []}
    />
  )
}
