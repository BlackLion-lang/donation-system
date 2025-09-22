"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useAccount } from "wagmi"
import { getCurrentUTCDate, isNewDay, isConsecutiveDay, updateLoginStreak, resetDailyTasks } from "@/utils/daily-reset"

interface DonationContextType {
  currentLevel: number
  setCurrentLevel: (level: number) => void
  balance: number
  setBalance: (balance: number) => void
  referrals: number
  setReferrals: (referrals: number) => void
  dailyTasksCompleted: number
  setDailyTasksCompleted: (tasks: number) => void
  withdrawalPoints: number
  setWithdrawalPoints: (points: number | ((prev: number) => number)) => void
  isConnected: boolean
  setIsConnected: (connected: boolean) => void
  streak: number
  setStreak: (streak: number) => void
  totalEarned: number
  setTotalEarned: (earned: number | ((prev: number) => number)) => void
  lastLoginDate: string
  setLastLoginDate: (date: string) => void
  isDataLoaded: boolean
  transactions: Transaction[]
  setTransactions: (transactions: Transaction[] | ((prev: Transaction[]) => Transaction[])) => void
  achievements: Achievement[]
  setAchievements: (achievements: Achievement[]) => void
}

interface Transaction {
  id: number
  type: "deposit" | "reward"
  amount: number
  level: number
  status: "completed" | "pending"
  date: string
}

interface Achievement {
  id: number
  name: string
  description: string
  unlocked: boolean
  icon: string
}

const DonationContext = createContext<DonationContextType | undefined>(undefined)

