"use client"

import { useEffect, useState } from "react"
import Image from "next/image"

export default function SplashScreen() {
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    // Fade in animation
    const fadeInTimer = setTimeout(() => {
      setOpacity(100)
    }, 100)

    return () => clearTimeout(fadeInTimer)
  }, [])

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-primary-teal transition-opacity duration-1000"
      style={{ opacity: opacity / 100 }}
    >
      <div className="flex flex-col items-center">
        <div className="relative h-32 w-64">
          <Image src="/images/seedclub-logo.svg" alt="Seed Club Logo" fill className="object-contain" priority />
        </div>
        <p className="mt-4 text-white/80">Grow your wealth</p>
      </div>
    </div>
  )
}
