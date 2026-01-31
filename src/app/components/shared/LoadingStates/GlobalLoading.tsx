'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { LoadingSpinner } from '@/components/ui/loading-spinner'

export function GlobalLoading() {
  const pathname = usePathname()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const handleStart = () => setLoading(true)
    const handleComplete = () => setLoading(false)

    // Listen to route changes
    handleStart()
    const timer = setTimeout(handleComplete, 300) // Minimum loading time

    return () => {
      clearTimeout(timer)
      handleComplete()
    }
  }, [pathname])

  if (!loading) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="text-center space-y-4">
        <LoadingSpinner size="lg" />
        <p className="text-gray-600 dark:text-gray-400 animate-pulse">
          Loading HealthSync Pro...
        </p>
      </div>
    </div>
  )
}