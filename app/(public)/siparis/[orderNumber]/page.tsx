import { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle, Package, Truck, Home, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface OrderConfirmationPageProps {
  params: Promise<{ orderNumber: string }>
}

export async function generateMetadata({ params }: OrderConfirmationPageProps): Promise<Metadata> {
  const { orderNumber } = await params
  return {
    title: `Sipariş Onayı - ${orderNumber} | Dental Market`,
    description: 'Siparişiniz başarıyla oluşturuldu.',
    robots: {
      index: false,
      follow: false,
    },
  }
}

export default async function OrderConfirmationPage({ params }: OrderConfirmationPageProps) {
  const { orderNumber } = await params

  // Not: Gerçek uygulamada sipariş detayları veritabanından çekilir
  // const order = await getOrderByNumber(orderNumber)
  
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto">
        {/* Başarı İkonu */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full mb-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Siparişiniz Alındı!
          </h1>
          <p className="text-muted-foreground">
            Siparişiniz başarıyla oluşturuldu ve işleme alındı.
          </p>
        </div>

        {/* Sipariş Bilgileri Kartı */}
        <div className="bg-card rounded-xl border border-border/50 p-6 mb-6">
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
            <div>
              <p className="text-sm text-muted-foreground">Sipariş Numarası</p>
              <p className="text-2xl font-bold font-mono">{orderNumber}</p>
            </div>
            <Package className="w-10 h-10 text-primary" />
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">E-posta Bildirimi</p>
                <p className="text-sm text-muted-foreground">
                  Sipariş detayları ve takip bilgileri e-posta adresinize gönderildi.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Truck className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Kargo Takibi</p>
                <p className="text-sm text-muted-foreground">
                  Siparişiniz kargoya verildiğinde takip numarası e-posta ile iletilecektir.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-muted-foreground mt-0.5" />
              <div>
                <p className="font-medium">Destek</p>
                <p className="text-sm text-muted-foreground">
                  Sorularınız için{' '}
                  <a href="tel:08502123434" className="text-primary hover:underline">
                    0850 212 34 34
                  </a>
                  {' '}numaralı hattımızı arayabilirsiniz.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sonraki Adımlar */}
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-800 p-6 mb-6">
          <h2 className="font-semibold text-blue-700 dark:text-blue-300 mb-3">
            Sonraki Adımlar
          </h2>
          <ol className="list-decimal list-inside space-y-2 text-sm text-blue-600 dark:text-blue-400">
            <li>Siparişiniz onaylandıktan sonra hazırlanmaya başlayacak</li>
            <li>Ürünleriniz özenle paketlenecek</li>
            <li>Kargo firmasına teslim edildiğinde bilgilendirileceksiniz</li>
            <li>Tahmini teslimat süresi: 1-3 iş günü</li>
          </ol>
        </div>

        {/* Aksiyonlar */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/hesabim/siparislerim" className="flex-1">
            <Button className="w-full">
              <Package className="w-4 h-4 mr-2" />
              Siparişlerimi Görüntüle
            </Button>
          </Link>
          <Link href="/" className="flex-1">
            <Button variant="outline" className="w-full">
              <Home className="w-4 h-4 mr-2" />
              Ana Sayfaya Dön
            </Button>
          </Link>
        </div>

        {/* Ek Bilgi */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Dental Market&apos;i tercih ettiğiniz için teşekkür ederiz!
          </p>
          <p className="mt-1">
            Memnuniyetiniz bizim için önemli.
          </p>
        </div>
      </div>
    </div>
  )
}
