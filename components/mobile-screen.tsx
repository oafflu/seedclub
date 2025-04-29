import type { ReactNode } from "react"
import { cn } from "@/lib/utils"

interface MobileScreenProps {
  children: ReactNode
  className?: string
}

export function MobileScreen({ children, className }: MobileScreenProps) {
  return (
    <div className={cn("relative mx-auto w-[280px] h-[560px]", className)}>
      {/* Phone frame */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800 to-black rounded-[40px] shadow-xl overflow-hidden border-[8px] border-gray-800">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-6 bg-black rounded-b-xl z-10"></div>

        {/* Screen */}
        <div className="absolute inset-0 rounded-[32px] overflow-hidden bg-gray-100">{children}</div>

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-white rounded-full z-10"></div>
      </div>
    </div>
  )
}
