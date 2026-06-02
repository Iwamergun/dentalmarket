import AdminTaxonomyManager from '@/components/admin/AdminTaxonomyManager'
import { requireAdminAccess } from '@/lib/auth/require-admin'
import { createClient } from '@/lib/supabase/server'

export default async function AdminCategoriesPage() {
  await requireAdminAccess()
  const supabase = await createClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('id, parent_id, name, slug, description, seo_title, seo_description, canonical_url, noindex, depth, path, sort_order, is_active, created_at')
    .order('path', { ascending: true })

  return (
    <AdminTaxonomyManager
      kind="categories"
      title="Kategoriler"
      description="Katalog kategori ağacını oluşturun, sıralayın ve yayın durumunu yönetin."
      initialRows={categories ?? []}
    />
  )
}
