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
          <Wallet className="h-5 w-5" />
          <span className="text-xs">Wallet</span>
        </Link>
        <Link
          href="/mobile/invest"
          className="relative flex flex-col items-center justify-center"
        >
          <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L15 5M12 2L9 5M12 2V14M12 14L7 9M12 14L17 9M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-xs mt-6">Invest</span>
        </Link>
        <Link
          href="/mobile/referrals"
          className={`flex flex-col items-center justify-center ${
            isActive("/mobile/referrals") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 3.46776C17.4817 4.20411 18.5 5.73314 18.5 7.5C18.5 9.26686 17.4817 10.7959 16 11.5322M18 16.7664C19.5115 17.4503 20.8725 18.565 22 20M2 20C3.94649 17.5226 6.58918 16 9.5 16C12.4108 16 15.0535 17.5226 17 20M14 7.5C14 9.98528 11.9853 12 9.5 12C7.01472 12 5 9.98528 5 7.5C5 5.01472 7.01472 3 9.5 3C11.9853 3 14 5.01472 14 7.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-xs">Referral</span>
        </Link>
        <Link
          href="/mobile/profile"
          className={`flex flex-col items-center justify-center ${
            isActive("/mobile/profile") ? "text-primary" : "text-muted-foreground"
          }`}
        >
          <User className="h-5 w-5" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </nav>
  )
}