export function DonationProvider({ children }: { children: ReactNode }) {
  // Safely use useAccount hook with error boundary
  let walletConnected = false
  let address = undefined
  
  try {
    const account = useAccount()
    walletConnected = account.isConnected
    address = account.address
  } catch (error) {
    // Handle case when wagmi context is not available (SSR)
    console.log("[v0] Wagmi context not available, using default values")
  }
  
  const [currentLevel, setCurrentLevel] = useState(1)
  const [balance, setBalance] = useState(0)
  const [referrals, setReferrals] = useState(0)
  const [dailyTasksCompleted, setDailyTasksCompleted] = useState(0)
  const [withdrawalPoints, setWithdrawalPoints] = useState(0)
  const [isConnected, setIsConnected] = useState(false)
  const [streak, setStreak] = useState(1)
  const [totalEarned, setTotalEarned] = useState(0)
  const [lastLoginDate, setLastLoginDate] = useState("")
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const [transactions, setTransactions] = useState<Transaction[]>([
    { id: 1, type: "deposit", amount: 1, level: 1, status: "completed", date: "2024-01-15" },
    { id: 2, type: "reward", amount: 8, level: 1, status: "completed", date: "2024-01-20" },
  ])
  const [achievements, setAchievements] = useState<Achievement[]>([
    { id: 1, name: "First Steps", description: "Complete your first donation", unlocked: true, icon: "🎯" },
    { id: 2, name: "Network Builder", description: "Refer 5 people", unlocked: true, icon: "🌐" },
    { id: 3, name: "Streak Master", description: "7-day login streak", unlocked: true, icon: "🔥" },
    { id: 4, name: "Level Climber", description: "Reach level 5", unlocked: false, icon: "⛰️" },
  ])

  // Wallet connection state will be managed by components that have access to wagmi context

  // Load data from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("olympus-donation-data")
    let loadedData = {
      withdrawalPoints: 0,
      streak: 1,
      totalEarned: 0,
      dailyTasksCompleted: 0,
      lastLoginDate: "",
    }

    if (savedData) {
      try {
        loadedData = { ...loadedData, ...JSON.parse(savedData) }
        console.log("[v0] Loading saved data:", loadedData)
      } catch (error) {
        console.error("[v0] Error loading saved data:", error)
      }
    }

    // Use UTC dates for consistency across timezones
    const today = getCurrentUTCDate()
    const savedLastLogin = localStorage.getItem("olympus-last-login")

    console.log("[v0] Streak check - Today (UTC):", today)
    console.log("[v0] Streak check - Saved last login:", savedLastLogin)
    console.log("[v0] Streak check - Current streak:", loadedData.streak)

    // Check if daily tasks should reset (new day)
    const lastTaskDate = localStorage.getItem("olympus-last-task-date")
    if (isNewDay(lastTaskDate)) {
      console.log("[v0] New day detected - resetting daily tasks")
      loadedData.dailyTasksCompleted = 0
      localStorage.setItem("olympus-last-task-date", today)
    }

    // Handle login streak logic
    if (isNewDay(savedLastLogin)) {
      const { newStreak, bonusPoints } = updateLoginStreak(loadedData.streak, savedLastLogin)
      
      loadedData.streak = newStreak
      loadedData.withdrawalPoints += bonusPoints
      
      console.log(
        "[v0] Streak updated! New streak:",
        newStreak,
        "Bonus points:",
        bonusPoints,
        "Total points:",
        loadedData.withdrawalPoints,
      )

      localStorage.setItem("olympus-last-login", today)
      loadedData.lastLoginDate = today
      console.log("[v0] Updated last login date to:", today)
    } else {
      console.log("[v0] Already logged in today - no streak change")
    }

    // Set all state at once to avoid race conditions
    setWithdrawalPoints(loadedData.withdrawalPoints)
    setStreak(loadedData.streak)
    setTotalEarned(loadedData.totalEarned)
    setDailyTasksCompleted(loadedData.dailyTasksCompleted)
    setLastLoginDate(loadedData.lastLoginDate)

    setIsDataLoaded(true)

    console.log("[v0] Final loaded state:", loadedData)
  }, [])

  // Real-time daily reset checking
  useEffect(() => {
    const checkDailyReset = () => {
      const today = getCurrentUTCDate()
      const lastTaskDate = localStorage.getItem("olympus-last-task-date")
      const lastLoginDate = localStorage.getItem("olympus-last-login")

      // Check if we need to reset daily tasks
      if (isNewDay(lastTaskDate)) {
        console.log("[v0] New day detected - resetting daily tasks")
        setDailyTasksCompleted(0)
        resetDailyTasks()
      }

      // Check if we need to update streak
      if (isNewDay(lastLoginDate)) {
        const { newStreak, bonusPoints } = updateLoginStreak(streak, lastLoginDate)
        
        if (newStreak !== streak || bonusPoints > 0) {
          setStreak(newStreak)
          setWithdrawalPoints(prev => prev + bonusPoints)
          setLastLoginDate(today)
          localStorage.setItem("olympus-last-login", today)
          
          console.log(
            "[v0] Streak updated! New streak:",
            newStreak,
            "Bonus points:",
            bonusPoints
          )
        }
      }
    }

    checkDailyReset()
    // Check every 5 minutes for real-time updates
    const interval = setInterval(checkDailyReset, 5 * 60 * 1000) // 5 minutes

    return () => clearInterval(interval)
  }, [streak])

  // Save data to localStorage when state changes
  useEffect(() => {
    if (!isDataLoaded) return

    const dataToSave = {
      withdrawalPoints,
      streak,
      totalEarned,
      dailyTasksCompleted,
      lastLoginDate,
    }

    try {
      localStorage.setItem("olympus-donation-data", JSON.stringify(dataToSave))
      console.log("[v0] Data saved to localStorage:", dataToSave)
    } catch (error) {
      console.error("[v0] Error saving data:", error)
    }
  }, [withdrawalPoints, streak, totalEarned, dailyTasksCompleted, lastLoginDate, isDataLoaded])

  return (
    <DonationContext.Provider
      value={{
        currentLevel,
        setCurrentLevel,
        balance,
        setBalance,
        referrals,
        setReferrals,
        dailyTasksCompleted,
        setDailyTasksCompleted,
        withdrawalPoints,
        setWithdrawalPoints,
        isConnected,
        setIsConnected,
        streak,
        setStreak,
        totalEarned,
        setTotalEarned,
        lastLoginDate,
        setLastLoginDate,
        isDataLoaded,
        transactions,
        setTransactions,
        achievements,
        setAchievements,
      }}
    >
      {children}
    </DonationContext.Provider>
  )
}

export function useDonation() {
  const context = useContext(DonationContext)
  if (context === undefined) {
    throw new Error("useDonation must be used within a DonationProvider")
  }
  return context
}

export type { Transaction, Achievement }
