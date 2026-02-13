'use client'

import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/app/contexts/AuthContext'

const FAVORITES_KEY_PREFIX = 'favorites_'

export function useFavorites() {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  // Favorileri localStorage'dan yükle
  useEffect(() => {
    if (typeof window === 'undefined') return

    const loadFavorites = () => {
      const key = user ? `${FAVORITES_KEY_PREFIX}${user.id}` : `${FAVORITES_KEY_PREFIX}guest`
      const stored = localStorage.getItem(key)
      setFavorites(stored ? JSON.parse(stored) : [])
      setLoading(false)
    }

    loadFavorites()
  }, [user])

  // Favorileri kaydet
  const saveFavorites = useCallback((newFavorites: string[]) => {
    if (typeof window === 'undefined') return

    const key = user ? `${FAVORITES_KEY_PREFIX}${user.id}` : `${FAVORITES_KEY_PREFIX}guest`
    localStorage.setItem(key, JSON.stringify(newFavorites))
    setFavorites(newFavorites)
  }, [user])

  // Favori mi kontrol et
  const isFavorite = useCallback((productId: string) => {
    return favorites.includes(productId)
  }, [favorites])

  // Favoriye ekle
  const addToFavorites = useCallback((productId: string) => {
    if (!favorites.includes(productId)) {
      saveFavorites([...favorites, productId])
      return true
    }
    return false
  }, [favorites, saveFavorites])

  // Favoriden kaldır
  const removeFromFavorites = useCallback((productId: string) => {
    saveFavorites(favorites.filter(id => id !== productId))
  }, [favorites, saveFavorites])

  // Toggle favori
  const toggleFavorite = useCallback((productId: string) => {
    if (favorites.includes(productId)) {
      removeFromFavorites(productId)
      return false
    } else {
      addToFavorites(productId)
      return true
    }
  }, [favorites, addToFavorites, removeFromFavorites])

  // Tümünü temizle
  const clearFavorites = useCallback(() => {
    saveFavorites([])
  }, [saveFavorites])

  return {
    favorites,
    loading,
    isFavorite,
    addToFavorites,
    removeFromFavorites,
    toggleFavorite,
    clearFavorites,
    count: favorites.length,
  }
}
