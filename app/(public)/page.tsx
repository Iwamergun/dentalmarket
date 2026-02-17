import { HeroSection } from '@/components/home/hero-section'
import { CategoryGrid } from '@/components/home/category-grid'
import { CampaignBanner } from '@/components/home/campaign-banner'
import { FeaturedProducts } from '@/components/home/featured-products'
import { BrandLogos } from '@/components/home/brand-logos'
import { TrustSection } from '@/components/home/trust-section'
import { getRootCategories } from '@/lib/supabase/queries/categories'
import { getProducts } from '@/lib/supabase/queries/products'
import { getBrands } from '@/lib/supabase/queries/brands'

export default async function HomePage() {
  // Fetch data from Supabase
  const [categories, products, brands] = await Promise.all([
    getRootCategories(),
    getProducts(8, 0), // Get first 8 products
    getBrands(),
  ])

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Category Grid */}
      <CategoryGrid categories={categories} />
      
      {/* Campaign Banner */}
      <CampaignBanner />
      
      {/* Featured Products */}
      <FeaturedProducts products={products} />
      
      {/* Brand Logos */}
      <BrandLogos brands={brands} />
      
      {/* Trust Section */}
      <TrustSection />
    </div>
  )
}
