/**
 * Utility functions for daily reset functionality
 */

export const getCurrentUTCDate = (): string => {
  return new Date().toISOString().split('T')[0] // YYYY-MM-DD format
}

export const isNewDay = (lastDate: string | null): boolean => {
  const today = getCurrentUTCDate()
  return lastDate !== today
}

export const getYesterdayUTCDate = (): string => {
  const yesterday = new Date()
  yesterday.setUTCDate(yesterday.getUTCDate() - 1)
  return yesterday.toISOString().split('T')[0]
}

export const isConsecutiveDay = (lastLoginDate: string | null): boolean => {
  if (!lastLoginDate) return false
  const yesterday = getYesterdayUTCDate()
  return lastLoginDate === yesterday
}

export const calculateStreakBonus = (streak: number): number => {
  return Math.min(streak, 7) * 2 // Max 7 days, 2 points per day
}

export const resetDailyTasks = (): void => {
  const today = getCurrentUTCDate()
  localStorage.setItem("olympus-last-task-date", today)
  
  // Update localStorage with reset tasks
  const savedData = localStorage.getItem("olympus-donation-data")
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      const updatedData = { ...parsed, dailyTasksCompleted: 0 }
      localStorage.setItem("olympus-donation-data", JSON.stringify(updatedData))
      console.log("[v0] Daily tasks reset successfully")
    } catch (error) {
      console.error("[v0] Error updating saved data:", error)
    }
  }
}

export const updateLoginStreak = (currentStreak: number, lastLoginDate: string | null): { newStreak: number; bonusPoints: number } => {
  const today = getCurrentUTCDate()
  
  if (lastLoginDate === today) {
    // Already logged in today
    return { newStreak: currentStreak, bonusPoints: 0 }
  }
  
  if (isConsecutiveDay(lastLoginDate)) {
    // Consecutive day - increase streak
    const newStreak = Math.min(currentStreak + 1, 7)
    const bonusPoints = calculateStreakBonus(newStreak)
    return { newStreak, bonusPoints }
  } else if (lastLoginDate && lastLoginDate !== today) {
    // Missed a day - reset streak
    return { newStreak: 1, bonusPoints: 1 }
  } else {
    // First time login
    return { newStreak: 1, bonusPoints: 1 }
  }
}

// Debug functions for testing
export const debugDailyReset = (): void => {
  const today = getCurrentUTCDate()
  const lastTaskDate = localStorage.getItem("olympus-last-task-date")
  const lastLoginDate = localStorage.getItem("olympus-last-login")
  const savedData = localStorage.getItem("olympus-donation-data")
  
  console.log("=== Daily Reset Debug Info ===")
  console.log("Today (UTC):", today)
  console.log("Last task date:", lastTaskDate)
  console.log("Last login date:", lastLoginDate)
  console.log("Is new day for tasks:", isNewDay(lastTaskDate))
  console.log("Is new day for login:", isNewDay(lastLoginDate))
  console.log("Is consecutive day:", isConsecutiveDay(lastLoginDate))
  
  if (savedData) {
    try {
      const parsed = JSON.parse(savedData)
      console.log("Current data:", parsed)
    } catch (error) {
      console.error("Error parsing saved data:", error)
    }
  }
  console.log("=============================")
}

// Function to simulate a new day for testing
export const simulateNewDay = (): void => {
  const yesterday = getYesterdayUTCDate()
  localStorage.setItem("olympus-last-task-date", yesterday)
  localStorage.setItem("olympus-last-login", yesterday)
  console.log("[v0] Simulated new day - tasks and login will reset on next check")
}
