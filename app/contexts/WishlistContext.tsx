'use client'

import { createContext, useContext, useEffect, useState, useCallback, ReactNode, useMemo } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from './AuthContext'
import { toast } from 'sonner'
import type { ProductWithRelations } from '@/types/catalog.types'

// Types
export interface WishlistItem {
  id: string
  user_id: string
  product_id: string
  created_at: string
  product?: ProductWithRelations
}

interface WishlistContextType {
  items: WishlistItem[]
  itemCount: number
  loading: boolean
  error: string | null
  isInWishlist: (productId: string) => boolean
  addToWishlist: (productId: string) => Promise<void>
  removeFromWishlist: (productId: string) => Promise<void>
  toggleWishlist: (productId: string) => Promise<void>
  refreshWishlist: () => Promise<void>
}

interface WishlistProviderProps {
  children: ReactNode
}

// Local Storage Key
const LOCAL_WISHLIST_KEY = 'dental_market_wishlist'

// Context
const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

// Provider
export function WishlistProvider({ children }: WishlistProviderProps) {
  const { user, loading: authLoading } = useAuth()
  const [items, setItems] = useState<WishlistItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = useMemo(() => createClient(), [])

  // Calculate item count
  const itemCount = items.length

  // Get local wishlist from localStorage
  const getLocalWishlist = useCallback((): string[] => {
    if (typeof window === 'undefined') return []
    
    try {
      const stored = localStorage.getItem(LOCAL_WISHLIST_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      console.error('Error reading local wishlist')
      return []
    }
  }, [])

  // Save local wishlist to localStorage
  const saveLocalWishlist = useCallback((productIds: string[]) => {
    if (typeof window === 'undefined') return
    
    try {
      localStorage.setItem(LOCAL_WISHLIST_KEY, JSON.stringify(productIds))
    } catch {
      console.error('Error saving local wishlist')
    }
  }, [])

  // Clear local wishlist
  const clearLocalWishlist = useCallback(() => {
    if (typeof window === 'undefined') return
    localStorage.removeItem(LOCAL_WISHLIST_KEY)
  }, [])

  // Fetch wishlist from Supabase
  const fetchWishlist = useCallback(async () => {
    if (authLoading) return

    setLoading(true)
    setError(null)

    try {
      if (user) {
        // Logged in user - fetch from Supabase
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data, error: fetchError } = await (supabase as any)
          .from('wishlist')
          .select(`
            id,
            user_id,
            product_id,
            created_at,
            product:catalog_products (
              id,
              name,
              slug,
              short_description,
              primary_image,
              sku,
              is_active,
              brand_id,
              primary_category_id,
              brand:brands (
                id,
                name,
                slug
              ),
              category:categories!catalog_products_primary_category_id_fkey (
                id,
                name,
                slug
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (fetchError) {
          // Tablo yoksa - localStorage kullan
          if (fetchError.message?.includes('does not exist')) {
            console.log('Wishlist table does not exist, using localStorage fallback')
            const localProductIds = getLocalWishlist()
            if (localProductIds.length > 0) {
              const mockItems: WishlistItem[] = localProductIds.map((productId, index) => ({
                id: `local-${index}`,
                user_id: user.id,
                product_id: productId,
                created_at: new Date().toISOString(),
              }))
              setItems(mockItems)
            } else {
              setItems([])
            }
          } 
          // RLS policy hatası
          else if (fetchError.code === '42501' || fetchError.message?.includes('policy')) {
            console.warn('Wishlist RLS policy error:', fetchError.message)
            // RLS hatası durumunda localStorage'a düş
            const localProductIds = getLocalWishlist()
            const mockItems: WishlistItem[] = localProductIds.map((productId, index) => ({
              id: `local-${index}`,
              user_id: user.id,
              product_id: productId,
              created_at: new Date().toISOString(),
            }))
            setItems(mockItems)
            // Kullanıcıya hata gösterme, sessizce devam et
          }
          // Diğer hatalar
          else {
            console.error('Wishlist fetch error:', {
              message: fetchError.message,
              details: fetchError.details,
              hint: fetchError.hint,
              code: fetchError.code
            })
            // Kritik olmayan hatalar için localStorage'a düş
            const localProductIds = getLocalWishlist()
            if (localProductIds.length > 0) {
              const mockItems: WishlistItem[] = localProductIds.map((productId, index) => ({
                id: `local-${index}`,
                user_id: user.id,
                product_id: productId,
                created_at: new Date().toISOString(),
              }))
              setItems(mockItems)
            } else {
              setItems([])
            }
          }
        } else {
          // Merge local wishlist to Supabase on first load
          const localProductIds = getLocalWishlist()
          if (localProductIds.length > 0) {
            const existingProductIds = data?.map((item: WishlistItem) => item.product_id) || []
            const newProductIds = localProductIds.filter(id => !existingProductIds.includes(id))
            
            if (newProductIds.length > 0) {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              await (supabase as any)
                .from('wishlist')
                .insert(newProductIds.map(productId => ({
                  user_id: user.id,
                  product_id: productId,
                })))
              
              // Refresh after merge
              clearLocalWishlist()
              fetchWishlist()
              return
            }
            clearLocalWishlist()
          }
          
          setItems(data || [])
        }
      } else {
        // Guest user - use localStorage (hata atmadan)
        const localProductIds = getLocalWishlist()
        if (localProductIds.length > 0) {
          // Fetch product details for local items
          try {
            const { data: products, error: productError } = await supabase
              .from('catalog_products')
              .select(`
                id,
                name,
                slug,
                short_description,
                primary_image,
                sku,
                is_active,
                brand_id,
                primary_category_id,
                brand:brands (
                  id,
                  name,
                  slug
                ),
                category:categories!catalog_products_primary_category_id_fkey (
                  id,
                  name,
                  slug
                )
              `)
              .in('id', localProductIds)

            if (productError) {
              console.warn('Error fetching product details for wishlist:', productError.message)
            }

            const mockItems: WishlistItem[] = localProductIds.map((productId, index) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const product = products?.find((p: any) => p.id === productId)
              return {
                id: `local-${index}`,
                user_id: 'guest',
                product_id: productId,
                created_at: new Date().toISOString(),
                product: product || undefined,
              }
            })
            setItems(mockItems)
          } catch (productFetchErr) {
            console.warn('Failed to fetch product details:', productFetchErr)
            // Ürün detayları olmadan sadece ID'leri göster
            const mockItems: WishlistItem[] = localProductIds.map((productId, index) => ({
              id: `local-${index}`,
              user_id: 'guest',
              product_id: productId,
              created_at: new Date().toISOString(),
            }))
            setItems(mockItems)
          }
        } else {
          setItems([])
        }
      }
    } catch (err) {
      // Sadece beklenmedik kritik hatalar için error state kullan
      const errorMessage = err instanceof Error ? err.message : (typeof err === 'object' && err !== null ? JSON.stringify(err) : String(err))
      console.error('Wishlist fetch error:', errorMessage, {
        user: user?.id || 'guest'
      })
      
      // User yoksa veya auth hatası varsa, error gösterme
      if (!user) {
        setItems([])
        setError(null)
      } else {
        // Kritik hata - kullanıcıya bildir ama localStorage'a düş
        const localProductIds = getLocalWishlist()
        if (localProductIds.length > 0) {
          const mockItems: WishlistItem[] = localProductIds.map((productId, index) => ({
            id: `local-${index}`,
            user_id: user.id,
            product_id: productId,
            created_at: new Date().toISOString(),
          }))
          setItems(mockItems)
        } else {
          setItems([])
        }
        // Sadece network hatası gibi kritik durumlarda hata göster
        if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
          setError('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.')
        }
      }
    } finally {
      setLoading(false)
    }
  }, [user, authLoading, supabase, getLocalWishlist, clearLocalWishlist])

  // Initial load
  useEffect(() => {
    fetchWishlist()
  }, [fetchWishlist])

  // Check if product is in wishlist
  const isInWishlist = useCallback((productId: string): boolean => {
    return items.some(item => item.product_id === productId)
  }, [items])

  // Add to wishlist
  const addToWishlist = useCallback(async (productId: string) => {
    // 1. Önce local state'de kontrol et
    if (isInWishlist(productId)) {
      toast.info('Bu ürün zaten favorilerinizde')
      return
    }

    // 2. User yoksa toast göster ve return
    if (!user) {
      // Guest - save to localStorage
      const localIds = getLocalWishlist()
      if (localIds.includes(productId)) {
        toast.info('Bu ürün zaten favorilerinizde')
        return
      }
      saveLocalWishlist([...localIds, productId])
      await fetchWishlist()
      return
    }

    try {
      // 3. Supabase'de de kontrol et (state senkronizasyon sorunu için)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { data: existing } = await (supabase as any)
        .from('wishlist')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', productId)
        .maybeSingle()

      if (existing) {
        toast.info('Bu ürün zaten favorilerinizde')
        return
      }

      // 4. Insert yap
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { error: insertError } = await (supabase as any)
        .from('wishlist')
        .insert({
          user_id: user.id,
          product_id: productId,
        })

      if (insertError) {
        // 5. Duplicate key error handle (23505)
        if (insertError.code === '23505') {
          toast.info('Ürün zaten favorilerde')
          await fetchWishlist() // State'i senkronize et
          return
        }

        // RLS policy hatası kontrolü
        if (insertError.code === '42501' || insertError.message?.includes('policy')) {
          console.warn('Wishlist RLS policy error on insert:', {
            message: insertError.message,
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code,
          })
          // RLS hatası - localStorage'a düş
          const localIds = getLocalWishlist()
          if (!localIds.includes(productId)) {
            saveLocalWishlist([...localIds, productId])
          }
        } else if (insertError.message?.includes('does not exist')) {
          // Tablo yoksa localStorage'a düş
          const localIds = getLocalWishlist()
          if (!localIds.includes(productId)) {
            saveLocalWishlist([...localIds, productId])
          }
        } else {
          // Diğer Supabase hataları
          console.error('Error adding to wishlist:', insertError.message || JSON.stringify(insertError), {
            details: insertError.details,
            hint: insertError.hint,
            code: insertError.code,
          })
          throw insertError
        }
      }

      await fetchWishlist()
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : (typeof err === 'object' && err !== null ? JSON.stringify(err) : String(err))
      console.error('Error adding to wishlist:', errMsg)
      toast.error('Favorilere eklenirken bir hata oluştu')
      throw err
    }
  }, [user, supabase, isInWishlist, getLocalWishlist, saveLocalWishlist, fetchWishlist])

  // Remove from wishlist
  const removeFromWishlist = useCallback(async (productId: string) => {
    try {
      if (user) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error: deleteError } = await (supabase as any)
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId)

        if (deleteError && !deleteError.message?.includes('does not exist')) {
          throw deleteError
        }

        // Fallback to localStorage if table doesn't exist
        if (deleteError?.message?.includes('does not exist')) {
          const localIds = getLocalWishlist()
          saveLocalWishlist(localIds.filter(id => id !== productId))
        }
      } else {
        // Guest - remove from localStorage
        const localIds = getLocalWishlist()
        saveLocalWishlist(localIds.filter(id => id !== productId))
      }

      // Update local state immediately
      setItems(prev => prev.filter(item => item.product_id !== productId))
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : (typeof err === 'object' && err !== null ? JSON.stringify(err) : String(err))
      console.error('Error removing from wishlist:', errMsg)
      throw err
    }
  }, [user, supabase, getLocalWishlist, saveLocalWishlist])

  // Toggle wishlist
  const toggleWishlist = useCallback(async (productId: string) => {
    if (isInWishlist(productId)) {
      await removeFromWishlist(productId)
    } else {
      await addToWishlist(productId)
    }
  }, [isInWishlist, addToWishlist, removeFromWishlist])

  // Refresh wishlist
  const refreshWishlist = useCallback(async () => {
    await fetchWishlist()
  }, [fetchWishlist])

  const value: WishlistContextType = {
    items,
    itemCount,
    loading,
    error,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    refreshWishlist,
  }

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  )
}

// Hook
export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider')
  }
  return context
}
