"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Wallet, User, Gift, Sprout } from "lucide-react"

export default function MobileNav() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Home",
      href: "/mobile",
      icon: Home,
      color: "text-blue-500",
    },
    {
      name: "Wallet",
      href: "/mobile/wallet",
      icon: Wallet,
      color: "text-emerald-500",
    },
    {
      name: "Invest",
      href: "/mobile/invest",
      icon: Sprout,
      color: "text-green-500",
      main: true,
    },
    {
      name: "Referral",
      href: "/mobile/referrals",
      icon: Gift,
      color: "text-amber-500",
    },
    {
      name: "Profile",
      href: "/mobile/profile",
      icon: User,
      color: "text-purple-500",
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 z-50 w-full border-t bg-background md:hidden">
      <div className="grid h-16 grid-cols-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex flex-col items-center justify-center space-y-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              {item.main ? (
                <div className="absolute -top-6 flex h-12 w-12 items-center justify-center rounded-full bg-primary-orange">
                  <item.icon className="h-5 w-5 text-ivory" />
                </div>
              ) : (
                <item.icon className={`h-5 w-5 ${isActive ? item.color : "text-muted-foreground"}`} />
              )}
              <span className="text-xs">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
