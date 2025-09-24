"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Star, Users, Trophy, Flame } from "lucide-react"
import { useEffect, useState } from "react"
import { useWriteContract, useReadContract, useAccount } from "wagmi"
import { CONTRACTS, ABIS } from "@/constant/constant"
import { formatUnits } from "viem"

// Client-side withdrawal component with wagmi hooks
function WithdrawButtonClient({ 
  withdrawalPoints, 
  onWithdrawSuccess
}: { 
  withdrawalPoints: number
  onWithdrawSuccess: () => void
}) {
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const { writeContract: withdraw, isPending, isSuccess } = useWriteContract()
  const { address } = useAccount()
  
  // Get user balance from contract
  const { data: userData } = useReadContract({
    address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
    abi: ABIS.Referral,
    functionName: "users",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  })
  
  // Extract balance from user data
  const userBalance = userData ? Number(formatUnits((userData as any)[5], 6)) : 0
  
  // Handle successful withdrawal
  useEffect(() => {
    if (isSuccess) {
      onWithdrawSuccess()
    }
  }, [isSuccess, onWithdrawSuccess])
  
  const handleWithdraw = async () => {
    if (!withdraw) return
    
    setIsWithdrawing(true)
    
    try {
      await withdraw({
        address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
        abi: ABIS.Referral,
        functionName: "withdrawCredit",
        args: [],
      })
    } catch (error) {
      console.error('Withdrawal failed:', error)
      setIsWithdrawing(false)
    }
  }
  
  const isDisabled = withdrawalPoints < 75 || isWithdrawing || isPending || userBalance <= 0
  
  return (
    <Button
      size="sm"
      className="w-full text-xs mt-2"
      onClick={handleWithdraw}
      disabled={isDisabled}
    >
      {isWithdrawing || isPending ? "Withdrawing..." : 
       withdrawalPoints >= 75 ?  userBalance <= 0 ? "No Balance" : `Withdraw($${userBalance})` : `${75 - withdrawalPoints} more needed`}
    </Button>
  )
}

// Wrapper component that only renders on client side
function WithdrawButton({ 
  withdrawalPoints, 
  onWithdrawSuccess
}: { 
  withdrawalPoints: number
  onWithdrawSuccess: () => void
}) {
  const [isClient, setIsClient] = useState(false)
  
  useEffect(() => {
    setIsClient(true)
  }, [])
  
  if (!isClient) {
    return (
      <Button
        size="sm"
        className="w-full text-xs mt-2"
        disabled
      >
        Loading...
      </Button>
    )
  }
  
  return (
    <WithdrawButtonClient 
      withdrawalPoints={withdrawalPoints}
      onWithdrawSuccess={onWithdrawSuccess}
    />
  )
}

interface StatsCardsProps {
  withdrawalPoints: number
  referrals: number
  dailyTasksCompleted: number
  streak: number
  handleWithdraw: () => void
  setWithdrawalPoints: (points: number) => void
  userBalance?: number
}

export function StatsCards({
  withdrawalPoints,
  referrals,
  dailyTasksCompleted,
  streak,
  handleWithdraw,
  setWithdrawalPoints,
}: StatsCardsProps) {
  // Handle successful withdrawal
  const handleWithdrawSuccess = () => {
    setWithdrawalPoints(0)
    // Save updated state to localStorage
    const dataToSave = {
      withdrawalPoints: 0,
      streak,
      totalEarned: 0, // This should come from context
      dailyTasksCompleted,
      lastLoginDate: new Date().toISOString().split('T')[0],
    }
    localStorage.setItem("olympus-donation-data", JSON.stringify(dataToSave))
  }
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
      <Card className="hover-lift scale-in holographic">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Withdrawal Points</CardTitle>
          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 particle-float" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="space-y-2">
            <div className="text-xl sm:text-2xl font-bold text-green-500">{withdrawalPoints}%</div>
            <Progress value={withdrawalPoints} className="h-2 progress-animated" />
            <p className="text-xs text-muted-foreground">
              {withdrawalPoints >= 75 ? "Ready to withdraw!" : `${75 - withdrawalPoints} more points needed`}
            </p>
            <WithdrawButton 
              withdrawalPoints={withdrawalPoints}
              onWithdrawSuccess={handleWithdrawSuccess}
            />
          </div>
        </CardContent>
      </Card>

      {/* <Card className="hover-lift scale-in holographic">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Active Network</CardTitle>
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 float-animation" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-xl sm:text-2xl font-bold text-blue-500">{referrals}</div>
          <p className="text-xs text-muted-foreground">{8 - referrals} more needed</p>
        </CardContent>
      </Card> */}

      <Card className="hover-lift scale-in holographic">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Daily Tasks</CardTitle>
          <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 coin-flip" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-xl sm:text-2xl font-bold text-purple-500">{dailyTasksCompleted}/5</div>
          <p className="text-xs text-muted-foreground">
            {dailyTasksCompleted === 5 ? "All tasks completed! 🎉" : `+${(5 - dailyTasksCompleted) * 5} points available`}
          </p>
        </CardContent>
      </Card>

      <Card className="hover-lift scale-in holographic">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Login Streak</CardTitle>
          <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 glow-effect" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-xl sm:text-2xl font-bold text-orange-500">{streak}/7</div>
          <p className="text-xs text-muted-foreground">
            {streak === 7 ? "Max streak! 🔥" : `${7 - streak} days to max bonus`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
