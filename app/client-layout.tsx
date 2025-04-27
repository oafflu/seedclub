"use client"

import type React from "react"

import { usePathname } from "next/navigation"
import MobileNav from "@/components/mobile-nav"

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  // Don't show mobile nav on auth pages, admin pages, marketing page, or splash screen
  const shouldShowMobileNav =
    !pathname.startsWith("/admin") && !pathname.startsWith("/auth") && pathname !== "/marketing" && pathname !== "/"

  return (
    <>
      {children}
      {shouldShowMobileNav && <MobileNav />}
    </>
  )
}
