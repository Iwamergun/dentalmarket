'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js'

// Types
interface AuthContextType {
  user: User | null
  loading: boolean
}

interface AuthProviderProps {
  children: ReactNode
}

// Context
const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Provider
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getInitialUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        
        if (error) {
          // "Auth session missing!" is expected for logged-out users, not an error
          if (error.message === 'Auth session missing!' || error.name === 'AuthSessionMissingError') {
            setUser(null)
          } else {
            // Log only unexpected errors
            console.error('Error fetching user:', error.message)
            setUser(null)
          }
        } else {
          setUser(user)
        }
      } catch (error) {
        // Handle unexpected errors
        if (error instanceof Error && error.message !== 'Auth session missing!') {
          console.error('Unexpected error fetching user:', error)
        }
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    getInitialUser()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: AuthChangeEvent, session: Session | null) => {
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setUser(session?.user ?? null)
        } else if (event === 'SIGNED_OUT') {
          setUser(null)
        } else if (event === 'USER_UPDATED') {
          setUser(session?.user ?? null)
        }
        setLoading(false)
      }
    )

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe()
    }
  }, [supabase.auth])

  const value: AuthContextType = {
    user,
    loading,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// Hook
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  
  return context
}

export default AuthContext
