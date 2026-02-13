'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { User, Mail, Phone, Building2, FileText, Loader2, Save, CheckCircle } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

// Profil şeması
const profileSchema = z.object({
  company_name: z.string().min(2, 'Firma adı en az 2 karakter olmalıdır').optional().or(z.literal('')),
  tax_number: z.string().regex(/^[0-9]{10,11}$/, 'Geçerli bir vergi numarası giriniz').optional().or(z.literal('')),
  phone: z.string().regex(/^(\+90|0)?[0-9]{10}$/, 'Geçerli bir telefon numarası giriniz').optional().or(z.literal('')),
})

type ProfileFormData = z.infer<typeof profileSchema>

interface Profile {
  id: string
  role: string
  company_name: string | null
  tax_number: string | null
  phone: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function ProfilPage() {
  const { user } = useAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  })

  // Profil bilgilerini çek
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) {
          // Profil yoksa oluştur
          if (error.code === 'PGRST116') {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert({
                id: user.id,
                role: 'customer',
              })
              .select()
              .single()

            if (!createError && newProfile) {
              setProfile(newProfile as Profile)
              reset({
                company_name: '',
                tax_number: '',
                phone: '',
              })
            }
          } else {
            console.error('Profil yüklenirken hata:', error)
          }
        } else if (data) {
          setProfile(data as Profile)
          reset({
            company_name: data.company_name || '',
            tax_number: data.tax_number || '',
            phone: data.phone || '',
          })
        }
      } catch (error) {
        console.error('Profil yüklenirken hata:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [user, supabase, reset])

  // Profil güncelle
  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          company_name: data.company_name || null,
          tax_number: data.tax_number || null,
          phone: data.phone || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id)

      if (error) throw error

      toast.success('Profil bilgileriniz güncellendi')
      
      // Formu sıfırla (isDirty false olsun)
      reset(data)
    } catch (error) {
      console.error('Profil güncellenirken hata:', error)
      toast.error('Profil güncellenirken bir hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Hesabım</h1>
        <p className="text-muted-foreground">Profil bilgilerinizi görüntüleyin ve düzenleyin</p>
      </div>

      {/* Email Info Card */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-lg">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">E-posta Adresi</p>
            <p className="font-semibold">{user?.email}</p>
          </div>
          <div className="ml-auto">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
              <CheckCircle className="w-4 h-4" />
              Doğrulanmış
            </span>
          </div>
        </div>
      </div>

      {/* Profile Form */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Firma Bilgileri</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Firma Adı */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="w-4 h-4 text-muted-foreground" />
              Firma Adı
            </label>
            <Input
              {...register('company_name')}
              placeholder="Firma adınız"
              disabled={saving}
              className={errors.company_name ? 'border-red-500' : ''}
            />
            {errors.company_name && (
              <p className="text-xs text-red-500">{errors.company_name.message}</p>
            )}
          </div>

          {/* Vergi Numarası */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <FileText className="w-4 h-4 text-muted-foreground" />
              Vergi Numarası
            </label>
            <Input
              {...register('tax_number')}
              placeholder="10 veya 11 haneli vergi numarası"
              maxLength={11}
              disabled={saving}
              className={errors.tax_number ? 'border-red-500' : ''}
            />
            {errors.tax_number && (
              <p className="text-xs text-red-500">{errors.tax_number.message}</p>
            )}
          </div>

          {/* Telefon */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Telefon Numarası
            </label>
            <Input
              {...register('phone')}
              placeholder="05XX XXX XX XX"
              disabled={saving}
              className={errors.phone ? 'border-red-500' : ''}
            />
            {errors.phone && (
              <p className="text-xs text-red-500">{errors.phone.message}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="submit"
              disabled={saving || !isDirty}
              className="gap-2"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Kaydediliyor...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Değişiklikleri Kaydet
                </>
              )}
            </Button>
          </div>
        </form>
      </div>

      {/* Account Info */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold mb-4">Hesap Bilgileri</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Hesap Tipi</p>
            <p className="font-medium capitalize">{profile?.role || 'Müşteri'}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Hesap Durumu</p>
            <p className="font-medium">
              {profile?.is_active ? (
                <span className="text-green-600">Aktif</span>
              ) : (
                <span className="text-red-600">Pasif</span>
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Kayıt Tarihi</p>
            <p className="font-medium">
              {profile?.created_at 
                ? new Date(profile.created_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : '-'
              }
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Son Güncelleme</p>
            <p className="font-medium">
              {profile?.updated_at 
                ? new Date(profile.updated_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                : '-'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
