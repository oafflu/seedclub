import { MarketingLayout } from "@/components/marketing-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react"

export default function ContactPage() {
  return (
    <MarketingLayout title="Contact Us" description="Have questions or need assistance? We're here to help.">
      <div className="grid md:grid-cols-2 gap-6 md:gap-12">
        <div>
          <div className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:space-x-4">
              <div className="bg-primary/10 p-3 rounded-full w-fit">
                <Mail className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Email Us</h3>
                <p className="text-muted-foreground mb-1 text-sm">For general inquiries:</p>
                <a href="mailto:info@seedclub.com" className="text-primary hover:underline">
                  info@seedclub.com
                </a>
                <p className="text-muted-foreground mt-2 mb-1 text-sm">For customer support:</p>
                <a href="mailto:support@seedclub.com" className="text-primary hover:underline">
                  support@seedclub.com
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:space-x-4">
              <div className="bg-primary/10 p-3 rounded-full w-fit">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Call Us</h3>
                <p className="text-muted-foreground mb-1 text-sm">Customer Service:</p>
                <a href="tel:+18005551234" className="text-primary hover:underline">
                  1-800-555-1234
                </a>
                <p className="text-muted-foreground mt-2 mb-1 text-sm">Hours of Operation:</p>
                <p className="text-sm">Monday - Friday: 9am - 8pm EST</p>
                <p className="text-sm">Saturday: 10am - 6pm EST</p>
                <p className="text-sm">Sunday: Closed</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:space-x-4">
              <div className="bg-primary/10 p-3 rounded-full w-fit">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Visit Us</h3>
                <p className="text-muted-foreground mb-1 text-sm">Headquarters:</p>
                <address className="not-italic text-sm">
                  123 Financial District
                  <br />
                  New York, NY 10004
                  <br />
                  United States
                </address>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:space-x-4">
              <div className="bg-primary/10 p-3 rounded-full w-fit">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg">Live Chat</h3>
                <p className="text-muted-foreground mb-3 text-sm">
                  Chat with our customer service team in real-time through our mobile app or by logging into your
                  account.
                </p>
                <Button variant="outline" size="sm">
                  Launch Live Chat
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Card>
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold mb-4">Send Us a Message</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First Name</Label>
                    <Input id="first-name" placeholder="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last Name</Label>
                    <Input id="last-name" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="john.doe@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone (Optional)</Label>
                  <Input id="phone" placeholder="(123) 456-7890" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" placeholder="How can we help you?" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea id="message" placeholder="Please provide details about your inquiry..." rows={5} />
                </div>
                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </MarketingLayout>
  )
}
