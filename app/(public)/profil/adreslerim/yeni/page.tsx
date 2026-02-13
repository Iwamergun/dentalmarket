'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  ArrowLeft, Loader2, Check, MapPin
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/app/contexts/AuthContext'
import { turkishCities } from '@/lib/validations/checkout'
import { addressFormSchema, type AddressFormData } from '@/lib/validations/address'

export default function YeniAdresPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const [saving, setSaving] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddressFormData>({
    resolver: zodResolver(addressFormSchema),
    defaultValues: {
      country: 'Türkiye',
      is_default: false,
      address_line2: '',
      state: '',
    },
  })

  const onSubmit = async (data: AddressFormData) => {
    if (!user) {
      toast.error('Oturum açmanız gerekiyor')
      router.push('/giris')
      return
    }

    setSaving(true)

    try {
      const res = await fetch('/api/addresses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok) {
        if (json.details) {
          const firstError = Object.values(json.details).flat()[0] as string
          toast.error(firstError || 'Validasyon hatası')
        } else {
          toast.error(json.error || 'Adres eklenirken bir hata oluştu')
        }
        return
      }

      toast.success('Adres başarıyla eklendi')
      router.push('/profil/adreslerim')
    } catch (err) {
      console.error('Adres eklenirken hata:', err)
      toast.error('Adres eklenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  // Auth loading
  if (authLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-40 bg-background-card rounded animate-pulse" />
        <div className="bg-background-card rounded-xl border border-border p-6 h-96 animate-pulse" />
      </div>
    )
  }

  // Not authenticated
  if (!user) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Yeni Adres Ekle</h1>
        </div>
        <div className="bg-background-card rounded-xl border border-border p-8 text-center">
          <MapPin className="w-12 h-12 mx-auto mb-4 text-text-muted" />
          <p className="text-text-secondary mb-4">
            Adres eklemek için giriş yapmanız gerekiyor.
          </p>
          <Link href="/giris">
            <Button>Giriş Yap</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/profil/adreslerim"
          className="p-2 rounded-lg bg-background-card border border-border hover:border-primary/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Yeni Adres Ekle</h1>
          <p className="text-text-secondary">Teslimat adresi bilgilerinizi girin</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-background-card rounded-xl border border-border p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Adres Başlığı */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Adres Başlığı <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('address_title')}
              placeholder="Örn: Ev, İş, Ofis"
              maxLength={50}
              disabled={saving}
              className={errors.address_title ? 'border-red-500' : ''}
            />
            {errors.address_title && (
              <p className="text-xs text-red-500">{errors.address_title.message}</p>
            )}
          </div>

          {/* Ad Soyad */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Ad Soyad <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('full_name')}
              placeholder="Ad Soyad"
              disabled={saving}
              className={errors.full_name ? 'border-red-500' : ''}
            />
            {errors.full_name && (
              <p className="text-xs text-red-500">{errors.full_name.message}</p>
            )}
          </div>

          {/* Telefon */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Telefon <span className="text-red-500">*</span>
            </label>
            <Input
              {...register('phone_number')}
              placeholder="05XX XXX XX XX"
              disabled={saving}
              className={errors.phone_number ? 'border-red-500' : ''}
            />
            {errors.phone_number && (
              <p className="text-xs text-red-500">{errors.phone_number.message}</p>
            )}
          </div>

          {/* Adres Satırı 1 */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Adres <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register('address_line1')}
              placeholder="Mahalle, sokak, bina no, daire no..."
              disabled={saving}
              rows={3}
              className={`flex w-full rounded-lg border bg-background-deep px-4 py-3 text-sm text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${
                errors.address_line1 ? 'border-red-500' : 'border-border'
              }`}
            />
            {errors.address_line1 && (
              <p className="text-xs text-red-500">{errors.address_line1.message}</p>
            )}
          </div>

          {/* Adres Satırı 2 (Opsiyonel) */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">
              Adres Satırı 2 <span className="text-text-muted text-xs">(Opsiyonel)</span>
            </label>
            <Input
              {...register('address_line2')}
              placeholder="Apartman, kat, daire vb."
              disabled={saving}
            />
          </div>

          {/* Şehir, İlçe/Bölge, Posta Kodu */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Şehir <span className="text-red-500">*</span>
              </label>
              <select
                {...register('city')}
                disabled={saving}
                className={`flex h-11 w-full rounded-lg border bg-background-deep px-4 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50 ${
                  errors.city ? 'border-red-500' : 'border-border'
                }`}
              >
                <option value="">Şehir seçiniz</option>
                {turkishCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              {errors.city && (
                <p className="text-xs text-red-500">{errors.city.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                İlçe / Bölge <span className="text-text-muted text-xs">(Opsiyonel)</span>
              </label>
              <Input
                {...register('state')}
                placeholder="İlçe"
                disabled={saving}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-primary">
                Posta Kodu <span className="text-red-500">*</span>
              </label>
              <Input
                {...register('postal_code')}
                placeholder="34000"
                maxLength={5}
                disabled={saving}
                className={errors.postal_code ? 'border-red-500' : ''}
              />
              {errors.postal_code && (
                <p className="text-xs text-red-500">{errors.postal_code.message}</p>
              )}
            </div>
          </div>

          {/* Ülke */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-text-primary">Ülke</label>
            <Input
              {...register('country')}
              placeholder="Türkiye"
              disabled={saving}
            />
          </div>

          {/* Varsayılan */}
          <label className="flex items-center gap-3 cursor-pointer p-4 rounded-lg border border-border bg-background-deep hover:border-primary/30 transition-colors">
            <input
              type="checkbox"
              {...register('is_default')}
              disabled={saving}
              className="w-5 h-5 rounded border-border text-primary focus:ring-primary focus:ring-offset-0"
            />
            <div>
              <span className="text-sm font-medium text-text-primary">Varsayılan adres olarak ayarla</span>
              <p className="text-xs text-text-secondary mt-0.5">
                Bu adres siparişlerinizde otomatik olarak seçili gelecektir.
              </p>
            </div>
          </label>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <Button type="submit" disabled={saving} className="gap-2">
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Kaydet
                </>
              )}
            </Button>
            <Link href="/profil/adreslerim">
              <Button type="button" variant="outline" disabled={saving}>
                İptal
              </Button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
