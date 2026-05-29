'use client'

import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'

type PendingSupplier = {
  id: string
  company_name: string | null
  tax_number: string | null
  phone: string | null
  store_slug: string | null
  store_description: string | null
  created_at: string
}

export default function AdminSuppliersPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<PendingSupplier[]>([])
  const [busyId, setBusyId] = useState<string | null>(null)

  const fetchRows = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/suppliers')
      const payload = await response.json()

      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'Depo listesi alınamadı')
      }

      setRows(payload.suppliers ?? [])
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Depo listesi alınamadı')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRows()
  }, [fetchRows])

  const handleAction = async (supplierId: string, action: 'approve' | 'reject') => {
    setBusyId(supplierId)
    try {
      const response = await fetch('/api/admin/suppliers', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ supplierId, action }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.success) {
        throw new Error(payload.error || 'İşlem başarısız')
      }

      toast.success(action === 'approve' ? 'Depo onaylandı' : 'Depo reddedildi')
      await fetchRows()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'İşlem başarısız')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Depo Onayları</h1>
        <p className="mt-1 text-sm text-gray-500">Onay bekleyen depo kayıtlarını buradan yönetebilirsiniz.</p>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium text-gray-600">Firma</th>
              <th className="px-4 py-3 font-medium text-gray-600">Vergi No</th>
              <th className="px-4 py-3 font-medium text-gray-600">Telefon</th>
              <th className="px-4 py-3 font-medium text-gray-600">Mağaza Slug</th>
              <th className="px-4 py-3 font-medium text-gray-600">Kayıt Tarihi</th>
              <th className="px-4 py-3 font-medium text-gray-600">İşlem</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Yükleniyor...</td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Onay bekleyen depo bulunmuyor.</td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-900">{row.company_name || '-'}</p>
                    {row.store_description ? (
                      <p className="mt-1 max-w-xs truncate text-xs text-gray-500">{row.store_description}</p>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-gray-700">{row.tax_number || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{row.phone || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{row.store_slug || '-'}</td>
                  <td className="px-4 py-3 text-gray-700">{new Date(row.created_at).toLocaleDateString('tr-TR')}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => handleAction(row.id, 'approve')}
                        className="rounded-md bg-green-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                      >
                        Onayla
                      </button>
                      <button
                        type="button"
                        disabled={busyId === row.id}
                        onClick={() => handleAction(row.id, 'reject')}
                        className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-60"
                      >
                        Reddet
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
