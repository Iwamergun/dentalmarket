'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import type { Database } from '@/types/database.types'

export default function UrunOnerPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    product_name: searchParams.get('query') ?? '',
    brand_name: '',
    category_name: '',
    description: '',
    notes: '',
    reference_url: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.product_name.trim()) {
      toast.error('Ürün adı zorunludur')
      return
    }
    if (form.reference_url.trim()) {
      try {
        const parsed = new URL(form.reference_url.trim())
        if (!['http:', 'https:'].includes(parsed.protocol)) {
          toast.error('Referans URL http:// veya https:// ile başlamalıdır')
          return
        }
      } catch {
        toast.error('Geçerli bir referans URL girin')
        return
      }
    }

    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        toast.error('Oturum bulunamadı')
        return
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await ((supabase as any).from('product_suggestions') as any).insert({
        supplier_id: user.id,
        product_name: form.product_name.trim(),
        brand_name: form.brand_name.trim() || null,
        category_name: form.category_name.trim() || null,
        description: form.description.trim() || null,
        notes: form.notes.trim() || null,
        reference_url: form.reference_url.trim() || null,
        status: 'pending',
      })

      if (error) throw error

      toast.success('Ürün öneriniz incelemeye gönderildi')
      router.push('/supplier/urunler/yeni')
    } catch (error) {
      console.error('Product suggestion error:', error)
      toast.error('Öneri gönderilirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Ürün Öner</h1>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı <span className="text-red-500">*</span>
              </label>
              <input
                name="product_name"
                value={form.product_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Marka</label>
              <input
                name="brand_name"
                value={form.brand_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kategori</label>
              <input
                name="category_name"
                value={form.category_name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Referans URL</label>
              <input
                name="reference_url"
                type="url"
                value={form.reference_url}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Açıklama</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notlar</label>
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center gap-4 border-t pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
            >
              {loading ? 'Gönderiliyor...' : 'Öneriyi Gönder'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/supplier/urunler/yeni')}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium"
            >
              Vazgeç
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
