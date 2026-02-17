import { HeroSection } from '@/components/home/hero-section'
import { CategoryGrid } from '@/components/home/category-grid'
import { CampaignBanner } from '@/components/home/campaign-banner'
import { FeaturedProducts } from '@/components/home/featured-products'
import { BrandLogos } from '@/components/home/brand-logos'
import { TrustSection } from '@/components/home/trust-section'
import { FilterSidebar } from '@/components/catalog/filter-sidebar'
import { getRootCategories } from '@/lib/supabase/queries/categories'
import { getProducts } from '@/lib/supabase/queries/products'
import { getBrands } from '@/lib/supabase/queries/brands'

const FEATURED_PRODUCTS_COUNT = 8

export default async function HomePage() {
  // Fetch data from Supabase
  const [categories, products, brands] = await Promise.all([
    getRootCategories(),
    getProducts(FEATURED_PRODUCTS_COUNT, 0),
    getBrands(),
  ])

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <HeroSection />
      
      <main>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* FilterSidebar */}
            <FilterSidebar 
              categories={categories}
              brands={brands}
              className="w-full lg:w-80 flex-shrink-0"
            />
            
            {/* Main Content */}
            <div className="flex-1 space-y-16">
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
