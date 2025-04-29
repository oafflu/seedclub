import { MarketingLayout } from "@/components/marketing-layout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle, ArrowRight, Download } from "lucide-react"

export default function HowItWorksPage() {
  const steps = [
    {
      number: 1,
      title: "Create Your Account",
      description:
        "Sign up for Seed Club in just a few minutes. Provide your basic information and verify your identity to get started.",
    },
    {
      number: 2,
      title: "Fund Your Wallet",
      description:
        "Add funds to your Seed Club wallet using your preferred payment method. You can start with any amount that fits your budget.",
    },
    {
      number: 3,
      title: "Choose Your Investment Jar",
      description:
        "Select from our range of investment jars with different term lengths and guaranteed growth rates (10%, 12%, or 15%).",
    },
    {
      number: 4,
      title: "Watch Your Money Grow",
      description:
        "Track your investment growth in real-time through our intuitive dashboard. See exactly how much your money is growing each day.",
    },
    {
      number: 5,
      title: "Withdraw at Maturity",
      description:
        "When your investment term ends, withdraw your principal plus all earned interest to your bank account or reinvest for continued growth.",
    },
  ]

  return (
    <MarketingLayout
      title="How It Works"
      description="Learn how to grow your wealth with Seed Club's simple investment process."
    >
      <div className="space-y-16">
        <section>
          <div className="relative">
            {/* Vertical line connecting the steps */}
            <div className="absolute left-4 top-6 bottom-6 w-0.5 bg-muted-foreground/20 hidden md:block"></div>

            <div className="space-y-8 sm:space-y-12">
              {steps.map((step, index) => (
                <div key={index} className="flex flex-col md:flex-row gap-4 sm:gap-6">
                  <div className="md:w-24 flex-shrink-0 flex md:justify-center">
                    <div className="h-8 w-8 sm:h-9 sm:w-9 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                      {step.number}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm sm:text-base">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-muted/30 p-8 rounded-xl">
          <div className="flex flex-col md:flex-row items-start gap-6 sm:gap-8">
            <div className="flex-1">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Investment Jars Explained</h2>
              <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">
                Our investment jars are time-bound investment options with guaranteed returns. Each jar has a fixed term
                and a guaranteed growth rate:
              </p>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium">12-month jar:</span> 10% annual guaranteed growth
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium">24-month jar:</span> 12% annual guaranteed growth
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  <div>
                    <span className="font-medium">36-month jar:</span> 15% annual guaranteed growth
                  </div>
                </li>
              </ul>
            </div>
            <div className="flex-1">
              <div className="p-6 bg-white rounded-lg shadow-sm">
                <h3 className="font-bold mb-4 text-xl">Growth Example</h3>
                <p className="text-muted-foreground mb-4">
                  Here's how a $10,000 investment would grow in our different jars:
                </p>
                <div className="space-y-4">
                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">12-month jar (10%)</div>
                      <div className="text-green-600 font-bold">$11,000</div>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div className="bg-primary h-full rounded-full" style={{ width: "10%" }}></div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">$1,000 profit</div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">24-month jar (12%)</div>
                      <div className="text-green-600 font-bold">$12,544</div>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div className="bg-primary h-full rounded-full" style={{ width: "25%" }}></div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">$2,544 profit</div>
                  </div>

                  <div className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div className="font-medium">36-month jar (15%)</div>
                      <div className="text-green-600 font-bold">$15,209</div>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full">
                      <div className="bg-primary h-full rounded-full" style={{ width: "52%" }}></div>
                    </div>
                    <div className="mt-2 text-xs text-muted-foreground">$5,209 profit</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section>
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Ready to Start Your Investment Journey?</h2>
            <p className="text-lg text-muted-foreground">
              Download the Seed Club app and start growing your wealth today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-black hover:bg-gray-800 text-white border border-white/20 rounded-full px-4 sm:px-6 flex items-center gap-2"
            >
              <Link href="https://apps.apple.com">
                <Download className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>App Store</span>
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              className="bg-primary hover:bg-primary/90 rounded-full px-4 sm:px-6 flex items-center gap-2"
            >
              <Link href="/auth/register">
                <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />
                <span>Get Started</span>
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}
