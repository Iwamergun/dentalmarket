'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Bell, Lock, Shield, Trash2, 
  Loader2, AlertTriangle, Mail, Eye, EyeOff 
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/app/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export default function AyarlarPage() {
  const { user } = useAuth()
  const router = useRouter()
  const supabase = createClient()
  
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [deletingAccount, setDeletingAccount] = useState(false)
  
  // Bildirim ayarları (localStorage'da tutulur)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [orderUpdates, setOrderUpdates] = useState(true)
  const [promotions, setPromotions] = useState(false)

  // Şifre değiştir
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('Yeni şifreler eşleşmiyor')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Şifre en az 6 karakter olmalıdır')
      return
    }

    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) throw error

      toast.success('Şifreniz başarıyla değiştirildi')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error)
      toast.error('Şifre değiştirilirken bir hata oluştu')
    } finally {
      setChangingPassword(false)
    }
  }

  // Hesap sil
  const handleDeleteAccount = async () => {
    const confirmed = window.prompt(
      'Hesabınızı silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.\n\nOnaylamak için "SİL" yazın:'
    )

    if (confirmed !== 'SİL') {
      if (confirmed !== null) {
        toast.error('Hesap silme iptal edildi')
      }
      return
    }

    setDeletingAccount(true)
    try {
      // Not: Gerçek uygulamada admin API ile hesap silinir
      // Şimdilik sadece çıkış yapıyoruz
      await supabase.auth.signOut()
      toast.success('Hesabınız silindi')
      router.push('/')
    } catch (error) {
      console.error('Hesap silme hatası:', error)
      toast.error('Hesap silinirken bir hata oluştu')
    } finally {
      setDeletingAccount(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Ayarlar</h1>
        <p className="text-muted-foreground">Hesap ve bildirim ayarlarınızı yönetin</p>
      </div>

      {/* Notification Settings */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Bell className="w-5 h-5 text-primary" />
          Bildirim Ayarları
        </h2>
        
        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">E-posta Bildirimleri</p>
              <p className="text-sm text-muted-foreground">Önemli güncellemeler için e-posta alın</p>
            </div>
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={(e) => setEmailNotifications(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Sipariş Güncellemeleri</p>
              <p className="text-sm text-muted-foreground">Sipariş durumu değişikliklerinde bildirim alın</p>
            </div>
            <input
              type="checkbox"
              checked={orderUpdates}
              onChange={(e) => setOrderUpdates(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </label>
          
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="font-medium">Kampanya ve Promosyonlar</p>
              <p className="text-sm text-muted-foreground">İndirim ve kampanyalardan haberdar olun</p>
            </div>
            <input
              type="checkbox"
              checked={promotions}
              onChange={(e) => setPromotions(e.target.checked)}
              className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary"
            />
          </label>
        </div>
      </div>

      {/* Change Password */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Lock className="w-5 h-5 text-primary" />
          Şifre Değiştir
        </h2>
        
        <form onSubmit={handleChangePassword} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Yeni Şifre</label>
            <div className="relative">
              <Input
                type={showPasswords ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Yeni şifreniz"
                disabled={changingPassword}
              />
              <button
                type="button"
                onClick={() => setShowPasswords(!showPasswords)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Yeni Şifre (Tekrar)</label>
            <Input
              type={showPasswords ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Yeni şifrenizi tekrar girin"
              disabled={changingPassword}
            />
          </div>

          <Button type="submit" disabled={changingPassword || !newPassword || !confirmPassword}>
            {changingPassword ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Değiştiriliyor...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4 mr-2" />
                Şifreyi Değiştir
              </>
            )}
          </Button>
        </form>
      </div>

      {/* Security Info */}
      <div className="bg-card rounded-xl border border-border/50 p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-4">
          <Shield className="w-5 h-5 text-primary" />
          Güvenlik
        </h2>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">E-posta:</span>
            <span className="font-medium">{user?.email}</span>
          </div>
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-muted-foreground" />
            <span className="text-muted-foreground">Son giriş:</span>
            <span className="font-medium">
              {user?.last_sign_in_at 
                ? new Date(user.last_sign_in_at).toLocaleDateString('tr-TR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })
                : '-'
              }
            </span>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-950/30 rounded-xl border border-red-200 dark:border-red-800 p-6">
        <h2 className="text-lg font-semibold flex items-center gap-2 mb-2 text-red-700 dark:text-red-400">
          <AlertTriangle className="w-5 h-5" />
          Tehlikeli Bölge
        </h2>
        <p className="text-sm text-red-600 dark:text-red-400 mb-4">
          Bu işlemler geri alınamaz. Lütfen dikkatli olun.
        </p>
        
        <Button 
          variant="outline" 
          onClick={handleDeleteAccount}
          disabled={deletingAccount}
          className="border-red-300 text-red-600 hover:bg-red-100 dark:border-red-700 dark:hover:bg-red-900/50"
        >
          {deletingAccount ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Siliniyor...
            </>
          ) : (
            <>
              <Trash2 className="w-4 h-4 mr-2" />
              Hesabımı Sil
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
