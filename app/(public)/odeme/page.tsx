'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  ShoppingBag, 
  Truck, 
  CreditCard, 
  CheckCircle, 
  ChevronLeft, 
  Loader2,
  AlertCircle,
  Shield
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { useCart } from '@/app/contexts/CartContext'
import { AddressForm, PaymentMethodSelector, OrderSummary } from '@/components/checkout'
import { 
  type AddressFormData, 
  type PaymentMethod 
} from '@/lib/validations/checkout'

// Kargo ücreti hesaplama
const FREE_SHIPPING_THRESHOLD = 500
const SHIPPING_COST = 49.90

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, loading: cartLoading, clearCart } = useCart()
  const [currentStep, setCurrentStep] = useState(1)
  const [addressData, setAddressData] = useState<AddressFormData | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Kargo ücreti
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
  const grandTotal = total + shipping

  // Sepet boşsa sepet sayfasına yönlendir
  useEffect(() => {
    if (!cartLoading && items.length === 0) {
      router.push('/sepet')
    }
  }, [items, cartLoading, router])

  // Adres formu submit handler
  const handleAddressSubmit = (data: AddressFormData) => {
    setAddressData(data)
    setCurrentStep(2)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Ödeme yöntemi seçimi
  const handlePaymentSelect = (method: PaymentMethod) => {
    setPaymentMethod(method)
  }

  // Siparişi tamamla
  const handleCompleteOrder = async () => {
    if (!addressData || !paymentMethod) {
      toast.error('Lütfen tüm bilgileri doldurun')
      return
    }

    if (!acceptTerms) {
      toast.error('Sipariş koşullarını kabul etmelisiniz')
      return
    }

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: addressData,
          paymentMethod,
          items: items.map(item => ({
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.price,
          })),
          subtotal: total,
          shipping,
          total: grandTotal,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Sipariş oluşturulamadı')
      }

      // Sepeti temizle
      await clearCart()

      // Başarı mesajı
      toast.success('Siparişiniz başarıyla oluşturuldu!', {
        description: data.message,
      })

      // Sipariş onay sayfasına yönlendir
      router.push(`/siparis/${data.order.orderNumber}`)
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Bir hata oluştu'
      setError(message)
      toast.error('Sipariş oluşturulamadı', { description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Loading state
  if (cartLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  // Sepet boşsa loading göster (redirect olana kadar)
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  const steps = [
    { number: 1, title: 'Teslimat', icon: Truck },
    { number: 2, title: 'Ödeme', icon: CreditCard },
    { number: 3, title: 'Onay', icon: CheckCircle },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/sepet" 
          className="p-2 hover:bg-muted rounded-lg transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold">Sipariş Oluştur</h1>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
              currentStep >= step.number 
                ? 'bg-primary text-white' 
                : 'bg-muted text-muted-foreground'
            }`}>
              <step.icon className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">{step.title}</span>
            </div>
            {index < steps.length - 1 && (
              <div className={`w-8 sm:w-16 h-1 mx-2 rounded ${
                currentStep > step.number ? 'bg-primary' : 'bg-muted'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-red-700 dark:text-red-400">Hata</p>
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sol Taraf - Form Alanları */}
        <div className="lg:col-span-2 space-y-6">
          {/* Adım 1: Teslimat Adresi */}
          <div className={`bg-card rounded-xl border border-border/50 p-6 ${
            currentStep !== 1 && addressData ? 'opacity-60' : ''
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Truck className="w-5 h-5 text-primary" />
                Teslimat Adresi
              </h2>
              {currentStep > 1 && addressData && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentStep(1)}
                >
                  Düzenle
                </Button>
              )}
            </div>
            
            {currentStep === 1 ? (
              <AddressForm 
                onSubmit={handleAddressSubmit}
                defaultValues={addressData || undefined}
                disabled={isSubmitting}
              />
            ) : addressData ? (
              <div className="text-sm space-y-1 text-muted-foreground">
                <p className="font-medium text-foreground">
                  {addressData.firstName} {addressData.lastName}
                </p>
                <p>{addressData.phone}</p>
                <p>{addressData.address}</p>
                <p>{addressData.district}, {addressData.city} {addressData.postalCode}</p>
              </div>
            ) : null}

            {currentStep === 1 && (
              <Button 
                type="submit"
                form="address-form"
                className="w-full mt-6"
                onClick={() => {
                  const form = document.querySelector('form')
                  if (form) {
                    form.requestSubmit()
                  }
                }}
              >
                Devam Et
              </Button>
            )}
          </div>

          {/* Adım 2: Ödeme Yöntemi */}
          {currentStep >= 2 && (
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <CreditCard className="w-5 h-5 text-primary" />
                Ödeme Yöntemi
              </h2>
              
              <PaymentMethodSelector
                selectedMethod={paymentMethod}
                onSelect={handlePaymentSelect}
                disabled={isSubmitting}
              />

              {paymentMethod === 'bank_transfer' && (
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    <strong>Havale Bilgileri:</strong> Siparişinizi tamamladıktan sonra 
                    banka hesap bilgileri e-posta adresinize gönderilecektir.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Adım 3: Sipariş Onayı */}
          {currentStep >= 2 && paymentMethod && (
            <div className="bg-card rounded-xl border border-border/50 p-6">
              <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
                <CheckCircle className="w-5 h-5 text-primary" />
                Sipariş Onayı
              </h2>

              {/* Koşullar */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  disabled={isSubmitting}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span className="text-sm text-muted-foreground">
                  <Link href="/kullanim-sartlari" className="text-primary hover:underline">
                    Satış koşullarını
                  </Link>
                  {' '}ve{' '}
                  <Link href="/gizlilik-politikasi" className="text-primary hover:underline">
                    gizlilik politikasını
                  </Link>
                  {' '}okudum ve kabul ediyorum.
                </span>
              </label>

              {/* Siparişi Tamamla Butonu */}
              <Button
                onClick={handleCompleteOrder}
                disabled={!acceptTerms || isSubmitting}
                size="lg"
                className="w-full mt-6 h-14 text-lg"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Sipariş Oluşturuluyor...
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Siparişi Tamamla - {new Intl.NumberFormat('tr-TR', { 
                      style: 'currency', 
                      currency: 'TRY' 
                    }).format(grandTotal)}
                  </>
                )}
              </Button>

              {/* Güvenlik Notu */}
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <Shield className="w-4 h-4" />
                <span>256-bit SSL ile güvenli ödeme</span>
              </div>
            </div>
          )}
        </div>

        {/* Sağ Taraf - Sipariş Özeti */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-xl border border-border/50 p-6 sticky top-24">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <ShoppingBag className="w-5 h-5 text-primary" />
              Sipariş Özeti
            </h2>
            
            <OrderSummary
              items={items}
              subtotal={total}
              shipping={shipping}
              total={grandTotal}
            />

            {/* Sepete Dön */}
            <Link 
              href="/sepet"
              className="block text-center text-sm text-primary hover:underline mt-4"
            >
              Sepeti Düzenle
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
