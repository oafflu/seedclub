"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Save, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function ContactInfoPage() {
  const [formData, setFormData] = useState({
    email: "",
    emailVerified: true,
    phoneNumber: "",
    phoneVerified: false,
    address: {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  })
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    // In a real app, you would fetch user data from an API
    // For demo purposes, we'll use localStorage
    const userEmail = localStorage.getItem("userEmail") || "user@example.com"

    setFormData({
      email: userEmail,
      emailVerified: true,
      phoneNumber: "+1 (555) 123-4567",
      phoneVerified: false,
      address: {
        street: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "United States",
      },
    })
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // In a real app, you would update user data with an API call
    setTimeout(() => {
      // Update localStorage for demo purposes
      localStorage.setItem("userEmail", formData.email)
      setIsLoading(false)
      toast({
        title: "Contact information updated",
        description: "Your contact details have been saved successfully.",
      })
    }, 1000)
  }

  const handleVerifyPhone = () => {
    // In a real app, this would initiate a verification process
    toast({
      title: "Verification code sent",
      description: "A verification code has been sent to your phone number.",
    })
  }

  return (
    <div className="container space-y-6 px-4 py-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" asChild>
          <Link href="/profile">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Contact Information</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Email & Phone</CardTitle>
            <CardDescription>Manage your contact information and verification status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email">Email Address</Label>
                  {formData.emailVerified && (
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" /> Verified
                    </Badge>
                  )}
                </div>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  {formData.phoneVerified ? (
                    <Badge variant="outline" className="text-green-500 border-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" /> Verified
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-500">
                      Not Verified
                    </Badge>
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    required
                  />
                  {!formData.phoneVerified && (
                    <Button type="button" variant="outline" onClick={handleVerifyPhone}>
                      Verify
                    </Button>
                  )}
                </div>
              </div>
            </div>

            <Alert>
              <AlertTitle>Why verification matters</AlertTitle>
              <AlertDescription>
                Verifying your contact information enhances your account security and helps us protect your investments.
                It also enables us to send important notifications about your account.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mailing Address</CardTitle>
            <CardDescription>Your physical address for communications and verification</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                name="address.street"
                value={formData.address.street}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  name="address.state"
                  value={formData.address.state}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip/Postal Code</Label>
                <Input
                  id="zipCode"
                  name="address.zipCode"
                  value={formData.address.zipCode}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="address.country"
                  value={formData.address.country}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <Separator />

            <p className="text-sm text-muted-foreground">
              Your address information is used for account verification and may be required for tax reporting purposes.
              We will never share your address with third parties without your consent.
            </p>
          </CardContent>
          <CardFooter className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>Saving changes...</>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </>
              )}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  )
}
