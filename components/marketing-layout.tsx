import type React from "react"
import Link from "next/link"
import Image from "next/image"
import { Apple, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MarketingLayoutProps {
  children: React.ReactNode
  title: string
  description?: string
}

export function MarketingLayout({ children, title, description }: MarketingLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/marketing" className="relative h-8 w-32">
              <Image
                src="/images/seedclub-logo.svg"
                alt="Seed Club Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>
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

      {/* Page Content */}
      <main className="flex-1">
        <div className="container py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-6">{title}</h1>
            {description && <p className="text-xl text-muted-foreground mb-8">{description}</p>}
            {children}
          </div>
        </div>
      </main>

      {/* Footer */}
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
                  <Link href="/contact" className="text-muted-foreground hover:text-foreground">
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Resources</h3>
              <ul className="mt-2 space-y-2 text-sm">
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-muted-foreground hover:text-foreground">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link href="/support-center" className="text-muted-foreground hover:text-foreground">
                    Support
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold">Legal</h3>
              <ul className="mt-2 space-y-2 text-sm">
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
          </div>
          <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Seed Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
