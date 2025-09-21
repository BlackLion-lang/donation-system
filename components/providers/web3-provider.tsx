"use client"

import { ReactNode, useEffect, useState } from 'react'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'
import { bscTestnet } from 'wagmi/chains'

const queryClient = new QueryClient()

const projectId = '987217903d9f70edff1a34ee30224965'

const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com',
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const chains = [bscTestnet] as const

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

interface Web3ProviderProps {
  children: ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    
    // Dynamically import and initialize Web3Modal only on client side
    if (typeof window !== 'undefined') {
      import('@web3modal/wagmi/react').then(({ createWeb3Modal }) => {
        createWeb3Modal({
          wagmiConfig,
          projectId,
          themeVariables: {
            "--w3m-font-family": "Bree Serif, sans-serif",
            "--w3m-color-mix": "#000000",
            "--w3m-accent": "#00C5CE",
            "--w3m-border-radius-master": "2px",
          },
        })
      }).catch((error) => {
        console.error('Failed to load Web3Modal:', error)
      })
    }
  }, [])

  // Don't render Web3 providers on server side
  if (!isClient) {
    return <>{children}</>
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
