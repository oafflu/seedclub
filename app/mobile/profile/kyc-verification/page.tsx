"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Upload, Shield, CheckCircle, AlertTriangle, Info, Camera } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function KYCVerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<
    "not_started" | "in_progress" | "pending_review" | "verified" | "rejected"
  >("in_progress")
  const [activeTab, setActiveTab] = useState("personal")
  const [progress, setProgress] = useState(25)

  // Mock function to handle document upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    // In a real app, you would handle the file upload to a server
    if (e.target.files && e.target.files.length > 0) {
      // Simulate progress update
      setProgress((prev) => Math.min(prev + 25, 75))

      if (activeTab === "document" && progress >= 50) {
        setVerificationStatus("pending_review")
      }
    }
  }

  // Mock function to submit the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (activeTab === "personal") {
      setActiveTab("document")
      setProgress(50)
    } else {
      setVerificationStatus("pending_review")
      setProgress(75)
    }
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
        <h1 className="text-2xl font-bold">KYC Verification</h1>
      </div>

      {/* Status Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary-teal" />
                <h2 className="text-lg font-semibold">Verification Status</h2>
              </div>
              {verificationStatus === "not_started" && (
                <Badge variant="outline" className="text-muted-foreground">
                  Not Started
                </Badge>
              )}
              {verificationStatus === "in_progress" && (
                <Badge variant="outline" className="text-blue-500 border-blue-500">
                  In Progress
                </Badge>
              )}
              {verificationStatus === "pending_review" && (
                <Badge variant="outline" className="text-amber-500 border-amber-500">
                  Pending Review
                </Badge>
              )}
              {verificationStatus === "verified" && (
                <Badge variant="default" className="bg-green-500">
                  Verified
                </Badge>
              )}
              {verificationStatus === "rejected" && <Badge variant="destructive">Rejected</Badge>}
            </div>

            <Progress value={progress} className="h-2" />

            <div className="grid grid-cols-3 text-xs text-center">
              <div className={progress >= 25 ? "text-primary-teal font-medium" : "text-muted-foreground"}>
                Personal Info
              </div>
              <div className={progress >= 50 ? "text-primary-teal font-medium" : "text-muted-foreground"}>
                Document Upload
              </div>
              <div className={progress >= 75 ? "text-primary-teal font-medium" : "text-muted-foreground"}>
                Verification
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {verificationStatus === "pending_review" && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification in Progress</AlertTitle>
          <AlertDescription>
            Your documents are being reviewed. This process typically takes 1-2 business days. We'll notify you once the
            verification is complete.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === "verified" && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-500" />
          <AlertTitle className="text-green-800">Verification Complete</AlertTitle>
          <AlertDescription className="text-green-700">
            Your identity has been successfully verified. You now have full access to all platform features.
          </AlertDescription>
        </Alert>
      )}

      {verificationStatus === "rejected" && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Verification Failed</AlertTitle>
          <AlertDescription>
            We couldn't verify your identity with the provided documents. Please review the feedback below and resubmit.
          </AlertDescription>
        </Alert>
      )}

      {(verificationStatus === "not_started" || verificationStatus === "in_progress") && (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="document" disabled={progress < 25}>
              Document Verification
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>
                  Please provide your personal details exactly as they appear on your official ID documents.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="full-name">Full Legal Name</Label>
                      <Input id="full-name" placeholder="Enter your full name" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="dob">Date of Birth</Label>
                      <Input id="dob" type="date" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nationality">Nationality</Label>
                      <Select required>
                        <SelectTrigger id="nationality">
                          <SelectValue placeholder="Select your nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax-country">Country of Tax Residence</Label>
                      <Select required>
                        <SelectTrigger id="tax-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="ca">Canada</SelectItem>
                          <SelectItem value="uk">United Kingdom</SelectItem>
                          <SelectItem value="au">Australia</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Label>ID Document Type</Label>
                    <RadioGroup defaultValue="passport" className="flex flex-col space-y-2">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="passport" id="passport" />
                        <Label htmlFor="passport">Passport</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="driving-license" id="driving-license" />
                        <Label htmlFor="driving-license">Driving License</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="national-id" id="national-id" />
                        <Label htmlFor="national-id">National ID Card</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="id-number">ID Document Number</Label>
                    <Input id="id-number" placeholder="Enter your ID number" required />
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit">Continue to Document Upload</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="document" className="mt-4 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Document Verification</CardTitle>
                <CardDescription>Please upload clear photos or scans of your identification documents.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert variant="outline" className="bg-blue-50 border-blue-200">
                  <Info className="h-4 w-4 text-blue-500" />
                  <AlertTitle className="text-blue-800">Document Requirements</AlertTitle>
                  <AlertDescription className="text-blue-700">
                    <ul className="list-disc pl-5 space-y-1 mt-2">
                      <li>Documents must be valid and not expired</li>
                      <li>All information must be clearly visible</li>
                      <li>Accepted formats: JPG, PNG, PDF (max 5MB)</li>
                    </ul>
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>ID Document (Front)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                      <Input
                        type="file"
                        className="hidden"
                        id="id-front"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={handleFileUpload}
                      />
                      <Button variant="outline" onClick={() => document.getElementById("id-front")?.click()}>
                        Select File
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>ID Document (Back)</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Drag and drop or click to upload</p>
                      <Input
                        type="file"
                        className="hidden"
                        id="id-back"
                        accept="image/jpeg,image/png,application/pdf"
                        onChange={handleFileUpload}
                      />
                      <Button variant="outline" onClick={() => document.getElementById("id-back")?.click()}>
                        Select File
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Selfie with ID</Label>
                    <div className="border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center bg-muted/30">
                      <Camera className="h-8 w-8 text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground mb-2">Take a photo of yourself holding your ID</p>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => document.getElementById("selfie")?.click()}>
                          Upload Photo
                        </Button>
                        <Button variant="outline">Take Photo</Button>
                      </div>
                      <Input
                        type="file"
                        className="hidden"
                        id="selfie"
                        accept="image/jpeg,image/png"
                        onChange={handleFileUpload}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("personal")}>
                  Back
                </Button>
                <Button onClick={handleSubmit}>Submit for Verification</Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {/* FAQ Section */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Why do I need to verify my identity?</h3>
            <p className="text-sm text-muted-foreground">
              KYC (Know Your Customer) verification is required by financial regulations to prevent fraud, money
              laundering, and ensure the security of our platform.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">How long does verification take?</h3>
            <p className="text-sm text-muted-foreground">
              Most verifications are completed within 1-2 business days. You'll receive an email notification once your
              verification is complete.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Is my data secure?</h3>
            <p className="text-sm text-muted-foreground">
              Yes, all your personal information and documents are encrypted and stored securely. We comply with data
              protection regulations and never share your information with unauthorized third parties.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
