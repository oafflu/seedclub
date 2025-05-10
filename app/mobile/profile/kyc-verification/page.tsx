"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

const countryList = [
  "Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan", "Bahamas", "Bahrain", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi", "Cabo Verde", "Cambodia", "Cameroon", "Canada", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic", "Denmark", "Djibouti", "Dominica", "Dominican Republic", "East Timor", "Ecuador", "Egypt", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Eswatini", "Ethiopia", "Fiji", "Finland", "France", "Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana", "Haiti", "Honduras", "Hungary", "Iceland", "India", "Indonesia", "Iran", "Iraq", "Ireland", "Israel", "Italy", "Jamaica", "Japan", "Jordan", "Kazakhstan", "Kenya", "Kiribati", "Korea, North", "Korea, South", "Kosovo", "Kuwait", "Kyrgyzstan", "Laos", "Latvia", "Lebanon", "Lesotho", "Liberia", "Libya", "Liechtenstein", "Lithuania", "Luxembourg", "Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Morocco", "Mozambique", "Myanmar", "Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway", "Oman", "Pakistan", "Palau", "Palestine", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal", "Qatar", "Romania", "Russia", "Rwanda", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Saudi Arabia", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Sweden", "Switzerland", "Syria", "Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Tunisia", "Turkey", "Turkmenistan", "Tuvalu", "Uganda", "Ukraine", "United Arab Emirates", "United Kingdom", "United States", "Uruguay", "Uzbekistan", "Vanuatu", "Vatican City", "Venezuela", "Vietnam", "Yemen", "Zambia", "Zimbabwe"
]

export default function KYCVerificationPage() {
  const [verificationStatus, setVerificationStatus] = useState<
    "not_started" | "in_progress" | "pending_review" | "verified" | "rejected"
  >("not_started")
  const [activeTab, setActiveTab] = useState("personal")
  const [progress, setProgress] = useState(25)
  const [kycData, setKycData] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [userId, setUserId] = useState<string | null>(null)
  const [docFront, setDocFront] = useState<File | null>(null)
  const [docBack, setDocBack] = useState<File | null>(null)
  const [selfie, setSelfie] = useState<File | null>(null)
  const supabase = createClientComponentClient()

  // Fetch KYC status and details on mount
  useEffect(() => {
    const fetchKyc = async () => {
      setLoading(true)
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) {
        setLoading(false)
        return
      }
      setUserId(session.user.id)
      // Fetch KYC record
      const { data, error } = await supabase
        .from("kyc_verifications")
        .select("*")
        .eq("customer_id", session.user.id)
        .single()
      if (data) {
        setKycData(data)
        setVerificationStatus(data.status as any)
        if (data.status === "verified") setProgress(100)
        else if (data.status === "pending_review") setProgress(75)
        else if (data.status === "in_progress") setProgress(50)
        else setProgress(25)
      }
      setLoading(false)
    }
    fetchKyc()
  }, [])

  // Handle personal info submit
  const handlePersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const form = e.target as HTMLFormElement
    const fullName = (form["full-name"] as HTMLInputElement).value
    const dob = (form["dob"] as HTMLInputElement).value
    const nationality = (form["nationality"] as HTMLInputElement).value
    const taxCountry = (form["tax-country"] as HTMLInputElement).value
    const idType = (form["id-type"] as HTMLInputElement)?.value || "passport"
    const idNumber = (form["id-number"] as HTMLInputElement).value
    if (!userId) return
    // Upsert KYC record
    await supabase.from("kyc_verifications").upsert([
      {
        customer_id: userId,
        document_type: idType,
        status: "in_progress",
        full_name: fullName,
        date_of_birth: dob,
        nationality,
        tax_country: taxCountry,
        id_number: idNumber,
        updated_at: new Date().toISOString(),
      }
    ], { onConflict: "customer_id" })
    setActiveTab("document")
    setProgress(50)
    setVerificationStatus("in_progress")
  }

  // Handle document upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "front" | "back" | "selfie") => {
    if (e.target.files && e.target.files.length > 0 && userId) {
      const file = e.target.files[0]
      let path = `kyc/${userId}/${type}-${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage.from("kyc-documents").upload(path, file, { upsert: true })
      if (!error) {
        if (type === "front") setDocFront(file)
        if (type === "back") setDocBack(file)
        if (type === "selfie") setSelfie(file)
        // Save file URL to KYC record
        const url = data?.path ? supabase.storage.from("kyc-documents").getPublicUrl(data.path).data.publicUrl : null
        await supabase.from("kyc_verifications").update({ [`${type}_url`]: url, updated_at: new Date().toISOString() }).eq("customer_id", userId)
      }
    }
  }

  // Handle document submit
  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId) return
    await supabase.from("kyc_verifications").update({
      status: "pending_review",
      updated_at: new Date().toISOString(),
    }).eq("customer_id", userId)
    setVerificationStatus("pending_review")
    setProgress(75)
  }

  return (
    <div className="container space-y-6 px-4 py-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" className="mr-2" asChild>
          <Link href="/mobile/profile">
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
                <form onSubmit={handlePersonalSubmit} className="space-y-4">
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
                      <Select required name="nationality">
                        <SelectTrigger id="nationality">
                          <SelectValue placeholder="Select your nationality" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryList.map((country) => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tax-country">Country of Tax Residence</Label>
                      <Select required name="tax-country">
                        <SelectTrigger id="tax-country">
                          <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                          {countryList.map((country) => (
                            <SelectItem key={country} value={country}>{country}</SelectItem>
                          ))}
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
                <Alert className="bg-blue-50 border-blue-200">
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
                        onChange={(e) => handleFileUpload(e, "front")}
                      />
                      <Button variant="outline" onClick={() => document.getElementById("id-front")?.click()}>
                        Select File
                      </Button>
                      {docFront && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {docFront.type.startsWith('image') ? (
                            <img src={URL.createObjectURL(docFront)} alt="ID Front Preview" className="max-h-24 rounded border" />
                          ) : (
                            <span>{docFront.name}</span>
                          )}
                        </div>
                      )}
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
                        onChange={(e) => handleFileUpload(e, "back")}
                      />
                      <Button variant="outline" onClick={() => document.getElementById("id-back")?.click()}>
                        Select File
                      </Button>
                      {docBack && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {docBack.type.startsWith('image') ? (
                            <img src={URL.createObjectURL(docBack)} alt="ID Back Preview" className="max-h-24 rounded border" />
                          ) : (
                            <span>{docBack.name}</span>
                          )}
                        </div>
                      )}
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
                        onChange={(e) => handleFileUpload(e, "selfie")}
                      />
                      {selfie && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {selfie.type.startsWith('image') ? (
                            <img src={URL.createObjectURL(selfie)} alt="Selfie Preview" className="max-h-24 rounded border" />
                          ) : (
                            <span>{selfie.name}</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => setActiveTab("personal")}>
                  Back
                </Button>
                <Button onClick={handleDocumentSubmit}>Submit for Verification</Button>
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
