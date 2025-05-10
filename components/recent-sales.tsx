"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const defaultSales = [
  { name: "John Doe", action: "Created 12-month jar", amount: 1999, type: "deposit", avatar: "/avatars/01.png" },
  { name: "Jane Smith", action: "Deposited to 6-month jar", amount: 39, type: "deposit", avatar: "/avatars/02.png" },
  { name: "Robert Wilson", action: "Withdrew from 3-month jar", amount: 299, type: "withdrawal", avatar: "/avatars/03.png" },
  { name: "Emma Brown", action: "Created 9-month jar", amount: 999, type: "deposit", avatar: "/avatars/04.png" },
  { name: "Michael Davis", action: "Deposited to 12-month jar", amount: 499, type: "deposit", avatar: "/avatars/05.png" },
]

export function RecentSales({ sales }: { sales?: any[] }) {
  const items = sales && sales.length > 0 ? sales : defaultSales
  return (
    <div className="space-y-8">
      {items.map((item, i) => (
        <div className="flex items-center" key={i}>
          <Avatar className="h-9 w-9">
            <AvatarImage src={item.avatar || "/avatars/01.png"} alt="Avatar" />
            <AvatarFallback>{item.name?.split(" ").map((n: string) => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{item.name}</p>
            <p className="text-sm text-muted-foreground">{item.action}</p>
          </div>
          <div className={"ml-auto font-medium " + (item.type === "withdrawal" ? "text-red-500" : "")}>{item.type === "withdrawal" ? "-" : "+"}${item.amount.toLocaleString()}</div>
        </div>
      ))}
    </div>
  )
} 