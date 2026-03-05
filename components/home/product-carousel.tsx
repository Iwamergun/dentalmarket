'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/app/contexts/AuthContext'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { formatPrice } from '@/lib/utils/format'
import type { Product } from '@/types/catalog.types'

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

interface ProductCarouselProps {
  fallbackProducts?: Product[]
}

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
  const imageUrl = getImageUrl(product.primary_image)
  const hasDiscount =
    product.compare_at_price !== null &&
    product.price !== null &&
    product.compare_at_price > product.price

  return (
    <Link
      href={`/urunler/${product.slug}`}
      className="w-56 flex-shrink-0 rounded-2xl border border-border bg-white shadow-lg overflow-hidden hover:shadow-xl hover:scale-[1.03] transition-all duration-300 group"
    >
      <div className="aspect-square relative overflow-hidden bg-background">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="224px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
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
          {product.price !== null && (
            <span className="text-sm font-extrabold text-primary">
              {formatPrice(product.price)}
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

function toCarouselProduct(product: Product): CarouselProduct {
  return {
    id: product.id,
    name: product.name,
    slug: product.slug,
    primary_image: product.primary_image,
    price: product.price,
    compare_at_price: product.compare_at_price,
    brand_id: product.brand_id,
    brands: null,
  }
}

export function ProductCarousel({ fallbackProducts = [] }: ProductCarouselProps) {
  const { user } = useAuth()
  const [products, setProducts] = useState<CarouselProduct[]>([])
  const [title, setTitle] = useState('Popüler Ürünler')
  const [loading, setLoading] = useState(true)
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const controller = new AbortController()
    fetch('/api/recommendations?limit=16', { signal: controller.signal })
      .then((res) => res.json())
      .then((data) => {
        if (data.products && data.products.length > 0) {
          setProducts(data.products)
          setTitle(data.title ?? 'Popüler Ürünler')
        } else {
          setProducts(fallbackProducts.map(toCarouselProduct))
        }
      })
      .catch((err) => {
        if (err?.name !== 'AbortError') console.error('Carousel fetch error:', err)
        setProducts(fallbackProducts.map(toCarouselProduct))
      })
      .finally(() => setLoading(false))
    return () => controller.abort()
  // Re-fetch when auth state changes so personalized results are shown on login
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id])

  // Duplicate the list so the marquee loops seamlessly
  const displayProducts = products.length > 0 ? [...products, ...products] : []

  return (
    <section className="py-10 bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl font-extrabold text-foreground mb-6">{title}</h2>
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
        <div
          className="overflow-hidden"
          onMouseEnter={() => {
            if (trackRef.current) trackRef.current.style.animationPlayState = 'paused'
          }}
          onMouseLeave={() => {
            if (trackRef.current) trackRef.current.style.animationPlayState = 'running'
          }}
        >
          <div
            ref={trackRef}
            className="flex gap-4 w-max"
            style={{
              animation: `carousel-scroll ${products.length * 3}s linear infinite`,
            }}
          >
            {displayProducts.map((product, idx) => (
              <ProductCard key={`${product.id}-${idx}`} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
