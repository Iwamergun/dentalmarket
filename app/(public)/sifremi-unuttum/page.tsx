'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

const forgotPasswordSchema = z.object({
  email: z.string().email('Geçerli bir e-posta adresi giriniz'),
})

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>

export default function SifremiUnuttumPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const [sentEmail, setSentEmail] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true)

    try {
      const supabase = createClient()
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/sifre-sifirla`,
      })

      if (error) {
        toast.error(error.message || 'Şifre sıfırlama e-postası gönderilirken bir hata oluştu')
        return
      }

      setSentEmail(data.email)
      setIsSent(true)
    } catch {
      toast.error('Beklenmeyen bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-xl">DA</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Şifrenizi Sıfırlayın
          </h1>
          <p className="text-text-secondary">
            E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim
          </p>
        </div>

        {isSent ? (
          <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">E-posta Gönderildi!</h2>
            <p className="text-gray-600 mb-6">
              Gelen kutunuzu kontrol edin. Şifre sıfırlama bağlantısı <strong>{sentEmail}</strong> adresine gönderildi.
            </p>
            <Link href="/giris">
              <Button className="w-full h-12 text-base font-semibold">
                Giriş Sayfasına Dön
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-background-card border border-border rounded-2xl p-6 shadow-lg">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-text-primary">
                  E-posta Adresi
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ornek@klinik.com"
                  autoComplete="email"
                  disabled={isLoading}
                  {...register('email')}
                  className={errors.email ? 'border-red-500 focus:border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

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
                    Gönderiliyor...
                  </span>
                ) : (
                  'Sıfırlama Bağlantısı Gönder'
                )}
              </Button>
            </form>
          </div>
        )}

        <p className="text-center mt-6 text-text-secondary">
          Şifrenizi hatırladınız mı?{' '}
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
