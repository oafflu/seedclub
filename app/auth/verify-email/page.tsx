"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { verifyEmail } from '@/lib/supabase/auth'

export default function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying')
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  useEffect(() => {
    const verify = async () => {
      if (!token) {
        setStatus('error')
        setError('Verification token is missing')
        return
      }

      try {
        const { success, error } = await verifyEmail(token)
        if (success) {
          setStatus('success')
        } else {
          setStatus('error')
          setError(error || 'Verification failed')
        }
      } catch (err: any) {
        setStatus('error')
        setError(err.message || 'An error occurred during verification')
      }
    }

    verify()
  }, [token])

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="flex justify-center">
          <Image src="/images/seedclub-logo.svg" alt="Seed Club Logo" width={180} height={60} priority />
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Email Verification</CardTitle>
            <CardDescription>
              {status === 'verifying' ? 'Verifying your email address...' : 
               status === 'success' ? 'Your email has been verified!' :
               'Email verification failed'}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {status === 'verifying' && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            )}

            {status === 'success' && (
              <div className="space-y-4">
                <Alert>
                  <AlertTitle>Success</AlertTitle>
                  <AlertDescription>
                    Your email has been successfully verified. You can now log in to your account.
                  </AlertDescription>
                </Alert>
                <Button className="w-full" onClick={() => router.push('/mobile/login')}>
                  Go to Login
                </Button>
              </div>
            )}

            {status === 'error' && (
              <div className="space-y-4">
                <Alert variant="destructive">
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
                <Button className="w-full" onClick={() => router.push('/mobile/register')}>
                  Back to Sign Up
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 