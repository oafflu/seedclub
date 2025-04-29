"use client"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { getSession } from "@/lib/supabase/auth"

interface WithAuthProps {
  requiredRole?: 'admin' | 'customer'
}

export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  { requiredRole }: WithAuthProps = {}
) {
  return function WithAuthWrapper(props: P) {
    const router = useRouter()
    const pathname = usePathname()
    const [isAuthorized, setIsAuthorized] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      const checkAuth = async () => {
        const session = await getSession()
        
        if (!session) {
          // Redirect to appropriate login page based on required role
          const loginPath = requiredRole === 'admin' ? '/admin/login' : '/auth/login'
          router.push(loginPath)
          return
        }

        // If role is required, check if user has the correct role
        if (requiredRole && session.role !== requiredRole) {
          router.push('/')
          return
        }

        setIsAuthorized(true)
        setIsLoading(false)
      }

      checkAuth()
    }, [router, pathname])

    if (isLoading) {
      return (
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <h2 className="text-lg font-semibold">Checking authorization...</h2>
            <p className="text-sm text-muted-foreground">Please wait</p>
          </div>
        </div>
      )
    }

    if (!isAuthorized) {
      return null
    }

    return <WrappedComponent {...props} />
  }
} 