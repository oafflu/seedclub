"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Menu, X, Apple, Download } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MarketingLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function MarketingLayout({ children, title, description }: MarketingLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="relative h-8 w-32">
              <Image
                src="/images/seedclub-logo.svg"
                alt="Seed Club Logo"
                fill
                className="object-contain object-left"
                priority
              />
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden flex items-center justify-center p-2 rounded-md text-muted-foreground"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

          {/* Desktop navigation */}
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

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Button asChild variant="outline">
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/register">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden border-t`}>
          <div className="container py-4 space-y-4">
            <nav className="flex flex-col space-y-4">
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
            <div className="flex flex-col gap-2">
              <Button asChild variant="outline">
                <Link href="/auth/login">Sign in</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <section className="py-12 sm:py-20">
          <div className="container px-4">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">{title}</h1>
              <p className="mt-4 text-muted-foreground text-lg">{description}</p>
            </div>

            <div className="mt-12">
              {children}
            </div>
          </div>
        </section>
      </main>

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
