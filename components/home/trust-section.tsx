import { Shield, Truck, RotateCcw, Headphones } from 'lucide-react'

const trustItems = [
  {
    Icon: Shield,
    title: 'Güvenli Ödeme',
    description: '256-bit SSL şifreleme ile güvenli alışveriş',
    gradient: 'from-primary to-secondary',
  },
  {
    Icon: Truck,
    title: 'Hızlı Teslimat',
    description: 'Türkiye geneli 2-5 iş gününde kapınızda',
    gradient: 'from-secondary to-accent',
  },
  {
    Icon: RotateCcw,
    title: 'Kolay İade',
    description: '14 gün içinde ücretsiz iade hakkı',
    gradient: 'from-accent to-warning',
  },
  {
    Icon: Headphones,
    title: '7/24 Destek',
    description: 'Uzman ekibimiz her zaman yanınızda',
    gradient: 'from-warning to-primary',
  },
]

export function TrustSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-br from-muted via-white to-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="text-center group bg-white rounded-2xl p-6 shadow-lg border-2 border-border hover:shadow-xl hover:border-primary/30 transition-all duration-300"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br ${item.gradient} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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
