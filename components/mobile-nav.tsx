"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, User } from "lucide-react"

export default function MobileNav() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname?.startsWith(path)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="grid h-16 grid-cols-5">
        <Link
          href="/mobile/dashboard"
          className={`flex flex-col items-center justify-center ${
            isActive("/mobile/dashboard") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <Home className="h-5 w-5" />
          <span className="text-xs">Home</span>
        </Link>
        <Link
          href="/mobile/wallet"
          className={`flex flex-col items-center justify-center ${
            isActive("/mobile/wallet") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <img src="/mobile/nav/wallet.svg" alt="Wallet" className="h-7 w-7" />
          <span className="text-xs">Wallet</span>
        </Link>
        <Link
          href="/mobile/invest"
          className="relative flex flex-col items-center justify-center"
        >
          <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <img src="/mobile/nav/invest.svg" alt="Invest" className="h-8 w-8" />
          </div>
          <span className="text-xs mt-6">Invest</span>
        </Link>
        <Link
          href="/mobile/referrals"
          className={`flex flex-col items-center justify-center ${
            isActive("/mobile/referrals") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <img src="/mobile/nav/referral.svg" alt="Referral" className="h-7 w-7" />
          <span className="text-xs">Referral</span>
        </Link>
        <Link
          href="/mobile/profile"
          className={`flex flex-col items-center justify-center ${
            isActive("/mobile/profile") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <img src="/mobile/nav/profile.svg" alt="Profile" className="h-7 w-7" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
}
