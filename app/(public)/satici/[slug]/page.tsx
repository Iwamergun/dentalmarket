import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import Link from 'next/link'
import Image from 'next/image'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { Star, Package, Phone, Truck } from 'lucide-react'

interface SaticiPageProps {
  params: Promise<{ slug: string }>
}

interface SupplierProfile {
  id: string
  company_name: string | null
  store_description: string | null
  store_logo_url: string | null
  store_slug: string | null
  phone: string | null
  avg_rating: number | null
  total_ratings: number | null
  total_sales: number | null
}

interface SupplierOffer {
  offer_id: string
  price: number
  stock_quantity: number
  lead_time_days: number | null
  shipping_cost: number
  payment_options: string[]
  product: {
    id: string
    name: string
    slug: string
    primary_image: string | null
    short_description: string | null
  }
}

async function getSupplierData(slug: string) {
  const cookieStore = await cookies()
  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll() {},
      },
    }
  )
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // 1. Supplier'ı bul
  const { data: supplierRaw } = await (supabase
    .from('profiles')
    .select('id, company_name, store_description, store_logo_url, store_slug, phone, avg_rating, total_ratings, total_sales')
    .eq('store_slug', slug)
    .in('role', ['depo', 'supplier'])
    .eq('is_active', true)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .single() as any)

  const supplier = supplierRaw as SupplierProfile | null
  if (!supplier) return null

  // 2. Bu supplier'ın aktif offer'larını al (JOIN OLMADAN - RLS sorununu önler)
  const { data: offersRaw } = await (supabase
    .from('offers')
    .select('id, price, stock_quantity, lead_time_days, shipping_cost, payment_options, product_id')
    .eq('supplier_id', supplier.id)
    .eq('is_active', true)
    .gt('stock_quantity', 0)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .order('price', { ascending: true }) as any)

  if (!offersRaw || offersRaw.length === 0) {
    return { supplier, offers: [] as SupplierOffer[], isAuthenticated: Boolean(user) }
  }

  // 3. Ürün bilgilerini AYRI çek (RLS join sorunu yok)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productIds = offersRaw.map((o: any) => String(o.product_id)).filter((v: string, i: number, a: string[]) => a.indexOf(v) === i)

  const { data: productsRaw } = await (supabase
    .from('catalog_products')
    .select('id, name, slug, primary_image, short_description')
    .in('id', productIds)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .eq('is_active', true) as any)

  // 4. Birleştir
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const productMap = new Map<string, any>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (productsRaw || []).map((p: any) => [p.id, p])
  )

  const offers: SupplierOffer[] = offersRaw
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((o: any) => productMap.has(o.product_id))
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((o: any) => {
      const product = productMap.get(o.product_id)
      return {
        offer_id: o.id,
        price: parseFloat(String(o.price)),
        stock_quantity: o.stock_quantity,
        lead_time_days: o.lead_time_days,
        shipping_cost: parseFloat(String(o.shipping_cost || 0)),
        payment_options: o.payment_options || [],
        product: {
          id: product.id,
          name: product.name,
          slug: product.slug,
          primary_image: product.primary_image || null,
          short_description: product.short_description || null,
        }
      }
    })

  return { supplier, offers, isAuthenticated: Boolean(user) }
}

export async function generateMetadata({ params }: SaticiPageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getSupplierData(slug)
  if (!data) return {}
  return {
    title: `${data.supplier.company_name} - Dent Alışveriş`,
    description: data.supplier.store_description ?? `${data.supplier.company_name} mağaza sayfası`,
  }
}

export default async function SaticiPage({ params }: SaticiPageProps) {
  const { slug } = await params
  const data = await getSupplierData(slug)

  if (!data) notFound()

  const { supplier, offers, isAuthenticated } = data

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: 'Satıcılar', href: '/saticilar' },
    { label: supplier.company_name ?? 'Mağaza', href: `/satici/${slug}` },
  ]

  const rating = supplier.avg_rating ? parseFloat(String(supplier.avg_rating)) : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      {/* Satıcı Bilgi Kartı */}
      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <div className="flex items-start gap-4">
          {supplier.store_logo_url ? (
            <Image
              src={getImageUrl(supplier.store_logo_url)}
              alt={supplier.company_name || 'Mağaza'}
              width={80}
              height={80}
              className="rounded-lg border border-gray-200 object-cover"
            />
          ) : (
            <div className="w-20 h-20 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">{supplier.company_name}</h1>
            {supplier.store_description && (
              <p className="mt-1 text-gray-600">{supplier.store_description}</p>
            )}
            <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500">
              {rating > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-amber-600">{rating.toFixed(1)}</span>
                  <span>({supplier.total_ratings} değerlendirme)</span>
                </span>
              )}
              {(supplier.total_sales ?? 0) > 0 && (
                <span className="flex items-center gap-1">
                  <Package className="w-4 h-4" />
                  {supplier.total_sales} satış
                </span>
              )}
              {supplier.phone && (
                <span className="flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {supplier.phone}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Ürün Sayısı */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-semibold text-blue-600">{offers.length}</span> ürün bulundu
        </p>
      </div>

      {/* Ürün Grid */}
      {offers.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Bu mağazada henüz ürün bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {offers.map((offer) => (
            <div
              key={offer.offer_id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
            >
              <Link href={`/urunler/${offer.product.slug}`}>
                <div className="aspect-square bg-gray-50 flex items-center justify-center relative">
                  {offer.product.primary_image ? (
                    <Image
                      src={getImageUrl(offer.product.primary_image)}
                      alt={offer.product.name}
                      fill
                      className="object-contain p-2"
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">Görsel Yok</div>
                  )}
                </div>
              </Link>
              <div className="p-4 flex flex-col flex-1">
                <Link href={`/urunler/${offer.product.slug}`}>
                  <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-blue-600 transition-colors">
                    {offer.product.name}
                  </h3>
                </Link>

                {/* Fiyat ve Stok */}
                <div className="mt-auto pt-3">
                  {isAuthenticated ? (
                    <p className="text-lg font-bold text-blue-600">
                      ₺{offer.price.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                    </p>
                  ) : (
                    <p className="inline-flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-600">
                      Fiyat için giriş yapın
                    </p>
                  )}
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    {isAuthenticated && (
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        {offer.shipping_cost === 0 ? 'Ücretsiz kargo' : `₺${offer.shipping_cost} kargo`}
                      </span>
                    )}
                    <span>Stok: {offer.stock_quantity}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
