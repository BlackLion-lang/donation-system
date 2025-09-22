"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Users, Star, Trophy, Target, CreditCard, CheckCircle, ChevronRight, Flame } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { LevelCard } from "@/components/dashboard/level-card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MiniGames } from "@/components/games/mini-games"
import { DonationProvider, useDonation } from "@/contexts/donation-context"
import { useDeposit } from "@/hooks/use-deposit"
import { useTasks } from "@/hooks/use-tasks"
import { levelsData } from "@/lib/levels"
import { useContractLevels } from "@/hooks/use-contract-levels"
import { useState, useEffect } from "react"

function DashboardContent() {
  const [timeUntilReset, setTimeUntilReset] = useState("")
  
  const {
    currentLevel: contextCurrentLevel,
    balance,
    referrals,
    dailyTasksCompleted,
    withdrawalPoints,
    isConnected,
    setIsConnected,
    setBalance,
    streak,
    totalEarned,
    transactions,
    achievements,
  } = useDonation()

  // Real-time clock for daily reset
  useEffect(() => {
    const updateTimeUntilReset = () => {
      // Get current time
      const now = new Date()
      
      // Get current UTC time
      const utcNow = new Date(now.toISOString())
      
      // Get current UTC date (YYYY-MM-DD)
      const today = utcNow.toISOString().split('T')[0]
      
      // Create tomorrow's midnight UTC (00:00:00 UTC tomorrow)
      const tomorrowMidnight = new Date(today + 'T00:00:00.000Z')
      tomorrowMidnight.setUTCDate(tomorrowMidnight.getUTCDate() + 1)
      
      // Calculate time difference in milliseconds
      const timeDiff = tomorrowMidnight.getTime() - utcNow.getTime()
      
      // Convert to hours, minutes, seconds
      const hours = Math.floor(timeDiff / (1000 * 60 * 60))
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)
      
      setTimeUntilReset(`${hours}h ${minutes}m ${seconds}s`)
    }

    updateTimeUntilReset()
    const interval = setInterval(updateTimeUntilReset, 1000) // Update every second

    return () => clearInterval(interval)
  }, [])

  // Get contract data for levels
  const { currentLevel, contractLevels, isLoading: levelsLoading } = useContractLevels()

  const {
    isDepositModalOpen,
    setIsDepositModalOpen,
    depositAmount,
    setDepositAmount,
    isProcessingDeposit,
    processDeposit,
  } = useDeposit()

  const { completeDailyTask, handleWithdraw } = useTasks()

  const connectWallet = () => {
    setIsConnected(true)
    setBalance(500)
  }

  const getLevelProgression = () => {
    const maxDisplay = 5
    const start = Math.max(0, currentLevel - 3)
    const end = Math.min(levelsData.length, start + maxDisplay)
    return levelsData.slice(start, end)
  }

  const currentLevelData = levelsData[currentLevel - 1]

  return (
    <div className="min-h-screen bg-background">
      <Header balance={balance} streak={streak} />
{/* isConnected={isConnected} connectWallet={connectWallet} */}
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <Tabs defaultValue="dashboard" className="space-y-4 sm:space-y-8">
          <div className="w-full">
            <TabsList className="grid grid-cols-4 glass-effect min-w-full sm:w-full text-xs sm:text-sm">
              <TabsTrigger value="dashboard" className="px-2 py-2">
                <span className="hidden sm:inline">Dashboard</span>
                <span className="sm:hidden">Home</span>
              </TabsTrigger>
              <TabsTrigger value="levels" className="px-2 py-2">
                Levels
              </TabsTrigger>
              <TabsTrigger value="games" className="px-2 py-2">
                Games
              </TabsTrigger>
              {/* <TabsTrigger value="referrals" className="px-2 py-2">
                <span className="hidden sm:inline">Referrals</span>
                <span className="sm:hidden">Refs</span>
              </TabsTrigger> */}
              <TabsTrigger value="tasks" className="px-2 py-2">
                Tasks
              </TabsTrigger>
              {/* <TabsTrigger value="achievements" className="px-2 py-2">
                <span className="hidden sm:inline">Achievements</span>
                <span className="sm:hidden">Awards</span>
              </TabsTrigger> */}
              {/* <TabsTrigger value="transactions" className="px-2 py-2">
                <span className="hidden sm:inline">Transactions</span>
                <span className="sm:hidden">History</span>
              </TabsTrigger> */}
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-4 sm:space-y-6">
            <LevelCard
              currentLevelData={currentLevelData}
              walletAddress={undefined}
            />

            <StatsCards
              withdrawalPoints={withdrawalPoints}
              referrals={referrals}
              dailyTasksCompleted={dailyTasksCompleted}
              streak={streak}
              handleWithdraw={handleWithdraw}
            />
          </TabsContent>

          <TabsContent value="levels" className="space-y-4 sm:space-y-6">
            {/* <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-blue-500" />
                  Your Journey Progress
                </CardTitle>
                <CardDescription>Track your heroic ascension through the levels</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center gap-2 overflow-x-auto pb-2">
                  {getLevelProgression().map((level, index, array) => (
                    <div key={level.id} className="flex items-center gap-2 flex-shrink-0">
                      <div
                        className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-all ${
                          level.id === currentLevel
                            ? "bg-green-500/20 border-2 border-green-500 scale-110"
                            : level.id < currentLevel
                              ? "bg-green-500/10 border border-green-500/30"
                              : "bg-muted/20 border border-muted"
                        }`}
                      >
                        <span className="text-lg">{level.icon}</span>
                        <span className="text-xs font-medium">Level {level.id}</span>
                        <span className="text-xs text-muted-foreground">${level.amount}</span>
                      </div>
                      {index < array.length - 1 && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card> */}

            <div className="grid gap-3 sm:gap-4">
              {levelsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2 text-muted-foreground">Loading levels...</span>
                </div>
              ) : (
                contractLevels.map((contractLevel, index) => {
                  const staticLevel = levelsData[index]
                  if (!staticLevel) return null
                  
                  return (
                    <Card
                      key={contractLevel.id}
                      className={`${contractLevel.id === currentLevel ? "level-up-animation" : "hover-lift"} ${contractLevel.id < currentLevel ? "opacity-60" : ""}`}
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex items-start gap-3 sm:gap-4">
                              <div className="text-2xl sm:text-3xl float-animation">{staticLevel.icon}</div>
                              <div className="flex-1">
                                <h3 className="font-semibold text-base sm:text-lg">{staticLevel.name}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{staticLevel.category}</p>
                                <p className="text-sm italic text-muted-foreground/80 mb-2">"{staticLevel.description}"</p>
                                <div className="flex flex-wrap gap-2">
                                  {contractLevel.id === currentLevel && (
                                    <Badge variant="default" className="text-xs">
                                      Current Level
                                    </Badge>
                                  )}
                                  {contractLevel.id < currentLevel && (
                                    <Badge variant="secondary" className="text-xs">
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                              <div className="text-center sm:text-right">
                                <p className="text-sm text-muted-foreground">
                                  Invest ${contractLevel.isLoaded ? contractLevel.amount.toFixed(0) : "No data"}
                                </p>
                                <p className="text-lg font-bold text-primary">
                                  Earn ${contractLevel.isLoaded ? (contractLevel.amount * 8).toFixed(0) : "No data"}
                                </p>
                              </div>
                              {contractLevel.id === currentLevel && isConnected && (
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button className="deposit-button w-full sm:w-auto">
                                      <CreditCard className="mr-2 h-4 w-4" />
                                      Deposit
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md gradient-border z-50">
                                    <DialogHeader>
                                      <DialogTitle className="flex items-center gap-2">
                                        <span className="text-2xl">{staticLevel.icon}</span>
                                        <span className="text-sm sm:text-base">{staticLevel.name}</span>
                                      </DialogTitle>
                                      <DialogDescription className="text-sm italic">
                                        "{staticLevel.description}"
                                      </DialogDescription>
                                    </DialogHeader>
                                    <div className="space-y-4">
                                      <div className="text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                                        <p className="text-sm text-muted-foreground">Required Investment</p>
                                        <p className="text-2xl sm:text-3xl font-bold text-green-500">
                                          ${contractLevel.isLoaded ? contractLevel.amount.toFixed(0) : staticLevel.amount}
                                        </p>
                                      </div>
                                      <Button className="w-full deposit-button h-12" size="lg">
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Confirm Deposit
                                      </Button>
                                    </div>
                                  </DialogContent>
                                </Dialog>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="games" className="space-y-4 sm:space-y-6">
            <MiniGames />
          </TabsContent>

          {/* <TabsContent value="transactions" className="space-y-4 sm:space-y-6">
            <Card className="gradient-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                  Transaction History
                </CardTitle>
                <CardDescription className="text-sm">Track all your deposits and rewards</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 sm:space-y-4">
                  {transactions.map((transaction) => (
                    <div
                      key={transaction.id}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-3 sm:p-4 rounded-lg border hover-lift holographic"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${transaction.type === "deposit" ? "bg-red-500/20" : "bg-green-500/20"}`}
                        >
                          {transaction.type === "deposit" ? (
                            <CreditCard className="h-4 w-4 text-red-500" />
                          ) : (
                            <Trophy className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-sm sm:text-base">
                            {transaction.type === "deposit" ? "Deposit" : "Reward"} - Level {transaction.level}
                          </p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                        <p
                          className={`font-bold text-lg sm:text-base ${transaction.type === "deposit" ? "text-red-500" : "text-green-500"}`}
                        >
                          {transaction.type === "deposit" ? "-" : "+"}${transaction.amount}
                        </p>
                        <Badge
                          variant={transaction.status === "completed" ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {transaction.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}

          {/* <TabsContent value="referrals" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Your Referral Network</CardTitle>
                <CardDescription>Share your link and build your heroic network</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-secondary/20 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Your Referral Link</p>
                  <code className="text-sm bg-background p-2 rounded border block">
                    https://olympus-donation.com/ref/hero123
                  </code>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-4 rounded-lg bg-card border">
                    <p className="text-2xl font-bold text-primary">2</p>
                    <p className="text-sm text-muted-foreground">Level 1</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border">
                    <p className="text-2xl font-bold text-primary">4</p>
                    <p className="text-sm text-muted-foreground">Level 2</p>
                  </div>
                  <div className="p-4 rounded-lg bg-card border">
                    <p className="text-2xl font-bold text-primary">2</p>
                    <p className="text-sm text-muted-foreground">Level 3</p>
                  </div>
                </div>

                <Button className="w-full">
                  <Users className="mr-2 h-4 w-4" />
                  Share Referral Link
                </Button>
              </CardContent>
            </Card>
          </TabsContent> */}

          <TabsContent value="tasks" className="space-y-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Daily Progress</p>
                      <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{dailyTasksCompleted}/5</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(dailyTasksCompleted / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/20 dark:to-green-900/20 border-green-200 dark:border-green-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">Points Earned</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">{dailyTasksCompleted * 5}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    {25 - (dailyTasksCompleted * 5)} more available
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/20 dark:to-orange-900/20 border-orange-200 dark:border-orange-800">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Login Streak</p>
                      <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">{streak}/7</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-500/20 rounded-full flex items-center justify-center">
                      <Flame className="h-6 w-6 text-orange-600 dark:text-orange-400" />
                    </div>
                  </div>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    {streak === 7 ? "Max streak! 🔥" : `${7 - streak} days to max`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Tasks */}
            <Card className="overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Daily Heroic Tasks
                    </CardTitle>
                    <CardDescription className="text-purple-100">
                      Complete tasks daily to earn withdrawal points. Tasks reset every day at midnight UTC.
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-purple-200">Next Reset</div>
                    <div className="text-lg font-bold text-white">{timeUntilReset}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="space-y-0">
                  {[
                    { 
                      task: "Login to your account", 
                      description: "Visit the platform daily",
                      icon: "🏠",
                      completed: dailyTasksCompleted >= 1,
                      points: 5
                    },
                    { 
                      task: "Check your progress", 
                      description: "Review your dashboard and stats",
                      icon: "📊",
                      completed: dailyTasksCompleted >= 2,
                      points: 5
                    },
                    { 
                      task: "Explore levels page", 
                      description: "Browse available investment levels",
                      icon: "📈",
                      completed: dailyTasksCompleted >= 3,
                      points: 5
                    },
                    { 
                      task: "Play mini-games", 
                      description: "Engage with the gaming features",
                      icon: "🎮",
                      completed: dailyTasksCompleted >= 4,
                      points: 5
                    },
                    { 
                      task: "Complete all tasks", 
                      description: "Finish your daily checklist",
                      icon: "✅",
                      completed: dailyTasksCompleted >= 5,
                      points: 5
                    },
                  ].map((item, index) => (
                    <div key={index} className={`flex items-center justify-between p-6 border-b last:border-b-0 transition-all duration-300 ${
                      item.completed 
                        ? "bg-green-50 dark:bg-green-950/10 border-green-200 dark:border-green-800" 
                        : "hover:bg-muted/30"
                    }`}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl transition-all duration-300 ${
                          item.completed 
                            ? "bg-green-500 text-white" 
                            : "bg-muted text-muted-foreground"
                        }`}>
                          {item.completed ? "✓" : item.icon}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold text-lg ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                              {item.task}
                            </span>
                            {item.completed && (
                              <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-green-500" />
                                <span className="text-sm text-green-600 dark:text-green-400 font-medium">+{item.points}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {item.completed ? (
                          <Badge variant="default" className="bg-green-500 hover:bg-green-600 text-white px-4 py-2">
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Completed
                          </Badge>
                        ) : (
                          <Button 
                            size="lg" 
                            onClick={completeDailyTask} 
                            disabled={dailyTasksCompleted >= 5}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-2"
                          >
                            Complete Task
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {dailyTasksCompleted === 5 && (
                  <div className="p-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                        <Trophy className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="font-bold text-lg">All Daily Tasks Completed! 🎉</h3>
                        <p className="text-green-100">
                          You've earned 25 points today! Come back tomorrow for new tasks.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* <TabsContent value="achievements" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Your Achievements
                </CardTitle>
                <CardDescription>Unlock rewards as you progress through your heroic journey</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div
                      key={achievement.id}
                      className={`p-4 rounded-lg border transition-all duration-300 hover-lift ${
                        achievement.unlocked
                          ? "bg-gradient-to-br from-green-500/10 to-green-600/5 border-green-500/20"
                          : "bg-muted/20 border-muted"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`text-2xl ${achievement.unlocked ? "" : "grayscale opacity-50"}`}>
                          {achievement.icon}
                        </div>
                        <div className="flex-1">
                          <h3
                            className={`font-semibold ${achievement.unlocked ? "text-green-500" : "text-muted-foreground"}`}
                          >
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                        </div>
                        {achievement.unlocked && (
                          <Badge variant="default" className="bg-green-500">
                            <Star className="h-3 w-3 mr-1" />
                            Unlocked
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent> */}
        </Tabs>
      </div>
    </div>
  )
}

export default function DonationDashboard() {
  return (
    <DonationProvider>
      <DashboardContent />
    </DonationProvider>
  )
}
