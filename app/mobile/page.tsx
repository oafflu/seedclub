"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSession } from "@/lib/supabase/auth"

export default function MobileRootPage() {
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession()
      if (session?.role === 'customer') {
        router.push('/mobile/dashboard')
      } else {
        router.push('/mobile/login')
      }
    }

    checkAuth()
  }, [router])

  return null // or a loading spinner
}
