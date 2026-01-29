import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ProductCardHome } from './product-card-home'
import type { Product } from '@/types/catalog.types'

export async function BestSellersSection() {
  const supabase = await createClient()
  
  const { data: productsData } = await supabase
    .from('catalog_products')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(4)

  const products = (productsData || []) as Product[]

  return (
    <section className="py-12 md:py-16 bg-background-card">
      <div className="container-main">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">En Çok Satanlar</h2>
            <p className="section-subtitle">Kliniklerin tercihi</p>
          </div>
          <Link 
            href="/urunler?sort=best-sellers" 
            className="text-primary hover:text-primary-light transition-colors text-sm font-medium"
          >
            Tümünü Gör →
          </Link>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCardHome key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted">Henüz ürün bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </section>
  )
}
