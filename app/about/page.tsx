import { MarketingLayout } from "@/components/marketing-layout"
import Image from "next/image"
import { Sprout, Shield, TrendingUp, Users } from "lucide-react"

export default function AboutPage() {
  return (
    <MarketingLayout
      title="About Seed Club"
      description="Learn about our mission to help people grow their wealth through smart investments."
    >
      <div className="space-y-8">
        <div className="relative h-80 w-full rounded-xl overflow-hidden mb-8">
          <Image src="/placeholder.svg?height=600&width=1200" alt="Seed Club team" fill className="object-cover" />
        </div>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg text-muted-foreground mb-4">
            At Seed Club, we believe that everyone deserves access to high-quality investment opportunities. Our mission
            is to democratize wealth building by providing guaranteed returns through our innovative investment jar
            system.
          </p>
          <p className="text-lg text-muted-foreground">
            We're committed to transparency, security, and helping our customers achieve their financial goals through
            smart, accessible investments.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Our Story</h2>
          <p className="text-lg text-muted-foreground mb-4">
            Seed Club was founded in 2020 by a team of financial experts and technology innovators who saw a gap in the
            market for simple, transparent investment products with guaranteed returns.
          </p>
          <p className="text-lg text-muted-foreground mb-4">
            What started as a small fintech startup has grown into a trusted platform serving thousands of investors
            across the country. Our unique jar-based investment model has helped our customers grow their wealth
            consistently and predictably.
          </p>
          <p className="text-lg text-muted-foreground">
            Today, we continue to innovate and expand our offerings while staying true to our core values of simplicity,
            transparency, and customer-first service.
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Values</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="rounded-full bg-primary/10 p-4 w-fit mb-4">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Growth</h3>
              <p className="text-muted-foreground">
                We're committed to helping our customers grow their wealth through smart investments with guaranteed
                returns.
              </p>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="rounded-full bg-primary/10 p-4 w-fit mb-4">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Security</h3>
              <p className="text-muted-foreground">
                We prioritize the security of our customers' investments and personal information above all else.
              </p>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="rounded-full bg-primary/10 p-4 w-fit mb-4">
                <Sprout className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Innovation</h3>
              <p className="text-muted-foreground">
                We continuously innovate to provide the best investment products and user experience for our customers.
              </p>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <div className="rounded-full bg-primary/10 p-4 w-fit mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Community</h3>
              <p className="text-muted-foreground">
                We build a community of investors who support each other on their financial growth journeys.
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Leadership Team</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: "Sarah Johnson", title: "CEO & Co-Founder" },
              { name: "Michael Chen", title: "CTO & Co-Founder" },
              { name: "Jessica Williams", title: "Chief Investment Officer" },
              { name: "David Rodriguez", title: "Chief Marketing Officer" },
              { name: "Aisha Patel", title: "Chief Financial Officer" },
              { name: "Robert Kim", title: "Head of Customer Success" },
            ].map((person, index) => (
              <div key={index} className="text-center">
                <div className="w-32 h-32 rounded-full bg-muted mx-auto mb-4"></div>
                <h3 className="font-bold text-lg">{person.name}</h3>
                <p className="text-muted-foreground">{person.title}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </MarketingLayout>
  )
}
