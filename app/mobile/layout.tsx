"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AppHeader } from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function MobileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    // Temporarily disable authentication check for development
    setIsAuthenticated(true);
    // If you want to re-enable, restore the original checkAuth logic
  }, [pathname, router, supabase])

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h2 className="text-lg font-semibold">Loading...</h2>
          <p className="text-sm text-muted-foreground">Please wait while we check your authentication</p>
        </div>
      </div>
    )
  }

  // If not authenticated and not on auth pages, show nothing (will redirect)
  // (Temporarily disabled)
  // if (!isAuthenticated && !pathname.startsWith('/auth/') && pathname !== '/mobile/login') {
  //   return null
  // }

  // If authenticated or on auth pages, show the layout
  return (
    <div className="flex min-h-screen flex-col bg-secondary-gray">
      <AppHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  )
}
