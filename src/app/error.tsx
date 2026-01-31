'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useRouter } from 'next/navigation'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <Card className="w-full max-w-md border-red-200 dark:border-red-900">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
              <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Something went wrong!</CardTitle>
          <CardDescription>
            We encountered an error while processing your request.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Error Details:
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono break-words">
              {error.message || 'Unknown error occurred'}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                Error ID: {error.digest}
              </p>
            )}
          </div>
          
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">This might be due to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Network connectivity issues</li>
              <li>Server maintenance</li>
              <li>Temporary service disruption</li>
              <li>Browser cache issues</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <Button
            onClick={() => reset()}
            className="w-full"
            size="lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <div className="flex space-x-3 w-full">
            <Button
              onClick={() => router.push('/')}
              variant="outline"
              className="flex-1"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
            <Button
              onClick={() => router.push('/contact')}
              variant="outline"
              className="flex-1"
            >
              Contact Support
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}