"use client"

import Link from "next/link"
import Image from "next/image"
import {
  Check,
  Shield,
  TrendingUp,
  Wallet,
  LineChart,
  Users,
  Sprout,
  Apple,
  Download,
  BellRing,
  Star,
  Users2,
  ChevronRight,
  Lock,
  BarChart3,
  PieChart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileScreen } from "@/components/mobile-screen"
import { ProfitCalculator } from "@/components/profit-calculator"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function MarketingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="relative h-8 w-32">
              <Image
                src="/images/seedclub-logo.svg"
                alt="Seed Club Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm font-medium">
              Features
            </Link>
            <Link href="/how-it-works" className="text-sm font-medium">
              How It Works
            </Link>
            <Link href="/calculator" className="text-sm font-medium">
              Calculator
            </Link>
            <Link href="/faq" className="text-sm font-medium">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center">
            <Button asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center gap-8 sm:gap-12">
            <div className="md:w-1/2 text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Smart, Secure, Simple <span className="text-primary">Financial Growth</span>
              </h1>
              <p className="mt-4 sm:mt-6 text-base sm:text-lg text-muted-foreground">
                Invest in time-bound jars with guaranteed returns. Start your financial growth journey today with Seed
                Club.
              </p>
              <div className="mt-6 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center md:justify-start">
                <Button
                  asChild
                  className="bg-black hover:bg-gray-800 text-white border border-white/20 rounded-full px-4 sm:px-6 py-5 sm:py-6 flex items-center gap-2"
                >
                  <Link href="https://apps.apple.com">
                    <Apple className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>App Store</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 sm:px-6 py-5 sm:py-6 flex items-center gap-2"
                >
                  <Link href="https://play.google.com">
                    <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Google Play</span>
                  </Link>
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 relative">
              <MobileScreen>
                {/* Dashboard Screen */}
                <div className="h-full w-full">
                  {/* Status Bar */}
                  <div className="bg-primary h-6 flex items-center justify-between px-4">
                    <span className="text-xs text-white">9:41 AM</span>
                    <div className="flex items-center space-x-1">
                      <BellRing className="h-3 w-3 text-white" />
                      <div className="h-3 w-3 rounded-full bg-white"></div>
                    </div>
                  </div>

                  {/* Header */}
                  <div className="bg-primary/10 p-4">
                    <div className="text-sm text-primary font-medium">Hi Obed!</div>
                    <div className="text-2xl font-bold mt-1">Total Balance</div>
                    <div className="text-3xl font-bold mt-1">$12,450.00</div>
                    <div className="text-sm text-green-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12.4% this month
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="p-4">
                    <div className="mb-4">
                      <div className="text-sm font-medium mb-2">Quick Actions</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-2 shadow-sm">
                          <Wallet className="h-5 w-5 text-primary mb-1" />
                          <span className="text-xs">Add Funds</span>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-2 shadow-sm">
                          <Sprout className="h-5 w-5 text-green-500 mb-1" />
                          <span className="text-xs">New Jar</span>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-white rounded-lg p-2 shadow-sm">
                          <Users className="h-5 w-5 text-blue-500 mb-1" />
                          <span className="text-xs">Refer</span>
                        </div>
                      </div>
                    </div>

                    <div className="mb-1">
                      <div className="text-sm font-medium mb-2">Your Jars</div>
                      <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
                        <div className="font-medium">Jar 1</div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">$5,000 invested</span>
                          <span className="text-xs font-medium text-green-600">10% Growth</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm mb-3">
                        <div className="font-medium">Jar 2</div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">$3,500 invested</span>
                          <span className="text-xs font-medium text-green-600">12% Growth</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg p-3 shadow-sm">
                        <div className="font-medium">Jar 3</div>
                        <div className="flex justify-between mt-1">
                          <span className="text-xs text-muted-foreground">$2,000 invested</span>
                          <span className="text-xs font-medium text-green-600">15% Growth</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: "15%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </MobileScreen>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Why Choose Seed Club?</h2>
            <p className="mt-4 text-muted-foreground">
              Experience the future of financial growth with our innovative features
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Secure Investment</h3>
              <p className="mt-2 text-muted-foreground">
                Your investments are protected with bank-grade security and encryption
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Guaranteed Returns</h3>
              <p className="mt-2 text-muted-foreground">
                Know exactly how much you'll earn with our fixed-rate investment jars
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 bg-white rounded-xl shadow-sm">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <LineChart className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold">Smart Analytics</h3>
              <p className="mt-2 text-muted-foreground">
                Track your growth with detailed analytics and performance metrics
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Calculate Your Returns</h2>
            <p className="mt-4 text-muted-foreground">
              See how much you could earn with our investment calculator
            </p>
          </div>

          <div className="mt-12">
            <ProfitCalculator />
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Benefits of Seed Club</h2>
            <p className="mt-4 text-muted-foreground">
              Join thousands of investors who trust Seed Club for their financial growth
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Community-Driven</h3>
                <p className="mt-2 text-muted-foreground">
                  Join a growing community of investors and learn from their experiences
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Regulated & Licensed</h3>
                <p className="mt-2 text-muted-foreground">
                  We operate under strict financial regulations to protect your investments
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Performance Tracking</h3>
                <p className="mt-2 text-muted-foreground">
                  Monitor your investment performance with real-time analytics
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <PieChart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Diversified Options</h3>
                <p className="mt-2 text-muted-foreground">
                  Choose from multiple investment jars with different terms and returns
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 sm:py-20 bg-gray-50">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Frequently Asked Questions</h2>
            <p className="mt-4 text-muted-foreground">
              Find answers to common questions about Seed Club
            </p>
          </div>

          <div className="mt-12 max-w-3xl mx-auto">
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>How does Seed Club work?</AccordionTrigger>
                <AccordionContent>
                  Seed Club allows you to invest in time-bound investment jars with guaranteed returns. Choose your investment amount and duration, and watch your money grow with fixed interest rates.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>Is my money safe with Seed Club?</AccordionTrigger>
                <AccordionContent>
                  Yes, your investments are protected by bank-grade security measures. We are fully regulated and licensed, ensuring your funds are secure and protected at all times.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>What are the minimum investment amounts?</AccordionTrigger>
                <AccordionContent>
                  You can start investing with as little as $100. Different investment jars may have different minimum requirements based on their terms and returns.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>How do I withdraw my investments?</AccordionTrigger>
                <AccordionContent>
                  You can withdraw your investments once the jar&apos;s term is complete. Early withdrawals may be subject to terms and conditions. The process is simple and can be done through the app.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="relative h-8 w-32 mb-4">
                <Image
                  src="/images/seedclub-logo.svg"
                  alt="Seed Club Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Smart financial growth for everyone. Start investing today and secure your future.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/features" className="text-sm text-muted-foreground hover:text-foreground">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="/how-it-works" className="text-sm text-muted-foreground hover:text-foreground">
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link href="/calculator" className="text-sm text-muted-foreground hover:text-foreground">
                    Calculator
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-sm text-muted-foreground hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Company</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-sm text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-sm text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-sm text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support-center" className="text-sm text-muted-foreground hover:text-foreground">
                    Support Center
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Seed Club. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link href="https://apps.apple.com" className="text-muted-foreground hover:text-foreground">
                  <Apple className="h-5 w-5" />
                </Link>
                <Link href="https://play.google.com" className="text-muted-foreground hover:text-foreground">
                  <Download className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
