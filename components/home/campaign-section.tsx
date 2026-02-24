import Link from 'next/link'

const campaigns = [
  {
    id: 1,
    title: 'Kış Kampanyası',
    description: 'Seçili ürünlerde %20 indirim',
    badge: '%20 İNDİRİM',
    color: 'primary',
    href: '/kampanyalar',
  },
  {
    id: 2,
    title: 'Yeni Üye Fırsatı',
    description: 'İlk siparişinize özel avantajlar',
    badge: 'YENİ ÜYE',
    color: 'accent',
    href: '/kayit',
  },
  {
    id: 3,
    title: 'Toplu Alım Avantajı',
    description: '10+ ürün alımlarında ekstra indirim',
    badge: 'TOPLU ALIM',
    color: 'primary',
    href: '/kampanyalar',
  },
]

export function CampaignSection() {
  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-main">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Aktif Kampanyalar</h2>
            <p className="section-subtitle">Fırsatları kaçırmayın</p>
          </div>
          <Link 
            href="/kampanyalar" 
            className="text-primary hover:text-primary-light transition-colors text-sm font-medium"
          >
            Tümünü Gör →
          </Link>
        </div>

        {/* Campaign Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={campaign.href}
              className={`group relative overflow-hidden rounded-xl p-6 transition-all duration-200 hover:-translate-y-1 ${
                campaign.color === 'primary' 
                  ? 'bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/30 hover:border-primary/50 hover:shadow-glow-primary'
                  : 'bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 hover:border-accent/50 hover:shadow-glow-accent'
              }`}
            >
              {/* Badge */}
              <span className={`inline-block px-3 py-1 text-xs font-bold rounded-full mb-4 ${
                campaign.color === 'primary'
                  ? 'bg-primary text-white'
                  : 'bg-accent text-background-deep'
              }`}>
                {campaign.badge}
              </span>
              
              <h3 className="text-xl font-bold text-text-primary mb-2 group-hover:text-primary transition-colors">
                {campaign.title}
              </h3>
              <p className="text-text-secondary text-sm">
                {campaign.description}
              </p>
              
              {/* Arrow */}
              <div className={`absolute bottom-6 right-6 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 group-hover:translate-x-1 ${
                campaign.color === 'primary'
                  ? 'bg-primary/20 text-primary'
                  : 'bg-accent/20 text-accent'
              }`}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
