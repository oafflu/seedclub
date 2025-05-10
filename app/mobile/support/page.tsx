"use client"

import type React from "react"

import { useState, useEffect } from "react"
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
  const [tickets, setTickets] = useState<any[]>([])
  const [loadingTickets, setLoadingTickets] = useState(true)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [reply, setReply] = useState("")
  const [messages, setMessages] = useState<any[]>([])
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [activeTab, setActiveTab] = useState("contact")
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true); }, [])

  // Fetch tickets for 'My Tickets' tab (no typeof window check needed)
  useEffect(() => {
    setLoadingTickets(true)
    fetch("/api/support")
      .then((res) => res.json())
      .then((data) => setTickets(data.tickets || []))
      .finally(() => setLoadingTickets(false))
  }, [])

  // Fetch messages for selected ticket
  useEffect(() => {
    if (selectedTicket) {
      setLoadingMessages(true)
      fetch(`/api/support/messages?ticket_id=${selectedTicket.id}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.messages || []))
        .finally(() => setLoadingMessages(false))
    }
  }, [selectedTicket])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!subject.trim() || !message.trim()) return
    try {
      const res = await fetch("/api/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          description: message,
          category: "General",
          priority: "medium"
        })
      })
      if (res.ok) {
        toast({
          title: "Support request submitted",
          description: "We'll get back to you as soon as possible.",
        })
        setMessage("")
        setSubject("")
        // Refresh tickets
        setLoadingTickets(true)
        fetch("/api/support")
          .then((res) => res.json())
          .then((data) => setTickets(data.tickets || []))
          .finally(() => setLoadingTickets(false))
      } else {
        const data = await res.json()
        toast({
          title: "Error",
          description: data.error || "Failed to submit support request.",
          variant: "destructive",
        })
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit support request.",
        variant: "destructive",
      })
    }
  }

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!reply.trim()) return
    const res = await fetch("/api/support", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ticket_id: selectedTicket.id, message: reply }),
    })
    if (res.ok) {
      setReply("")
      // Refresh messages
      fetch(`/api/support/messages?ticket_id=${selectedTicket.id}`)
        .then((res) => res.json())
        .then((data) => setMessages(data.messages || []))
      toast({ title: "Reply sent" })
    } else {
      toast({ title: "Error", description: "Failed to send reply", variant: "destructive" })
    }
  }

  function clientFormattedDate(dateString: string | null | undefined) {
    if (!mounted || !dateString) return ""
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return ""
    }
  }

  // Only render the main UI after mount and tickets are loaded
  if (!mounted || loadingTickets) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
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

      <Tabs defaultValue="contact" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="contact">Contact Us</TabsTrigger>
          <TabsTrigger value="faq">FAQs</TabsTrigger>
          <TabsTrigger value="my-tickets">My Tickets</TabsTrigger>
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

          <div className="grid gap-4 md:grid-cols-1">
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
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => setActiveTab("contact")}>Contact Us</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-tickets" className="mt-4 space-y-4">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>My Tickets</CardTitle>
                <CardDescription>Manage and view your support tickets.</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingTickets ? (
                  <div className="text-center text-muted-foreground">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                  <div className="text-center text-muted-foreground">No tickets found.</div>
                ) : (
                  <div className="space-y-2">
                    {tickets.map((ticket) => (
                      <Card key={ticket.id} className="border p-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-medium">{ticket.subject}</div>
                            <div className="text-xs text-muted-foreground">Status: {ticket.status}</div>
                          </div>
                          <Button size="sm" variant="outline" onClick={() => setSelectedTicket(ticket)}>
                            View
                          </Button>
                        </div>
                        {selectedTicket && selectedTicket.id === ticket.id && (
                          <div className="mt-4 border-t pt-2">
                            <div className="mb-2 text-sm text-muted-foreground">Category: {ticket.category} | Priority: {ticket.priority}</div>
                            <div className="mb-2 text-sm">{ticket.description}</div>
                            <div className="mb-2 text-xs text-muted-foreground">Created: {clientFormattedDate(ticket.created_at)}</div>
                            <div className="font-semibold mb-1">Messages</div>
                            {loadingMessages ? (
                              <div className="text-xs text-muted-foreground">Loading messages...</div>
                            ) : messages.length === 0 ? (
                              <div className="text-xs text-muted-foreground">No messages yet.</div>
                            ) : (
                              <div className="space-y-2 max-h-40 overflow-y-auto">
                                {messages.map((msg) => (
                                  <div key={msg.id} className={`rounded p-2 text-sm ${msg.sender_type === 'customer' ? 'bg-primary/10 text-primary' : 'bg-muted'}`}>
                                    <div>{msg.message}</div>
                                    <div className="text-xs text-muted-foreground mt-1">{clientFormattedDate(msg.created_at)}</div>
                                  </div>
                                ))}
                              </div>
                            )}
                            {ticket.status !== 'closed' && (
                              <form onSubmit={handleReply} className="mt-2 flex gap-2">
                                <Input
                                  value={reply}
                                  onChange={(e) => setReply(e.target.value)}
                                  placeholder="Type your reply..."
                                  className="flex-1"
                                  required
                                />
                                <Button type="submit" disabled={!reply.trim()}><Send className="h-4 w-4 mr-1" />Send</Button>
                              </form>
                            )}
                            {ticket.status === 'closed' && (
                              <div className="mt-2 text-xs text-muted-foreground">This ticket is closed. You cannot reply.</div>
                            )}
                            <div className="mt-2">
                              <Button size="sm" variant="ghost" onClick={() => setSelectedTicket(null)}>Hide</Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
