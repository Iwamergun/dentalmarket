import { Shield, Truck, RotateCcw, Headphones } from 'lucide-react'

const trustItems = [
  {
    Icon: Shield,
    title: 'Güvenli Ödeme',
    description: '256-bit SSL şifreleme ile güvenli alışveriş',
    gradient: 'from-accent to-accent-light',
  },
  {
    Icon: Truck,
    title: 'Hızlı Teslimat',
    description: 'Türkiye geneli 2-5 iş gününde kapınızda',
    gradient: 'from-purple to-purple-light',
  },
  {
    Icon: RotateCcw,
    title: 'Kolay İade',
    description: '14 gün içinde ücretsiz iade hakkı',
    gradient: 'from-teal to-teal-light',
  },
  {
    Icon: Headphones,
    title: '7/24 Destek',
    description: 'Uzman ekibimiz her zaman yanınızda',
    gradient: 'from-secondary to-secondary-light',
  },
]

export function TrustSection() {
  return (
    <section className="py-12 md:py-16 bg-gradient-to-b from-white to-background border-y-2 border-border">
      <div className="container-main">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {trustItems.map((item, index) => (
            <div
              key={index}
              className="group text-center relative"
            >
              {/* Icon with Premium Gradient */}
              <div className="relative inline-flex items-center justify-center w-20 h-20 mb-4">
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-20 group-hover:opacity-30 rounded-2xl blur-xl transition-all duration-300`} />
                
                {/* Icon Container */}
                <div className={`relative w-20 h-20 flex items-center justify-center rounded-2xl bg-gradient-to-br ${item.gradient} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <item.Icon className="w-10 h-10" strokeWidth={2} />
                </div>
              </div>
              
              {/* Title */}
              <h3 className="font-bold text-lg text-text-primary mb-2 group-hover:text-accent transition-colors">
                {item.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-text-muted leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
