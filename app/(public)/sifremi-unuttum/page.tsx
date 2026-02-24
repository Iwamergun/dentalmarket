'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail } from 'lucide-react'

export default function SifremiUnuttumPage() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSent, setIsSent] = useState(false)
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      toast.error('Lütfen e-posta adresinizi girin')
      return
    }

    setIsLoading(true)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/giris`,
      })

      if (error) {
        toast.error(error.message || 'Şifre sıfırlama bağlantısı gönderilemedi')
        return
      }

      setIsSent(true)
    } catch (error) {
      console.error('Password reset error:', error)
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
              <span className="text-white font-bold text-xl">DM</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Şifrenizi Sıfırlayın
          </h1>
          <p className="text-text-secondary">
            E-posta adresinizi girin, şifre sıfırlama bağlantısı gönderelim
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-background-card border border-border rounded-2xl p-6 shadow-lg">
          {isSent ? (
            <div className="rounded-xl bg-green-50 border border-green-200 p-6 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Mail className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                E-posta gönderildi!
              </h2>
              <p className="text-sm text-green-700">
                Gelen kutunuzu kontrol edin. Şifre sıfırlama bağlantısı{' '}
                <strong>{email}</strong> adresine gönderildi.
              </p>
              <p className="text-xs text-green-600 mt-3">
                E-postayı göremiyorsanız spam/gereksiz klasörünü kontrol edin.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

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
                    Gönderiliyor...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Sıfırlama Bağlantısı Gönder
                  </span>
                )}
              </Button>
            </form>
          )}
        </div>

        {/* Login Link */}
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
