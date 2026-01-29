'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { ProductCardHome } from './product-card-home'
import type { Product } from '@/types/catalog.types'

export function AllProductsSection() {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const limit = 8

  useEffect(() => {
    async function fetchProducts() {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const offset = (page - 1) * limit
      const { data, error } = await supabase
        .from('catalog_products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (!error && data) {
        if (page === 1) {
          setProducts(data as Product[])
        } else {
          setProducts(prev => [...prev, ...(data as Product[])])
        }
        setHasMore(data.length === limit)
      }
      setIsLoading(false)
    }

    fetchProducts()
  }, [page])

  const loadMore = () => {
    setPage(prev => prev + 1)
  }

  return (
    <section className="py-12 md:py-16 bg-background">
      <div className="container-main">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="section-title">Tüm Ürünler</h2>
            <p className="section-subtitle">Geniş ürün yelpazemizi keşfedin</p>
          </div>
          <Link 
            href="/urunler" 
            className="text-primary hover:text-primary-light transition-colors text-sm font-medium"
          >
            Tümünü Gör →
          </Link>
        </div>

        {/* Products Grid */}
        {isLoading && page === 1 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="card-base overflow-hidden">
                <div className="aspect-square bg-background-elevated animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-background-elevated rounded animate-pulse" />
                  <div className="h-4 bg-background-elevated rounded w-2/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {products.map((product) => (
                <ProductCardHome key={product.id} product={product} />
              ))}
            </div>
            
            {/* Load More */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={loadMore}
                  className="btn-outline"
                  disabled={isLoading}
                >
                  {isLoading ? 'Yükleniyor...' : 'Daha Fazla Göster'}
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-text-muted">Henüz ürün bulunmamaktadır.</p>
          </div>
        )}
      </div>
    </section>
  )
}
