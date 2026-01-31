'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { confirmPasswordReset, verifyPasswordResetCode } from 'firebase/auth'
import { auth } from '@/lib/firebase/app'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle,
  AlertCircle,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'react-hot-toast'

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const oobCode = searchParams.get('oobCode')
  
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [validating, setValidating] = useState(true)

  useEffect(() => {
    // Validate the password reset code
    const validateCode = async () => {
      if (!oobCode) {
        setError('Invalid or expired reset link')
        setValidating(false)
        return
      }

      try {
        await verifyPasswordResetCode(auth, oobCode)
        setValidating(false)
      } catch (error: any) {
        console.error('Code validation error:', error)
        setError('Invalid or expired reset link. Please request a new password reset.')
        setValidating(false)
      }
    }

    validateCode()
  }, [oobCode])

  const validatePassword = () => {
    if (!password || !confirmPassword) {
      setError('Please fill in all fields')
      return false
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return false
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return false
    }
    
    // Check for at least one number and one letter
    const hasNumber = /\d/.test(password)
    const hasLetter = /[a-zA-Z]/.test(password)
    if (!hasNumber || !hasLetter) {
      setError('Password must contain both letters and numbers')
      return false
    }
    
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validatePassword()) return
    
    setLoading(true)
    setError(null)

    try {
      if (!oobCode) {
        throw new Error('Invalid reset code')
      }

      await confirmPasswordReset(auth, oobCode, password)
      
      setSuccess(true)
      toast.success('Password reset successfully!')
      
      // Redirect to login after delay
      setTimeout(() => {
        router.push('/login?reset=success')
      }, 3000)
      
    } catch (error: any) {
      console.error('Password reset error:', error)
      
      let errorMessage = 'Failed to reset password. Please try again.'
      
      switch (error.code) {
        case 'auth/expired-action-code':
          errorMessage = 'Reset link has expired. Please request a new one.'
          break
        case 'auth/invalid-action-code':
          errorMessage = 'Invalid reset link. Please request a new one.'
          break
        case 'auth/weak-password':
          errorMessage = 'Password is too weak. Please choose a stronger password.'
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

  if (validating) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">
                Validating reset link...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error && !oobCode) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Invalid Reset Link</CardTitle>
            <CardDescription>
              The password reset link is invalid or has expired.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link href="/forgot-password">
                Request New Reset Link
              </Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-0 shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">
            {success ? 'Password Reset!' : 'Reset your password'}
          </CardTitle>
          <CardDescription>
            {success 
              ? 'Your password has been successfully reset' 
              : 'Create a new secure password for your account'}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {success ? (
            <div className="space-y-6">
              <Alert className="bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800">
                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                <AlertDescription className="text-green-800 dark:text-green-200">
                  Password has been reset successfully!
                </AlertDescription>
              </Alert>

              <div className="text-center space-y-4">
                <p className="text-gray-600 dark:text-gray-400">
                  You will be redirected to the login page in a few seconds...
                </p>
                
                <Button asChild className="w-full">
                  <Link href="/login">
                    Sign in with new password
                  </Link>
                </Button>
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
                <Label htmlFor="password">New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                <p className="text-xs text-gray-500">
                  Must be at least 8 characters with letters and numbers
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    disabled={loading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <h4 className="font-semibold mb-2 text-sm">Password Requirements:</h4>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li className={`flex items-center ${password.length >= 8 ? 'text-green-600' : ''}`}>
                    {password.length >= 8 ? '✓' : '•'} At least 8 characters
                  </li>
                  <li className={`flex items-center ${/\d/.test(password) ? 'text-green-600' : ''}`}>
                    {/\d/.test(password) ? '✓' : '•'} Contains at least one number
                  </li>
                  <li className={`flex items-center ${/[a-zA-Z]/.test(password) ? 'text-green-600' : ''}`}>
                    {/[a-zA-Z]/.test(password) ? '✓' : '•'} Contains at least one letter
                  </li>
                </ul>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={loading}
              >
                {loading ? 'Resetting Password...' : 'Reset Password'}
              </Button>
            </form>
          )}
        </CardContent>

        {!success && (
          <CardFooter className="flex flex-col space-y-4">
            <Button
              asChild
              variant="ghost"
              className="w-full"
            >
              <Link href="/login">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Sign in
              </Link>
            </Button>
            
            <div className="text-center text-xs text-gray-500">
              <p>Make sure you're on a secure connection</p>
              <p>and never share your password with anyone</p>
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}