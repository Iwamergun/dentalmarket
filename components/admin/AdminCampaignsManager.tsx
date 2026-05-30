'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import { toast } from 'sonner'
import ImageUploader from '@/components/admin/ImageUploader'
import { createClient } from '@/lib/supabase/client'
import { getImageUrl } from '@/lib/utils/imageHelper'
import type { Campaign } from '@/lib/supabase/queries/campaigns'

type CampaignForm = {
  title: string
  description: string
  image_path: string
  href: string
  sort_order: string
  is_active: boolean
}

const initialForm: CampaignForm = {
  title: '',
  description: '',
  image_path: '',
  href: '/kampanyalar',
  sort_order: '0',
  is_active: true,
}

export default function AdminCampaignsManager() {
  const supabase = useMemo(() => createClient(), [])
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState<CampaignForm>(initialForm)

  const fetchCampaigns = useCallback(async () => {
    setLoading(true)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('campaigns')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false })

    if (error) {
      toast.error('Kampanyalar yüklenemedi')
      setCampaigns([])
      setLoading(false)
      return
    }

    setCampaigns((data ?? []) as Campaign[])
    setLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchCampaigns()
  }, [fetchCampaigns])

  const resetForm = () => {
    setEditingId(null)
    setForm(initialForm)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!form.title.trim() || !form.image_path.trim()) {
      toast.error('Başlık ve kampanya görseli zorunludur')
      return
    }

    setSaving(true)

    const payload = {
      title: form.title.trim(),
      description: form.description.trim() || null,
      image_path: form.image_path.trim(),
      href: form.href.trim() || '/kampanyalar',
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const query = (supabase as any).from('campaigns')

    const { error } = editingId
      ? await query.update(payload).eq('id', editingId)
      : await query.insert(payload)

    if (error) {
      toast.error(editingId ? 'Kampanya güncellenemedi' : 'Kampanya oluşturulamadı')
      setSaving(false)
      return
    }

    toast.success(editingId ? 'Kampanya güncellendi' : 'Kampanya oluşturuldu')
    resetForm()
    await fetchCampaigns()
    setSaving(false)
  }

  const handleEdit = (campaign: Campaign) => {
    setEditingId(campaign.id)
    setForm({
      title: campaign.title,
      description: campaign.description ?? '',
      image_path: campaign.image_path,
      href: campaign.href,
      sort_order: String(campaign.sort_order),
      is_active: campaign.is_active,
    })
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm('Bu kampanyayı silmek istediğinize emin misiniz?')) {
      return
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any).from('campaigns').delete().eq('id', id)

    if (error) {
      toast.error('Kampanya silinemedi')
      return
    }

    toast.success('Kampanya silindi')
    if (editingId === id) {
      resetForm()
    }
    await fetchCampaigns()
  }

  const toggleActive = async (campaign: Campaign) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('campaigns')
      .update({ is_active: !campaign.is_active })
      .eq('id', campaign.id)

    if (error) {
      toast.error('Kampanya durumu güncellenemedi')
      return
    }

    toast.success('Kampanya durumu güncellendi')
    await fetchCampaigns()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Kampanya Yönetimi</h1>
        <p className="mt-1 text-sm text-gray-500">Ana sayfa ve kampanyalar ekranında görünen görselleri yönetin.</p>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Başlık</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm((prev) => ({ ...prev, title: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Yönlendirme Linki</label>
              <input
                type="text"
                value={form.href}
                onChange={(e) => setForm((prev) => ({ ...prev, href: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="/kampanyalar"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Sıralama</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => setForm((prev) => ({ ...prev, sort_order: e.target.value }))}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-3 pt-7">
              <input
                id="campaign-active"
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
                className="h-4 w-4 rounded border-gray-300"
              />
              <label htmlFor="campaign-active" className="text-sm font-medium text-gray-700">Aktif</label>
            </div>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Açıklama</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <ImageUploader
            label="Kampanya Görseli"
            currentImage={form.image_path || null}
            onUpload={(path) => setForm((prev) => ({ ...prev, image_path: path }))}
          />

          <div className="flex flex-wrap items-center gap-3 border-t border-gray-100 pt-4">
            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Kampanya Oluştur'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-lg border border-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Görsel</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Başlık</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Link</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Sıra</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-gray-500">Durum</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-gray-500">İşlem</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Yükleniyor...</td>
                </tr>
              ) : campaigns.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">Henüz kampanya bulunmuyor.</td>
                </tr>
              ) : (
                campaigns.map((campaign) => (
                  <tr key={campaign.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="relative h-14 w-24 overflow-hidden rounded-md border border-gray-200">
                        <Image
                          src={getImageUrl(campaign.image_path)}
                          alt={campaign.title}
                          fill
                          className="object-cover"
                          sizes="96px"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-gray-900">{campaign.title}</td>
                    <td className="px-4 py-3 text-gray-600">{campaign.href}</td>
                    <td className="px-4 py-3 text-gray-600">{campaign.sort_order}</td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleActive(campaign)}
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${campaign.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                      >
                        {campaign.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleEdit(campaign)}
                          className="rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50"
                        >
                          Düzenle
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(campaign.id)}
                          className="rounded-md border border-red-200 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          Sil
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
    </div>
  )
}
