"use client"

import type React from "react"

import { AdminHeader } from "@/components/admin-header"
import { AdminNav } from "@/components/admin-nav"
import { usePathname } from "next/navigation"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  // Don't show the admin nav on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

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
