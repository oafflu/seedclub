"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Plus, CreditCard, BanknoteIcon as Bank, Trash2, CheckCircle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function PaymentMethodsPage() {
  const [paymentMethods, setPaymentMethods] = useState<any[]>([])
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [newPaymentType, setNewPaymentType] = useState("bank")
  const [form, setForm] = useState({
    account_holder_name: "",
    bank_name: "",
    routing_number: "",
    account_number: "",
    account_type: "checking",
  })
  const { toast } = useToast()

  // Fetch bank accounts from Supabase
  useEffect(() => {
    async function fetchBankAccounts() {
      const supabase = createClientComponentClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { data, error } = await supabase
        .from("customer_bank_accounts")
        .select("id, bank_name, account_number, routing_number, account_holder_name, created_at")
        .eq("customer_id", session.user.id)
        .order("created_at", { ascending: false })
      if (!error) setPaymentMethods(data || [])
    }
    fetchBankAccounts()
  }, [])

  // Add new bank account
  const handleAddPaymentMethod = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClientComponentClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session?.user) return
    const { error } = await supabase
      .from("customer_bank_accounts")
      .insert({
        customer_id: session.user.id,
        bank_name: form.bank_name,
        account_number: form.account_number,
        routing_number: form.routing_number,
        account_holder_name: form.account_holder_name,
      })
    if (!error) {
      toast({ title: "Bank account added", description: "Your new bank account has been added successfully." })
      setAddDialogOpen(false)
      setForm({ account_holder_name: "", bank_name: "", routing_number: "", account_number: "", account_type: "checking" })
      // Refresh list
      const { data } = await supabase
        .from("customer_bank_accounts")
        .select("id, bank_name, account_number, routing_number, account_holder_name, created_at")
        .eq("customer_id", session.user.id)
        .order("created_at", { ascending: false })
      setPaymentMethods(data || [])
    }
  }

  // Remove bank account
  const handleRemove = async (id: string) => {
    const supabase = createClientComponentClient()
    await supabase.from("customer_bank_accounts").delete().eq("id", id)
    setPaymentMethods((prev) => prev.filter((method) => method.id !== id))
    toast({ title: "Bank account removed", description: "Your bank account has been removed successfully." })
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
        <h1 className="text-2xl font-bold">Payment Methods</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Your Payment Methods</CardTitle>
              <CardDescription>Manage your payment methods for deposits and withdrawals</CardDescription>
            </div>
            <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" /> Add Method
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Payment Method</DialogTitle>
                  <DialogDescription>Add a new card or bank account to your profile</DialogDescription>
                </DialogHeader>
                <form onSubmit={handleAddPaymentMethod}>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Payment Method Type</Label>
                      <RadioGroup
                        value={newPaymentType}
                        onValueChange={setNewPaymentType}
                        className="flex flex-col space-y-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="card" id="card" />
                          <Label htmlFor="card" className="flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Credit/Debit Card
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="bank" id="bank" />
                          <Label htmlFor="bank" className="flex items-center gap-2">
                            <Bank className="h-4 w-4" /> Bank Account
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>

                    {newPaymentType === "card" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <Input id="cardNumber" placeholder="**** **** **** ****" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="expiryDate">Expiry Date</Label>
                            <Input id="expiryDate" placeholder="MM/YY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="cvv">CVV</Label>
                            <Input id="cvv" placeholder="***" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cardholderName">Cardholder Name</Label>
                          <Input id="cardholderName" placeholder="Name as shown on card" />
                        </div>
                      </>
                    )}

                    {newPaymentType === "bank" && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="accountName">Account Holder Name</Label>
                          <Input id="accountName" placeholder="Enter your name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="bankName">Bank Name</Label>
                          <Input id="bankName" placeholder="Enter your bank name" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="routingNumber">Routing Number</Label>
                          <Input id="routingNumber" placeholder="9 digit routing number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountNumber">Account Number</Label>
                          <Input id="accountNumber" placeholder="Your account number" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="accountType">Account Type</Label>
                          <Select defaultValue="checking">
                            <SelectTrigger id="accountType">
                              <SelectValue placeholder="Select account type" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="checking">Checking</SelectItem>
                              <SelectItem value="savings">Savings</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>
                  <DialogFooter>
                    <Button variant="outline" type="button" onClick={() => setAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit">Add Payment Method</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {paymentMethods.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
              <CreditCard className="mb-2 h-10 w-10 text-muted-foreground" />
              <h3 className="mb-1 text-lg font-medium">No payment methods</h3>
              <p className="mb-4 text-sm text-muted-foreground">
                You haven't added any payment methods yet. Add a card or bank account to start investing.
              </p>
              <Button onClick={() => setAddDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" /> Add Payment Method
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {paymentMethods.map((method) => (
                <div key={method.id} className="flex items-center justify-between rounded-lg border p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {method.type === "card" ? (
                        <CreditCard className="h-5 w-5 text-primary" />
                      ) : (
                        <Bank className="h-5 w-5 text-primary" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{method.name}</p>
                        {method.isDefault && (
                          <Badge variant="outline" className="text-green-500 border-green-500">
                            <CheckCircle className="mr-1 h-3 w-3" /> Default
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{method.details}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {!method.isDefault && (
                        <DropdownMenuItem onClick={() => handleRemove(method.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Remove
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex-col items-start gap-2 text-sm text-muted-foreground">
          <p>Your payment information is securely stored and encrypted.</p>
          <p>We never store your complete card details on our servers.</p>
        </CardFooter>
      </Card>
    </div>
  )
}
