import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/imageHelper'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/')

  // Fetch products with brand and category names
  const { data: products } = await supabase
    .from('catalog_products')
    .select('id, name, slug, sku, primary_image, is_active, brand_id, primary_category_id, created_at')
    .order('created_at', { ascending: false })

  const productIds = products?.map((p) => p.id) || []

  // Fetch default offers for these products
  const { data: offers } = productIds.length > 0
    ? await supabase
        .from('offers')
        .select('product_id, price, stock_quantity')
        .in('product_id', productIds)
        .eq('is_active', true)
    : { data: [] }

  // Fetch brands and categories for name lookup
  const brandIds = [...new Set(products?.map((p) => p.brand_id).filter(Boolean) as string[])]
  const categoryIds = [...new Set(products?.map((p) => p.primary_category_id).filter(Boolean) as string[])]

  const [{ data: brands }, { data: categories }] = await Promise.all([
    brandIds.length > 0
      ? supabase.from('brands').select('id, name').in('id', brandIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
    categoryIds.length > 0
      ? supabase.from('categories').select('id, name').in('id', categoryIds)
      : Promise.resolve({ data: [] as { id: string; name: string }[] }),
  ])

  const brandMap = new Map((brands ?? []).map((b) => [b.id, b.name]))
  const categoryMap = new Map((categories ?? []).map((c) => [c.id, c.name]))
  const offerMap = new Map((offers ?? []).map((o) => [o.product_id, o]))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Ürünler</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Yeni Ürün Ekle
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görsel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marka</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kategori</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(products ?? []).length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    Henüz ürün eklenmemiş
                  </td>
                </tr>
              ) : (
                (products ?? []).map((product) => {
                  const offer = offerMap.get(product.id)
                  return (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <Image
                          src={getImageUrl(product.primary_image)}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded object-cover bg-gray-100"
                          unoptimized
                        />
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                      <td className="px-6 py-4 text-gray-600">{product.sku ?? '-'}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.brand_id ? brandMap.get(product.brand_id) ?? '-' : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {product.primary_category_id ? categoryMap.get(product.primary_category_id) ?? '-' : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {offer ? `₺${Number(offer.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{offer?.stock_quantity ?? '-'}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            product.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {product.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          Düzenle
                        </Link>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
