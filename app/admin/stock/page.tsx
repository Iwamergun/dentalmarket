import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import StockTable from '@/components/admin/StockTable'
import { AlertTriangle } from 'lucide-react'

const LOW_STOCK_THRESHOLD = 10

export default async function AdminStockPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') redirect('/')

  // Fetch all active offers joined with product info
  const { data: offers } = await supabase
    .from('offers')
    .select('id, stock_quantity, product_id')
    .eq('is_active', true)
    .order('stock_quantity', { ascending: true })

  const productIds = offers?.map((o) => o.product_id) ?? []

  const { data: products } =
    productIds.length > 0
      ? await supabase
          .from('catalog_products')
          .select('id, name, sku, primary_image')
          .in('id', productIds)
      : { data: [] as { id: string; name: string; sku: string | null; primary_image: string | null }[] }

  const productMap = new Map((products ?? []).map((p) => [p.id, p]))

  const rows = (offers ?? [])
    .filter((o) => productMap.has(o.product_id))
    .map((o) => {
      const p = productMap.get(o.product_id)!
      return {
        product_id: o.product_id,
        product_name: p.name,
        product_sku: p.sku,
        product_image: p.primary_image,
        offer_id: o.id,
        stock_quantity: o.stock_quantity,
      }
    })

  const lowStockCount = rows.filter((r) => r.stock_quantity < LOW_STOCK_THRESHOLD).length
  const zeroStockCount = rows.filter((r) => r.stock_quantity === 0).length

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Stok Yönetimi</h1>
        <p className="mt-1 text-sm text-gray-500">
          Ürün tekliflerinin stok miktarlarını görüntüleyin ve güncelleyin.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Toplam Ürün (Teklif)</p>
          <p className="text-2xl font-bold text-gray-900">{rows.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Düşük Stok (&lt;{LOW_STOCK_THRESHOLD})</p>
          <p className={`text-2xl font-bold ${lowStockCount > 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {lowStockCount}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Sıfır Stok</p>
          <p className={`text-2xl font-bold ${zeroStockCount > 0 ? 'text-orange-500' : 'text-gray-900'}`}>
            {zeroStockCount}
          </p>
        </div>
      </div>

      {/* Low stock banner */}
      {lowStockCount > 0 && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            <strong>{lowStockCount}</strong> üründe stok seviyesi {LOW_STOCK_THRESHOLD} adedinin altında.
            Lütfen inceleyin.
          </span>
        </div>
      )}

      <StockTable rows={rows} />
    </div>
  )
}
