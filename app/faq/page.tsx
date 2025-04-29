import { MarketingLayout } from "@/components/marketing-layout"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

export default function FAQPage() {
  const faqCategories = [
    {
      id: "general",
      label: "General",
      questions: [
        {
          question: "What is Seed Club?",
          answer:
            "Seed Club is an investment platform that offers time-bound investment jars with guaranteed returns. We provide a simple way for individuals to grow their wealth through fixed APY rates of 10%, 12%, or 15% based on the chosen term length.",
        },
        {
          question: "How does Seed Club work?",
          answer:
            "Seed Club works by allowing users to invest their money in 'jars' with fixed terms (12, 24, or 36 months) and guaranteed APY rates. Users can track their investment growth in real-time through our web platform or mobile app, and withdraw their funds with earned interest upon maturity.",
        },
        {
          question: "Is Seed Club available in my country?",
          answer:
            "Currently, Seed Club is available in the United States. We're working on expanding to other countries soon. Sign up for our newsletter to be notified when we launch in your region.",
        },
        {
          question: "How do I contact customer support?",
          answer:
            "You can contact our customer support team through multiple channels: email at support@seedclub.com, phone at 1-800-555-1234, or through the live chat feature in our mobile app or website when logged into your account.",
        },
      ],
    },
    {
      id: "account",
      label: "Account",
      questions: [
        {
          question: "How do I create an account?",
          answer:
            "To create an account, click on the 'Get Started' button on our homepage, fill out the registration form with your personal information, verify your email address, and complete the identity verification process.",
        },
        {
          question: "What information do I need to provide to open an account?",
          answer:
            "To open an account, you'll need to provide your full name, email address, phone number, home address, date of birth, and Social Security Number (for US residents). This information is required for identity verification and tax reporting purposes.",
        },
        {
          question: "How do I reset my password?",
          answer:
            "To reset your password, click on the 'Forgot Password' link on the login page, enter your registered email address, and follow the instructions sent to your email to create a new password.",
        },
        {
          question: "Can I have multiple accounts?",
          answer:
            "No, each individual is limited to one Seed Club account. This policy helps us maintain security and comply with regulatory requirements.",
        },
      ],
    },
    {
      id: "investments",
      label: "Investments",
      questions: [
        {
          question: "What are the minimum and maximum investment amounts?",
          answer:
            "The minimum investment amount for any jar is $100. There is no maximum limit, allowing you to invest as much as you'd like based on your financial goals.",
        },
        {
          question: "How are the returns guaranteed?",
          answer:
            "Seed Club guarantees returns through strategic investments in a diversified portfolio of assets, including fixed-income securities, real estate, and other stable investment vehicles. Our business model is designed to deliver the promised returns while maintaining a safety margin.",
        },
        {
          question: "Can I withdraw my investment before maturity?",
          answer:
            "Yes, you can withdraw your investment before maturity, but early withdrawals are subject to a fee that varies based on how much time is left in your term. The specific fee structure is outlined in our terms of service and shown to you before confirming an early withdrawal.",
        },
        {
          question: "What happens when my investment jar matures?",
          answer:
            "When your investment jar matures, you'll receive a notification, and the full amount (principal plus earned interest) will be transferred to your Seed Club wallet. From there, you can withdraw the funds to your bank account or reinvest in a new jar.",
        },
      ],
    },
    {
      id: "payments",
      label: "Payments",
      questions: [
        {
          question: "What payment methods are accepted?",
          answer:
            "Seed Club accepts bank transfers (ACH), wire transfers, debit cards, and credit cards for funding your account. Please note that credit card transactions may incur additional fees from your card issuer.",
        },
        {
          question: "How long does it take to process deposits and withdrawals?",
          answer:
            "Deposits via ACH typically take 1-3 business days to process, while debit/credit card deposits are usually instant. Withdrawals to your bank account generally take 2-3 business days to complete after the request is submitted.",
        },
        {
          question: "Are there any fees for deposits or withdrawals?",
          answer:
            "Seed Club does not charge fees for standard deposits or withdrawals. However, wire transfers and expedited withdrawals may incur a small processing fee, which will be disclosed before you confirm the transaction.",
        },
        {
          question: "Can I set up automatic deposits?",
          answer:
            "Yes, you can set up automatic recurring deposits on a weekly, bi-weekly, or monthly basis. This feature helps you consistently grow your investments without having to manually make deposits each time.",
        },
      ],
    },
    {
      id: "security",
      label: "Security",
      questions: [
        {
          question: "How is my personal and financial information protected?",
          answer:
            "Seed Club employs bank-level security measures, including 256-bit encryption, secure socket layer (SSL) technology, and multi-factor authentication to protect your personal and financial information. We also regularly undergo security audits by independent third parties.",
        },
        {
          question: "Is my investment insured?",
          answer:
            "While Seed Club is not FDIC-insured like a traditional bank, we maintain comprehensive insurance policies that protect against fraud, theft, and cybersecurity breaches. Additionally, our diversified investment strategy minimizes risk to your principal.",
        },
        {
          question: "What security features does the app have?",
          answer:
            "Our app includes multiple security features such as biometric authentication (fingerprint/face recognition), PIN protection, automatic logout after inactivity, and real-time notifications for account activities to alert you of any unauthorized access.",
        },
        {
          question: "How do I report suspicious activity on my account?",
          answer:
            "If you notice any suspicious activity on your account, immediately contact our security team at security@seedclub.com or call our dedicated security hotline at 1-800-555-9876. You should also change your password immediately.",
        },
      ],
    },
  ]

  return (
    <MarketingLayout
      title="Frequently Asked Questions"
      description="Find answers to common questions about Seed Club and our investment services."
    >
      <div className="space-y-12">
        <div className="relative max-w-lg mx-auto mb-6">
          <div className="flex items-center border rounded-lg overflow-hidden">
            <Input
              placeholder="Search for answers..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
            <Button variant="ghost" className="h-full px-3 aspect-square rounded-none">
              <Search className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
        </div>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto py-1">
            {faqCategories.map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs sm:text-sm">
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {faqCategories.map((category) => (
            <TabsContent key={category.id} value={category.id} className="mt-6">
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </TabsContent>
          ))}
        </Tabs>

        <section className="bg-muted/30 p-4 sm:p-8 rounded-xl">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Still Have Questions?</h2>
          <p className="text-base sm:text-lg mb-4 sm:mb-6">
            If you couldn't find the answer you were looking for, our customer support team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button className="flex-1">Contact Support</Button>
            <Button variant="outline" className="flex-1">
              Schedule a Call
            </Button>
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}
