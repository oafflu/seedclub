"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const { toast } = useToast()
  const supabase = createClientComponentClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // 1. Login with Supabase Auth
      const { data: { session }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) {
        setError(signInError.message)
        toast({
          title: "Login failed",
          description: signInError.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (!session) {
        setError("No session returned from Supabase")
        toast({
          title: "Login failed",
          description: "No session returned from Supabase",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // 2. Fetch customer profile
      const { data: customer, error: customerError } = await supabase
        .from("customers")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (customerError || !customer) {
        setError(customerError?.message || "Customer profile not found.")
        toast({
          title: "Login failed",
          description: customerError?.message || "Customer profile not found.",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Store session/profile as needed
      localStorage.setItem('customer_session', JSON.stringify({
        id: customer.id,
        email: customer.email,
        firstName: customer.first_name,
        lastName: customer.last_name
      }))
      localStorage.setItem('isAuthenticated', 'true')
      localStorage.setItem('userName', customer.first_name + (customer.last_name ? ' ' + customer.last_name : ''))
      localStorage.setItem('userEmail', customer.email)

      toast({
        title: "Login successful",
        description: `Welcome back, ${customer.first_name}!`,
      })

      // Redirect to customer dashboard
      router.push("/mobile/dashboard")
    } catch (error: any) {
      setError(error.message || "Invalid email or password. Please try again.")
      toast({
        title: "Login failed",
        description: error.message || "Please check your credentials and try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="flex justify-center">
          <Image src="/images/seedclub-logo.svg" alt="Seed Club Logo" width={180} height={60} priority />
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Welcome back</CardTitle>
            <CardDescription>Sign in to access your account</CardDescription>
          </CardHeader>

          {error && (
            <div className="px-6 pb-2">
              <Alert variant="destructive">
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            </div>
          )}

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input id="email" name="email" type="email" placeholder="name@example.com" required className="pl-10" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/mobile/forgot-password" className="text-sm hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm">
              Don&apos;t have an account?{" "}
              <Link href="/mobile/register" className="hover:underline">
                Sign up
              </Link>
            </div>
            <div className="text-center text-xs text-muted-foreground">
              By signing in, you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 