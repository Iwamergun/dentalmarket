import Image from 'next/image'
import Link from 'next/link'
import type { BestOfferProduct } from '@/lib/supabase/queries/products'
import { formatPrice } from '@/lib/utils/format'
import { getImageUrl } from '@/lib/utils/imageHelper'

interface ProductGroup {
  title: string
  href: string
  products: BestOfferProduct[]
}

interface ProductGroupBandProps {
  groups: ProductGroup[]
}

const CARD_STYLES = [
  'from-primary/10 via-primary/5 to-white',
  'from-secondary/12 via-accent/8 to-white',
  'from-accent/12 via-secondary/8 to-white',
]

const PLACEHOLDER_SVG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'%3E%3Crect width='96' height='96' fill='%23f1f5f9'/%3E%3Ctext x='48' y='48' text-anchor='middle' dy='.3em' font-family='sans-serif' font-size='10' fill='%2394a3b8'%3EGörsel Yok%3C/text%3E%3C/svg%3E"

function getProductPrice(product: BestOfferProduct) {
  const price = product.price_min ?? product.min_price
  if (!price || Number.isNaN(price) || price <= 0) {
    return 'Fiyat için giriş yapın'
  }
  return formatPrice(price)
}

export function ProductGroupBand({ groups }: ProductGroupBandProps) {
  const visibleGroups = groups.filter((group) => group.products.length > 0)

  if (visibleGroups.length === 0) return null

  return (
    <section className="py-4 md:py-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {visibleGroups.map((group, groupIndex) => (
          <article
            key={group.title}
            className={`rounded-2xl border border-slate-200/80 bg-gradient-to-br ${CARD_STYLES[groupIndex % CARD_STYLES.length]} p-3.5 shadow-[0_12px_28px_-24px_rgba(37,99,235,0.45)]`}
          >
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 md:text-base">{group.title}</h3>
              <Link href={group.href} className="text-xs font-semibold text-primary transition-colors hover:text-secondary">
                Tümünü Gör →
              </Link>
            </div>

            <div className="space-y-2.5">
              {group.products.slice(0, 3).map((product) => (
                <Link
                  key={`${group.title}-${product.id}`}
                  href={`/urunler/${product.slug}`}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200/75 bg-white/90 p-2 transition-colors hover:border-primary/30 hover:bg-white"
                >
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={getImageUrl(product.primary_image) || PLACEHOLDER_SVG}
                      alt={product.name}
                      fill
                      sizes="56px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-xs font-medium text-slate-800">{product.name}</p>
                    <p className="mt-1 text-xs font-semibold text-primary">{getProductPrice(product)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
