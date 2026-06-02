'use client'

import { useMemo, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { Check, Pencil, Plus, Save, X } from 'lucide-react'
import { toast } from 'sonner'
import type { Database } from '@/types/database.types'

type TaxonomyKind = 'categories' | 'brands'

type TaxonomyRow = {
  id: string
  name: string
  slug: string
  description?: string | null
  seo_title?: string | null
  seo_description?: string | null
  canonical_url?: string | null
  noindex?: boolean
  is_active: boolean
  sort_order?: number
  parent_id?: string | null
  depth?: number
  path?: string
  created_at?: string
}

type TaxonomyFormState = {
  name: string
  slug: string
  description: string
  seo_title: string
  seo_description: string
  canonical_url: string
  noindex: boolean
  is_active: boolean
  sort_order: string
  parent_id: string
}

type AdminTaxonomyManagerProps = {
  kind: TaxonomyKind
  title: string
  description: string
  initialRows: TaxonomyRow[]
}

const emptyForm: TaxonomyFormState = {
  name: '',
  slug: '',
  description: '',
  seo_title: '',
  seo_description: '',
  canonical_url: '',
  noindex: false,
  is_active: true,
  sort_order: '0',
  parent_id: '',
}

function slugify(text: string) {
  return text
    .trim()
    .toLowerCase()
    .replace(/i̇/g, 'i')
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function createFormFromRow(row: TaxonomyRow): TaxonomyFormState {
  return {
    name: row.name,
    slug: row.slug,
    description: row.description ?? '',
    seo_title: row.seo_title ?? '',
    seo_description: row.seo_description ?? '',
    canonical_url: row.canonical_url ?? '',
    noindex: row.noindex ?? false,
    is_active: row.is_active,
    sort_order: String(row.sort_order ?? 0),
    parent_id: row.parent_id ?? '',
  }
}

export default function AdminTaxonomyManager({
  kind,
  title,
  description,
  initialRows,
}: AdminTaxonomyManagerProps) {
  const supabase = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [rows, setRows] = useState<TaxonomyRow[]>(initialRows)
  const [form, setForm] = useState<TaxonomyFormState>(emptyForm)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  const isCategory = kind === 'categories'
  const activeCount = rows.filter((row) => row.is_active).length
  const sortedRows = useMemo(
    () => [...rows].sort((left, right) => {
      if (isCategory) {
        return (left.path ?? left.name).localeCompare(right.path ?? right.name, 'tr')
      }

      return left.name.localeCompare(right.name, 'tr')
    }),
    [isCategory, rows]
  )

  const resetForm = () => {
    setForm(emptyForm)
    setEditingId(null)
  }

  const handleNameChange = (value: string) => {
    setForm((current) => ({
      ...current,
      name: value,
      slug: current.slug ? current.slug : slugify(value),
    }))
  }

  const handleEdit = (row: TaxonomyRow) => {
    setEditingId(row.id)
    setForm(createFormFromRow(row))
  }

  const buildPayload = () => {
    const slug = form.slug || slugify(form.name)
    const basePayload = {
      name: form.name.trim(),
      slug,
      seo_title: form.seo_title.trim() || null,
      seo_description: form.seo_description.trim() || null,
      canonical_url: form.canonical_url.trim() || null,
      noindex: form.noindex,
      is_active: form.is_active,
    }

    if (!isCategory) {
      return basePayload
    }

    const parent = rows.find((row) => row.id === form.parent_id)
    const depth = parent ? (parent.depth ?? 0) + 1 : 0
    const path = parent?.path ? `${parent.path}/${slug}` : slug

    return {
      ...basePayload,
      parent_id: form.parent_id || null,
      description: form.description.trim() || null,
      sort_order: Number.parseInt(form.sort_order, 10) || 0,
      depth,
      path,
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!form.name.trim()) {
      toast.error(`${isCategory ? 'Kategori' : 'Marka'} adı zorunludur`)
      return
    }

    setSaving(true)
    try {
      const payload = buildPayload()
      const query = editingId
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ? (supabase as any).from(kind).update(payload).eq('id', editingId).select('*').single()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        : (supabase as any).from(kind).insert(payload).select('*').single()

      const { data, error } = await query

      if (error || !data) {
        throw error
      }

      const savedRow = data as TaxonomyRow
      setRows((current) => {
        if (editingId) {
          return current.map((row) => (row.id === savedRow.id ? savedRow : row))
        }

        return [savedRow, ...current]
      })
      resetForm()
      toast.success(`${isCategory ? 'Kategori' : 'Marka'} kaydedildi`)
    } catch (error) {
      console.error('Taxonomy save error:', error)
      toast.error(`${isCategory ? 'Kategori' : 'Marka'} kaydedilemedi`)
    } finally {
      setSaving(false)
    }
  }

  const handleToggleActive = async (row: TaxonomyRow) => {
    const nextActive = !row.is_active
    setRows((current) => current.map((item) => (
      item.id === row.id ? { ...item, is_active: nextActive } : item
    )))

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from(kind)
      .update({ is_active: nextActive })
      .eq('id', row.id)

    if (error) {
      setRows((current) => current.map((item) => (
        item.id === row.id ? { ...item, is_active: row.is_active } : item
      )))
      toast.error('Durum güncellenemedi')
      return
    }

    toast.success(nextActive ? 'Aktif hale getirildi' : 'Pasif hale getirildi')
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm sm:w-64">
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
            <p className="text-gray-500">Toplam</p>
            <p className="text-lg font-semibold text-gray-900">{rows.length}</p>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white px-3 py-2">
            <p className="text-gray-500">Aktif</p>
            <p className="text-lg font-semibold text-gray-900">{activeCount}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[minmax(320px,420px)_1fr]">
        <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold text-gray-900">
              {editingId ? 'Kaydı Düzenle' : `Yeni ${isCategory ? 'Kategori' : 'Marka'}`}
            </h2>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                aria-label="Düzenlemeyi iptal et"
              >
                <X className="h-4 w-4" />
              </button>
            ) : null}
          </div>

          <label className="block text-sm font-medium text-gray-700">
            Ad
            <input
              value={form.name}
              onChange={(event) => handleNameChange(event.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Slug
            <input
              value={form.slug}
              onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {isCategory ? (
            <>
              <label className="block text-sm font-medium text-gray-700">
                Üst Kategori
                <select
                  value={form.parent_id}
                  onChange={(event) => setForm((current) => ({ ...current, parent_id: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Ana kategori</option>
                  {sortedRows
                    .filter((row) => row.id !== editingId)
                    .map((row) => (
                      <option key={row.id} value={row.id}>
                        {'  '.repeat(row.depth ?? 0)}{row.name}
                      </option>
                    ))}
                </select>
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Sıra
                <input
                  type="number"
                  value={form.sort_order}
                  onChange={(event) => setForm((current) => ({ ...current, sort_order: event.target.value }))}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>

              <label className="block text-sm font-medium text-gray-700">
                Açıklama
                <textarea
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  rows={3}
                  className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </label>
            </>
          ) : null}

          <label className="block text-sm font-medium text-gray-700">
            SEO Başlık
            <input
              value={form.seo_title}
              onChange={(event) => setForm((current) => ({ ...current, seo_title: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            SEO Açıklama
            <textarea
              value={form.seo_description}
              onChange={(event) => setForm((current) => ({ ...current, seo_description: event.target.value }))}
              rows={2}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <label className="block text-sm font-medium text-gray-700">
            Canonical URL
            <input
              value={form.canonical_url}
              onChange={(event) => setForm((current) => ({ ...current, canonical_url: event.target.value }))}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(event) => setForm((current) => ({ ...current, is_active: event.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Aktif
            </label>
            <label className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-700">
              <input
                type="checkbox"
                checked={form.noindex}
                onChange={(event) => setForm((current) => ({ ...current, noindex: event.target.checked }))}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              Noindex
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
          >
            {editingId ? <Save className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {saving ? 'Kaydediliyor...' : editingId ? 'Güncelle' : 'Ekle'}
          </button>
        </form>

        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Ad</th>
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Slug</th>
                  {isCategory ? <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Yol</th> : null}
                  <th className="px-5 py-3 text-left text-xs font-medium uppercase text-gray-500">Durum</th>
                  <th className="px-5 py-3 text-right text-xs font-medium uppercase text-gray-500">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sortedRows.length === 0 ? (
                  <tr>
                    <td colSpan={isCategory ? 5 : 4} className="px-5 py-10 text-center text-gray-500">
                      Henüz kayıt yok
                    </td>
                  </tr>
                ) : sortedRows.map((row) => (
                  <tr key={row.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4 font-medium text-gray-900">
                      <span style={{ paddingLeft: isCategory ? `${(row.depth ?? 0) * 16}px` : 0 }}>
                        {row.name}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{row.slug}</td>
                    {isCategory ? <td className="px-5 py-4 text-gray-600">{row.path ?? '-'}</td> : null}
                    <td className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => handleToggleActive(row)}
                        className={
                          row.is_active
                            ? 'inline-flex items-center gap-1 rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800'
                            : 'inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600'
                        }
                      >
                        {row.is_active ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                        {row.is_active ? 'Aktif' : 'Pasif'}
                      </button>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleEdit(row)}
                        className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil className="h-4 w-4" />
                        Düzenle
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
