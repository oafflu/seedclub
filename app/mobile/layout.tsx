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
    const checkAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error || !session) {
          setIsAuthenticated(false)
          if (!pathname.startsWith('/auth/') && pathname !== '/mobile/login') {
            router.push("/auth/login")
          }
          return
        }

        // Check user role from metadata
        const role = session.user?.user_metadata?.role
        if (role !== 'customer') {
          await supabase.auth.signOut()
          setIsAuthenticated(false)
          if (!pathname.startsWith('/auth/') && pathname !== '/mobile/login') {
            router.push("/auth/login")
          }
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error('Auth check error:', error)
        setIsAuthenticated(false)
        if (!pathname.startsWith('/auth/') && pathname !== '/mobile/login') {
          router.push("/auth/login")
        }
      }
    }

    checkAuth()

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        if (!pathname.startsWith('/auth/') && pathname !== '/mobile/login') {
          router.push('/auth/login')
        }
      } else if (event === 'SIGNED_IN') {
        checkAuth()
      }
    })

    return () => {
      subscription.unsubscribe()
    }
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
  if (!isAuthenticated && !pathname.startsWith('/auth/') && pathname !== '/mobile/login') {
    return null
  }

  // If authenticated or on auth pages, show the layout
  return (
    <div className="flex min-h-screen flex-col bg-secondary-gray">
      <AppHeader />
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      <MobileNav />
    </div>
  )
}
