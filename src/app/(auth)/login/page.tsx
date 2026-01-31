'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Mail, Lock, Eye, EyeOff, LogIn, Chrome, User } from 'lucide-react'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cream-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-blue-100 shadow-xl">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center text-blue-900">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-gray-600">
            Sign in to your healthcare dashboard
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Google Login */}
          <Button className="w-full h-12 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700">
            <Chrome className="mr-2 h-5 w-5" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Or continue with</span>
            </div>
          </div>

          {/* Email/Username Login */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Email or Username
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="you@example.com or username"
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="/auth/forgot-password" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="pl-10 pr-10 h-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <Button className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600">
              <LogIn className="mr-2 h-5 w-5" />
              Sign In
            </Button>
          </div>

          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" className="font-semibold text-blue-600 hover:underline">
              Sign up now
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}