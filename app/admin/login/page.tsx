"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, ShieldAlert } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      // In a real app, you would validate credentials with an API
      // This is just a mock for demonstration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mock validation - in production this would be a real API call
      if (email === "admin@seedclub.com" && password === "admin123") {
        // Set admin authentication
        localStorage.setItem("adminAuthenticated", "true")
        localStorage.setItem("adminEmail", email)
        localStorage.setItem("adminName", "Admin User")

        // Redirect to admin dashboard
        router.push("/admin")
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <div className="relative h-12 w-48">
            <Image src="/images/seedclub-logo.svg" alt="Seed Club Logo" fill className="object-contain" priority />
          </div>
        </div>

        <Card className="border-2">
          <CardHeader className="space-y-1">
            <div className="flex items-center justify-center mb-2">
              <ShieldAlert className="h-10 w-10 text-primary-teal" />
            </div>
            <CardTitle className="text-center text-2xl">Admin Portal</CardTitle>
            <CardDescription className="text-center">Secure access for Seed Club administrators only</CardDescription>
          </CardHeader>

          {error && (
            <div className="px-6">
              <Alert variant="destructive">
                <AlertTitle>Authentication Error</AlertTitle>
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
                  <Input
                    id="email"
                    name="email"
                    placeholder="admin@seedclub.com"
                    type="email"
                    required
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link href="/admin/forgot-password" className="text-xs text-primary-teal hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="pl-10 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-10 w-10 text-muted-foreground"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-primary-teal hover:bg-primary-teal/90" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign in to Admin Portal"}
              </Button>
            </form>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <div className="text-center text-sm text-muted-foreground">
              <span>This portal is for authorized administrators only.</span>
            </div>
            <div className="text-center text-sm">
              <Link href="/" className="text-primary-teal hover:underline">
                Return to main site
              </Link>
            </div>
          </CardFooter>
        </Card>

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Seed Club. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
