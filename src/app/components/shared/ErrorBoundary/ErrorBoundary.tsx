'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    // Log error to error reporting service
    if (process.env.NODE_ENV === 'production') {
      // TODO: Send to error reporting service (Sentry, LogRocket, etc.)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null
    })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return <ErrorFallback error={this.state.error} onReset={this.handleReset} />
    }

    return this.props.children
  }
}

interface ErrorFallbackProps {
  error: Error | null
  onReset: () => void
}

function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full mb-4">
            <AlertTriangle className="h-8 w-8 text-red-600 dark:text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            We encountered an error while loading this page.
          </p>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Error Details:
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400 font-mono break-words">
            {error?.message || 'Unknown error'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Button
            onClick={onReset}
            className="w-full"
            size="lg"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          
          <Button
            onClick={() => router.push('/')}
            variant="outline"
            className="w-full"
            size="lg"
          >
            <Home className="h-4 w-4 mr-2" />
            Go Home
          </Button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-500">
            If the problem persists, please{' '}
            <button
              onClick={() => router.push('/contact')}
              className="text-primary hover:underline"
            >
              contact support
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}