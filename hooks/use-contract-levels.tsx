"use client"

import { useReadContract, useAccount } from "wagmi"
import { CONTRACTS, ABIS } from "@/constant/constant"
import { formatUnits } from "viem"

export function useContractLevels() {
  let address: `0x${string}` | undefined = undefined
  let isConnected = false

  try {
    const account = useAccount()
    address = account.address
    isConnected = account.isConnected
  } catch (error) {
    console.log("[useContractLevels] Wagmi context not available")
  }
  
  // Fetch user's current level from contract
  let userData: any = null
  try {
    const userQuery = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "users",
      args: address ? [address] : undefined,
      query: { enabled: !!address && isConnected },
    })
    userData = userQuery.data
  } catch (error) {
    console.log("[useContractLevels] Error fetching user data")
  }

  const currentLevel = userData ? Number((userData as any)[3]) : 1

  // Fetch level data for all levels (1-12)
  const levelQueries = Array.from({ length: 12 }, (_, i) => i + 1).map(levelId => {
    try {
      return useReadContract({
        address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
        abi: ABIS.Referral,
        functionName: "levels",
        args: [levelId],
        query: { enabled: isConnected },
      })
    } catch (error) {
      console.log(`[useContractLevels] Error fetching level ${levelId}`)
      return { data: null, isLoading: false }
    }
  })

  // Process level data
  const contractLevels = levelQueries.map((query, index) => {
    const levelId = index + 1
    const levelData = query.data
    
    if (!levelData) {
      return {
        id: levelId,
        amount: 0,
        reward: 0,
        isLoaded: false
      }
    }

    return {
      id: levelId,
      amount: Number(formatUnits((levelData as any)[0], 18)),
      reward: Number(formatUnits((levelData as any)[1], 18)),
      isLoaded: true
    }
  })

  return {
    currentLevel,
    contractLevels,
    isLoading: levelQueries.some(query => query.isLoading),
    isConnected
  }
}
