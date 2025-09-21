"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Star, Users, Trophy, Flame } from "lucide-react"

interface StatsCardsProps {
  withdrawalPoints: number
  referrals: number
  dailyTasksCompleted: number
  streak: number
  handleWithdraw: () => void
}

export function StatsCards({
  withdrawalPoints,
  referrals,
  dailyTasksCompleted,
  streak,
  handleWithdraw,
}: StatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
      <Card className="hover-lift scale-in holographic">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Withdrawal Points</CardTitle>
          <Star className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 particle-float" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="space-y-2">
            <div className="text-xl sm:text-2xl font-bold text-green-500">{withdrawalPoints}%</div>
            <Progress value={withdrawalPoints} className="h-2 progress-animated" />
            <p className="text-xs text-muted-foreground">Daily tasks maintain eligibility</p>
            <Button
              size="sm"
              className="w-full text-xs mt-2"
              onClick={handleWithdraw}
              disabled={withdrawalPoints < 100}
            >
              {withdrawalPoints >= 100 ? "Withdraw $100" : `Need ${100 - withdrawalPoints} more`}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="hover-lift scale-in holographic">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Active Network</CardTitle>
          <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 float-animation" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-xl sm:text-2xl font-bold text-blue-500">{referrals}</div>
          <p className="text-xs text-muted-foreground">{8 - referrals} more needed</p>
        </CardContent>
      </Card>

      <Card className="hover-lift scale-in holographic">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Daily Tasks</CardTitle>
          <Trophy className="h-3 w-3 sm:h-4 sm:w-4 text-purple-500 coin-flip" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-xl sm:text-2xl font-bold text-purple-500">{dailyTasksCompleted}/5</div>
          <p className="text-xs text-muted-foreground">+{5 - dailyTasksCompleted} points available</p>
        </CardContent>
      </Card>

      <Card className="hover-lift scale-in holographic">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 px-3 sm:px-6 pt-3 sm:pt-6">
          <CardTitle className="text-xs sm:text-sm font-medium">Login Streak</CardTitle>
          <Flame className="h-3 w-3 sm:h-4 sm:w-4 text-orange-500 glow-effect" />
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3 sm:pb-6">
          <div className="text-xl sm:text-2xl font-bold text-orange-500">{streak}</div>
          <p className="text-xs text-muted-foreground">Keep the momentum!</p>
        </CardContent>
      </Card>
    </div>
  )
}
