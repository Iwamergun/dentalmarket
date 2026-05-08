import { Shield, Truck, RotateCcw, Headphones } from 'lucide-react'

const trustItems = [
  {
    Icon: Shield,
    title: 'Güvenli Ödeme',
    description: '256-bit SSL şifreleme ile güvenli alışveriş',
    tone: 'bg-primary',
  },
  {
    Icon: Truck,
    title: 'Hızlı Teslimat',
    description: 'Türkiye geneli 2-5 iş gününde kapınızda',
    tone: 'bg-secondary',
  },
  {
    Icon: RotateCcw,
    title: 'Kolay İade',
    description: '14 gün içinde ücretsiz iade hakkı',
    tone: 'bg-accent',
  },
  {
    Icon: Headphones,
    title: '7/24 Destek',
    description: 'Uzman ekibimiz her zaman yanınızda',
    tone: 'bg-warning',
  },
]

export function TrustSection() {
  return (
    <section className="bg-muted py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="text-center group bg-white rounded-2xl p-6 shadow-lg border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className={`mb-4 inline-flex h-16 w-16 items-center justify-center rounded-2xl ${item.tone} text-white shadow-lg transition-transform duration-300 group-hover:scale-110`}>
                <item.Icon className="w-8 h-8" strokeWidth={2} />
              </div>
              <h3 className="font-bold text-body-text mb-2 text-lg">{item.title}</h3>
              <p className="text-sm text-secondary-text">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
