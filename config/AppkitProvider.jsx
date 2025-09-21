"use client"

import { createWeb3Modal } from "@web3modal/wagmi/react"
import { defaultWagmiConfig } from "@web3modal/wagmi/react/config"
import { WagmiProvider } from "wagmi"
import { bsc, bscTestnet } from "wagmi/chains"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useEffect, useState } from "react"

const queryClient = new QueryClient()

const projectId = '987217903d9f70edff1a34ee30224965'

// 2. Create a metadata object - optional
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://example.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

const chains = [bscTestnet]

const wagmiConfig = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
})

export function AppKitProvider({ children }) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)

    // Only create Web3Modal on client side
    if (typeof window !== 'undefined') {
      createWeb3Modal({
        wagmiConfig,
        projectId,
        chains,
        themeVariables: {
          "--w3m-font-family": "Bree Serif, sans-serif",
          "--w3m-color-mix": "#000000",
          "--w3m-accent": "#00C5CE",
          "--w3m-border-radius-master": "2px",
        },
      })
    }
  }, [])

  // Don't render Web3 providers on server side
  if (!isClient) {
    return <>{children}</>
  }

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}
