import Link from 'next/link'
import Image from 'next/image'
import { HeroSection } from '@/components/home/hero-section'
import { ProductCarousel } from '@/components/home/product-carousel'
import { ProductGroupBand } from '@/components/home/product-group-band'
import { CategoryGrid } from '@/components/home/category-grid'
import { CampaignBanner } from '@/components/home/campaign-banner'
import { FeaturedProducts } from '@/components/home/featured-products'
import { BrandLogos } from '@/components/home/brand-logos'
import { TrustSection } from '@/components/home/trust-section'
import { HomeCatalogFilter } from '@/components/home/home-catalog-filter'
import { getRootCategories } from '@/lib/supabase/queries/categories'
import { getProductsWithOffers } from '@/lib/supabase/queries/products'
import { getBrands } from '@/lib/supabase/queries/brands'
import { getActiveCampaigns } from '@/lib/supabase/queries/campaigns'
import { getImageUrl } from '@/lib/utils/imageHelper'

const FEATURED_PRODUCTS_COUNT = 18

export default async function HomePage() {
  // Fetch data from Supabase
  const [categories, products, brands, campaigns] = await Promise.all([
    getRootCategories(),
    getProductsWithOffers(FEATURED_PRODUCTS_COUNT, 0),
    getBrands(),
    getActiveCampaigns(),
  ])

  const mobileCategoryEmoji: Record<string, string> = {
    implant: '🦷',
    hijyen: '🪥',
    endodonti: '🔬',
    ortodonti: '⚙️',
    laboratuvar: '🧪',
  }

  const productsByPrice = [...products].sort((a, b) => {
    const aPrice = a.price_min ?? a.min_price ?? Number.MAX_SAFE_INTEGER
    const bPrice = b.price_min ?? b.min_price ?? Number.MAX_SAFE_INTEGER
    return aPrice - bPrice
  })

  const productGroups = [
    {
      title: 'Çok Satanlar',
      href: '/urunler',
      products: products.slice(0, 3),
    },
    {
      title: 'Yeni Gelenler',
      href: '/urunler?sort=newest',
      products: [...products].reverse().slice(0, 3),
    },
    {
      title: 'Fiyat Avantajlı',
      href: '/urunler?sort=price-asc',
      products: productsByPrice.slice(0, 3),
    },
  ]

  return (
    <>
      <div className="md:hidden min-h-screen bg-[#F8FAFC] pb-24">
        <div className="space-y-4 px-2.5 pb-7 pt-3 sm:px-3">
          <section className="overflow-hidden rounded-2xl border border-[#E5E7EB]/90 bg-white">
            <HeroSection campaigns={campaigns} products={products} />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#E5E7EB]/90 bg-white">
            <ProductCarousel fallbackProducts={products} />
          </section>

          <section className="rounded-2xl border border-[#E5E7EB]/90 bg-white p-3.5">
            <ProductGroupBand groups={productGroups} />
          </section>

          <section className="rounded-2xl border border-[#E5E7EB]/90 bg-white p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[0.04em] text-slate-900">Kategoriler</h2>
              <Link href="/kategoriler" className="text-xs font-semibold text-[#2563EB]">
                Tümünü Gör
              </Link>
            </div>
            <div className="-mx-0.5 flex gap-2.5 overflow-x-auto px-0.5 pb-0.5">
              {categories.slice(0, 12).map((category) => {
                const icon = mobileCategoryEmoji[category.slug] ?? '🛍️'

                return (
                  <Link
                    key={category.id}
                    href={`/kategoriler/${category.slug}`}
                    className="min-w-[118px] rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] px-2.5 py-3 transition-colors hover:border-[#2563EB]/35"
                  >
                    <span className="text-xl leading-none">{icon}</span>
                    <p className="mt-2 line-clamp-2 text-xs font-semibold text-slate-800">{category.name}</p>
                  </Link>
                )
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB]/90 bg-white p-0.5">
            <FeaturedProducts products={products} />
          </section>

          <section className="rounded-2xl border border-[#E5E7EB]/90 bg-white p-3.5">
            <div className="mb-2.5 flex items-center justify-between">
              <h2 className="text-sm font-semibold tracking-[0.04em] text-slate-900">Kampanyalar</h2>
              <Link href="/kampanyalar" className="text-xs font-semibold text-[#2563EB]">
                Tümü
              </Link>
            </div>
            <div className="-mx-0.5 flex snap-x snap-mandatory gap-2.5 overflow-x-auto px-0.5 pb-0.5">
              {(campaigns.length > 0 ? campaigns : []).slice(0, 8).map((campaign) => (
                <Link
                  key={campaign.id}
                  href={campaign.href || '/kampanyalar'}
                  className="w-[84%] shrink-0 snap-start overflow-hidden rounded-xl border border-[#E5E7EB] bg-white"
                >
                  <div className="relative aspect-[16/9] bg-slate-100">
                    {campaign.image_path ? (
                      <Image
                        src={getImageUrl(campaign.image_path)}
                        alt={campaign.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 90vw, 320px"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-slate-100" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-slate-900">{campaign.title}</p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-600">
                      {campaign.description ?? 'Özel kampanyayı inceleyin.'}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#E5E7EB]/90 bg-white">
            <BrandLogos brands={brands} />
          </section>

          <section className="overflow-hidden rounded-2xl border border-[#E5E7EB]/90 bg-white">
            <TrustSection />
          </section>
        </div>
      </div>

      <div className="hidden min-h-screen bg-white md:block">
        {/* Hero Section */}
        <HeroSection campaigns={campaigns} products={products} />

        {/* Product Carousel */}
        <div className="border-y border-slate-300 bg-[#F4F7FB] shadow-[inset_0_1px_0_rgba(255,255,255,0.85)]">
          <ProductCarousel fallbackProducts={products} />
        </div>

        <div className="border-b border-slate-300 bg-[#F8FAFC]">
          <div className="container-main">
            <ProductGroupBand groups={productGroups} />
          </div>
        </div>
        
        <main className="bg-white">
          <div className="border-b border-slate-300 bg-white">
            <div className="container-main py-10 md:py-14">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="w-full lg:w-80 lg:flex-shrink-0">
                <HomeCatalogFilter categories={categories} brands={brands} />
              </div>
              
              {/* Main Content */}
              <div className="flex-1 space-y-14 md:space-y-16">
                {/* Category Grid */}
                <CategoryGrid categories={categories} />
                
                {/* Campaign Banner */}
                <CampaignBanner />
                
                {/* Featured Products */}
                <FeaturedProducts products={products} />
              </div>
            </div>
            </div>
          </div>
          
          {/* Brand Logos */}
          <div className="border-b border-slate-300 bg-[#F6F8FB]">
            <BrandLogos brands={brands} />
          </div>
          
          {/* Trust Section */}
          <div className="border-b border-slate-300 bg-white">
            <TrustSection />
          </div>
        </main>
      </div>
    </>
  )
}
