"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Sprout,
  Receipt,
  BarChart3,
  Wallet,
  Gift,
  HeadphonesIcon,
  Settings,
  ShieldAlert,
  FileText,
  MonitorSmartphone,
  Menu,
  ChevronDown,
  ChevronRight,
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface NavItem {
  title: string
  href: string
  icon: React.ElementType
  submenu?: NavItem[]
  expanded?: boolean
}

export function AdminNav() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(true)
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const navItems: NavItem[] = [
    {
      title: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      title: "Jars",
      href: "/admin/jars",
      icon: Sprout,
    },
    {
      title: "Transactions",
      href: "/admin/transactions",
      icon: Receipt,
      submenu: [
        {
          title: "All Transactions",
          href: "/admin/transactions",
          icon: Receipt,
        },
        {
          title: "Pending",
          href: "/admin/transactions/pending",
          icon: Receipt,
        },
      ],
    },
    {
      title: "Reports",
      href: "/admin/reports",
      icon: BarChart3,
    },
    {
      title: "Wallet",
      href: "/admin/wallet",
      icon: Wallet,
      submenu: [
        {
          title: "Overview",
          href: "/admin/wallet",
          icon: Wallet,
        },
        {
          title: "Manage",
          href: "/admin/wallet/manage",
          icon: Wallet,
        },
      ],
    },
    {
      title: "Referrals",
      href: "/admin/referrals",
      icon: Gift,
    },
    {
      title: "Support",
      href: "/admin/support",
      icon: HeadphonesIcon,
    },
    {
      title: "Marketing",
      href: "/admin/marketing",
      icon: BarChart3,
      submenu: [
        {
          title: "Overview",
          href: "/admin/marketing",
          icon: BarChart3,
        },
        {
          title: "Pages",
          href: "/admin/marketing/pages",
          icon: FileText,
        },
        {
          title: "Components",
          href: "/admin/marketing/components",
          icon: FileText,
        },
      ],
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
    {
      title: "Users & Roles",
      href: "/admin/users-roles",
      icon: Users,
    },
    {
      title: "Audit Logs",
      href: "/admin/audit-logs",
      icon: ShieldAlert,
    },
    {
      title: "System Monitoring",
      href: "/admin/system-monitoring",
      icon: MonitorSmartphone,
    },
  ]

  // Initialize expanded state based on current path
  useEffect(() => {
    const newExpandedItems: Record<string, boolean> = {}

    navItems.forEach((item) => {
      if (item.submenu) {
        const isActive = item.submenu.some(
          (subItem) => pathname === subItem.href || pathname.startsWith(`${subItem.href}/`),
        )
        newExpandedItems[item.title] = isActive
      }
    })

    setExpandedItems(newExpandedItems)
  }, [pathname])

  const toggleSubmenu = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <div
      className={cn(
        "h-screen fixed left-0 top-16 z-40 flex flex-col border-r bg-background transition-all duration-300",
        isOpen ? "w-64" : "w-20",
      )}
    >
      <div className="flex h-14 items-center border-b px-4">
        {isOpen ? (
          <h2 className="text-lg font-semibold">Navigation</h2>
        ) : (
          <h2 className="text-lg font-semibold">Nav</h2>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="ml-auto rounded-md p-2 hover:bg-accent"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>
      <nav className="flex-1 overflow-y-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.title}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleSubmenu(item.title)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-md px-3 py-2 hover:bg-accent",
                      isActive(item.href) && "bg-accent text-accent-foreground",
                    )}
                  >
                    <div className="flex items-center">
                      <item.icon className="mr-2 h-5 w-5" />
                      {isOpen && <span className="truncate">{item.title}</span>}
                    </div>
                    {isOpen &&
                      (expandedItems[item.title] ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      ))}
                  </button>
                  {isOpen && expandedItems[item.title] && (
                    <ul className="mt-1 space-y-1 pl-6">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            href={subItem.href}
                            className={cn(
                              "flex items-center rounded-md px-3 py-2 hover:bg-accent",
                              isActive(subItem.href) && "bg-accent text-accent-foreground",
                            )}
                          >
                            <subItem.icon className="mr-2 h-4 w-4" />
                            <span className="truncate">{subItem.title}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 hover:bg-accent",
                    isActive(item.href) && "bg-accent text-accent-foreground",
                  )}
                >
                  <item.icon className="mr-2 h-5 w-5" />
                  {isOpen && <span className="truncate">{item.title}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
