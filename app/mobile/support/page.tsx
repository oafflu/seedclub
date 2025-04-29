"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ChevronLeft, Send, MessageSquare, Phone, Mail, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"

export default function SupportPage() {
  const { toast } = useToast()
  const [message, setMessage] = useState("")
  const [subject, setSubject] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Support request submitted",
      description: "We'll get back to you as soon as possible.",
    })
    setMessage("")
    setSubject("")
  }

  return (
    <div className="container space-y-6 px-4 py-6 pb-16 md:pb-6">
      <div className="flex items-center">
        <Button variant="ghost" size="icon" asChild className="mr-2">
          <Link href="/mobile">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">Support</h1>
      </div>

      <Tabs defaultValue="contact" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
        </TabsList>

        <TabsContent value="contact" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Get in Touch</CardTitle>
              <CardDescription>
                We're here to help. Send us a message and we'll respond as soon as possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="What's your question about?"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Please describe your issue or question in detail..."
                    className="min-h-[120px]"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" /> Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-center text-lg font-medium">Live Chat</h3>
                <p className="text-center text-sm text-muted-foreground">Available 9am-5pm</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-center text-lg font-medium">Call Us</h3>
                <p className="text-center text-sm text-muted-foreground">+1 (800) 123-4567</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="flex flex-col items-center justify-center p-6">
                <div className="mb-4 rounded-full bg-primary/10 p-3">
                  <Mail className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-center text-lg font-medium">Email</h3>
                <p className="text-center text-sm text-muted-foreground">support@seedclub.com</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="faq" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Frequently Asked Questions</CardTitle>
              <CardDescription>Find quick answers to common questions about Seed Club.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                {
                  question: "How do I create a new investment jar?",
                  answer:
                    "To create a new investment jar, go to the Invest page from the dashboard or navigation menu, select your preferred investment plan, enter the amount you wish to invest, and follow the on-screen instructions to complete the setup.",
                },
                {
                  question: "What are the withdrawal terms?",
                  answer:
                    "Withdrawals are processed within 1-3 business days. Early withdrawals from investment jars may incur a fee depending on your investment plan's terms. Regular wallet funds can be withdrawn at any time without fees.",
                },
                {
                  question: "How is my interest calculated?",
                  answer:
                    "Interest is calculated based on your investment plan's annual percentage rate (APR), compounded daily. The exact rate depends on your selected plan, investment amount, and term length.",
                },
                {
                  question: "Is my money safe with Seed Club?",
                  answer:
                    "Yes, Seed Club employs bank-level security measures to protect your funds. All deposits are insured up to $250,000, and we use advanced encryption to secure all transactions and personal data.",
                },
                {
                  question: "How does the referral program work?",
                  answer:
                    "When you invite friends to join Seed Club using your unique referral link, both you and your friend receive a bonus when they make their first investment. Visit the Referrals page for more details and to get your referral link.",
                },
              ].map((faq, index) => (
                <div key={index} className="space-y-2">
                  <h3 className="font-medium">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <Clock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Still have questions?</h3>
                  <p className="text-sm text-muted-foreground">Contact our support team for personalized assistance.</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto" asChild>
                  <Link href="/mobile/support?tab=contact">Contact Us</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
