"use client"

import { Web3Provider } from './web3-provider'
import { ReactNode } from 'react'

interface ClientProviderProps {
  children: ReactNode
}

export function ClientProvider({ children }: ClientProviderProps) {
  return <Web3Provider>{children}</Web3Provider>
}
