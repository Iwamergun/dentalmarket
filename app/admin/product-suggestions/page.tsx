import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getAuthMetadata, hasAdminAccess } from '@/lib/auth/access'

type ProductSuggestion = {
  id: string
  supplier_id: string
  product_name: string
  brand_name: string | null
  category_name: string | null
  description: string | null
  notes: string | null
  reference_url: string | null
  status: string
  created_at: string
}

export default async function AdminProductSuggestionsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!hasAdminAccess(profile?.role, getAuthMetadata(user))) redirect('/')

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: suggestions } = await ((supabase as any).from('product_suggestions') as any)
    .select('id, supplier_id, product_name, brand_name, category_name, description, notes, reference_url, status, created_at')
    .order('created_at', { ascending: false })

  const rows = (suggestions ?? []) as ProductSuggestion[]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ürün Önerileri</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marka/Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Açıklama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kaynak</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">Henüz öneri yok</td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{row.product_name}</div>
                      <div className="text-xs text-gray-500">Tedarikçi ID: {row.supplier_id}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {[row.brand_name, row.category_name].filter(Boolean).join(' / ') || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {row.description || row.notes || '-'}
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {row.reference_url ? (
                        <a href={row.reference_url} target="_blank" rel="noreferrer" className="text-blue-600 hover:text-blue-800">
                          Link
                        </a>
                      ) : '-'}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                        {row.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(row.created_at).toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
