'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { formatPrice } from '@/lib/utils/format'

interface CarouselProduct {
  id: string
  name: string
  slug: string
  primary_image: string | null
  price: number | null
  compare_at_price: number | null
  brand_id: string | null
  brands: { name: string } | null
}

const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='224' height='224' viewBox='0 0 224 224'%3E%3Crect width='224' height='224' fill='%23f3f4f6'/%3E%3Ctext x='112' y='112' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='14' fill='%239ca3af'%3EGörsel Yok%3C/text%3E%3C/svg%3E"

function SkeletonCard() {
  return (
    <div className="w-56 flex-shrink-0 rounded-2xl border border-border bg-white shadow-lg overflow-hidden animate-pulse">
      <div className="aspect-square bg-muted/40" />
      <div className="p-4 space-y-2">
        <div className="h-3 bg-muted/40 rounded w-1/3" />
        <div className="h-4 bg-muted/40 rounded w-full" />
        <div className="h-4 bg-muted/40 rounded w-4/5" />
        <div className="h-5 bg-muted/40 rounded w-1/2 mt-2" />
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: CarouselProduct }) {
  const [imgSrc, setImgSrc] = useState(getImageUrl(product.primary_image))
  const hasDiscount =
    product.compare_at_price !== null &&
    product.price !== null &&
    !isNaN(product.compare_at_price) &&
    !isNaN(product.price) &&
    product.compare_at_price > product.price

  const validPrice =
    product.price !== null && !isNaN(product.price) && product.price > 0

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="w-56 flex-shrink-0 snap-start rounded-2xl border border-border bg-white shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.03] transition-all duration-300 group"
    >
      <div className="aspect-square relative overflow-hidden bg-background">
        <Image
          src={imgSrc}
          alt={product.name}
          fill
          sizes="224px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          onError={() => setImgSrc(PLACEHOLDER_SVG)}
        />
      </div>
      <div className="p-4 space-y-1">
        {product.brands?.name && (
          <p className="text-[11px] text-secondary-text font-medium uppercase tracking-wide truncate">
            {product.brands.name}
          </p>
        )}
        <h3 className="text-sm font-bold text-body-text line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 pt-1">
          {validPrice ? (
            <span className="text-sm font-extrabold text-primary">
              {formatPrice(product.price!)}
            </span>
          ) : (
            <span className="text-xs text-secondary-text italic">
              Fiyat için iletişime geçin
            </span>
          )}
          {hasDiscount && product.compare_at_price !== null && (
            <span className="text-xs text-secondary-text line-through">
              {formatPrice(product.compare_at_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

export function ProductCarousel() {
  const { user } = useAuth()
  const [products, setProducts] = useState<CarouselProduct[]>([])
  const [title, setTitle] = useState('Popüler Ürünler')
  const [loading, setLoading] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/recommendations?limit=16', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products)
          setTitle(data.title ?? 'Popüler Ürünler')
        }
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') console.error('Carousel fetch error:', err)
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  // Re-fetch when auth state changes so personalized results are shown on login
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  return (
    <section className="py-10 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-extrabold text-foreground">{title}</h2>
          {products.length > 0 && (
            <div className="flex gap-2">
              <button
                onClick={scrollLeft}
                className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
                aria-label="Sola kaydır"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={scrollRight}
                className="w-10 h-10 rounded-full border border-border bg-white flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm"
                aria-label="Sağa kaydır"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex gap-4 px-4 overflow-hidden container mx-auto">
          {Array.from({ length: 6 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="container mx-auto px-4 text-center py-8">
          <p className="text-secondary-text">Yakında yeni ürünler eklenecektir</p>
        </div>
      ) : (
        <div className="container mx-auto px-4">
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 snap-x snap-mandatory"
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}