'use client'

import { useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import { AlertTriangle, Check, Loader2 } from 'lucide-react'
import { getImageUrl } from '@/lib/utils/imageHelper'

interface StockRow {
  product_id: string
  product_name: string
  product_sku: string | null
  product_image: string | null
  offer_id: string
  stock_quantity: number
}

interface Props {
  rows: StockRow[]
}

const LOW_STOCK_THRESHOLD = 10

export default function StockTable({ rows }: Props) {
  const [quantities, setQuantities] = useState<Record<string, string>>(
    Object.fromEntries(rows.map((r) => [r.offer_id, String(r.stock_quantity)]))
  )
  const [saving, setSaving] = useState<Record<string, boolean>>({})
  const [saved, setSaved] = useState<Record<string, boolean>>({})

  const handleChange = (offerId: string, value: string) => {
    setQuantities((prev) => ({ ...prev, [offerId]: value }))
    setSaved((prev) => ({ ...prev, [offerId]: false }))
  }

  const handleSave = async (offerId: string, original: number) => {
    const rawValue = quantities[offerId]
    const parsed = parseInt(rawValue, 10)

    if (isNaN(parsed) || parsed < 0) {
      toast.error('Geçerli bir stok miktarı girin (0 veya daha büyük)')
      return
    }

    if (parsed === original) {
      toast.info('Stok miktarı değişmedi')
      return
    }

    setSaving((prev) => ({ ...prev, [offerId]: true }))

    try {
      const res = await fetch('/api/admin/stock', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer_id: offerId, stock_quantity: parsed }),
      })

      const result = await res.json()

      if (!result.success) {
        toast.error(result.error ?? 'Stok güncellenemedi')
        return
      }

      toast.success('Stok güncellendi')
      setSaved((prev) => ({ ...prev, [offerId]: true }))
    } catch (err) {
      console.error('Stock update error:', err)
      toast.error('Bağlantı hatası oluştu')
    } finally {
      setSaving((prev) => ({ ...prev, [offerId]: false }))
    }
  }

  if (rows.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 px-6 py-12 text-center text-gray-500">
        Henüz teklif oluşturulmuş ürün bulunmuyor
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Görsel</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ürün Adı</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mevcut Stok</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Yeni Miktar</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rows.map((row) => {
              const currentQty = quantities[row.offer_id]
              const parsed = parseInt(currentQty, 10)
              const isDirty = !isNaN(parsed) && parsed !== row.stock_quantity
              const isLow = row.stock_quantity < LOW_STOCK_THRESHOLD
              const isSaving = saving[row.offer_id] ?? false
              const isSaved = saved[row.offer_id] ?? false

              return (
                <tr key={row.offer_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <Image
                      src={getImageUrl(row.product_image)}
                      alt={row.product_name}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded object-cover bg-gray-100"
                      unoptimized
                    />
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.product_name}</td>
                  <td className="px-6 py-4 text-gray-600">{row.product_sku ?? '-'}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center gap-1 font-semibold ${
                        isLow ? 'text-red-600' : 'text-gray-800'
                      }`}
                    >
                      {isLow && <AlertTriangle className="w-3.5 h-3.5" />}
                      {row.stock_quantity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      min="0"
                      value={currentQty}
                      onChange={(e) => handleChange(row.offer_id, e.target.value)}
                      className="w-24 border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleSave(row.offer_id, row.stock_quantity)}
                      disabled={!isDirty || isSaving}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                        isSaved
                          ? 'bg-green-100 text-green-700 cursor-default'
                          : isDirty
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isSaving ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isSaved ? (
                        <Check className="w-3.5 h-3.5" />
                      ) : null}
                      {isSaving ? 'Kaydediliyor…' : isSaved ? 'Kaydedildi' : 'Kaydet'}
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
