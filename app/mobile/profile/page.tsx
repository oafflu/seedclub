"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { User, Mail, Shield, CreditCard, LogOut, ChevronRight, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// MOCK CUSTOMER DATA FOR DEVELOPMENT/DEMO PURPOSES
const mockCustomer = {
  id: 'mock-customer-id',
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
}

export default function ProfilePage() {
  const [userName, setUserName] = useState(`${mockCustomer.firstName} ${mockCustomer.lastName}`)
  const [userEmail, setUserEmail] = useState(mockCustomer.email)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return
    const fetchProfile = async () => {
      try {
        const supabase = require('@supabase/auth-helpers-nextjs').createClientComponentClient()
        const { data: { session } } = await supabase.auth.getSession()
        let name = ''
        let email = ''
        if (session?.user) {
          const headers = new Headers({
            apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
            Authorization: `Bearer ${session.access_token}`,
            Accept: 'application/json',
          })
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/customers?select=first_name,last_name,email&id=eq.${session.user.id}`,
            {
              headers,
            }
          )
          const arr = await res.json()
          const customer = arr && arr[0]
          if (customer) {
            name = (customer.first_name || '') + (customer.last_name ? ' ' + customer.last_name : '')
            email = customer.email || ''
          }
        }
        if (!name.trim()) {
          name = 'User'
        }
        if (!email.trim()) {
          email = 'user@example.com'
        }
        setUserName(name)
        setUserEmail(email)
      } catch {
        setUserName('User')
        setUserEmail('user@example.com')
      }
    }
    fetchProfile()
  }, [mounted])

  if (!mounted || userName === null || userEmail === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/auth/login")
  }

  return (
    <div className="container space-y-6 px-4 py-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" alt={userName} />
              <AvatarFallback className="text-lg">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="ml-4">
              <h2 className="text-xl font-bold">{userName}</h2>
              <p className="text-sm text-muted-foreground">{userEmail}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Account Settings</h2>

        <Card>
          <CardContent className="p-0">
            <Link href="/mobile/profile/personal-info" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <User className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Personal Information</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Link href="/mobile/profile/kyc-verification" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Shield className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>KYC Verification</span>
              </div>
              <Badge variant="outline" className="text-amber-500 border-amber-500">
                Required
              </Badge>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Link href="/mobile/profile/contact-info" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Contact Information</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Link href="/mobile/profile/security" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <Shield className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Security</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Link href="/mobile/profile/payment-methods" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <CreditCard className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Payment Methods</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-0">
            <Link href="/mobile/support" className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <HelpCircle className="mr-3 h-5 w-5 text-muted-foreground" />
                <span>Support</span>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Notifications</h2>

        <Card>
          <CardContent className="space-y-4 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="investment-updates">Investment Updates</Label>
                <p className="text-sm text-muted-foreground">Receive updates about your investments</p>
              </div>
              <Switch id="investment-updates" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="referral-notifications">Referral Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when someone uses your referral link</p>
              </div>
              <Switch id="referral-notifications" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="marketing-emails">Marketing Emails</Label>
                <p className="text-sm text-muted-foreground">Receive promotional offers and newsletters</p>
              </div>
              <Switch id="marketing-emails" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Button variant="outline" className="w-full" onClick={handleLogout}>
        <LogOut className="mr-2 h-4 w-4" /> Sign Out
      </Button>
    </div>
  )
}
