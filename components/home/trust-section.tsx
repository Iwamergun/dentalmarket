import { Shield, Truck, RotateCcw, Headphones } from 'lucide-react'

const trustItems = [
  {
    Icon: Shield,
    title: 'Güvenli Ödeme',
    description: '256-bit SSL şifreleme ile güvenli alışveriş',
  },
  {
    Icon: Truck,
    title: 'Hızlı Teslimat',
    description: 'Türkiye geneli 2-5 iş gününde kapınızda',
  },
  {
    Icon: RotateCcw,
    title: 'Kolay İade',
    description: '14 gün içinde ücretsiz iade hakkı',
  },
  {
    Icon: Headphones,
    title: '7/24 Destek',
    description: 'Uzman ekibimiz her zaman yanınızda',
  },
]

export function TrustSection() {
  return (
    <section className="py-12 md:py-16 bg-white border-y border-border">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="text-center group"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-secondary/10 border border-secondary/20 text-secondary group-hover:bg-secondary group-hover:text-white transition-all duration-200 mb-4">
                <item.Icon className="w-8 h-8" strokeWidth={1.5} />
              </div>
              <h3 className="font-semibold text-text-primary mb-1">{item.title}</h3>
              <p className="text-sm text-text-muted">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
