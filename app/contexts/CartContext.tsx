'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthContext'

// Types
interface CartBrand {
  id: string
  name: string
  slug: string
}

interface CartVariantInfo {
  id: string
  variant_name: string
  variant_sku: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  attributes: any
}

interface CartProduct {
  id: string
  name: string
  slug: string
  primary_image?: string
  sku: string
  brand_id: string
  is_active: boolean
  current_price?: number | null
  cart_price: number
  currency: string
  price_changed?: boolean
  stock_quantity?: number | null
  low_stock_warning?: boolean
  out_of_stock?: boolean
  variant?: CartVariantInfo | null
  brands?: CartBrand
}

interface CartVariant {
  id: string
  variant_name: string
}

export interface CartItem {
  id: string
  cart_id: string
  product_id: string
  variant_id?: string | null
  quantity: number
  price: number
  created_at: string
  updated_at?: string
  product?: CartProduct
  variant?: CartVariant | null
}

interface Cart {
  id: string
  user_id: string | null
  session_id: string | null
  created_at: string
  updated_at: string
}

interface LocalCartItem {
  product_id: string
  variant_id: string | null
  quantity: number
  price: number
  product?: CartProduct
  variant?: CartVariant | null
}

interface CartContextType {
  items: CartItem[]
  itemCount: number
  total: number
  subtotal: number
  finalTotal: number
  shipping_cost: number
  discount_code: string | null
  discount_amount: number
  loading: boolean
  error: string | null
  addToCart: (productId: string, variantId?: string | null, quantity?: number) => Promise<void>
  removeFromCart: (itemId: string) => Promise<void>
  updateQuantity: (itemId: string, quantity: number) => Promise<void>
  clearCart: () => Promise<void>
  refreshCart: () => Promise<void>
  applyDiscountCode: (code: string) => Promise<boolean>
  removeDiscountCode: () => void
}

interface CartProviderProps {
  children: ReactNode
}

// Local Storage Keys
const LOCAL_CART_KEY = 'dental_market_cart'

// Free shipping threshold
const FREE_SHIPPING_THRESHOLD = 500
const SHIPPING_FEE = 50

// Context
const CartContext = createContext<CartContextType | undefined>(undefined)

