'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, onSnapshot } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase/app'
import { User as AppUser } from '@/types/user.types'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

interface AuthContextType {
  user: AppUser | null
  firebaseUser: User | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  firebaseUser: null,
  loading: true,
  error: null,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)

      if (fbUser) {
        try {
          // Subscribe to user document
          const unsubscribeUser = onSnapshot(
            doc(db, 'users', fbUser.uid),
            (docSnapshot) => {
              if (docSnapshot.exists()) {
                const userData = docSnapshot.data() as AppUser
                setUser(userData)
                setError(null)
              } else {
                setUser(null)
                setError('User profile not found')
              }
              setLoading(false)
            },
            (error) => {
              console.error('Error fetching user data:', error)
              setError('Failed to load user data')
              setLoading(false)
            }
          )

          return () => unsubscribeUser()
        } catch (error) {
          console.error('Auth error:', error)
          setError('Authentication error')
          setLoading(false)
        }
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => unsubscribeAuth()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <LoadingSpinner size="lg" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading HealthSync Pro...
          </p>
        </div>
      </div>
    )
  }

  return (
    <AuthContext.Provider value={{ user, firebaseUser, loading, error }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)