import { MarketingLayout } from "@/components/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Briefcase, LineChart, HeartHandshake, Globe } from "lucide-react"

export default function CareersPage() {
  const openPositions = [
    {
      title: "Senior Full Stack Developer",
      department: "Engineering",
      location: "Remote (US)",
      type: "Full-time",
    },
    {
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      type: "Full-time",
    },
    {
      title: "Financial Analyst",
      department: "Finance",
      location: "Remote (US)",
      type: "Full-time",
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Miami, FL",
      type: "Full-time",
    },
    {
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Remote (US)",
      type: "Full-time",
    },
    {
      title: "UX/UI Designer",
      department: "Design",
      location: "Remote (US)",
      type: "Full-time",
    },
  ]

  return (
    <MarketingLayout title="Careers at Seed Club" description="Join our team and help build the future of investment.">
      <div className="space-y-12">
        <section>
          <div className="bg-primary/10 p-8 rounded-xl mb-8">
            <h2 className="text-2xl font-bold mb-4">Why Work With Us?</h2>
            <p className="text-lg mb-6">
              At Seed Club, we're building the future of investment. We're looking for passionate individuals who want
              to make a difference in people's financial lives.
            </p>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center p-4">
                <div className="rounded-full bg-primary/20 p-4 mb-4">
                  <HeartHandshake className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Meaningful Work</h3>
                <p className="text-sm text-muted-foreground">
                  Help people achieve financial freedom through smart investments
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="rounded-full bg-primary/20 p-4 mb-4">
                  <Globe className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Remote-First</h3>
                <p className="text-sm text-muted-foreground">
                  Work from anywhere with flexible hours and a focus on results
                </p>
              </div>
              <div className="flex flex-col items-center text-center p-4">
                <div className="rounded-full bg-primary/20 p-4 mb-4">
                  <LineChart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">Growth Opportunities</h3>
                <p className="text-sm text-muted-foreground">
                  Develop your skills and advance your career in a fast-growing company
                </p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Benefits & Perks</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Health & Wellness</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Comprehensive health, dental, and vision insurance</li>
                <li>• Mental health support and resources</li>
                <li>• Wellness stipend for gym memberships or fitness apps</li>
              </ul>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Financial Benefits</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Competitive salary and equity packages</li>
                <li>• 401(k) matching program</li>
                <li>• Special employee investment opportunities</li>
              </ul>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Work-Life Balance</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Flexible work hours</li>
                <li>• Unlimited PTO policy</li>
                <li>• Paid parental leave</li>
              </ul>
            </div>
            <div className="bg-muted/30 p-6 rounded-lg">
              <h3 className="text-xl font-bold mb-3">Growth & Development</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Learning and development budget</li>
                <li>• Conference and event attendance</li>
                <li>• Mentorship opportunities</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-6">Open Positions</h2>
          <div className="grid gap-4">
            {openPositions.map((position, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>{position.title}</CardTitle>
                  <CardDescription>{position.department}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center">
                      <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{position.location}</span>
                    </div>
                    <div className="flex items-center">
                      <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{position.type}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full">Apply Now</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </section>

        <section className="bg-primary/10 p-8 rounded-xl text-center">
          <h2 className="text-2xl font-bold mb-4">Don't See a Perfect Fit?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            We're always looking for talented individuals to join our team. Send us your resume and tell us why you'd be
            a great addition to Seed Club.
          </p>
          <Button size="lg">Submit General Application</Button>
        </section>
      </div>
    </MarketingLayout>
  )
}
