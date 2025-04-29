import type React from "react"
import { cn } from "@/lib/utils"

interface TypographyProps {
  children: React.ReactNode
  className?: string
}

export function Title({ children, className }: TypographyProps) {
  return <h1 className={cn("text-3xl md:text-4xl font-bold tracking-tight", className)}>{children}</h1>
}

export function Subtitle({ children, className }: TypographyProps) {
  return <h2 className={cn("text-2xl md:text-3xl font-bold tracking-tight", className)}>{children}</h2>
}

export function Paragraph({ children, className }: TypographyProps) {
  return <p className={cn("leading-7 font-light", className)}>{children}</p>
}

export function H4({ children, className }: TypographyProps) {
  return <h4 className={cn("text-lg md:text-xl font-bold tracking-tight", className)}>{children}</h4>
}

export function P({ children, className }: TypographyProps) {
  return <p className={cn("leading-7 font-light", className)}>{children}</p>
}

export function Lead({ children, className }: TypographyProps) {
  return <p className={cn("text-xl text-muted-foreground font-light", className)}>{children}</p>
}

export function Large({ children, className }: TypographyProps) {
  return <div className={cn("text-lg font-medium", className)}>{children}</div>
}

export function Small({ children, className }: TypographyProps) {
  return <small className={cn("text-sm font-light leading-none", className)}>{children}</small>
}

export function Muted({ children, className }: TypographyProps) {
  return <p className={cn("text-sm text-muted-foreground font-light", className)}>{children}</p>
}

export function Bold({ children, className }: TypographyProps) {
  return <span className={cn("font-bold", className)}>{children}</span>
}

export function Medium({ children, className }: TypographyProps) {
  return <span className={cn("font-medium", className)}>{children}</span>
}

export function Light({ children, className }: TypographyProps) {
  return <span className={cn("font-light", className)}>{children}</span>
}
