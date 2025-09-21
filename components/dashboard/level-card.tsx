"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, CheckCircle, AlertCircle, ArrowRight, Sparkles, Trophy } from "lucide-react"

interface Level {
  id: number
  name: string
  amount: number
  reward: number
  category: string
  icon: string
  description: string
}

interface LevelCardProps {
  currentLevelData: Level
  currentLevel: number
  referrals: number
  totalEarned: number
  balance: number
  isConnected: boolean
  isDepositModalOpen: boolean
  setIsDepositModalOpen: (open: boolean) => void
  depositAmount: string
  setDepositAmount: (amount: string) => void
  isProcessingDeposit: boolean
  processDeposit: () => void
}

export function LevelCard({
  currentLevelData,
  currentLevel,
  referrals,
  totalEarned,
  balance,
  isConnected,
  isDepositModalOpen,
  setIsDepositModalOpen,
  depositAmount,
  setDepositAmount,
  isProcessingDeposit,
  processDeposit,
}: LevelCardProps) {
  const progressToNext = (referrals / 8) * 100

  return (
    <Card className=" hover-lift slide-in-up">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <span className="text-2xl sm:text-3xl float-animation">{currentLevelData.icon}</span>
              <div>
                <div className="text-base sm:text-xl">{currentLevelData.name}</div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs holographic">
                    Level {currentLevel}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <span className="hidden sm:inline">{currentLevelData.category}</span>
                    <span className="sm:hidden">Cat {currentLevel}</span>
                  </Badge>
                </div>
              </div>
            </CardTitle>
            <CardDescription className="mt-2 text-sm italic text-muted-foreground">
              "{currentLevelData.description}"
            </CardDescription>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-sm text-muted-foreground">Total Earned</div>
            <div className="text-xl sm:text-2xl font-bold text-green-500 coin-flip">${totalEarned}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 border border-green-500/20 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Investment Opportunity
              </h3>
              <Badge variant="secondary" className="holographic">
                8x Return
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Investment</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-green-500">${currentLevelData.amount}</p>
                <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-500">Potential Reward</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-500">${currentLevelData.reward}</p>
                <p className="text-xs text-muted-foreground mt-1">From 8 referrals</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <span>ROI:</span>
              <span className="font-bold text-green-500">
                +{((currentLevelData.reward / currentLevelData.amount - 1) * 100).toFixed(0)}%
              </span>
              <ArrowRight className="h-4 w-4" />
              <span>Complete your network to unlock rewards</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">Network Progress</span>
            <span className="font-semibold">{referrals}/8 referrals</span>
          </div>
          <div className="relative">
            <Progress value={progressToNext} className="h-4 progress-animated" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-white drop-shadow-lg">{Math.round(progressToNext)}%</span>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Level {currentLevel}</span>
            <span>Level {currentLevel + 1}</span>
          </div>
        </div>

        <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full deposit-button hover-lift" size="lg" disabled={!isConnected}>
              <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">
                Deposit ${currentLevelData.amount} - Start Level {currentLevel}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md z-50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <span className="text-xl sm:text-2xl">{currentLevelData.icon}</span>
                <span className="text-sm sm:text-base">Deposit for {currentLevelData.name}</span>
              </DialogTitle>
              <DialogDescription className="text-sm">
                Make your investment to start your heroic journey at Level {currentLevel}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-center">
                <div className="p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground">Required Amount</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">${currentLevelData.amount}</p>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-muted-foreground">Expected Return</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-500">${currentLevelData.reward}</p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="deposit-amount">Deposit Amount (USDT)</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  placeholder={currentLevelData.amount.toString()}
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="text-center text-lg font-semibold h-12"
                />
              </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-500">Your wallet balance: {balance} USDT</p>
              </div>

              <Button
                onClick={processDeposit}
                className="w-full deposit-button h-12"
                size="lg"
                disabled={isProcessingDeposit || !depositAmount}
              >
                {isProcessingDeposit ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="text-sm sm:text-base">Processing Transaction...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span className="text-sm sm:text-base">Confirm Deposit</span>
                  </>
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  )
}
