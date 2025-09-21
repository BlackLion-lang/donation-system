"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

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

    const today = new Date().toDateString()
    const savedLastLogin = localStorage.getItem("olympus-last-login")

    console.log("[v0] Streak check - Today:", today)
    console.log("[v0] Streak check - Saved last login:", savedLastLogin)
    console.log("[v0] Streak check - Current streak:", loadedData.streak)

    if (savedLastLogin !== today) {
      const yesterday = new Date()
      yesterday.setDate(yesterday.getDate() - 1)
      const yesterdayString = yesterday.toDateString()

      console.log("[v0] Streak check - Yesterday:", yesterdayString)
      console.log("[v0] Streak check - Is consecutive?", savedLastLogin === yesterdayString)

      if (savedLastLogin === yesterdayString) {
        // Consecutive day - increase streak (max 7 days) and add bonus
        const newStreak = Math.min(loadedData.streak + 1, 7)
        const bonusPoints = newStreak * 2
        loadedData.streak = newStreak
        loadedData.withdrawalPoints += bonusPoints
        console.log(
          "[v0] Streak bonus added! New streak:",
          newStreak,
          "Bonus points:",
          bonusPoints,
          "Total points:",
          loadedData.withdrawalPoints,
        )
      } else if (savedLastLogin && savedLastLogin !== today) {
        // Missed a day or first time - reset streak to 1
        console.log("[v0] Streak reset - missed a day or first login")
        loadedData.streak = 1
        loadedData.withdrawalPoints += 1
      } else if (!savedLastLogin) {
        // First time login
        console.log("[v0] First time login - starting streak")
        loadedData.streak = 1
        loadedData.withdrawalPoints += 1
      }

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

  // Periodic streak checking
  useEffect(() => {
    const checkStreakPeriodically = () => {
      const today = new Date().toDateString()
      const savedLastLogin = localStorage.getItem("olympus-last-login")

      console.log("[v0] Periodic streak check - Today:", today)
      console.log("[v0] Periodic streak check - Saved last login:", savedLastLogin)

      if (savedLastLogin && savedLastLogin !== today) {
        console.log("[v0] Date changed detected - reloading streak data")

        const savedData = localStorage.getItem("olympus-donation-data")
        let loadedData = {
          withdrawalPoints: withdrawalPoints,
          streak: streak,
          totalEarned: totalEarned,
          dailyTasksCompleted: dailyTasksCompleted,
          lastLoginDate: lastLoginDate,
        }

        if (savedData) {
          try {
            const parsed = JSON.parse(savedData)
            loadedData = { ...loadedData, ...parsed }
          } catch (error) {
            console.error("[v0] Error loading saved data:", error)
          }
        }

        const yesterday = new Date()
        yesterday.setDate(yesterday.getDate() - 1)
        const yesterdayString = yesterday.toDateString()

        console.log("[v0] Recalculating streak - Yesterday:", yesterdayString)
        console.log("[v0] Recalculating streak - Is consecutive?", savedLastLogin === yesterdayString)

        if (savedLastLogin === yesterdayString) {
          const newStreak = Math.min(loadedData.streak + 1, 7)
          const bonusPoints = newStreak * 2
          loadedData.streak = newStreak
          loadedData.withdrawalPoints += bonusPoints
          console.log(
            "[v0] Streak bonus added! New streak:",
            newStreak,
            "Bonus points:",
            bonusPoints,
            "Total points:",
            loadedData.withdrawalPoints,
          )
        } else if (savedLastLogin && savedLastLogin !== today) {
          console.log("[v0] Streak reset - missed a day")
          loadedData.streak = 1
          loadedData.withdrawalPoints += 1
        } else if (!savedLastLogin) {
          console.log("[v0] First time login - starting streak")
          loadedData.streak = 1
          loadedData.withdrawalPoints += 1
        }

        localStorage.setItem("olympus-last-login", today)
        loadedData.lastLoginDate = today

        setWithdrawalPoints(loadedData.withdrawalPoints)
        setStreak(loadedData.streak)
        setTotalEarned(loadedData.totalEarned)
        setDailyTasksCompleted(loadedData.dailyTasksCompleted)
        setLastLoginDate(loadedData.lastLoginDate)

        console.log("[v0] Updated state after time change:", loadedData)
      }
    }

    checkStreakPeriodically()
    const interval = setInterval(checkStreakPeriodically, 10000)

    return () => clearInterval(interval)
  }, [withdrawalPoints, streak, totalEarned, dailyTasksCompleted, lastLoginDate])

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
