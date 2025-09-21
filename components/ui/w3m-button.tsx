"use client"

import { useEffect, useState } from 'react'

interface W3MButtonProps {
  balance?: 'show' | 'hide'
  size?: 'sm' | 'md' | 'mdl' | 'xxl'
}

export function W3MButton({ balance = 'show', size = 'md' }: W3MButtonProps) {
  const [W3MButtonComponent, setW3MButtonComponent] = useState<any>(null)
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Dynamically import w3m-button only on client side
    if (typeof window !== 'undefined') {
      import('@web3modal/wagmi/react').then((module) => {
        // The w3m-button is registered globally, so we create a wrapper component
        setW3MButtonComponent(() => {
          return function W3MButtonWrapper() {
            return <w3m-button balance={balance} size={size} />
          }
        })
      }).catch((error) => {
        console.error('Failed to load w3m-button:', error)
      })
    }
  }, [balance, size])

  if (!isClient || !W3MButtonComponent) {
    // Fallback button during SSR or loading
    return (
      <button 
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
        disabled
      >
        Connect Wallet
      </button>
    )
  }

  return <W3MButtonComponent />
}
