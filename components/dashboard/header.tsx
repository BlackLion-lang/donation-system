"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Wallet, Shield, Sparkles, Flame } from "lucide-react"
import Image from "next/image"
import { useAccount } from "wagmi"
import { W3MButton } from "@/components/ui/w3m-button"

interface HeaderProps {
  balance: number
  streak: number
  // isConnected: boolean
  // connectWallet: () => void
}

export function Header({ balance, streak }: HeaderProps) {

  const [isMenuOpen, setIsMenuOpen] = useState(false)
  
  // Safely use useAccount hook
  let address = undefined
  let isConnected = false
  
  try {
    const account = useAccount()
    address = account.address
    isConnected = account.isConnected
  } catch (error) {
    // Handle case when wagmi context is not available (SSR)
    console.log("[v0] Wagmi context not available in header")
  }

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="relative">
              <Image
                src="/logo.png"
                alt="Olympus Donation Logo"
                width={32}
                height={32}
                className="sm:w-10 sm:h-10 float-animation"
              />
              <div className="absolute inset-0 rounded-full glow-effect opacity-30"></div>
            </div>
            <div>
              <h1 className="text-lg sm:text-2xl font-bold bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
                Olympus Donation
              </h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Collaborative Economy Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            {/* <Badge variant="secondary" className="gap-1 sm:gap-2 hover-lift holographic text-xs sm:text-sm px-2 py-1">
              <Wallet className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden xs:inline">{balance}</span>
              <span className="xs:hidden">{balance}</span>
              <span className="hidden sm:inline">USDT</span>
            </Badge>
            <Badge variant="outline" className="gap-1 sm:gap-2 particle-float text-xs px-2 py-1 hidden sm:flex">
              <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
              {streak} day streak
            </Badge>
            {!isConnected ? (
              <Button
                onClick={connectWallet}
                className="shimmer hover-lift deposit-button text-xs sm:text-sm px-3 py-2"
              >
                <Sparkles className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Connect Wallet</span>
                <span className="sm:hidden">Connect</span>
              </Button>
            ) : (
              <Badge variant="default" className="gap-1 sm:gap-2 glow-effect text-xs px-2 py-1">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Connected</span>
                <span className="sm:hidden">✓</span>
              </Badge>
            )} */}
            
             <Badge variant="outline" className="gap-1 sm:gap-2 particle-float text-xs px-2 py-1 hidden sm:flex">
              <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500" />
              {streak} day streak
            </Badge>

            <W3MButton balance="show" size="sm" />

          </div>
        </div>
      </div>
    </header>
  )
}
