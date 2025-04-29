import { MarketingLayout } from "@/components/marketing-layout"
import { Shield, TrendingUp, Wallet, LineChart, Sprout, BarChart3, PieChart, Lock, Users2 } from "lucide-react"
import Image from "next/image"

export default function FeaturesPage() {
  const features = [
    {
      title: "Smart Budgeting",
      description:
        "Everything that you need to track your funds and know exactly where your money is at work. Our intuitive interface makes financial management simple.",
      icon: <BarChart3 className="h-6 w-6 text-primary" />,
      subfeatures: [
        {
          title: "Investment Organization",
          description: "Keep track of all your investments in one place with our intuitive jar system.",
          icon: <BarChart3 />,
        },
        {
          title: "Performance Analysis",
          description: "Track your growth in real-time and see exactly how your investments are performing.",
          icon: <TrendingUp />,
        },
        {
          title: "Predictive Analytics",
          description: "See projections of your future wealth based on your current investment strategy.",
          icon: <PieChart />,
        },
      ],
    },
    {
      title: "Seamless Investing",
      description:
        "Invest in our growth jars with just a few taps and watch your money grow over time. Our platform makes investing accessible to everyone.",
      icon: <Sprout className="h-6 w-6 text-primary" />,
      subfeatures: [
        {
          title: "Micro Investing",
          description: "Start with as little as $100 and build your investment portfolio gradually.",
          icon: <Sprout />,
        },
        {
          title: "Curated Portfolios",
          description: "Choose from our selection of investment jars with different growth rates and terms.",
          icon: <LineChart />,
        },
        {
          title: "Real-Time Performance",
          description: "Track your investment growth in real-time and see your wealth accumulate.",
          icon: <TrendingUp />,
        },
      ],
    },
    {
      title: "Bank-Grade Security",
      description:
        "Your investments are protected with the highest level of security standards in the industry. We take your security seriously.",
      icon: <Shield className="h-6 w-6 text-primary" />,
      subfeatures: [
        {
          title: "Military-Grade Encryption",
          description: "All your data and transactions are protected with end-to-end encryption.",
          icon: <Lock />,
        },
        {
          title: "Fraud Prevention",
          description: "Advanced fraud detection systems monitor your account 24/7 to prevent unauthorized access.",
          icon: <Shield />,
        },
        {
          title: "Two-Factor Authentication",
          description: "Add an extra layer of security with biometric verification and two-factor authentication.",
          icon: <Users2 />,
        },
      ],
    },
    {
      title: "Mobile Banking",
      description:
        "Access your account anytime, anywhere with our mobile banking app. Manage your investments on the go with ease.",
      icon: <Wallet className="h-6 w-6 text-primary" />,
      subfeatures: [
        {
          title: "Easy Deposits",
          description: "Add funds to your account easily through multiple payment methods.",
          icon: <Wallet />,
        },
        {
          title: "Smart Withdrawals",
          description: "Withdraw your funds when you need them with just a few taps.",
          icon: <Wallet />,
        },
        {
          title: "Transaction History",
          description: "Keep track of all your transactions in one place with detailed history.",
          icon: <LineChart />,
        },
      ],
    },
  ]

  return (
    <MarketingLayout
      title="Features"
      description="Discover all the powerful features that make Seed Club the best platform for your investments."
    >
      <div className="space-y-16">
        <section>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {features.map((feature, index) => (
              <div key={index} className="p-4 sm:p-6 border rounded-lg">
                <div className="rounded-full bg-primary/10 p-3 w-fit mb-4">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-bold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground mb-4 sm:mb-6 text-sm sm:text-base">{feature.description}</p>

                <div className="space-y-3 sm:space-y-4">
                  {feature.subfeatures.map((subfeature, idx) => (
                    <div key={idx} className="flex gap-3">
                      <div className="mt-1 bg-muted/50 p-2 rounded-full">
                        <div className="h-4 w-4 text-primary">{subfeature.icon}</div>
                      </div>
                      <div>
                        <h4 className="font-medium text-sm sm:text-base">{subfeature.title}</h4>
                        <p className="text-xs sm:text-sm text-muted-foreground">{subfeature.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-4">Get the Seed Club Mobile App</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Experience all these features and more on our mobile app. Download now and start your investment journey.
            </p>
          </div>
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2">
              <div className="relative h-[400px] sm:h-[500px] w-full">
                <Image src="/placeholder.svg?key=9vl81" alt="Seed Club App" fill className="object-contain" />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-2xl font-bold mb-2">Intuitive Design</h3>
                <p className="text-muted-foreground">
                  Our app is designed with simplicity in mind, making it easy for anyone to manage their investments,
                  regardless of their financial experience.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Real-time Updates</h3>
                <p className="text-muted-foreground">
                  Get instant notifications about your investment growth, deposits, and withdrawals. Stay informed about
                  your financial progress.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Secure Access</h3>
                <p className="text-muted-foreground">
                  Access your account securely with biometric authentication or two-factor authentication. Your security
                  is our priority.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}
