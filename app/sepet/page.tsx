'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ShoppingCart, Trash2, Plus, Minus, ArrowLeft, ShoppingBag,
  Loader2, TrendingDown, TrendingUp, AlertTriangle, XCircle,
  Tag, Truck, X, ChevronDown, Home, Package, LayoutGrid, Tags, Sparkles
} from 'lucide-react'
import { useAuth } from '@/app/contexts/AuthContext'
import { useCart, CartItem } from '@/app/contexts/CartContext'
import { Button } from '@/components/ui/button'
import { formatPrice } from '@/lib/utils/format'
import { getImageUrl } from '@/lib/utils/imageHelper'
import { FREE_SHIPPING_PROGRESS_THRESHOLD_TRY } from '@/lib/config/storefront'

function CartItemRow({ item, onUpdateQuantity, onRemove }: {
  item: CartItem
  onUpdateQuantity: (itemId: string, quantity: number) => Promise<void>
  onRemove: (itemId: string) => Promise<void>
}) {
  const { user, loading: authLoading } = useAuth()
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
    <div className={`rounded-[1.5rem] border bg-white p-4 shadow-storefront transition-colors sm:p-5 ${
      isOutOfStock
        ? 'border-red-200 bg-red-50/60'
        : 'border-slate-200 hover:border-primary/20'
    }`}>
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 sm:h-28 sm:w-28">
          <Image
            src={getImageUrl(item.product?.primary_image)}
            alt={item.product?.name || 'Ürün'}
            fill
            className={`object-contain p-2.5 ${isOutOfStock ? 'opacity-50 grayscale' : ''}`}
          />
          {isOutOfStock && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20">
              <XCircle className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 space-y-1.5">
              <Link
                href={`/urunler/${item.product?.slug || item.product_id}`}
                className="line-clamp-2 text-base font-semibold text-slate-900 transition-colors hover:text-primary"
              >
                {item.product?.name || 'Ürün'}
              </Link>

              {item.product?.variant && (
                <p className="text-sm text-slate-600">
                  Varyant: {item.product.variant.variant_name}
                  {item.product.variant.variant_sku && (
                    <span className="ml-2 text-xs text-slate-500">({item.product.variant.variant_sku})</span>
                  )}
                </p>
              )}

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                {item.product?.brands?.name && <p>Marka: {item.product.brands.name}</p>}
                {item.product?.sku && <p>SKU: {item.product.sku}</p>}
              </div>

              {isOutOfStock && (
                <div className="mt-2 flex w-fit items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm text-red-700">
                  <XCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Bu ürün stokta yok. Lütfen sepetinizden kaldırın.</span>
                </div>
              )}

              {!isOutOfStock && isLowStock && item.product?.stock_quantity != null && (
                <div className="mt-2 flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm text-amber-700">
                  <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                  <span>Son {item.product.stock_quantity} adet kaldı!</span>
                </div>
              )}

              {user && item.product?.price_changed && item.product?.current_price != null && (
                <div className={`mt-2 flex w-fit items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm ${
                  item.product.current_price < item.price
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : 'border-amber-200 bg-amber-50 text-amber-700'
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

            <div className="hidden shrink-0 text-right sm:block">
              {authLoading ? (
                <div className="h-6 w-20 animate-pulse rounded bg-muted" />
              ) : !user ? (
                <span className="text-xs font-semibold text-primary">Fiyat için giriş yapın</span>
              ) : (
                <>
                  <p className={`text-lg font-semibold ${isOutOfStock ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {formatPrice(itemTotal)}
                  </p>
                  {item.quantity > 1 && (
                    <p className="text-xs text-slate-500">
                      {formatPrice(item.price)} / adet
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 p-1">
                <button
                  onClick={() => handleQuantityChange(item.quantity - 1)}
                  disabled={updating || item.quantity <= 1 || isOutOfStock}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Miktarı azalt"
                >
                  <Minus className="w-4 h-4" />
                </button>

                <span className="w-12 text-center text-sm font-semibold text-slate-900">
                  {updating ? (
                    <Loader2 className="w-4 h-4 animate-spin mx-auto" />
                  ) : (
                    item.quantity
                  )}
                </span>

                <button
                  onClick={() => handleQuantityChange(item.quantity + 1)}
                  disabled={updating || item.quantity >= maxQuantity || isOutOfStock}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-600 transition-colors hover:bg-white hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                  aria-label="Miktarı artır"
                  title={item.quantity >= maxQuantity ? `En fazla ${maxQuantity} adet` : undefined}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {!isOutOfStock && item.product?.stock_quantity != null && item.product.stock_quantity < 50 && (
                <span className="text-xs text-slate-500">
                  Maksimum {item.product.stock_quantity} adet
                </span>
              )}
            </div>

            <div className="flex items-center justify-between gap-3 sm:justify-end">
              <div className="sm:hidden text-right">
                {authLoading ? (
                  <div className="h-6 w-20 animate-pulse rounded bg-muted" />
                ) : !user ? (
                  <span className="text-xs font-semibold text-primary">Giriş yapın</span>
                ) : (
                  <p className={`text-base font-semibold ${isOutOfStock ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                    {formatPrice(itemTotal)}
                  </p>
                )}
              </div>

              <button
                onClick={handleRemove}
                disabled={removing}
                className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                aria-label="Sepetten kaldır"
              >
                {removing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Kaldır
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function QuickNavDropdown() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const links = [
    { href: '/', label: 'Anasayfa', icon: Home },
    { href: '/urunler', label: 'Tüm Ürünler', icon: Package },
    { href: '/kategoriler', label: 'Kategoriler', icon: LayoutGrid },
    { href: '/markalar', label: 'Markalar', icon: Tags },
    { href: '/kampanyalar', label: 'Kampanyalar', icon: Sparkles },
  ]

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:border-primary/30 hover:text-primary"
      >
        Hızlı Menü
        <ChevronDown className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-white py-1.5 shadow-[0_24px_60px_rgba(15,23,42,0.18)] ring-1 ring-slate-950/5 animate-fade-in">
          {links.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="mx-1.5 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-700 transition-colors hover:bg-primary/5 hover:text-primary"
            >
              <Icon className="w-4 h-4 text-slate-500" />
              {label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function EmptyCart() {
  return (
    <div className="rounded-[1.75rem] border border-slate-200 bg-white px-6 py-14 text-center shadow-storefront">
      <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/[0.06] text-primary">
        <ShoppingCart className="w-12 h-12" />
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-2">
        Sepetiniz Boş
      </h2>
      <p className="mx-auto mb-8 max-w-md text-sm leading-7 text-slate-600 sm:text-base">
        Henüz sepetinize ürün eklemediniz. Ürünlerimize göz atarak alışverişe başlayabilirsiniz.
      </p>
      <Link href="/urunler">
        <Button size="lg" className="gap-2 rounded-full px-8">
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
      <div className="flex items-center justify-between rounded-xl border border-green-200 bg-green-50 px-3 py-2">
        <div className="flex items-center gap-2 text-green-700">
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
          className="flex-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/15"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={handleApply}
          disabled={!code.trim() || applying}
          className="rounded-xl px-4"
        >
          {applying ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Uygula'}
        </Button>
      </div>
      {codeError && (
        <p className="mt-1 text-xs text-red-500">{codeError}</p>
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
  const { user, loading: authLoading } = useAuth()
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_PROGRESS_THRESHOLD_TRY - subtotal)

  return (
    <div className="sticky top-28 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-storefront">
      <h2 className="mb-4 text-lg font-bold text-slate-900">
        Sipariş Özeti
      </h2>

      <div className="space-y-3 border-b border-slate-200 pb-4">
        <div className="flex justify-between text-sm text-slate-600">
          <span>Ürünler ({itemCount})</span>
          {authLoading ? (
            <div className="h-5 w-20 animate-pulse rounded bg-muted" />
          ) : !user ? (
            <span className="text-xs font-semibold text-primary">Fiyat için giriş yapın</span>
          ) : (
            <span>{formatPrice(subtotal)}</span>
          )}
        </div>

        {/* Shipping */}
        <div className="flex justify-between text-sm text-slate-600">
          <span className="flex items-center gap-1.5">
            <Truck className="w-4 h-4" />
            Kargo
          </span>
          {authLoading ? (
            <div className="h-5 w-16 animate-pulse rounded bg-muted" />
          ) : !user ? (
            <span className="text-xs font-semibold text-primary">Giriş yapın</span>
          ) : shipping_cost === 0 ? (
            <span className="text-green-600 font-medium">Ücretsiz</span>
          ) : (
            <span>{formatPrice(shipping_cost)}</span>
          )}
        </div>

        {/* Free shipping progress bar */}
        {user && shipping_cost > 0 && (
          <div className="mt-1">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>Ücretsiz kargoya {formatPrice(remainingForFreeShipping)} kaldı</span>
              <span>{FREE_SHIPPING_PROGRESS_THRESHOLD_TRY} ₺</span>
            </div>
            <div className="h-1.5 w-full rounded-full bg-slate-100">
              <div
                className="h-1.5 rounded-full bg-primary transition-all"
                style={{ width: `${Math.min(100, (subtotal / FREE_SHIPPING_PROGRESS_THRESHOLD_TRY) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {user && shipping_cost === 0 && (
          <p className="flex items-center gap-1 text-xs text-green-600">
            <Truck className="w-3.5 h-3.5" />
            {FREE_SHIPPING_PROGRESS_THRESHOLD_TRY} ₺ üzeri siparişlerde kargo ücretsiz!
          </p>
        )}

        {/* Discount */}
        {user && discount_amount > 0 && (
          <div className="flex justify-between text-sm text-green-600">
            <span>İndirim</span>
            <span>-{formatPrice(discount_amount)}</span>
          </div>
        )}
      </div>

      {/* Discount Code Input */}
      <div className="border-b border-slate-200 py-4">
        <DiscountCodeInput
          discountCode={discount_code}
          onApply={onApplyDiscount}
          onRemove={onRemoveDiscount}
        />
      </div>

      <div className="flex items-center justify-between border-b border-slate-200 py-4">
        <span className="text-lg font-bold text-slate-900">Toplam</span>
        {authLoading ? (
          <div className="h-7 w-24 animate-pulse rounded bg-muted" />
        ) : !user ? (
          <span className="text-sm font-semibold text-primary">Fiyat için giriş yapın</span>
        ) : (
          <span className="text-xl font-bold text-slate-900">{formatPrice(finalTotal)}</span>
        )}
      </div>

      {/* Out of stock warning */}
      {hasOutOfStock && (
        <div className="mt-4 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          <XCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>Sepetinizde stokta olmayan ürünler var. Ödemeye geçmek için lütfen bu ürünleri kaldırın.</span>
        </div>
      )}

      <div className="mt-6 space-y-3">
        <Link href="/odeme" className={hasOutOfStock ? 'pointer-events-none' : 'block'}>
          <Button
            size="lg"
            className="w-full gap-2 rounded-xl"
            disabled={hasOutOfStock}
          >
            Ödemeye Geç
            <ArrowLeft className="w-4 h-4 rotate-180" />
          </Button>
        </Link>
        
        <Link href="/urunler" className="block">
          <Button variant="outline" size="lg" className="w-full gap-2 rounded-xl border-slate-200 text-slate-700 hover:border-primary/20 hover:bg-primary/[0.04] hover:text-primary">
            <ArrowLeft className="w-4 h-4" />
            Alışverişe Devam Et
          </Button>
        </Link>
      </div>

      <p className="mt-4 text-center text-xs text-slate-500">
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
      <section className="pb-10 pt-4 sm:pt-6 lg:pt-8">
        <div className="container-main">
          <div className="flex items-center justify-center rounded-[1.75rem] border border-slate-200 bg-white py-20 shadow-storefront">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="pb-10 pt-4 sm:pt-6 lg:pt-8">
        <div className="container-main">
          <div className="flex flex-col items-center justify-center rounded-[1.75rem] border border-slate-200 bg-white py-16 text-center shadow-storefront">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>
              Tekrar Dene
            </Button>
          </div>
        </div>
      </section>
    )
  }

  // Empty cart
  if (items.length === 0) {
    return (
      <section className="pb-10 pt-4 sm:pt-6 lg:pt-8">
        <div className="container-main space-y-6">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-5 shadow-storefront sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sepet</p>
                <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">Sepetim</h1>
                <p className="mt-2 text-sm text-slate-600">Ürün eklediğinizde sipariş özetiniz burada görüntülenecek.</p>
              </div>
              <QuickNavDropdown />
            </div>
          </div>
          <EmptyCart />
        </div>
      </section>
    )
  }

  return (
    <section className="pb-10 pt-4 sm:pt-6 lg:pt-8">
      <div className="container-main space-y-6 lg:space-y-8">
        <div className="rounded-[1.75rem] border border-slate-200 bg-white px-5 py-5 shadow-storefront sm:px-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Sepet</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl">
                Sepetim
                <span className="ml-2 text-lg font-normal text-slate-500">
                  ({itemCount} ürün)
                </span>
              </h1>
              <p className="mt-2 max-w-2xl text-sm text-slate-600">
                Ürünlerinizi gözden geçirip teslimat ve ödeme adımına güvenle devam edin.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <QuickNavDropdown />
              <button
                onClick={handleClearCart}
                disabled={clearing}
                className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
              >
                {clearing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                Sepeti Temizle
              </button>
            </div>
          </div>
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.85fr)_minmax(320px,0.95fr)] xl:gap-8">
          <div className="space-y-4">
            {items.map((item) => (
              <CartItemRow
                key={item.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          <div>
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
    </section>
  )
}
