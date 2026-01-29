import { HeroSection } from '@/components/home/hero-section'
import { CampaignSection } from '@/components/home/campaign-section'
import { BestSellersSection } from '@/components/home/best-sellers-section'
import { AllProductsSection } from '@/components/home/all-products-section'
import { TrustSection } from '@/components/home/trust-section'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection />
      
      {/* Campaign Section */}
      <CampaignSection />
      
      {/* Best Sellers */}
      <BestSellersSection />
      
      {/* All Products */}
      <AllProductsSection />
      
      {/* Trust Section */}
      <TrustSection />
    </div>
  )
}
