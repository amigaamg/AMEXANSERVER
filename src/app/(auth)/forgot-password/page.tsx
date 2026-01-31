'use client'

import { useState } from 'react'
import Link from 'next/link'
import { sendPasswordResetEmail } from 'firebase/auth'
import { auth } from '@/lib/firebase/app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Mail, 
  ArrowLeft,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [emailSent, setEmailSent] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await sendPasswordResetEmail(auth, email)
      
      setSuccess(true)
      setEmailSent(email)
      toast.success('Password reset email sent!')
      
    } catch (error: any) {
      console.error('Password reset error:', error)
      
      let errorMessage = 'Failed to send reset email. Please try again.'
      
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.'
          break
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email.'
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts. Please try again later.'
          break
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection.'
          break
      }
      
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendEmail = async () => {
    await handleSubmit(new Event('submit') as any)
  }

  return (
    <Card className="border-0 shadow-lg max-w-md mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">
          {success ? 'Check your email' : 'Forgot password'}
        </CardTitle>
        <CardDescription>
          {success 
            ? 'We sent a password reset link to your email' 
            : 'Enter your email address and we\'ll send you a reset link'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {success ? (
          <div className="space-y-6">
            <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
              <AlertDescription className="text-green-800 dark:text-green-200">
                Password reset email sent to{' '}
                <span className="font-semibold">{emailSent}</span>
              </AlertDescription>
            </Alert>

            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2">What to do next:</h4>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  <li>Check your email inbox (and spam folder)</li>
                  <li>Click the password reset link in the email</li>
                  <li>Create a new secure password</li>
                  <li>Sign in with your new password</li>
                </ol>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleResendEmail}
                  variant="outline"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? 'Sending...' : 'Resend email'}
                </Button>
                
                <Button asChild className="w-full">
                  <Link href="/login">
                    Back to Sign in
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-sm text-gray-500">
                Enter the email address associated with your account
              </p>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Send reset link'}
            </Button>
          </form>
        )}
      </CardContent>

      {!success && (
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{' '}
            <Link 
              href="/login" 
              className="text-primary font-medium hover:underline"
            >
              Sign in
            </Link>
          </div>
          
          <Button
            asChild
            variant="ghost"
            className="w-full"
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}