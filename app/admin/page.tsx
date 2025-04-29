"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminRootPage() {
  const router = useRouter()

  useEffect(() => {
    const adminSession = localStorage.getItem("admin_session")
    if (adminSession) {
      router.push('/admin/dashboard')
    } else {
      router.push('/admin/login')
    }
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-semibold">Loading...</h2>
        <p className="text-sm text-muted-foreground">Please wait while we redirect you</p>
      </div>
    </div>
  )
}
