'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const supabase = createClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
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
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            full_name: `${data.firstName} ${data.lastName}`,
          },
          emailRedirectTo: `${window.location.origin}/giris`,
        },
      })

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Bu e-posta adresi zaten kayıtlı')
        } else {
          toast.error(error.message || 'Kayıt olurken bir hata oluştu')
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
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-xl">DM</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Hesap Oluşturun
          </h1>
          <p className="text-text-secondary">
            Dental Market&apos;e üye olun
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
