import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import type { Database } from '@/types/database.types'
import { Breadcrumbs } from '@/components/seo/breadcrumbs'
import Link from 'next/link'

interface SaticiPageProps {
  params: Promise<{ slug: string }>
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

  const { data: supplier } = await supabase
    .from('profiles')
    .select('id, company_name, store_description, store_logo_url, store_slug')
    .eq('store_slug', slug)
    .eq('role', 'supplier')
    .single()

  if (!supplier) return null

  const { data: products } = await supabase
    .from('catalog_products')
    .select('id, name, slug, price, primary_image, short_description, is_active')
    .eq('supplier_id', supplier.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return { supplier, products: products ?? [] }
}

export async function generateMetadata({ params }: SaticiPageProps): Promise<Metadata> {
  const { slug } = await params
  const data = await getSupplierData(slug)
  if (!data) return {}
  return {
    title: `${data.supplier.company_name} - DentalMarket`,
    description: data.supplier.store_description ?? `${data.supplier.company_name} mağaza sayfası`,
  }
}

export default async function SaticiPage({ params }: SaticiPageProps) {
  const { slug } = await params
  const data = await getSupplierData(slug)

  if (!data) notFound()

  const { supplier, products } = data

  const breadcrumbItems = [
    { label: 'Ana Sayfa', href: '/' },
    { label: supplier.company_name ?? 'Mağaza', href: `/satici/${slug}` },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <Breadcrumbs items={breadcrumbItems} />

      <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">{supplier.company_name}</h1>
        {supplier.store_description && (
          <p className="mt-2 text-gray-600">{supplier.store_description}</p>
        )}
      </div>

      {products.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Bu mağazada henüz ürün bulunmuyor.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product: {
            id: string
            name: string
            slug: string
            price: number
            primary_image: string | null
            short_description: string | null
          }) => (
            <Link
              key={product.id}
              href={`/urunler/${product.slug}`}
              className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-square bg-gray-100 flex items-center justify-center">
                {product.primary_image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={product.primary_image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-gray-400 text-sm">Resim yok</div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 text-sm line-clamp-2">{product.name}</h3>
                {product.short_description && (
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.short_description}</p>
                )}
                <p className="mt-2 font-bold text-primary">
                  ₺{Number(product.price).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
