import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  Check,
  Shield,
  TrendingUp,
  Clock,
  Smartphone,
  Wallet,
  LineChart,
  Users,
  Sprout,
  Home,
  Share2,
  Apple,
  Download,
  BellRing,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { MobileScreen } from "@/components/mobile-screen"
import { ProfitCalculator } from "@/components/profit-calculator"

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

          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20">
        <div className="absolute inset-0 z-0">
          <Image
            src="/images/marketing-home-banner.jpg"
            alt="Investment growth concept showing plants growing in jars with coins"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background/60 to-background/40"></div>
        </div>
        <div className="container relative z-10 px-4 text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl drop-shadow-md">
            Grow Your Wealth with <span className="text-primary">Seed Club</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-foreground drop-shadow-md font-medium">
            Invest in time-bound jars with guaranteed returns. Start your financial growth journey today.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              asChild
              className="bg-black hover:bg-gray-800 text-white border border-white/20 rounded-full px-6 py-6 flex items-center gap-2"
            >
              <Link href="/auth/register">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-black/50 hover:bg-black/60 text-white border border-white/20 rounded-full px-6 py-6 flex items-center gap-2"
            >
              <Link href="#how-it-works">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* App Showcase Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Manage Your Investments On The Go</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                The Seed Club mobile app gives you full control of your investments anytime, anywhere. Track your
                growth, manage your jars, and make deposits with just a few taps.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  className="bg-black hover:bg-gray-800 text-white border border-white/20 rounded-full px-6 py-6 flex items-center gap-2"
                >
                  <Link href="https://apps.apple.com">
                    <Apple className="h-6 w-6" />
                    <span>Download on App Store</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-black hover:bg-gray-800 text-white border border-white/20 rounded-full px-6 py-6 flex items-center gap-2"
                >
                  <Link href="https://play.google.com">
                    <Download className="h-6 w-6" />
                    <span>Get it on Google Play</span>
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

                  {/* Bottom Nav */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-2">
                    <div className="flex flex-col items-center">
                      <Home className="h-5 w-5 text-primary" />
                      <span className="text-xs mt-1 text-primary">Home</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Sprout className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Invest</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wallet className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Wallet</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Refer</span>
                    </div>
                  </div>
                </div>
              </MobileScreen>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Why Choose Seed Club?</h2>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            <div className="grid gap-8 sm:grid-cols-2">
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-bold">Guaranteed Returns</h3>
                <p className="mt-2 text-muted-foreground">
                  Enjoy fixed growth rates of 10%, 12%, or 15% based on your chosen term length.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-bold">Secure Investment</h3>
                <p className="mt-2 text-muted-foreground">
                  Your principal is fully secured, and your returns are guaranteed at the stated growth rate.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Clock className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-bold">Flexible Terms</h3>
                <p className="mt-2 text-muted-foreground">
                  Choose from 12, 24, or 36-month terms to match your financial goals.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <Smartphone className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mt-4 text-xl font-bold">Mobile Access</h3>
                <p className="mt-2 text-muted-foreground">
                  Track and manage your investments anytime, anywhere with our easy-to-use mobile app.
                </p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <MobileScreen>
                {/* Performance Screen */}
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
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Performance</div>
                        <div className="text-xl font-bold">Growth Tracker</div>
                      </div>
                      <div className="bg-primary/10 rounded-full p-2">
                        <LineChart className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="px-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium">Total Growth</div>
                        <div className="text-sm font-bold text-green-600">+$950.25</div>
                      </div>
                      <div className="h-32 flex items-end justify-between gap-1">
                        {[15, 25, 20, 35, 22, 30, 45].map((height, i) => (
                          <div key={i} className="w-full">
                            <div className="bg-primary/80 rounded-t-sm" style={{ height: `${height}%` }}></div>
                            <div className="text-xs text-center mt-1">{`W${i + 1}`}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Sprout className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Growth Progress</div>
                          <div className="text-xs text-gray-500">Your investment is growing</div>
                        </div>
                      </div>
                      <div className="relative pt-1">
                        <div className="flex items-center justify-between mb-1">
                          <div className="text-xs font-medium text-green-600">65% to maturity</div>
                          <div className="text-xs font-medium">Dec 2025</div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div className="bg-green-600 h-2 rounded-full" style={{ width: "65%" }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-sm font-medium mb-2">Projected Returns</div>
                      <div className="flex items-center justify-between">
                        <div className="text-2xl font-bold">$15,320</div>
                        <div className="text-sm font-medium text-green-600">+23.1%</div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">By maturity date</div>
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-2">
                    <div className="flex flex-col items-center">
                      <Home className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Home</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Sprout className="h-5 w-5 text-primary" />
                      <span className="text-xs mt-1 text-primary">Invest</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wallet className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Wallet</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Refer</span>
                    </div>
                  </div>
                </div>
              </MobileScreen>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="container px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  1
                </div>
                <h3 className="mt-4 text-xl font-bold">Sign Up</h3>
                <p className="mt-2 text-muted-foreground">Create your Seed Club account in minutes.</p>
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  2
                </div>
                <h3 className="mt-4 text-xl font-bold">Choose a Jar</h3>
                <p className="mt-2 text-muted-foreground">
                  Select from our 10%, 12%, or 15% Growth investment options.
                </p>
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  3
                </div>
                <h3 className="mt-4 text-xl font-bold">Fund Your Jar</h3>
                <p className="mt-2 text-muted-foreground">Deposit funds into your selected investment jar.</p>
              </div>
              <div className="relative flex flex-col items-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                  4
                </div>
                <h3 className="mt-4 text-xl font-bold">Watch It Grow</h3>
                <p className="mt-2 text-muted-foreground">Track your investment growth in real-time.</p>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <MobileScreen>
                {/* Wallet Screen */}
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
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Seed Wallet</div>
                        <div className="text-xl font-bold">Add Funds</div>
                      </div>
                      <div className="bg-primary/10 rounded-full p-2">
                        <Wallet className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="px-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <div className="text-sm font-medium mb-2">Available Balance</div>
                      <div className="text-2xl font-bold">$2,450.00</div>
                      <div className="flex items-center mt-3">
                        <Button className="w-full" size="sm">
                          Add Funds
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <div className="text-sm font-medium mb-3">Payment Methods</div>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                              <span className="text-blue-600 text-xs font-bold">VISA</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Visa •••• 4242</div>
                              <div className="text-xs text-gray-500">Expires 12/25</div>
                            </div>
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                            <div className="w-2 h-2 rounded-full bg-primary"></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between p-2 border rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-2">
                              <span className="text-red-600 text-xs font-bold">MC</span>
                            </div>
                            <div>
                              <div className="text-sm font-medium">Mastercard •••• 5555</div>
                              <div className="text-xs text-gray-500">Expires 09/26</div>
                            </div>
                          </div>
                          <div className="w-4 h-4 rounded-full border-2 border-gray-300"></div>
                        </div>
                      </div>

                      <div className="mt-3">
                        <Button variant="outline" size="sm" className="w-full">
                          Add Payment Method
                        </Button>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-sm font-medium mb-2">Recent Transactions</div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-2">
                              <Sprout className="h-3 w-3 text-green-600" />
                            </div>
                            <div className="text-xs">Created Jar</div>
                          </div>
                          <div className="text-xs font-medium">-$1,000</div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2">
                              <Wallet className="h-3 w-3 text-blue-600" />
                            </div>
                            <div className="text-xs">Added Funds</div>
                          </div>
                          <div className="text-xs font-medium">+$2,500</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-2">
                    <div className="flex flex-col items-center">
                      <Home className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Home</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Sprout className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Invest</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wallet className="h-5 w-5 text-primary" />
                      <span className="text-xs mt-1 text-primary">Wallet</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Refer</span>
                    </div>
                  </div>
                </div>
              </MobileScreen>
            </div>
          </div>
        </div>
      </section>

      {/* Profit Calculator Section */}
      <section className="py-20 bg-gradient-to-b from-white to-muted/30">
        <div className="container px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl mb-4">Calculate Your Returns</h2>
          <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Use our investment calculator to see how much your money could grow with Seed Club's guaranteed returns.
          </p>
          <div className="max-w-4xl mx-auto">
            <ProfitCalculator />
          </div>
        </div>
      </section>

      {/* Investment Options Section */}
      <section className="py-20 bg-muted/30 relative">
        <div className="absolute inset-0 z-0 opacity-10">
          <Image
            src="/placeholder.svg?height=1080&width=1920"
            alt="Financial growth chart background"
            fill
            className="object-cover object-center"
          />
        </div>
        <div className="container px-4 relative z-10">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">Investment Options</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-primary">10% Growth</h3>
                <p className="mt-2 text-xl font-medium">12 Months</p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>Short-term commitment</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>Guaranteed 10% annual return</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>Perfect for beginners</span>
                  </li>
                </ul>
                <Button className="mt-8 w-full" asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-primary">12% Growth</h3>
                <p className="mt-2 text-xl font-medium">24 Months</p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>Medium-term growth</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>Guaranteed 12% annual return</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>Higher returns than short-term</span>
                  </li>
                </ul>
                <Button className="mt-8 w-full" asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
              <div className="rounded-lg border bg-card p-6 shadow-sm">
                <h3 className="text-2xl font-bold text-primary">15% Growth</h3>
                <p className="mt-2 text-xl font-medium">36 Months</p>
                <ul className="mt-6 space-y-3">
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>Long-term wealth building</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>Guaranteed 15% annual return</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="mr-2 h-5 w-5 text-primary" />
                    <span>Maximum growth potential</span>
                  </li>
                </ul>
                <Button className="mt-8 w-full" asChild>
                  <Link href="/auth/register">Get Started</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <MobileScreen>
                {/* Investment Jars Screen */}
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
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Investment Jars</div>
                        <div className="text-xl font-bold">Choose Your Jar</div>
                      </div>
                      <div className="bg-primary/10 rounded-full p-2">
                        <Sprout className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="px-4">
                    <div className="space-y-4">
                      <div className="bg-white rounded-lg p-4 shadow-sm border-2 border-primary">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                              <Sprout className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-bold">Jar 1</div>
                              <div className="text-xs text-primary font-medium">10% Growth</div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-gray-500">12 months</div>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Matures: Dec 2025</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Min. $100</div>
                          <Button size="sm">Select</Button>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                              <div className="text-xs text-primary font-medium">12% Growth</div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-gray-500">24 months</div>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Matures: Mar 2027</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Min. $100</div>
                          <Button size="sm" variant="outline">
                            Select
                          </Button>
                        </div>
                      </div>

                      <div className="bg-white rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mr-2">
                              <Sprout className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <div className="text-sm font-bold">Jar 3</div>
                              <div className="text-xs text-primary font-medium">15% Growth</div>
                            </div>
                          </div>
                          <div className="text-xs font-medium text-gray-500">36 months</div>
                        </div>
                        <div className="text-xs text-gray-500 mb-2">Matures: Mar 2028</div>
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">Min. $100</div>
                          <Button size="sm" variant="outline">
                            Select
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 bg-primary/10 rounded-lg p-3">
                      <div className="text-xs text-center">Higher growth rates for longer commitment periods</div>
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-2">
                    <div className="flex flex-col items-center">
                      <Home className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Home</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Sprout className="h-5 w-5 text-primary" />
                      <span className="text-xs mt-1 text-primary">Invest</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wallet className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Wallet</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Refer</span>
                    </div>
                  </div>
                </div>
              </MobileScreen>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20">
        <div className="container px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">What Our Customers Say</h2>
          <div className="mt-16 grid gap-12 md:grid-cols-2">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-background p-6 shadow">
                <p className="text-muted-foreground">
                  "The Seed Club app is amazing! I can track my investments on the go and the interface is so intuitive.
                  I've already seen great returns on my investment."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                  <div className="ml-3">
                    <p className="font-medium">Sarah Johnson</p>
                    <p className="text-sm text-muted-foreground">Investor since 2023</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-background p-6 shadow">
                <p className="text-muted-foreground">
                  "The referral program in the app is fantastic! I've earned over $500 just by referring friends and
                  family to Seed Club. It's a win-win for everyone."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                  <div className="ml-3">
                    <p className="font-medium">Michael Chen</p>
                    <p className="text-sm text-muted-foreground">Investor since 2022</p>
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-background p-6 shadow">
                <p className="text-muted-foreground">
                  "I love how I can manage my investments from anywhere with the Seed Club app. The notifications keep
                  me updated on my growth in real-time."
                </p>
                <div className="mt-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary/10"></div>
                  <div className="ml-3">
                    <p className="font-medium">Jessica Williams</p>
                    <p className="text-sm text-muted-foreground">Investor since 2023</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-center items-center">
              <MobileScreen>
                {/* Referral Screen */}
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
                  <div className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-500">Referrals</div>
                        <div className="text-xl font-bold">Invite Friends</div>
                      </div>
                      <div className="bg-primary/10 rounded-full p-2">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>

                  {/* Main Content */}
                  <div className="px-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <div className="text-sm font-medium mb-2">Your Referral Status</div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-2">
                            <Sprout className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-bold">Grower</div>
                            <div className="text-xs text-gray-500">5 referrals</div>
                          </div>
                        </div>
                        <div className="text-xs font-medium text-primary">$50/referral</div>
                      </div>
                      <div className="mt-3">
                        <div className="text-xs mb-1 flex justify-between">
                          <span>5 referrals</span>
                          <span>25 referrals</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: "20%" }}></div>
                        </div>
                        <div className="text-xs mt-1 text-right">Next: Harvester</div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <div className="text-sm font-medium mb-3">Share Your Link</div>
                      <div className="flex items-center p-2 bg-gray-100 rounded-lg mb-3">
                        <div className="text-xs truncate flex-1">seedclub.com/ref/obed123</div>
                        <Button size="sm" variant="ghost" className="h-6 px-2">
                          Copy
                        </Button>
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center mb-1">
                            <Share2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs">FB</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-pink-600 flex items-center justify-center mb-1">
                            <Share2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs">IG</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center mb-1">
                            <Share2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs">WA</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-400 flex items-center justify-center mb-1">
                            <Share2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs">TG</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <div className="w-8 h-8 rounded-full bg-gray-500 flex items-center justify-center mb-1">
                            <Share2 className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs">SMS</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="text-sm font-medium mb-2">Rewards Earned</div>
                      <div className="text-2xl font-bold">$250.00</div>
                      <div className="text-xs text-gray-500 mb-3">From 5 successful referrals</div>
                      <Button size="sm" className="w-full">
                        Withdraw to Wallet
                      </Button>
                    </div>
                  </div>

                  {/* Bottom Nav */}
                  <div className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t flex items-center justify-around px-2">
                    <div className="flex flex-col items-center">
                      <Home className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Home</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Sprout className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Invest</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Wallet className="h-5 w-5 text-gray-400" />
                      <span className="text-xs mt-1">Wallet</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Users className="h-5 w-5 text-primary" />
                      <span className="text-xs mt-1 text-primary">Refer</span>
                    </div>
                  </div>
                </div>
              </MobileScreen>
            </div>
          </div>
        </div>
      </section>

      {/* Simple App Download CTA */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container px-4">
          <div className="flex flex-col items-center text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-6">Download the Seed Club App Today</h2>
            <p className="text-lg text-primary-foreground/80 max-w-2xl mb-8">
              Start growing your wealth with guaranteed returns. Join thousands of satisfied investors building their
              financial future.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="bg-black hover:bg-gray-800 text-white border border-white/20 rounded-full px-6 py-6 flex items-center gap-2"
              >
                <Link href="https://apps.apple.com">
                  <Apple className="h-6 w-6" />
                  <span>Download on App Store</span>
                </Link>
              </Button>
              <Button
                asChild
                className="bg-black hover:bg-gray-800 text-white border border-white/20 rounded-full px-6 py-6 flex items-center gap-2"
              >
                <Link href="https://play.google.com">
                  <Download className="h-6 w-6" />
                  <span>Get it on Google Play</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t bg-background py-12">
        <div className="container px-4">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div>
              <h3 className="text-lg font-bold">Seed Club</h3>
              <p className="mt-2 text-sm text-muted-foreground">Growing wealth through smart investments.</p>
              <div className="mt-4 flex gap-3">
                <Button
                  asChild
                  className="bg-black hover:bg-gray-800 text-white border border-white/20 rounded-full px-4 py-2 flex items-center gap-2"
                >
                  <Link href="https://apps.apple.com">
                    <Apple className="h-5 w-5" />
                    <span>App Store</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  className="bg-black hover:bg-gray-800 text-white border border-white/20 rounded-full px-4 py-2 flex items-center gap-2"
                >
                  <Link href="https://play.google.com">
                    <Download className="h-5 w-5" />
                    <span>Google Play</span>
                  </Link>
                </Button>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold">Company</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/careers">Careers</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Resources</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <Link href="/blog">Blog</Link>
                </li>
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/support-center">Support</Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Legal</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
                <li>
                  <Link href="/security">Security</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Seed Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
