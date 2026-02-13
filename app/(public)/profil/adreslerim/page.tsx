'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  MapPin, Plus, Edit2, Trash2, Home, Building2,
  Loader2, Star, RefreshCw, AlertCircle, Phone
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/app/contexts/AuthContext'
import type { Address } from '@/lib/validations/address'

export default function AdreslerimPage() {
  const { user, loading: authLoading } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [settingDefault, setSettingDefault] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null)

  const fetchAddresses = useCallback(async () => {
    if (!user) {
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/addresses')
      const json = await res.json()

      if (!res.ok) {
        throw new Error(json.error || 'Adresler yüklenemedi')
      }

      setAddresses(json.data || [])
    } catch (err) {
      console.error('Adresler yüklenirken hata:', err)
      setError('Adresler yüklenirken bir hata oluştu.')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    if (!authLoading) {
      fetchAddresses()
    }
  }, [authLoading, fetchAddresses])

  // Adres sil
  const handleDelete = async (id: string) => {
    if (!user) return

    setDeleting(id)
    setShowDeleteConfirm(null)

    try {
      const res = await fetch(`/api/addresses/${id}`, { method: 'DELETE' })
      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error || 'Adres silinirken bir hata oluştu')
        return
      }

      setAddresses(prev => prev.filter(addr => addr.id !== id))
      toast.success('Adres silindi')
    } catch (err) {
      console.error('Adres silinirken hata:', err)
      toast.error('Adres silinirken bir hata oluştu')
    } finally {
      setDeleting(null)
    }
  }

  // Varsayılan adres yap
  const handleSetDefault = async (id: string) => {
    if (!user) return

    setSettingDefault(id)

    try {
      const res = await fetch(`/api/addresses/${id}/set-default`, { method: 'POST' })
      const json = await res.json()

      if (!res.ok) {
        toast.error(json.error || 'Varsayılan adres güncellenemedi')
        return
      }

      setAddresses(prev =>
        prev.map(addr => ({
          ...addr,
          is_default: addr.id === id,
        }))
      )
      toast.success('Varsayılan adres güncellendi')
    } catch (err) {
      console.error('Varsayılan adres güncellenirken hata:', err)
      toast.error('Varsayılan adres güncellenirken bir hata oluştu')
    } finally {
      setSettingDefault(null)
    }
  }

  // Loading skeleton
  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-8 w-40 bg-background-card rounded animate-pulse mb-2" />
            <div className="h-5 w-64 bg-background-card rounded animate-pulse" />
          </div>
          <div className="h-10 w-32 bg-background-card rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => (
            <div key={i} className="bg-background-card rounded-xl border border-border p-6 h-48 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Adreslerim</h1>
          <p className="text-text-secondary">Teslimat adreslerinizi yönetin</p>
        </div>
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6 text-center">
          <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-500" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchAddresses} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Tekrar Dene
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Adreslerim</h1>
          <p className="text-text-secondary">Teslimat adreslerinizi yönetin</p>
        </div>
        <Link href="/profil/adreslerim/yeni">
          <Button className="gap-2">
            <Plus className="w-4 h-4" />
            Yeni Adres Ekle
          </Button>
        </Link>
      </div>

      {/* Addresses List */}
      {addresses.length === 0 ? (
        <div className="bg-background-card rounded-xl border border-border p-12 text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-background-deep flex items-center justify-center">
            <MapPin className="w-8 h-8 text-text-muted" />
          </div>
          <h2 className="text-xl font-semibold text-text-primary mb-2">Henüz kayıtlı adresiniz yok</h2>
          <p className="text-text-secondary mb-6">
            Siparişlerinizde kullanmak için teslimat adresi ekleyin.
          </p>
          <Link href="/profil/adreslerim/yeni">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Adres Ekle
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((address) => (
            <div
              key={address.id}
              className={`bg-background-card rounded-xl border p-6 transition-colors ${
                address.is_default
                  ? 'border-primary/50 bg-primary/5'
                  : 'border-border hover:border-primary/30'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {address.title?.toLowerCase().includes('ev') ? (
                    <Home className="w-5 h-5 text-primary" />
                  ) : (
                    <Building2 className="w-5 h-5 text-primary" />
                  )}
                  <h3 className="font-semibold text-text-primary">{address.title}</h3>
                  {address.is_default && (
                    <Badge variant="success" className="gap-1">
                      <Star className="w-3 h-3" />
                      Varsayılan Adres
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  {!address.is_default && (
                    <button
                      onClick={() => handleSetDefault(address.id)}
                      disabled={settingDefault === address.id}
                      className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-background-deep transition-colors disabled:opacity-50"
                      title="Varsayılan Yap"
                    >
                      {settingDefault === address.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Star className="w-4 h-4" />
                      )}
                    </button>
                  )}
                  <Link
                    href={`/profil/adreslerim/${address.id}/duzenle`}
                    className="p-2 rounded-lg text-text-muted hover:text-primary hover:bg-background-deep transition-colors"
                    title="Düzenle"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => setShowDeleteConfirm(address.id)}
                    disabled={deleting === address.id || address.is_default}
                    className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    title={address.is_default ? 'Varsayılan adres silinemez' : 'Sil'}
                  >
                    {deleting === address.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Card Content */}
              <div className="space-y-2 text-sm">
                <p className="font-medium text-text-primary">{address.full_name}</p>
                <p className="text-text-secondary">{address.address_line1}</p>
                {address.address_line2 && (
                  <p className="text-text-secondary">{address.address_line2}</p>
                )}
                <p className="text-text-secondary">
                  {address.state ? `${address.state}, ` : ''}{address.city} {address.postal_code}
                </p>
                {address.country && address.country !== 'Türkiye' && (
                  <p className="text-text-secondary">{address.country}</p>
                )}
                <div className="flex items-center gap-1.5 text-text-secondary pt-1">
                  <Phone className="w-3.5 h-3.5" />
                  <span>{address.phone}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 flex-wrap">
                <Link href={`/profil/adreslerim/${address.id}/duzenle`}>
                  <Button size="sm" variant="outline" className="gap-1.5">
                    <Edit2 className="w-3.5 h-3.5" />
                    Düzenle
                  </Button>
                </Link>
                {!address.is_default && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleSetDefault(address.id)}
                    disabled={settingDefault === address.id}
                    className="gap-1.5"
                  >
                    {settingDefault === address.id ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Star className="w-3.5 h-3.5" />
                    )}
                    Varsayılan Yap
                  </Button>
                )}
                {!address.is_default && (
                  <Button
                    size="sm"
                    variant="danger"
                    onClick={() => setShowDeleteConfirm(address.id)}
                    disabled={deleting === address.id}
                    className="gap-1.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Sil
                  </Button>
                )}
              </div>

              {/* Delete Confirmation Modal */}
              {showDeleteConfirm === address.id && (
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-sm text-text-secondary mb-3">
                    Bu adresi silmek istediğinizden emin misiniz?
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="danger"
                      onClick={() => handleDelete(address.id)}
                      disabled={deleting === address.id}
                    >
                      {deleting === address.id ? (
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      ) : null}
                      Evet, Sil
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(null)}
                    >
                      İptal
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
