import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Search, Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <div className="text-center mb-8">
        <div className="text-8xl font-bold text-gray-200 dark:text-gray-800 mb-4">
          404
        </div>
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Page Not Found
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-md">
          The page you're looking for doesn't exist or has been moved.
        </p>
      </div>

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Where would you like to go?</CardTitle>
          <CardDescription>
            Here are some helpful links to get you back on track
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Link href="/">
              <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <Home className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <div className="font-medium">Home Page</div>
                  <div className="text-sm text-gray-500">Return to the main dashboard</div>
                </div>
              </div>
            </Link>

            <Link href="/patient/dashboard">
              <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="h-5 w-5 mr-3 text-gray-400 flex items-center justify-center">
                  <div className="h-2 w-2 bg-healthcare-blue rounded-full" />
                </div>
                <div>
                  <div className="font-medium">Patient Dashboard</div>
                  <div className="text-sm text-gray-500">Access your health management tools</div>
                </div>
              </div>
            </Link>

            <Link href="/doctor/dashboard">
              <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <div className="h-5 w-5 mr-3 text-gray-400 flex items-center justify-center">
                  <div className="h-2 w-2 bg-healthcare-teal rounded-full" />
                </div>
                <div>
                  <div className="font-medium">Doctor Dashboard</div>
                  <div className="text-sm text-gray-500">Access provider tools and patient management</div>
                </div>
              </div>
            </Link>

            <Link href="/contact">
              <div className="flex items-center p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                <Search className="h-5 w-5 mr-3 text-gray-400" />
                <div>
                  <div className="font-medium">Contact Support</div>
                  <div className="text-sm text-gray-500">Get help from our support team</div>
                </div>
              </div>
            </Link>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-3">
          <div className="text-sm text-gray-500">
            Can't find what you're looking for? Try searching:
          </div>
          <div className="flex w-full space-x-3">
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
            <Button asChild className="flex-1">
              <Link href="/search">
                <Search className="h-4 w-4 mr-2" />
                Search Site
              </Link>
            </Button>
          </div>
        </CardFooter>
      </Card>

      <div className="mt-12 text-center text-gray-500 text-sm">
        <p>Error Code: 404 - Page Not Found</p>
        <p className="mt-2">
          If you believe this is an error, please{' '}
          <Link href="/contact" className="text-primary hover:underline">
            contact support
          </Link>
        </p>
      </div>
    </div>
  )
}