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

      {/* Smart Budgeting Section */}
      <section id="features" className="py-20">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative">
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
                  <div className="bg-primary p-4">
                    <div className="text-sm text-white font-medium">Seed Wallet</div>
                    <div className="text-2xl font-bold text-white mt-1">$20,000</div>
                    <Button size="sm" variant="secondary" className="mt-2">
                      Add Funds
                    </Button>
                  </div>

                  {/* Main Content */}
                  <div className="p-4">
                    <div className="grid grid-cols-4 gap-2 mb-4">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mb-1">
                          <Wallet className="h-5 w-5 text-blue-600" />
                        </div>
                        <span className="text-xs">Deposit</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mb-1">
                          <Sprout className="h-5 w-5 text-green-600" />
                        </div>
                        <span className="text-xs">Invest</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mb-1">
                          <LineChart className="h-5 w-5 text-purple-600" />
                        </div>
                        <span className="text-xs">Stats</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center mb-1">
                          <Users className="h-5 w-5 text-orange-600" />
                        </div>
                        <span className="text-xs">Refer</span>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Sprout className="h-4 w-4 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Jar 1</div>
                            <div className="text-xs text-gray-500">10% Growth</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">$5,000</div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                            <Sprout className="h-4 w-4 text-green-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Jar 2</div>
                            <div className="text-xs text-gray-500">12% Growth</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">$8,000</div>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                            <Sprout className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div>
                            <div className="text-sm font-medium">Jar 3</div>
                            <div className="text-xs text-gray-500">15% Growth</div>
                          </div>
                        </div>
                        <div className="text-sm font-medium">$7,000</div>
                      </div>
                    </div>
                  </div>
                </div>
              </MobileScreen>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Smart Budgeting</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything that you need to track your funds and know exactly where your money is at work.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <BarChart3 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Investment Organization</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Keep track of all your investments in one place with our intuitive jar system.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Performance Analysis</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track your growth in real-time and see exactly how your investments are performing.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <PieChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Predictive Analytics</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      See projections of your future wealth based on your current investment strategy.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seamless Investing Section */}
      <section className="py-20 bg-gray-50">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row-reverse items-center gap-12">
            <div className="md:w-1/2 relative">
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
                  </div>
                </div>
              </MobileScreen>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Seamless Investing</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Invest in our growth jars with just a few taps and watch your money grow over time.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <Sprout className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Micro Investing</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Start with as little as $100 and build your investment portfolio gradually.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <LineChart className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Curated Portfolios</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Choose from our selection of investment jars with different growth rates and terms.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Real-Time Performance</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Track your investment growth in real-time and see your wealth accumulate.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bank-Grade Security Section */}
      <section className="py-20">
        <div className="container px-4">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 relative">
              <MobileScreen>
                {/* Security Screen */}
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
                  <div className="bg-primary p-4">
                    <div className="text-sm text-white font-medium">Security Center</div>
                    <div className="text-2xl font-bold text-white mt-1">$20,000</div>
                    <div className="text-sm text-white/80 mt-1">Protected Balance</div>
                  </div>

                  {/* Main Content */}
                  <div className="p-4">
                    <div className="bg-white rounded-lg p-4 shadow-sm mb-4">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                          <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">Security Status</div>
                          <div className="text-xs text-green-600">Protected</div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="text-xs">Two-Factor Authentication</div>
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs">Biometric Login</div>
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs">Transaction Notifications</div>
                          <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center">
                            <Check className="h-3 w-3 text-green-600" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                            <Lock className="h-4 w-4 text-blue-600" />
                          </div>
                          <div className="text-sm">Security Settings</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                            <Users className="h-4 w-4 text-purple-600" />
                          </div>
                          <div className="text-sm">Trusted Contacts</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center">
                          <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mr-3">
                            <Shield className="h-4 w-4 text-orange-600" />
                          </div>
                          <div className="text-sm">Privacy Settings</div>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </MobileScreen>
            </div>
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Bank-Grade Security</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Your investments are protected with the highest level of security standards in the industry.
              </p>

              <div className="mt-8 space-y-6">
                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <Lock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Military-Grade Encryption</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      All your data and transactions are protected with end-to-end encryption.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Fraud Prevention</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Advanced fraud detection systems monitor your account 24/7 to prevent unauthorized access.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 bg-primary/10 p-2 rounded-full">
                    <Users2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Two-Factor Authentication</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      Add an extra layer of security with biometric verification and two-factor authentication.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Profit Calculator Section */}
      <section id="calculator" className="py-20 bg-gradient-to-b from-gray-50 to-white">
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

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="container px-4">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl mb-4">Frequently Asked Questions</h2>
          <p className="text-center text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
            Find answers to common questions about Seed Club and our investment options.
          </p>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>What is Seed Club?</AccordionTrigger>
                <AccordionContent>
                  Seed Club is a financial growth platform that allows you to invest in time-bound jars with guaranteed
                  returns. We offer various investment options with different growth rates and term lengths to suit your
                  financial goals.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-2">
                <AccordionTrigger>How do the investment jars work?</AccordionTrigger>
                <AccordionContent>
                  Our investment jars are time-bound investment options with guaranteed growth rates. You choose a jar
                  based on your preferred term length (12, 24, or 36 months) and corresponding growth rate (10%, 12%, or
                  15%). Your investment grows at the stated rate until maturity.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-3">
                <AccordionTrigger>Can I withdraw my funds early?</AccordionTrigger>
                <AccordionContent>
                  Yes, you can withdraw your funds before the maturity date, but early withdrawals may be subject to a
                  fee. The specific terms and conditions for early withdrawals are outlined in your investment
                  agreement.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-4">
                <AccordionTrigger>Is my investment secure?</AccordionTrigger>
                <AccordionContent>
                  Yes, your investment is secure. We implement bank-grade security measures to protect your funds and
                  personal information. Additionally, your principal investment is guaranteed, and we maintain
                  appropriate reserves to ensure we can meet our obligations to investors.
                </AccordionContent>
              </AccordionItem>

              <AccordionItem value="item-5">
                <AccordionTrigger>How do I get started?</AccordionTrigger>
                <AccordionContent>
                  Getting started is easy! Simply download the Seed Club app from the App Store or Google Play, create
                  an account, complete the verification process, and make your first deposit. You can then choose an
                  investment jar that matches your financial goals.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <h3 className="text-4xl font-bold text-primary">200k+</h3>
              <p className="mt-2 text-sm text-muted-foreground">Active users growing their wealth</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <h3 className="text-4xl font-bold text-primary">5.0</h3>
              <div className="flex mt-1 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">App Store & Google Play rating</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <h3 className="text-4xl font-bold text-primary">$50M+</h3>
              <p className="mt-2 text-sm text-muted-foreground">Total investments managed</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-16 bg-black text-white">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-3 sm:mb-4">
              Join Over 1 Million Users To Transform Your Finances
            </h2>
            <p className="text-base sm:text-lg text-white/80 mb-6 sm:mb-8">
              Start growing your wealth today with Seed Club's guaranteed returns.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Button
                asChild
                className="bg-white hover:bg-gray-100 text-black rounded-full px-4 sm:px-6 py-5 sm:py-6 flex items-center gap-2"
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
        </div>
      </section>

      <footer className="border-t bg-white py-8 sm:py-12">
        <div className="container px-4">
          <div className="grid gap-6 sm:gap-8 grid-cols-2 sm:grid-cols-4">
            <div>
              <div className="relative h-8 w-32 mb-4">
                <Image
                  src="/images/seedclub-logo.svg"
                  alt="Seed Club Logo"
                  fill
                  className="object-contain object-left"
                />
              </div>
              <p className="text-sm text-muted-foreground">Growing wealth through smart investments.</p>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Legal</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/security" className="text-muted-foreground hover:text-foreground">
                    Security
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-4">Contact Us</h3>
              <p className="text-sm text-muted-foreground mb-4">Have questions? We're here to help.</p>
              <Link href="mailto:help@seedclub.com" className="text-primary hover:text-primary/80 text-sm">
                help@seedclub.com
              </Link>
              <div className="flex gap-4 mt-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-twitter"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-facebook"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                  </svg>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                </Link>
              </div>
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
