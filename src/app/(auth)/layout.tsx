import { ReactNode } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Heart } from 'lucide-react'
import { AuthProvider } from '@/features/auth/components/AuthProvider'
import { ThemeToggle } from '@/components/layout/ThemeToggle'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col md:flex-row">
        {/* Left side - Branding/Info */}
        <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
          <div className="flex-1 p-8 lg:p-12">
            <Link href="/" className="flex items-center space-x-3 mb-12">
              <div className="h-10 w-10 bg-primary rounded-lg flex items-center justify-center">
                <Heart className="h-6 w-6 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold">HealthSync Pro</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Healthcare Platform
                </div>
              </div>
            </Link>

            <div className="max-w-md">
              <h1 className="text-4xl font-bold mb-6">
                Welcome to <span className="text-primary">HealthSync Pro</span>
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Join thousands of patients and providers managing healthcare in a modern, secure platform.
              </p>

              <div className="space-y-6">
                {[
                  {
                    icon: '🏥',
                    title: 'Comprehensive Care',
                    description: 'Manage all aspects of healthcare in one platform'
                  },
                  {
                    icon: '🔒',
                    title: 'Secure & Private',
                    description: 'HIPAA compliant with enterprise-grade security'
                  },
                  {
                    icon: '⚡',
                    title: 'Real-time Updates',
                    description: 'Instant notifications and live health monitoring'
                  }
                ].map((feature, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="text-2xl">{feature.icon}</div>
                    <div>
                      <div className="font-semibold">{feature.title}</div>
                      <div className="text-gray-600 dark:text-gray-400 text-sm">
                        {feature.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-12">
              <div className="flex items-center space-x-4">
                <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
                <div className="text-sm text-gray-500">Trusted by healthcare organizations</div>
                <div className="h-px flex-1 bg-gray-300 dark:bg-gray-700" />
              </div>
              <div className="flex items-center justify-center space-x-8 mt-6 opacity-60">
                <div className="text-gray-700 dark:text-gray-300 font-semibold">Hospital A</div>
                <div className="text-gray-700 dark:text-gray-300 font-semibold">Clinic B</div>
                <div className="text-gray-700 dark:text-gray-300 font-semibold">Provider C</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Auth Forms */}
        <div className="flex-1 bg-white dark:bg-gray-900">
          <div className="h-full flex flex-col">
            {/* Header */}
            <header className="p-6">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-3 md:hidden">
                  <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                    <Heart className="h-5 w-5 text-white" />
                  </div>
                  <div className="font-bold">HealthSync Pro</div>
                </Link>
                
                <div className="flex items-center space-x-4">
                  <ThemeToggle />
                  <Link 
                    href="/" 
                    className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center p-4">
              <div className="w-full max-w-md">
                {children}
              </div>
            </main>

            {/* Footer */}
            <footer className="p-6 border-t border-gray-200 dark:border-gray-800">
              <div className="text-center text-sm text-gray-600 dark:text-gray-400">
                <p>
                  By continuing, you agree to our{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
                <p className="mt-2">
                  Need help?{' '}
                  <Link href="/contact" className="text-primary hover:underline">
                    Contact Support
                  </Link>
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
    </AuthProvider>
  )
}