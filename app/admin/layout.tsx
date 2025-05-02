"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import { AdminHeader } from "@/components/admin-header"
import { AdminNav } from "@/components/admin-nav"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          setIsAuthenticated(false)
          if (pathname !== "/admin/login") {
            router.push("/admin/login")
          }
          return
        }

        // Check user role from metadata
        const role = session.user?.user_metadata?.role
        if (role !== 'admin' && role !== 'super_admin') {
          await supabase.auth.signOut()
          setIsAuthenticated(false)
          if (pathname !== "/admin/login") {
            router.push("/admin/login")
          }
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        if (pathname !== "/admin/login") {
          router.push("/admin/login")
        }
      }
    }

    checkAuth()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        if (pathname !== "/admin/login") {
          router.push('/admin/login')
        }
      } else if (event === 'SIGNED_IN') {
        checkAuth()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [pathname, router, supabase])

  // Don't show the admin nav on the login page
  if (pathname === "/admin/login") {
    return <>{children}</>
  }

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

  // If not authenticated, show nothing (will redirect)
  if (!isAuthenticated) {
    return null
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
