"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated for customer section
    const customerAuth = localStorage.getItem("isAuthenticated")
    setIsAuthenticated(customerAuth === "true")

    // If not authenticated, redirect to login
    if (customerAuth !== "true") {
      router.push("/auth/login")
    }
  }, [router])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  // If authenticated, show the mobile layout
  return (
    <div className="flex min-h-screen flex-col bg-secondary-gray">
      <AppHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  )
}
