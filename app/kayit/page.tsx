'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    getValues,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'clinic',
      company_name: '',
      tax_number: '',
      phone: '',
      store_description: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          emailRedirectTo: `${window.location.origin}/giris`,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        const fieldErrors = result?.details as Record<string, string[] | undefined> | undefined
        const firstFieldError = fieldErrors
          ? Object.values(fieldErrors).find((messages) => Array.isArray(messages) && messages.length > 0)?.[0]
          : null

        if (result?.error?.includes('zaten kayıtlı')) {
          toast.error('Bu e-posta adresi zaten kayıtlı')
        } else if (firstFieldError) {
          toast.error(firstFieldError)
        } else {
          toast.error(result?.error || 'Kayıt olurken bir hata oluştu')
        }
        return
      }

      setIsSuccess(true)
      toast.success('Kayıt başarılı! E-posta adresinizi kontrol edin.')
    } catch (error) {
      console.error('Register error:', error)
      toast.error('Beklenmeyen bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const selectedRole = watch('role')

  // Email doğrulama başarı ekranı
  if (isSuccess) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-background-card border border-border rounded-2xl p-8 shadow-lg">
            {/* Success Icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-green-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-text-primary mb-4">
              E-posta Adresinizi Doğrulayın
            </h1>
            
            <p className="text-text-secondary mb-6">
              <span className="font-semibold text-text-primary">{getValues('email')}</span> adresine 
              bir doğrulama bağlantısı gönderdik. Lütfen gelen kutunuzu kontrol edin ve bağlantıya tıklayarak 
              hesabınızı aktifleştirin.
            </p>

            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
              <p className="text-sm text-text-secondary">
                <span className="font-semibold text-primary">İpucu:</span> E-posta gelmedi mi? 
                Spam/Gereksiz klasörünüzü kontrol edin.
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/giris">
                <Button className="w-full">
                  Giriş Sayfasına Git
                </Button>
              </Link>
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setIsSuccess(false)}
              >
                Farklı E-posta ile Kayıt Ol
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary shadow-sm">
              <span className="text-white font-bold text-xl">DA</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Hesap Oluşturun
          </h1>
          <p className="text-text-secondary">
            Dent Alışveriş&apos;e üye olun
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-background-card border border-border rounded-2xl p-6 shadow-lg">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-text-primary">
                  Ad
                </label>
                <Input
                  id="firstName"
                  type="text"
                  placeholder="Adınız"
                  autoComplete="given-name"
                  disabled={isLoading}
                  {...register('firstName')}
                  className={errors.firstName ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.firstName && (
                  <p className="text-sm text-red-500">{errors.firstName.message}</p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-sm font-medium text-text-primary">
                  Soyad
                </label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Soyadınız"
                  autoComplete="family-name"
                  disabled={isLoading}
                  {...register('lastName')}
                  className={errors.lastName ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.lastName && (
                  <p className="text-sm text-red-500">{errors.lastName.message}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                E-posta Adresi
              </label>
              <Input
                id="email"
                type="email"
                placeholder="ornek@email.com"
                autoComplete="email"
                disabled={isLoading}
                {...register('email')}
                className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.email && (
                <p className="text-sm text-red-500">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-text-primary">
                Hesap Türü
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 cursor-pointer">
                  <input type="radio" value="clinic" disabled={isLoading} {...register('role')} />
                  <span className="text-sm text-text-primary">Klinik / Müşteri</span>
                </label>
                <label className="flex items-center gap-2 rounded-lg border border-border px-3 py-2 cursor-pointer">
                  <input type="radio" value="depo" disabled={isLoading} {...register('role')} />
                  <span className="text-sm text-text-primary">Depo / Satıcı</span>
                </label>
              </div>
              {errors.role && (
                <p className="text-sm text-red-500">{errors.role.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="company_name" className="block text-sm font-medium text-text-primary">
                Firma / Klinik Adı
              </label>
              <Input
                id="company_name"
                type="text"
                placeholder="Firma adınız"
                disabled={isLoading}
                {...register('company_name')}
                className={errors.company_name ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.company_name && (
                <p className="text-sm text-red-500">{errors.company_name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-text-primary">
                Telefon
              </label>
              <Input
                id="phone"
                type="tel"
                placeholder="05XXXXXXXXX"
                disabled={isLoading}
                {...register('phone')}
                className={errors.phone ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="tax_number" className="block text-sm font-medium text-text-primary">
                Vergi Numarası {selectedRole === 'clinic' ? '(Opsiyonel)' : ''}
              </label>
              <Input
                id="tax_number"
                type="text"
                placeholder="10 haneli vergi no"
                disabled={isLoading}
                {...register('tax_number')}
                className={errors.tax_number ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.tax_number && (
                <p className="text-sm text-red-500">{errors.tax_number.message}</p>
              )}
            </div>

            {selectedRole === 'depo' && (
              <div className="space-y-2">
                <label htmlFor="store_description" className="block text-sm font-medium text-text-primary">
                  Mağaza Açıklaması (Opsiyonel)
                </label>
                <textarea
                  id="store_description"
                  rows={3}
                  disabled={isLoading}
                  {...register('store_description')}
                  className={`w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/20 ${errors.store_description ? 'border-red-500 focus:border-red-500' : 'border-border'}`}
                />
                {errors.store_description && (
                  <p className="text-sm text-red-500">{errors.store_description.message}</p>
                )}
              </div>
            )}

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-text-primary">
                Şifre
              </label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                {...register('password')}
                className={errors.password ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
              <p className="text-xs text-text-muted">
                En az 6 karakter, 1 büyük harf, 1 küçük harf ve 1 rakam
              </p>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-text-primary">
                Şifre Tekrar
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                autoComplete="new-password"
                disabled={isLoading}
                {...register('confirmPassword')}
                className={errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Terms */}
            <p className="text-sm text-text-muted">
              Kayıt olarak{' '}
              <Link href="/kullanim-sartlari" className="text-primary hover:underline">
                Kullanım Şartları
              </Link>
              {' '}ve{' '}
              <Link href="/gizlilik-politikasi" className="text-primary hover:underline">
                Gizlilik Politikası
              </Link>
              &apos;nı kabul etmiş olursunuz.
            </p>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 text-base font-semibold"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Kayıt Yapılıyor...
                </span>
              ) : (
                'Kayıt Ol'
              )}
            </Button>
          </form>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-text-secondary">
          Zaten hesabınız var mı?{' '}
          <Link 
            href="/giris" 
            className="text-primary font-semibold hover:text-primary/80 transition-colors"
          >
            Giriş Yapın
          </Link>
        </p>
      </div>
    </div>
  )
}
