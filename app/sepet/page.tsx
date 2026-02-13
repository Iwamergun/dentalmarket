'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag,
  Loader2, TrendingDown, TrendingUp, AlertTriangle, XCircle,
  Tag, Truck, X
} from 'lucide-react'
import { useCart, CartItem } from '@/app/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/format'
import { getImageUrl } from '@/lib/utils/imageHelper'

function CartItemRow({ item, onUpdateQuantity, onRemove }: {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>
  onRemove: (itemId: string) => Promise<void>
}) {
  const [updating, setUpdating] = useState(false)
  const [removing, setRemoving] = useState(false)

  const maxQuantity = item.product?.stock_quantity ?? 999
  const isOutOfStock = item.product?.out_of_stock === true
  const isLowStock = item.product?.low_stock_warning === true

  const handleQuantityChange = async (newQuantity: number) => {
    if (updating || newQuantity < 1 || newQuantity > maxQuantity) return
    setUpdating(true)
    try {
      await onUpdateQuantity(item.id, newQuantity)
    } finally {
      setUpdating(false)
    }
  }

  const handleRemove = async () => {
    if (removing) return
    setRemoving(true)
    try {
      await onRemove(item.id)
    } finally {
      setRemoving(false)
    }
  }

  const itemTotal = item.price * item.quantity

  return (
    <div className={`flex gap-4 p-4 bg-background-card rounded-xl border transition-colors ${
      isOutOfStock
        ? 'border-red-300 bg-red-50/50 dark:border-red-800 dark:bg-red-950/30'
        : 'border-border hover:border-primary/30'
    }`}>
      {/* Product Image */}
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 rounded-lg overflow-hidden bg-background-deep">
        <Image
          src={getImageUrl(item.product?.primary_image)}
          alt={item.product?.name || 'Ürün'}
          fill
          className={`object-cover ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
        />
        {isOutOfStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <XCircle className="w-8 h-8 text-white" />
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="min-w-0">
            <Link 
              href={`/urunler/${item.product?.slug || item.product_id}`}
              className="font-medium text-text-primary hover:text-primary transition-colors line-clamp-2"
            >
              {item.product?.name || 'Ürün'}
            </Link>

            {/* Variant info */}
            {item.product?.variant && (
              <p className="text-sm text-text-muted mt-0.5">
                Varyant: {item.product.variant.variant_name}
                {item.product.variant.variant_sku && (
                  <span className="ml-2 text-xs">({item.product.variant.variant_sku})</span>
                )}
              </p>
            )}

            {/* Brand */}
            {item.product?.brands?.name && (
              <p className="text-xs text-text-muted mt-0.5">
                Marka: {item.product.brands.name}
              </p>
            )}

            {item.product?.sku && (
              <p className="text-xs text-text-muted mt-0.5">
                SKU: {item.product.sku}
              </p>
            )}

            {/* Out of stock alert */}
            {isOutOfStock && (
              <div className="text-sm mt-1.5 flex items-center gap-1.5 rounded-md px-2 py-1 w-fit text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-950">
                <XCircle className="w-4 h-4 flex-shrink-0" />
                <span>Bu ürün stokta yok. Lütfen sepetinizden kaldırın.</span>
              </div>
            )}

            {/* Low stock warning */}
            {!isOutOfStock && isLowStock && item.product?.stock_quantity != null && (
              <div className="text-sm mt-1.5 flex items-center gap-1.5 rounded-md px-2 py-1 w-fit text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>Son {item.product.stock_quantity} adet kaldı!</span>
              </div>
            )}

            {/* Price change warning */}
            {item.product?.price_changed && item.product?.current_price != null && (
              <div className={`text-sm mt-1.5 flex items-center gap-1 rounded-md px-2 py-1 w-fit ${
                item.product.current_price < item.price
                  ? 'text-green-700 bg-green-50 dark:text-green-400 dark:bg-green-950'
                  : 'text-amber-700 bg-amber-50 dark:text-amber-400 dark:bg-amber-950'
              }`}>
                {item.product.current_price < item.price ? (
                  <>
                    <TrendingDown className="w-4 h-4 flex-shrink-0" />
                    <span>Fiyat düştü! Güncel: {formatPrice(item.product.current_price)}</span>
                  </>
                ) : (
                  <>
                    <TrendingUp className="w-4 h-4 flex-shrink-0" />
                    <span>Fiyat arttı. Güncel: {formatPrice(item.product.current_price)}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Price (Desktop) */}
          <div className="hidden sm:block text-right flex-shrink-0">
            <p className={`font-semibold ${isOutOfStock ? 'text-text-muted line-through' : 'text-primary'}`}>
              {formatPrice(itemTotal)}
            </p>
            {item.quantity > 1 && (
              <p className="text-xs text-text-muted">
                {formatPrice(item.price)} / adet
              </p>
            )}
          </div>
        </div>

        {/* Quantity & Actions */}
        <div className="flex items-center justify-between mt-3 gap-4">
          {/* Quantity Controls */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => handleQuantityChange(item.quantity - 1)}
              disabled={updating || item.quantity <= 1 || isOutOfStock}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Miktarı azalt"
            >
              <Minus className="w-4 h-4" />
            </button>
            
            <span className="w-10 text-center font-medium text-text-primary">
              {updating ? (
                <Loader2 className="w-4 h-4 animate-spin mx-auto" />
              ) : (
                item.quantity
              )}
            </span>
            
            <button
              onClick={() => handleQuantityChange(item.quantity + 1)}
              disabled={updating || item.quantity >= maxQuantity || isOutOfStock}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-border text-text-secondary hover:text-primary hover:border-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              aria-label="Miktarı artır"
              title={item.quantity >= maxQuantity ? `En fazla ${maxQuantity} adet` : undefined}
            >
              <Plus className="w-4 h-4" />
            </button>

            {/* Max stock indicator */}
            {!isOutOfStock && item.product?.stock_quantity != null && item.product.stock_quantity < 50 && (
              <span className="text-xs text-text-muted ml-1.5">
                (maks: {item.product.stock_quantity})
              </span>
            )}
          </div>

          {/* Price (Mobile) */}
          <div className="sm:hidden text-right">
            <p className={`font-semibold ${isOutOfStock ? 'text-text-muted line-through' : 'text-primary'}`}>
              {formatPrice(itemTotal)}
            </p>
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            disabled={removing}
            className="p-2 rounded-lg text-text-muted hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 disabled:opacity-50 transition-colors"
            aria-label="Sepetten kaldır"
          >
            {removing ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Trash2 className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-24 h-24 rounded-full bg-background-card flex items-center justify-center mb-6">
        <ShoppingCart className="w-12 h-12 text-text-muted" />
      </div>
      <h2 className="text-2xl font-bold text-text-primary mb-2">
        Sepetiniz Boş
      </h2>
      <p className="text-text-secondary mb-8 max-w-md">
        Henüz sepetinize ürün eklemediniz. Ürünlerimize göz atarak alışverişe başlayabilirsiniz.
      </p>
      <Link href="/urunler">
        <Button size="lg" className="gap-2">
          <ShoppingBag className="w-5 h-5" />
          Alışverişe Başla
        </Button>
      </Link>
    </div>
  )
}

function DiscountCodeInput({
  discountCode,
  onApply,
  onRemove,
}: {
  discountCode: string | null
  onApply: (code: string) => Promise<boolean>
  onRemove: () => void
}) {
  const [code, setCode] = useState('')
  const [applying, setApplying] = useState(false)
  const [codeError, setCodeError] = useState<string | null>(null)

  const handleApply = async () => {
    if (!code.trim() || applying) return
    setApplying(true)
    setCodeError(null)
    try {
      const success = await onApply(code.trim())
      if (success) {
        setCode('')
      } else {
        setCodeError('Geçersiz indirim kodu')
      }
    } catch {
      setCodeError('İndirim kodu uygulanamadı')
    } finally {
      setApplying(false)
    }
  }

  if (discountCode) {
    return (
      <div className="flex items-center justify-between bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400">
          <Tag className="w-4 h-4" />
          <span className="text-sm font-medium">{discountCode}</span>
          <span className="text-xs">uygulandı</span>
        </div>
        <button
          onClick={onRemove}
          className="p-1 text-green-600 hover:text-red-500 transition-colors"
          aria-label="İndirim kodunu kaldır"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex gap-2">
        <input
          type="text"
          value={code}
          onChange={(e) => { setCode(e.target.value.toUpperCase()); setCodeError(null) }}
          onKeyDown={(e) => e.key === 'Enter' && handleApply()}
          placeholder="İndirim kodu"
          className="flex-1 px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleApply}
          disabled={!code.trim() || applying}
          className="px-4"
        >
          {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Uygula'}
        </Button>
      </div>
      {codeError && (
        <p className="text-xs text-red-500 mt-1">{codeError}</p>
      )}
    </div>
  )
}

function CartSummary({
  subtotal,
  shipping_cost,
  discount_code,
  discount_amount,
  finalTotal,
  itemCount,
  hasOutOfStock,
  onApplyDiscount,
  onRemoveDiscount,
}: {
  subtotal: number
  shipping_cost: number
  discount_code: string | null
  discount_amount: number
  finalTotal: number
  itemCount: number
  hasOutOfStock: boolean
  onApplyDiscount: (code: string) => Promise<boolean>
  onRemoveDiscount: () => void
}) {
  return (
    <div className="bg-background-card rounded-xl border border-border p-6 sticky top-24">
      <h2 className="text-lg font-bold text-text-primary mb-4">
        Sipariş Özeti
      </h2>

      <div className="space-y-3 pb-4 border-b border-border">
        <div className="flex justify-between text-text-secondary">
          <span>Ürünler ({itemCount})</span>
          <span>{formatPrice(subtotal)}</span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-text-secondary">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4" />
            Kargo
          </span>
          {shipping_cost === 0 ? (
            <span className="text-green-600 font-medium">Ücretsiz</span>
          ) : (
            <span>{formatPrice(shipping_cost)}</span>
          )}
        </div>

        {/* Free shipping progress bar */}
        {shipping_cost > 0 && (
          <div className="mt-1">
            <div className="flex justify-between text-xs text-text-muted mb-1">
              <span>Ücretsiz kargoya {formatPrice(500 - subtotal)} kaldı</span>
              <span>500 ₺</span>
            </div>
            <div className="w-full bg-background-deep rounded-full h-1.5">
              <div
                className="bg-primary h-1.5 rounded-full transition-all"
                style={{ width: `${Math.min(100, (subtotal / 500) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {shipping_cost === 0 && (
          <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
            <Truck className="w-3.5 h-3.5" />
            500 ₺ üzeri siparişlerde kargo ücretsiz!
          </p>
        )}

        {/* Discount */}
        {discount_amount > 0 && (
          <div className="flex justify-between text-green-600 dark:text-green-400">
            <span>İndirim</span>
            <span>-{formatPrice(discount_amount)}</span>
          </div>
        )}
      </div>

      {/* Discount Code Input */}
      <div className="py-4 border-b border-border">
        <DiscountCodeInput
          discountCode={discount_code}
          onApply={onApplyDiscount}
          onRemove={onRemoveDiscount}
        />
      </div>

      <div className="flex justify-between items-center py-4 border-b border-border">
        <span className="text-lg font-bold text-text-primary">Toplam</span>
        <span className="text-xl font-bold text-primary">{formatPrice(finalTotal)}</span>
      </div>

      {/* Out of stock warning */}
      {hasOutOfStock && (
        <div className="mt-4 flex items-start gap-2 text-sm text-red-600 bg-red-50 dark:bg-red-950/50 dark:text-red-400 rounded-lg p-3">
          <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Sepetinizde stokta olmayan ürünler var. Ödemeye geçmek için lütfen bu ürünleri kaldırın.</span>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <Link href="/odeme" className={hasOutOfStock ? 'pointer-events-none' : 'block'}>
          <Button
            size="lg"
            className="w-full gap-2"
            disabled={hasOutOfStock}
          >
            Ödemeye Geç
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </Link>
        
        <Link href="/urunler" className="block">
          <Button variant="outline" size="lg" className="w-full gap-2">
            <ArrowLeft className="w-4 h-4" />
            Alışverişe Devam Et
          </Button>
        </Link>
      </div>

      <p className="text-xs text-text-muted text-center mt-4">
        Güvenli ödeme ile alışverişinizi tamamlayın
      </p>
    </div>
  )
}

export default function SepetPage() {
  const {
    items, itemCount, subtotal, finalTotal, shipping_cost,
    discount_code, discount_amount, loading, error,
    updateQuantity, removeFromCart, clearCart,
    applyDiscountCode, removeDiscountCode,
  } = useCart()
  const [clearing, setClearing] = useState(false)

  const hasOutOfStock = items.some(item => item.product?.out_of_stock === true)

  useEffect(() => {
    console.log('🛍️ Sepet Page - items:', items)
    console.log('🛍️ Sepet Page - loading:', loading)
    console.log('🛍️ Sepet Page - items length:', items?.length)
    console.log('🛍️ Sepet Page - subtotal:', subtotal, 'shipping:', shipping_cost, 'final:', finalTotal)
  }, [items, loading, subtotal, shipping_cost, finalTotal])

  const handleClearCart = async () => {
    if (clearing || items.length === 0) return
    
    if (!confirm('Sepetinizdeki tüm ürünleri silmek istediğinize emin misiniz?')) {
      return
    }

    setClearing(true)
    try {
      await clearCart()
    } finally {
      setClearing(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="container-main py-8">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="container-main py-8">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            Tekrar Dene
          </Button>
        </div>
      </div>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <div className="container-main py-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-8">
          Sepetim
        </h1>
        <EmptyCart />
      </div>
    )
  }

  return (
    <div className="container-main py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
          Sepetim
          <span className="text-lg font-normal text-text-muted ml-2">
            ({itemCount} ürün)
          </span>
        </h1>
        
        <button
          onClick={handleClearCart}
          disabled={clearing}
          className="text-sm text-text-muted hover:text-red-500 transition-colors flex items-center gap-1"
        >
          {clearing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
          Sepeti Temizle
        </button>
      </div>

      {/* Content */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <CartItemRow
              key={item.id}
              item={item}
              onUpdateQuantity={updateQuantity}
              onRemove={removeFromCart}
            />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <CartSummary
            subtotal={subtotal}
            shipping_cost={shipping_cost}
            discount_code={discount_code}
            discount_amount={discount_amount}
            finalTotal={finalTotal}
            itemCount={itemCount}
            hasOutOfStock={hasOutOfStock}
            onApplyDiscount={applyDiscountCode}
            onRemoveDiscount={removeDiscountCode}
          />
        </div>
      </div>
    </div>
  )
}