// Provider
export function CartProvider({ children }: CartProviderProps) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [discountCode, setDiscountCode] = useState<string | null>(null)
  const [discountAmount, setDiscountAmount] = useState(0)
  
  // Memoize supabase client to prevent recreating on each render
  const supabase = useMemo(() => createClient(), [])

  // Calculate item count
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  // Calculate subtotal
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  }, [items])

  // Dynamic shipping calculation (500₺+ = free)
  const shipping_cost = useMemo(() => {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE
  }, [subtotal])

  // Final total
  const finalTotal = useMemo(() => {
    return Math.max(0, subtotal + shipping_cost - discountAmount)
  }, [subtotal, shipping_cost, discountAmount])

  // Legacy total (subtotal alias for backwards compat)
  const total = subtotal

  // Get local cart from localStorage
  const getLocalCart = useCallback((): LocalCartItem[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(LOCAL_CART_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      console.error('Error reading local cart')
      return []
    }
  }, [])

  // Save local cart to localStorage
  const saveLocalCart = useCallback((cartItems: LocalCartItem[]) => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(LOCAL_CART_KEY, JSON.stringify(cartItems))
    } catch {
      console.error('Error saving local cart')
    }
  }, [])

  // Clear local cart
  const clearLocalCart = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(LOCAL_CART_KEY)
  }, [])

  // Fetch product details (with offer price)
  const fetchProductDetails = useCallback(async (productId: string): Promise<CartProduct | null> => {
    try {
      const { data, error: fetchErr } = await supabase
        .from('catalog_products')
        .select('id, name, slug, primary_image, sku, brand_id, is_active, brands (id, name, slug)')
        .eq('id', productId)
        .single()

      if (fetchErr) throw fetchErr
      if (!data) return null

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const productData = data as any

      const { data: offerRaw } = await supabase
        .from('offers')
        .select('price, currency, stock_quantity')
        .eq('product_id', productId)
        .eq('is_active', true)
        .order('is_default', { ascending: false })
        .order('price', { ascending: true })
        .limit(1)
        .maybeSingle()

      const offer = offerRaw as { price: string | number; currency: string; stock_quantity: number | null } | null
      const offerPrice = offer?.price ? parseFloat(String(offer.price)) : 0
      const stockQty = offer?.stock_quantity ?? null

      return {
        id: productData.id,
        name: productData.name,
        slug: productData.slug,
        primary_image: productData.primary_image,
        sku: productData.sku || '',
        brand_id: productData.brand_id || '',
        is_active: productData.is_active ?? true,
        current_price: offerPrice,
        cart_price: offerPrice,
        currency: offer?.currency || 'TL',
        stock_quantity: stockQty,
        low_stock_warning: stockQty !== null && stockQty > 0 && stockQty <= 10,
        out_of_stock: stockQty !== null && stockQty <= 0,
        brands: productData.brands ?? undefined,
      }
    } catch {
      console.error('Error fetching product details')
      return null
    }
  }, [supabase])

  // Fetch variant details
  const fetchVariantDetails = useCallback(async (variantId: string): Promise<CartVariant | null> => {
    try {
      const { data, error } = await supabase
        .from('catalog_product_variants')
        .select('id, variant_name')
        .eq('id', variantId)
        .single()

      if (error) throw error
      return data
    } catch {
      console.error('Error fetching variant details')
      return null
    }
  }, [supabase])

  // Get or create cart for logged-in user
  const getOrCreateCart = useCallback(async (userId: string): Promise<Cart | null> => {
    try {
      const { data: existingCart, error: fetchError } = await supabase
        .from('cart')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle()

      if (fetchError) throw fetchError

      if (existingCart) {
        return existingCart as Cart
      }

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const cartTable = supabase.from('cart') as any
      const { data: newCart, error: createError } = await cartTable
        .insert({ user_id: userId, session_id: null })
        .select()
        .single()

      if (createError) throw createError
      return newCart as Cart
    } catch (err) {
      console.error('Error getting/creating cart:', err)
      return null
    }
  }, [supabase])

  // Load cart from Supabase for logged-in users
  const loadSupabaseCart = useCallback(async (userId: string) => {
    console.log('🛒 loadSupabaseCart started')
    console.log('👤 User ID:', userId)
    try {
      setLoading(true)
      setError(null)

      // Step 1: Get or create cart
      console.log('📦 Step 1: Getting or creating cart...')
      const cart = await getOrCreateCart(userId)
      console.log('📦 Cart data:', cart)

      if (!cart?.id) {
        console.error('❌ No cart data or cart ID')
        setItems([])
        return
      }

      // Step 2: Fetch cart items with variant support
      console.log('📦 Step 2: Fetching cart items for cart_id:', cart.id)
      const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`
          id,
          cart_id,
          product_id,
          variant_id,
          quantity,
          price,
          created_at,
          catalog_products (
            id,
            name,
            slug,
            primary_image,
            sku,
            brand_id,
            is_active,
            brands (
              id,
              name,
              slug
            )
          ),
          catalog_product_variants (
            id,
            variant_name,
            variant_sku,
            attributes
          )
        `)
        .eq('cart_id', cart.id)

      // Step 3: Log response
      console.log('📦 Step 3: Cart items response:', {
        itemsCount: cartItems?.length,
        error: cartError
      })

      if (cartError) {
        console.error('❌ Supabase error fetching cart items:', {
          message: cartError.message,
          code: cartError.code,
          details: cartError.details,
          hint: cartError.hint
        })
        throw cartError
      }

      // Step 4: Fetch current offer prices + stock info
      if (cartItems && cartItems.length > 0) {
        const productIds = cartItems.map((item: { product_id: string }) => item.product_id)

        console.log('💰 Step 4: Fetching current offers for products:', productIds)

        // Fetch offers (with variant support)
        const { data: currentOffers, error: offersError } = await supabase
          .from('offers')
          .select('product_id, variant_id, price, currency, stock_quantity')
          .in('product_id', productIds)
          .eq('is_active', true)
          .order('is_default', { ascending: false })
          .order('price', { ascending: true })

        console.log('💰 Current offers:', { offers: currentOffers, error: offersError })

        // Fetch inventory data
        const { data: inventoryData } = await supabase
          .from('inventory')
          .select('product_id, variant_id, quantity, reserved_quantity, low_stock_threshold')
          .in('product_id', productIds)

        console.log('📊 Inventory data:', inventoryData)

        // Build offer map (variant_id || product_id as key)
        const offerMap = new Map<string, { price: number; currency: string; stock_quantity: number | null }>()
        currentOffers?.forEach((offer: {
          product_id: string
          variant_id: string | null
          price: string | number
          currency: string
          stock_quantity: number | null
        }) => {
          const key = offer.variant_id || offer.product_id
          if (!offerMap.has(key)) {
            offerMap.set(key, {
              price: typeof offer.price === 'string' ? parseFloat(offer.price) : offer.price,
              currency: offer.currency || 'TL',
              stock_quantity: offer.stock_quantity,
            })
          }
        })

        // Build inventory map
        const inventoryMap = new Map<string, {
          quantity: number
          reserved_quantity: number
          low_stock_threshold: number
        }>()
        inventoryData?.forEach((inv: {
          product_id: string
          variant_id: string | null
          quantity: number
          reserved_quantity: number | null
          low_stock_threshold: number | null
        }) => {
          const key = inv.variant_id || inv.product_id
          inventoryMap.set(key, {
            quantity: inv.quantity,
            reserved_quantity: inv.reserved_quantity || 0,
            low_stock_threshold: inv.low_stock_threshold || 10,
          })
        })

        console.log('💰 Offer map:', Array.from(offerMap.entries()))
        console.log('📊 Inventory map:', Array.from(inventoryMap.entries()))

        // Step 5: Format items
        console.log('📦 Step 5: Formatting items...')

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const formattedItems: CartItem[] = (cartItems as any[]).map((item) => {
          const key = item.variant_id || item.product_id
          const currentOffer = offerMap.get(key)
          const inventory = inventoryMap.get(key)
          const cartPrice = typeof item.price === 'string' ? parseFloat(item.price) : item.price
          const currentPrice = currentOffer?.price ?? null

          // Calculate available stock
          const availableStock = inventory
            ? inventory.quantity - inventory.reserved_quantity
            : currentOffer?.stock_quantity ?? null

          const lowStockThreshold = inventory?.low_stock_threshold || 10

          return {
            id: item.id,
            cart_id: item.cart_id,
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: cartPrice,
            created_at: item.created_at,
            product: item.catalog_products ? {
              id: item.catalog_products.id,
              name: item.catalog_products.name,
              slug: item.catalog_products.slug,
              primary_image: item.catalog_products.primary_image,
              sku: item.catalog_products.sku || '',
              brand_id: item.catalog_products.brand_id || '',
              is_active: item.catalog_products.is_active ?? true,
              current_price: currentPrice,
              cart_price: cartPrice,
              currency: currentOffer?.currency || 'TL',
              price_changed: currentPrice !== null && currentPrice !== cartPrice,
              stock_quantity: availableStock,
              low_stock_warning: availableStock !== null && availableStock > 0 && availableStock <= lowStockThreshold,
              out_of_stock: availableStock !== null && availableStock <= 0,
              variant: item.catalog_product_variants || null,
              brands: item.catalog_products.brands ?? undefined,
            } : undefined,
            variant: null,
          }
        })

        console.log('✅ Formatted items with stock:', formattedItems)
        setItems(formattedItems)
      } else {
        console.log('⚠️ No cart items')
        setItems([])
      }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error('❌ Error loading Supabase cart:', {
        error: err,
        message: err?.message,
        code: err?.code,
        details: err?.details,
        hint: err?.hint,
        stack: err?.stack,
        name: err?.name
      })
      console.error('❌ Full error object:', JSON.stringify(err, null, 2))
      setError('Sepet yüklenirken bir hata oluştu: ' + (err?.message || 'Bilinmeyen hata'))
      setItems([])
    } finally {
      console.log('🏁 loadSupabaseCart completed')
      setLoading(false)
    }
  }, [supabase, getOrCreateCart])

  // Load cart from localStorage for anonymous users
  const loadLocalCart = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const localItems = getLocalCart()
      
      const itemsWithDetails: CartItem[] = await Promise.all(
        localItems.map(async (item, index) => {
          const product = await fetchProductDetails(item.product_id)
          const variant = item.variant_id ? await fetchVariantDetails(item.variant_id) : null

          return {
            id: `local_${index}_${item.product_id}`,
            cart_id: 'local',
            product_id: item.product_id,
            variant_id: item.variant_id,
            quantity: item.quantity,
            price: item.price,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            product: product || undefined,
            variant,
          }
        })
      )

      setItems(itemsWithDetails)
    } catch (err) {
      console.error('Error loading local cart:', err)
      setError('Sepet yüklenirken bir hata oluştu')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [getLocalCart, fetchProductDetails, fetchVariantDetails])

  // Migrate local cart to Supabase when user logs in
  const migrateLocalCartToSupabase = useCallback(async (userId: string) => {
    const localItems = getLocalCart()
    if (localItems.length === 0) return

    try {
      const cart = await getOrCreateCart(userId)
      if (!cart) return

      for (const item of localItems) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (supabase.from('cart_items') as any)
          .upsert({
            cart_id: cart.id,
            product_id: item.product_id,
            variant_id: item.variant_id ?? null,
            quantity: item.quantity,
            price: item.price,
          }, {
            onConflict: 'cart_id,product_id,variant_id',
          })
      }

      clearLocalCart()
    } catch (err) {
      console.error('Error migrating local cart:', err)
    }
  }, [supabase, getLocalCart, getOrCreateCart, clearLocalCart])

  // Add to cart with variant + stock support
  const addToCart = useCallback(async (
    productId: string,
    variantId?: string | null,
    quantity: number = 1
  ) => {
    try {
      setError(null)
      console.log('➕ addToCart started:', { productId, variantId, quantity, userId: user?.id })

      // Get offer (variant-aware)
      console.log('💰 Fetching product offer price...')
      let offerQuery = supabase
        .from('offers')
        .select('id, price, currency, stock_quantity, is_active')
        .eq('product_id', productId)
        .eq('is_active', true)

      if (variantId) {
        offerQuery = offerQuery.eq('variant_id', variantId)
      } else {
        offerQuery = offerQuery.is('variant_id', null)
      }

      const { data: offerRaw, error: offerError } = await offerQuery
        .order('is_default', { ascending: false })
        .order('price', { ascending: true })
        .limit(1)
        .maybeSingle()

      const offer = offerRaw as { id: string; price: string | number; currency: string; stock_quantity: number | null; is_active: boolean } | null
      console.log('💰 Offer result:', { offer, offerError })

      if (offerError) {
        console.error('❌ Offer fetch error:', offerError)
        throw new Error('Fiyat bilgisi alınamadı')
      }

      if (!offer || !offer.price) {
        console.error('❌ No active offer found for product')
        throw new Error('Ürün için aktif fiyat bulunamadı')
      }

      // Stock check from inventory
      console.log('📊 Checking inventory...')
      let inventoryQuery = supabase
        .from('inventory')
        .select('quantity, reserved_quantity')
        .eq('product_id', productId)

      if (variantId) {
        inventoryQuery = inventoryQuery.eq('variant_id', variantId)
      } else {
        inventoryQuery = inventoryQuery.is('variant_id', null)
      }

      const { data: inventoryRaw } = await inventoryQuery.maybeSingle()
      const inventory = inventoryRaw as { quantity: number; reserved_quantity: number | null } | null

      const availableStock = inventory
        ? inventory.quantity - (inventory.reserved_quantity || 0)
        : offer.stock_quantity ?? 999

      console.log('📊 Available stock:', availableStock)

      if (availableStock <= 0) {
        console.error('❌ Out of stock')
        throw new Error('Ürün stokta yok')
      }

      if (quantity > availableStock) {
        throw new Error(`Sadece ${availableStock} adet mevcut`)
      }

      const price = typeof offer.price === 'string' ? parseFloat(offer.price) : Number(offer.price)
      console.log('✅ Using offer price:', price, offer.currency || 'TL')

      if (user) {
        // Logged-in user: use Supabase
        console.log('📦 Getting or creating cart...')
        const cart = await getOrCreateCart(user.id)
        console.log('📦 Cart result:', cart)
        if (!cart) throw new Error('Sepet oluşturulamadı')

        // Check existing (variant_id aware)
        console.log('🔍 Checking existing cart item...')
        let existQuery = supabase
          .from('cart_items')
          .select('id, quantity')
          .eq('cart_id', cart.id)
          .eq('product_id', productId)
        
        if (variantId) {
          existQuery = existQuery.eq('variant_id', variantId)
        } else {
          existQuery = existQuery.is('variant_id', null)
        }
        
        const { data: existingItemData } = await existQuery.maybeSingle()
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const existingItem = existingItemData as { id: string; quantity: number } | null
        console.log('🔍 Existing item:', existingItem)

        if (existingItem) {
          const newQuantity = existingItem.quantity + quantity

          if (newQuantity > availableStock) {
            throw new Error(`En fazla ${availableStock} adet ekleyebilirsiniz`)
          }

          console.log('➕ Updating quantity...')
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { error: updateErr } = await (supabase.from('cart_items') as any)
            .update({
              quantity: newQuantity,
              price,
              updated_at: new Date().toISOString(),
            })
            .eq('id', existingItem.id)

          if (updateErr) {
            console.error('❌ Update error:', updateErr)
            throw new Error('Miktar güncellenemedi')
          }
        } else {
          console.log('➕ Inserting new cart item with price:', price)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: insertData, error: insertErr } = await (supabase.from('cart_items') as any)
            .insert({
              cart_id: cart.id,
              product_id: productId,
              variant_id: variantId ?? null,
              quantity,
              price,
            })
            .select()

          if (insertErr) {
            console.error('❌ Insert error:', {
              message: insertErr.message,
              code: insertErr.code,
              details: insertErr.details,
              hint: insertErr.hint
            })
            throw new Error('Ürün eklenemedi: ' + insertErr.message)
          }
          console.log('✅ Cart item created:', insertData)
        }

        console.log('🔄 Refreshing cart...')
        await loadSupabaseCart(user.id)
        console.log('✅ addToCart completed')
      } else {
        // Anonymous user: use localStorage
        const localItems = getLocalCart()
        const existingIndex = localItems.findIndex(
          item => item.product_id === productId && item.variant_id === (variantId || null)
        )

        if (existingIndex >= 0) {
          const newQty = localItems[existingIndex].quantity + quantity
          if (newQty > availableStock) {
            throw new Error(`En fazla ${availableStock} adet ekleyebilirsiniz`)
          }
          localItems[existingIndex].quantity = newQty
          localItems[existingIndex].price = price
        } else {
          localItems.push({
            product_id: productId,
            variant_id: variantId || null,
            quantity,
            price,
          })
        }

        saveLocalCart(localItems)
        await loadLocalCart()
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sepete eklenirken bir hata oluştu'
      console.error('💥 addToCart exception:', err)
      setError(message)
      throw err
    }
  }, [user, supabase, getOrCreateCart, loadSupabaseCart, getLocalCart, saveLocalCart, loadLocalCart])

  // Remove from cart
  const removeFromCart = useCallback(async (itemId: string) => {
    try {
      setError(null)

      if (user) {
        const { error: deleteError } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', itemId)

        if (deleteError) throw deleteError

        await loadSupabaseCart(user.id)
      } else {
        const localItems = getLocalCart()
        const itemIndex = items.findIndex(item => item.id === itemId)
        
        if (itemIndex >= 0) {
          const productId = items[itemIndex].product_id
          const variantId = items[itemIndex].variant_id
          
          const newLocalItems = localItems.filter(
            item => !(item.product_id === productId && item.variant_id === variantId)
          )
          
          saveLocalCart(newLocalItems)
          await loadLocalCart()
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ürün silinirken bir hata oluştu'
      setError(message)
      throw err
    }
  }, [user, supabase, items, loadSupabaseCart, getLocalCart, saveLocalCart, loadLocalCart])

  // Update quantity with stock check
  const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
    try {
      setError(null)

      if (quantity <= 0) {
        await removeFromCart(itemId)
        return
      }

      // Find current item for stock check
      const item = items.find(i => i.id === itemId)
      if (item?.product?.stock_quantity != null && quantity > item.product.stock_quantity) {
        setError(`En fazla ${item.product.stock_quantity} adet sipariş verebilirsiniz`)
        return
      }

      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: updateError } = await (supabase.from('cart_items') as any)
          .update({
            quantity,
            updated_at: new Date().toISOString(),
          })
          .eq('id', itemId)

        if (updateError) throw updateError

        await loadSupabaseCart(user.id)
      } else {
        const localItems = getLocalCart()
        const itemIndex = items.findIndex(i => i.id === itemId)
        
        if (itemIndex >= 0) {
          const productId = items[itemIndex].product_id
          const variantId = items[itemIndex].variant_id
          
          const localIndex = localItems.findIndex(
            li => li.product_id === productId && li.variant_id === variantId
          )
          
          if (localIndex >= 0) {
            localItems[localIndex].quantity = quantity
            saveLocalCart(localItems)
            await loadLocalCart()
          }
        }
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Miktar güncellenirken bir hata oluştu'
      setError(message)
      throw err
    }
  }, [user, supabase, items, removeFromCart, loadSupabaseCart, getLocalCart, saveLocalCart, loadLocalCart])

  // Clear cart
  const clearCart = useCallback(async () => {
    try {
      setError(null)

      if (user) {
        const cart = await getOrCreateCart(user.id)
        if (cart) {
          const { error: deleteError } = await supabase
            .from('cart_items')
            .delete()
            .eq('cart_id', cart.id)

          if (deleteError) throw deleteError
        }

        setItems([])
      } else {
        clearLocalCart()
        setItems([])
      }

      // Clear discount on cart clear
      setDiscountCode(null)
      setDiscountAmount(0)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sepet temizlenirken bir hata oluştu'
      setError(message)
      throw err
    }
  }, [user, supabase, getOrCreateCart, clearLocalCart])

  // Refresh cart
  const refreshCart = useCallback(async () => {
    if (user) {
      await loadSupabaseCart(user.id)
    } else {
      await loadLocalCart()
    }
  }, [user, loadSupabaseCart, loadLocalCart])

  // Apply discount code
  const applyDiscountCode = useCallback(async (code: string): Promise<boolean> => {
    try {
      // TODO: Check from discount_codes table in Supabase
      // For now, hardcoded discount codes
      const upperCode = code.toUpperCase().trim()

      if (upperCode === 'WELCOME10') {
        setDiscountCode(upperCode)
        setDiscountAmount(subtotal * 0.1)
        return true
      } else if (upperCode === 'DENTAL20') {
        setDiscountCode(upperCode)
        setDiscountAmount(subtotal * 0.2)
        return true
      } else {
        setError('Geçersiz indirim kodu')
        return false
      }
    } catch {
      setError('İndirim kodu uygulanamadı')
      return false
    }
  }, [subtotal])

  // Remove discount code
  const removeDiscountCode = useCallback(() => {
    setDiscountCode(null)
    setDiscountAmount(0)
  }, [])

  // Recalculate discount when subtotal changes
  useEffect(() => {
    if (discountCode) {
      const upperCode = discountCode.toUpperCase()
      if (upperCode === 'WELCOME10') {
        setDiscountAmount(subtotal * 0.1)
      } else if (upperCode === 'DENTAL20') {
        setDiscountAmount(subtotal * 0.2)
      }
    }
  }, [subtotal, discountCode])

  // Load cart when user changes
  useEffect(() => {
    if (authLoading) return

    if (user) {
      migrateLocalCartToSupabase(user.id).then(() => {
        loadSupabaseCart(user.id)
      })
    } else {
      loadLocalCart()
    }
  }, [user, authLoading, migrateLocalCartToSupabase, loadSupabaseCart, loadLocalCart])

  const value: CartContextType = {
    items,
    itemCount,
    total,
    subtotal,
    finalTotal,
    shipping_cost,
    discount_code: discountCode,
    discount_amount: discountAmount,
    loading,
    error,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    refreshCart,
    applyDiscountCode,
    removeDiscountCode,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}

// Hook
export function useCart(): CartContextType {
  const context = useContext(CartContext)
  
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  
  return context
}

export default CartContext
