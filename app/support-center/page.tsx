import { MarketingLayout } from "@/components/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, MessageSquare, Phone, Video, Mail, HelpCircle, BookOpen, FileQuestion } from "lucide-react"
import Link from "next/link"

export default function SupportCenterPage() {
  const supportCategories = [
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Account Issues",
      description: "Help with login problems, account verification, and profile updates.",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Investment Questions",
      description: "Information about investment jars, returns, and maturity dates.",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Payment Support",
      description: "Assistance with deposits, withdrawals, and payment methods.",
    },
    {
      icon: <HelpCircle className="h-6 w-6" />,
      title: "Technical Support",
      description: "Help with website or mobile app issues and troubleshooting.",
    },
    {
      icon: <FileQuestion className="h-6 w-6" />,
      title: "Tax & Legal",
      description: "Questions about tax documents, legal requirements, and compliance.",
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Educational Resources",
      description: "Access guides, tutorials, and learning materials about investing.",
    },
  ]

  const popularArticles = [
    "How to Reset Your Password",
    "Understanding Your Investment Statement",
    "Setting Up Automatic Deposits",
    "Withdrawing Funds After Maturity",
    "Tax Implications of Your Investments",
    "Troubleshooting Mobile App Issues",
  ]

  return (
    <MarketingLayout title="Support Center" description="Get help with your Seed Club account, investments, and more.">
      <div className="space-y-12">
        <section>
          <div className="relative mb-8">
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Input
                placeholder="Search for help articles..."
                className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
              />
              <Button className="h-full rounded-none">Search</Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {supportCategories.map((category, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">{category.icon}</div>
                  <div>
                    <CardTitle>{category.title}</CardTitle>
                    <CardDescription className="mt-1">{category.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">
                    View Articles
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Popular Help Articles</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {popularArticles.map((article, index) => (
              <Link
                href="#"
                key={index}
                className="p-4 border rounded-lg hover:bg-muted/30 transition-colors flex items-center gap-3"
              >
                <FileText className="h-5 w-5 text-primary" />
                <span>{article}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Contact Support</h2>
          <Tabs defaultValue="chat" className="w-full">
            <TabsList className="w-full grid grid-cols-4">
              <TabsTrigger value="chat" className="flex flex-col items-center gap-2 py-3">
                <MessageSquare className="h-5 w-5" />
                <span>Live Chat</span>
              </TabsTrigger>
              <TabsTrigger value="email" className="flex flex-col items-center gap-2 py-3">
                <Mail className="h-5 w-5" />
                <span>Email</span>
              </TabsTrigger>
              <TabsTrigger value="phone" className="flex flex-col items-center gap-2 py-3">
                <Phone className="h-5 w-5" />
                <span>Phone</span>
              </TabsTrigger>
              <TabsTrigger value="video" className="flex flex-col items-center gap-2 py-3">
                <Video className="h-5 w-5" />
                <span>Video Call</span>
              </TabsTrigger>
            </TabsList>
            <TabsContent value="chat" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Live Chat Support</CardTitle>
                  <CardDescription>Chat with our support team in real-time for immediate assistance.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Our live chat support is available Monday through Friday from 9am to 8pm EST, and Saturday from 10am
                    to 6pm EST.
                  </p>
                  <Button className="w-full">Start Chat</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="email" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Email Support</CardTitle>
                  <CardDescription>Send us an email and we'll get back to you within 24 hours.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    For general inquiries, email us at info@seedclub.com. For account-specific issues, please email
                    support@seedclub.com.
                  </p>
                  <Button className="w-full">Compose Email</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="phone" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Phone Support</CardTitle>
                  <CardDescription>Speak directly with our customer service representatives.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Call us at 1-800-555-1234. Our phone support is available Monday through Friday from 9am to 8pm EST,
                    and Saturday from 10am to 6pm EST.
                  </p>
                  <Button className="w-full">Call Support</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="video" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Video Call Support</CardTitle>
                  <CardDescription>
                    Schedule a video call with a support specialist for personalized assistance.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="mb-4 text-muted-foreground">
                    Video calls are available by appointment only. Schedule a time that works for you, and one of our
                    specialists will call you.
                  </p>
                  <Button className="w-full">Schedule Video Call</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

        <section className="bg-primary/10 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Frequently Asked Questions</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Find quick answers to common questions about Seed Club and our investment services.
          </p>
          <Button asChild size="lg">
            <Link href="/faq">View FAQ</Link>
          </Button>
        </section>
      </div>
    </MarketingLayout>
  )
}
