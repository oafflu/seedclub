"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { AdminNav } from "@/components/admin-nav"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user is authenticated for admin section
    const adminSession = localStorage.getItem("admin_session")
    setIsAuthenticated(!!adminSession)

    // If not on login page and not authenticated, redirect to login
    if (pathname !== "/admin/login" && !adminSession) {
      router.push("/admin/login")
    }
  }, [pathname, router])

  // Don't show the admin nav on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  // If authenticated, show the admin layout
  return (
    <div className="min-h-screen flex flex-col">
      <AdminHeader />

      <div className="flex flex-1 pt-16">
        <AdminNav />

        <main className="flex-1 ml-64 p-6">{children}</main>
      </div>
    </div>
  )
}
