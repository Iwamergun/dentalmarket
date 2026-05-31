import { HeroSection } from '@/components/home/hero-section'
import { ProductCarousel } from '@/components/home/product-carousel'
import { CategoryGrid } from '@/components/home/category-grid'
import { CampaignBanner } from '@/components/home/campaign-banner'
import { FeaturedProducts } from '@/components/home/featured-products'
import { BrandLogos } from '@/components/home/brand-logos'
import { TrustSection } from '@/components/home/trust-section'
import { HomeCatalogFilter } from '@/components/home/home-catalog-filter'
import { CampaignSidebar } from '@/components/home/campaign-sidebar'
import { getRootCategories } from '@/lib/supabase/queries/categories'
import { getProductsWithOffers } from '@/lib/supabase/queries/products'
import { getBrands } from '@/lib/supabase/queries/brands'
import { getActiveCampaigns } from '@/lib/supabase/queries/campaigns'

const FEATURED_PRODUCTS_COUNT = 8

export default async function HomePage() {
  // Fetch data from Supabase
  const [categories, products, brands, campaigns] = await Promise.all([
    getRootCategories(),
    getProductsWithOffers(FEATURED_PRODUCTS_COUNT, 0),
    getBrands(),
    getActiveCampaigns(),
  ])

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(118,59,255,0.08),_transparent_24%),linear-gradient(180deg,rgba(255,255,255,0.98),rgba(248,248,252,1))]">
      {/* Hero Section */}
      <HeroSection />

      {/* Product Carousel */}
      <ProductCarousel fallbackProducts={products} />
      
      <main>
        <div className="container-main py-10 md:py-14">
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="w-full lg:w-80 lg:flex-shrink-0 space-y-4">
              <CampaignSidebar campaigns={campaigns} />
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
        
        {/* Brand Logos */}
        <BrandLogos brands={brands} />
        
        {/* Trust Section */}
        <TrustSection />
      </main>
    </div>
  )
}
