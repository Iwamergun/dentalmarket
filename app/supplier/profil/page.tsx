'use client'

import { useState, useEffect } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'
import type { Database } from '@/types/database.types'

export default function SupplierProfilPage() {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    company_name: '',
    phone: '',
    tax_number: '',
    store_description: '',
  })

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from('profiles')
        .select('company_name, phone, tax_number, store_description')
        .eq('id', session.user.id)
        .single()

      if (profile) {
        setForm({
          company_name: profile.company_name ?? '',
          phone: profile.phone ?? '',
          tax_number: profile.tax_number ?? '',
          store_description: profile.store_description ?? '',
        })
      }
    }
    fetchProfile()
  }, [supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: form.company_name || null,
          phone: form.phone || null,
          tax_number: form.tax_number || null,
          store_description: form.store_description || null,
        })
        .eq('id', session!.user.id)

      if (error) throw error
      toast.success('Profil başarıyla güncellendi')
    } catch {
      toast.error('Profil güncellenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Mağaza Profili</h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mağaza Adı
            </label>
            <input
              type="text"
              name="company_name"
              value={form.company_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Telefon
            </label>
            <input
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Vergi No
            </label>
            <input
              type="text"
              name="tax_number"
              value={form.tax_number}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Açıklama
            </label>
            <textarea
              name="store_description"
              value={form.store_description}
              onChange={handleChange}
              rows={4}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 text-sm font-medium"
          >
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </div>
    </div>
  )
}
