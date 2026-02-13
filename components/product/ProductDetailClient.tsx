'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ShoppingCart, Minus, Plus, Check, Loader2, Package, Truck, Shield, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { WishlistButton } from '@/components/WishlistButton'
import { useCart } from '@/app/contexts/CartContext'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { formatPrice } from '@/lib/utils/format'
import { toast } from 'sonner'
import type { ProductWithRelations } from '@/types/catalog.types'

interface ProductDetailClientProps {
  product: ProductWithRelations & {
    price?: number | null
    compare_at_price?: number | null
    stock_quantity?: number | null
    images?: string[] | null
  }
}

export function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isAdded, setIsAdded] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const { addToCart } = useCart()

  // Ürün resimleri - Ana resim ve varsa ek resimler
  const images = [
    product.primary_image,
    ...(product.images || [])
  ].filter(Boolean) as string[]

  if (images.length === 0) {
    images.push('/placeholder-product.jpg')
  }

  const stockQty = product.stock_quantity ?? null

  // Stok durumu hesaplama
  const getStockStatus = () => {
    if (stockQty === null || stockQty === undefined) return { label: 'Stokta', variant: 'success' as const, color: 'text-green-600', dotColor: 'bg-green-500' }
    if (stockQty > 10) return { label: 'Stokta', variant: 'success' as const, color: 'text-green-600', dotColor: 'bg-green-500' }
    if (stockQty >= 1) return { label: `Son ${stockQty} adet`, variant: 'warning' as const, color: 'text-orange-600', dotColor: 'bg-orange-500' }
    return { label: 'Stokta Yok', variant: 'danger' as const, color: 'text-red-600', dotColor: 'bg-red-500' }
  }

  const stockStatus = getStockStatus()
  const isInStock = stockQty === null || stockQty > 0
  const maxQuantity = stockQty !== null ? Math.min(stockQty, 10) : 10

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta
    if (newQuantity >= 1 && newQuantity <= maxQuantity) {
      setQuantity(newQuantity)
    }
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    try {
      await addToCart(product.id, null, quantity)
      setIsAdded(true)
      toast.success(`${quantity} adet "${product.name}" sepete eklendi`)
      setTimeout(() => {
        setIsAdded(false)
        setQuantity(1)
      }, 2000)
    } catch (error) {
      console.error('Sepete ekleme hatası:', error)
      toast.error('Ürün sepete eklenemedi')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* SOL: Ürün Resimleri */}
      <div className="space-y-4">
        {/* Ana Resim */}
        <div className="relative aspect-square bg-white rounded-xl border border-border/50 overflow-hidden group">
          <Image
            src={getImageUrl(images[selectedImageIndex])}
            alt={product.name}
            fill
            className="object-contain p-4 transition-transform duration-300 group-hover:scale-105"
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
          
          {/* Resim Navigasyonu */}
          {images.length > 1 && (
            <>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Önceki resim"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Sonraki resim"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
          
          {/* Stokta Yok Overlay */}
          {!isInStock && (
            <div className="absolute top-4 left-4">
              <Badge variant="danger" className="text-sm">Stokta Yok</Badge>
            </div>
          )}
        </div>

        {/* Küçük Resimler (Thumbnail Gallery) */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`relative w-20 h-20 flex-shrink-0 rounded-lg border-2 overflow-hidden transition-all ${
                  selectedImageIndex === index 
                    ? 'border-primary ring-2 ring-primary/20' 
                    : 'border-border/50 hover:border-primary/50'
                }`}
              >
                <Image
                  src={getImageUrl(img)}
                  alt={`${product.name} - Resim ${index + 1}`}
                  fill
                  className="object-contain p-1"
                  sizes="80px"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* SAĞ: Ürün Bilgileri */}
      <div className="space-y-6">
        {/* Marka */}
        {product.brand && (
          <Link href={`/markalar/${product.brand.slug}`}>
            <Badge variant="secondary" className="hover:bg-primary/10 transition-colors cursor-pointer">
              {product.brand.name}
            </Badge>
          </Link>
        )}

        {/* Ürün Adı */}
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
          {product.name}
        </h1>

        {/* SKU ve Üretici Kodu */}
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
          {product.sku && (
            <div>
              <span className="font-medium">SKU:</span>{' '}
              <span className="font-mono">{product.sku}</span>
            </div>
          )}
          {product.manufacturer_code && (
            <div>
              <span className="font-medium">Üretici Kodu:</span>{' '}
              <span className="font-mono">{product.manufacturer_code}</span>
            </div>
          )}
        </div>

        {/* Kısa Açıklama */}
        {product.short_description && (
          <p className="text-lg text-muted-foreground">
            {product.short_description}
          </p>
        )}

        {/* Fiyat */}
        <div className="py-4 border-y border-border/50">
          {product.price ? (
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-xl text-muted-foreground line-through">
                  {formatPrice(product.compare_at_price)}
                </span>
              )}
            </div>
          ) : (
            <span className="text-2xl font-semibold text-muted-foreground">
              Fiyat için iletişime geçin
            </span>
          )}
          <p className="text-sm text-muted-foreground mt-1">KDV Dahil</p>
        </div>

        {/* Stok Durumu Badge */}
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${stockStatus.dotColor}`} />
          <Badge variant={stockStatus.variant}>
            {stockStatus.label}
          </Badge>
        </div>

        {/* Miktar Seçici ve Sepete Ekle */}
        {isInStock && (
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Miktar Seçici (+/- butonlar, 1-10 arası, max=stok) */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
                className="p-3 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Miktarı azalt"
              >
                <Minus className="w-5 h-5" />
              </button>
              <span className="px-6 py-3 font-semibold text-lg min-w-[60px] text-center bg-muted/30">
                {quantity}
              </span>
              <button
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= maxQuantity}
                className="p-3 hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Miktarı artır"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {/* Sepete Ekle Butonu */}
            <Button
              onClick={handleAddToCart}
              disabled={isAdding || isAdded}
              size="lg"
              className="flex-1 h-[54px] text-lg font-semibold"
            >
              {isAdding ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Ekleniyor...
                </>
              ) : isAdded ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Sepete Eklendi!
                </>
              ) : (
                <>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Sepete Ekle
                </>
              )}
            </Button>

            {/* Favorilere Ekle Kalp Butonu */}
            <WishlistButton
              productId={product.id}
              productName={product.name}
              size="lg"
              showLabel
            />
          </div>
        )}

        {/* Stokta Yok Mesajı */}
        {!isInStock && (
          <div className="p-4 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-red-700 dark:text-red-400 font-medium">
              Bu ürün şu anda stokta bulunmamaktadır. Stok durumu için bizimle iletişime geçebilirsiniz.
            </p>
            {/* Stokta yokken de favoriye eklenebilsin */}
            <div className="mt-3">
              <WishlistButton
                productId={product.id}
                productName={product.name}
                size="md"
                showLabel
              />
            </div>
          </div>
        )}

        {/* Güven Göstergeleri */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Package className="w-6 h-6 text-primary" />
            <div className="text-sm">
              <p className="font-medium">Orijinal Ürün</p>
              <p className="text-muted-foreground">Garantili</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Truck className="w-6 h-6 text-primary" />
            <div className="text-sm">
              <p className="font-medium">Hızlı Kargo</p>
              <p className="text-muted-foreground">1-3 iş günü</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-muted/30 rounded-lg">
            <Shield className="w-6 h-6 text-primary" />
            <div className="text-sm">
              <p className="font-medium">Güvenli Ödeme</p>
              <p className="text-muted-foreground">256-bit SSL</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
