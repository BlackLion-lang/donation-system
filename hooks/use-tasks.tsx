"use client"

import { useDonation } from "@/contexts/donation-context"

export function useTasks() {
  const {
    dailyTasksCompleted,
    setDailyTasksCompleted,
    setWithdrawalPoints,
    withdrawalPoints,
    setTotalEarned,
    streak,
    totalEarned,
    lastLoginDate,
  } = useDonation()

  const completeDailyTask = () => {
    if (dailyTasksCompleted < 5) {
      setDailyTasksCompleted((prev) => prev + 1)
      setWithdrawalPoints((prev) => Math.min(100, prev + 5))
      const celebration = document.createElement("div")
      celebration.innerHTML = "🎉 +5 Points!"
      celebration.style.cssText =
        "position:fixed;top:50%;left:50%;font-size:2rem;z-index:9999;animation:depositSuccess 1s ease-out;pointer-events:none;color:#22c55e;font-weight:bold;"
      document.body.appendChild(celebration)
      setTimeout(() => document.body.removeChild(celebration), 2000)
    }
  }

  const handleWithdraw = () => {
    if (withdrawalPoints >= 100) {
      const withdrawAmount = Math.floor(withdrawalPoints / 100) * 100
      const remainingPoints = withdrawalPoints % 100

      setWithdrawalPoints(remainingPoints)
      setTotalEarned((prev) => prev + withdrawAmount)

      const dataToSave = {
        withdrawalPoints: remainingPoints,
        streak,
        totalEarned: totalEarned + withdrawAmount,
        dailyTasksCompleted,
        lastLoginDate,
      }
      localStorage.setItem("olympus-donation-data", JSON.stringify(dataToSave))

      alert(`Successfully withdrew ${withdrawAmount} points! Remaining: ${remainingPoints} points`)
    }
  }

  return {
    completeDailyTask,
    handleWithdraw,
  }
}
