import type React from "react"
import AppHeader from "@/components/app-header"
// Remove the MobileNav import

export default function HistoryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-secondary-gray">
      <AppHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      {/* Remove the MobileNav component from here */}
    </div>
  )
}
