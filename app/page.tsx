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
import { Users, Star, Trophy, Target, CreditCard, CheckCircle, ChevronRight, Flame, ArrowRight, Sparkles, Gift, TrendingUp, Shield, Zap } from "lucide-react"
import { Header } from "@/components/dashboard/header"
import { LevelCard } from "@/components/dashboard/level-card"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { MiniGames } from "@/components/games/mini-games"
import { MiningSimulator } from "@/components/mining/mining-simulator"
import { DonationProvider, useDonation } from "@/contexts/donation-context"
import { useDeposit } from "@/hooks/use-deposit"
import { useTasks } from "@/hooks/use-tasks"
import { levelsData } from "@/lib/levels"
import { useContractLevels } from "@/hooks/use-contract-levels"
import { useState, useEffect } from "react"
import { useWriteContract } from "wagmi"
import { CONTRACTS, ABIS } from "@/constant/constant"

// Landing Page Component
function LandingPage() {
  const [showDashboard, setShowDashboard] = useState(false)
  const [notifications, setNotifications] = useState([
    { id: 1, name: "Sarah M.", amount: "$500", time: "2 minutes ago", location: "New York" },
    { id: 2, name: "Mike R.", amount: "$1,200", time: "5 minutes ago", location: "California" },
    { id: 3, name: "Emma L.", amount: "$800", time: "8 minutes ago", location: "Texas" },
    { id: 4, name: "David K.", amount: "$2,000", time: "12 minutes ago", location: "Florida" },
    { id: 5, name: "Lisa W.", amount: "$1,500", time: "15 minutes ago", location: "Washington" },
  ])

  const [currentNotification, setCurrentNotification] = useState(0)

  // Rotate notifications every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentNotification((prev) => (prev + 1) % notifications.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [notifications.length])

  const handleGetStarted = () => {
    setShowDashboard(true)
  }

  // If dashboard is shown, render the original dashboard
  if (showDashboard) {
    return <DashboardContent onBackToLanding={() => setShowDashboard(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-yellow-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            {/* Main Title */}
            <div className="mb-8">
              <h1 className="text-5xl sm:text-7xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 bg-clip-text text-transparent mb-4 animate-fade-in">
                Relevo8
              </h1>
              <p className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300 mb-2 animate-fade-in delay-200">
                The Revolutionary 8x Donation System
              </p>
              <p className="text-lg text-gray-500 dark:text-gray-400 animate-fade-in delay-400">
                Join thousands earning 8x returns through our innovative donation network
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-6 animate-fade-in delay-600">
              <Button 
                size="lg" 
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-xl px-12 py-6 rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
              >
                <Gift className="mr-3 h-6 w-6" />
                Receive 8 Donations
                <ArrowRight className="ml-3 h-6 w-6" />
              </Button>
            </div>

            {/* Live Notifications */}
            {/* <div className="max-w-md mx-auto mb-16">
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Live Registrations</span>
                  </div>
                  <div className="space-y-3">
                    {notifications.slice(currentNotification, currentNotification + 2).map((notification, index) => (
                      <div key={notification.id} className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-green-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {notification.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 dark:text-gray-200">{notification.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">{notification.location}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600 dark:text-green-400">{notification.amount}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div> */}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 sm:py-24 bg-white/50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              Why Choose Relevo8?
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Experience the power of 8x returns through our innovative donation system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-8 hover-lift border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">8x Returns</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get 8 times your investment back through our proven donation system
              </p>
            </Card>

            <Card className="text-center p-8 hover-lift border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Secure & Trusted</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Blockchain-powered security with smart contracts ensuring transparency
              </p>
            </Card>

            <Card className="text-center p-8 hover-lift border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Instant Payouts</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Receive your returns immediately through our automated system
              </p>
            </Card>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 sm:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Simple steps to start earning 8x returns
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">
                  1
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Make Your Investment</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose your investment level and make your deposit securely
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">
                  2
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Build Your Network</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Refer others and watch your network grow exponentially
                </p>
              </div>

              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-black">
                  3
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-4">Receive 8x Returns</h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Get 8 times your investment back through our proven system
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      {/* <div className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-200 mb-4">
              What Our Users Say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Real stories from people who have transformed their lives with Relevo8
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="p-6 hover-lift border-0 shadow-lg bg-white dark:bg-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                  SM
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Sarah Martinez</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">New York, NY</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "I invested $500 and received $4,000 back in just 2 weeks! The system really works. 
                I've already referred 3 friends and we're all earning together."
              </p>
            </Card>

            <Card className="p-6 hover-lift border-0 shadow-lg bg-white dark:bg-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold">
                  MR
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Mike Rodriguez</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Los Angeles, CA</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "This is the best investment I've ever made. The 8x returns are real and the community 
                is amazing. I'm now on my third cycle and earning consistently."
              </p>
            </Card>

            <Card className="p-6 hover-lift border-0 shadow-lg bg-white dark:bg-gray-800">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                  EL
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200">Emma Liu</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Austin, TX</p>
                </div>
              </div>
              <div className="flex items-center gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 italic">
                "I was skeptical at first, but after seeing my first return, I was hooked. 
                The system is transparent and the support team is incredible. Highly recommended!"
              </p>
            </Card>
          </div>
        </div>
      </div> */}

      {/* Final CTA Section */}
      <div className="py-16 sm:py-24 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
            Ready to Start Earning?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users already earning 8x returns with Relevo8
          </p>
          <Button 
            size="lg" 
            onClick={handleGetStarted}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-xl px-12 py-6 rounded-full shadow-2xl hover:shadow-yellow-500/25 transition-all duration-300 transform hover:scale-105"
          >
            <Gift className="mr-3 h-6 w-6" />
            Receive 8 Donations
            <ArrowRight className="ml-3 h-6 w-6" />
          </Button>
        </div>
      </div>
    </div>
  )
}

function DashboardContent({ onBackToLanding }: { onBackToLanding?: () => void }) {
  const [timeUntilReset, setTimeUntilReset] = useState("")
  
  const {
    currentLevel: contextCurrentLevel,
    balance,
    referrals,
    dailyTasksCompleted,
    withdrawalPoints,
    setWithdrawalPoints,
    miningPoints,
    setMiningPoints,
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

  const { completeDailyTask } = useTasks()
  
  // Simple withdraw function that will be handled by StatsCards component
  const handleWithdraw = () => {
    // This will be handled by the StatsCards component internally
    console.log('Withdraw requested')
  }

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
      {onBackToLanding && (
        <div className="container mx-auto px-3 sm:px-4 py-2">
          <Button 
            variant="outline" 
            onClick={onBackToLanding}
            className="mb-4 hover-lift"
          >
            <ArrowRight className="mr-2 h-4 w-4 rotate-180" />
            Back to Landing Page
          </Button>
        </div>
      )}
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
              <TabsTrigger value="mining" className="px-2 py-2">
                Mining
              </TabsTrigger>
              <TabsTrigger value="tasks" className="px-2 py-2">
                Tasks
              </TabsTrigger>
              {/* <TabsTrigger value="games" className="px-2 py-2">
                Games
              </TabsTrigger> */}
              {/* <TabsTrigger value="referrals" className="px-2 py-2">
                <span className="hidden sm:inline">Referrals</span>
                <span className="sm:hidden">Refs</span>
              </TabsTrigger> */}
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
              setWithdrawalPoints={setWithdrawalPoints}
            />
          </TabsContent>

          <TabsContent value="mining" className="space-y-4 sm:space-y-6 bg-gradient-to-br from-slate-900/30 via-purple-900/20 to-blue-900/30 dark:from-slate-800/50 dark:via-purple-800/30 dark:to-blue-800/40 rounded-lg p-6">
            <MiningSimulator
              onPointsUpdate={setWithdrawalPoints}
              currentPoints={withdrawalPoints}
              maxPoints={100}
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
                                  <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md z-50">
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

          <TabsContent value="tasks" className="space-y-6 bg-gradient-to-br from-slate-900/30 via-purple-900/20 to-blue-900/30 dark:from-slate-800/50 dark:via-purple-800/30 dark:to-blue-800/40 rounded-lg p-6">
            {/* Progress Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-gradient-to-br from-slate-800/60 via-blue-900/40 to-purple-900/50 dark:from-slate-700/80 dark:via-blue-800/60 dark:to-purple-800/70 border-blue-500/30 dark:border-blue-400/50 ">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-200 dark:text-blue-100">Daily Progress</p>
                      <p className="text-2xl font-bold text-blue-300 dark:text-blue-200">{dailyTasksCompleted}/5</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-yellow-500/20 rounded-full flex items-center justify-center">
                      <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(dailyTasksCompleted / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/60 via-purple-900/40 to-yellow-900/50 dark:from-slate-700/80 dark:via-purple-800/60 dark:to-yellow-800/70 border-purple-500/30 dark:border-purple-400/50 ">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-purple-200 dark:text-purple-100">Points Earned</p>
                      <p className="text-2xl font-bold text-purple-300 dark:text-purple-200">{dailyTasksCompleted * 5}</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500/20 via-yellow-500/20 to-blue-500/20 rounded-full flex items-center justify-center">
                      <Star className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <p className="text-xs text-purple-300 dark:text-purple-200 mt-1">
                    {25 - (dailyTasksCompleted * 5)} more available
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-slate-800/60 via-yellow-900/40 to-blue-900/50 dark:from-slate-700/80 dark:via-yellow-800/60 dark:to-blue-800/70 border-yellow-500/30 dark:border-yellow-400/50 ">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-yellow-200 dark:text-yellow-100">Login Streak</p>
                      <p className="text-2xl font-bold text-yellow-300 dark:text-yellow-200">{streak}/7</p>
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-500/20 via-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center">
                      <Flame className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
                    </div>
                  </div>
                  <p className="text-xs text-yellow-300 dark:text-yellow-200 mt-1">
                    {streak === 7 ? "Max streak! 🔥" : `${7 - streak} days to max`}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Daily Tasks */}
            <Card className="overflow-hidden bg-gradient-to-br from-slate-800/60 via-purple-900/40 to-blue-900/50 dark:from-slate-700/80 dark:via-purple-800/60 dark:to-blue-800/70 ">
              <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Daily Heroic Tasks
                    </CardTitle>
                    <CardDescription className="text-blue-100">
                      Complete tasks daily to earn withdrawal points. Tasks reset every day at midnight UTC.
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-blue-200">Next Reset</div>
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
      <LandingPage />
    </DonationProvider>
  )
}
