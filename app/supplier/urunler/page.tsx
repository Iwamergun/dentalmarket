import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { formatPrice } from '@/lib/utils/format'

const PAYMENT_LABELS: Record<string, string> = {
  havale: 'Havale/EFT',
  kredi_karti: 'Kredi Kartı',
  vade_30: '30 Gün Vade',
  vade_60: '60 Gün Vade',
  vade_90: '90 Gün Vade',
}

export default async function SupplierTekliflerimPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/giris')

  // Get supplier's offers with full details
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: supplierOffers } = await (supabase as any)
    .from('offers')
    .select('id, product_id, price, stock_quantity, lead_time_days, shipping_cost, payment_options, notes, is_active, created_at, currency')
    .eq('supplier_id', user.id)
    .order('created_at', { ascending: false })

  type OfferRow = {
    id: string
    product_id: string
    price: number
    stock_quantity: number | null
    lead_time_days: number | null
    shipping_cost: number | null
    payment_options: string[] | null
    notes: string | null
    is_active: boolean
    created_at: string
    currency: string
  }

  const offers = (supplierOffers ?? []) as OfferRow[]
  const productIds = offers.map((o) => o.product_id)

  // Fetch associated products
  const { data: products } = productIds.length > 0
    ? await supabase
        .from('catalog_products')
        .select('id, name, slug, sku, primary_image, is_active')
        .in('id', productIds)
    : { data: [] as { id: string; name: string; slug: string; sku: string | null; primary_image: string | null; is_active: boolean }[] }

  const productMap = new Map((products ?? []).map((p) => [p.id, p]))

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tekliflerim</h1>
        <Link
          href="/supplier/urunler/yeni"
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" />
          Yeni Teklif Ver
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görsel</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fiyat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stok</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Teslimat</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Kargo</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ödeme</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Durum</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {offers.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-12 text-center text-gray-500">
                    Henüz teklif oluşturmadınız
                  </td>
                </tr>
              ) : (
                offers.map((offer) => {
                  const product = productMap.get(offer.product_id)
                  return (
                    <tr key={offer.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <img
                          src={getImageUrl(product?.primary_image ?? null)}
                          alt={product?.name ?? ''}
                          className="w-10 h-10 rounded object-cover bg-gray-100"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{product?.name ?? 'Bilinmeyen'}</div>
                        {product?.sku && <div className="text-xs text-gray-500">SKU: {product.sku}</div>}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {formatPrice(Number(offer.price))}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{offer.stock_quantity ?? 0}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {offer.lead_time_days === 0 ? 'Aynı gün' : offer.lead_time_days != null ? `${offer.lead_time_days} gün` : '-'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {offer.shipping_cost != null
                          ? offer.shipping_cost === 0 ? 'Ücretsiz' : formatPrice(Number(offer.shipping_cost))
                          : '-'}
                      </td>
                      <td className="px-6 py-4">
                        {offer.payment_options && offer.payment_options.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {offer.payment_options.map((opt: string) => (
                              <span key={opt} className="text-[10px] bg-gray-100 px-1.5 py-0.5 rounded">
                                {PAYMENT_LABELS[opt] ?? opt}
                              </span>
                            ))}
                          </div>
                        ) : '-'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          offer.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          {offer.is_active ? 'Aktif' : 'Pasif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <Link
                          href={`/supplier/urunler/${offer.id}/duzenle`}
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
