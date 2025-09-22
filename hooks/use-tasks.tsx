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
      const newTaskCount = dailyTasksCompleted + 1
      const pointsToAdd = 5
      const newWithdrawalPoints = Math.min(100, withdrawalPoints + pointsToAdd)
      
      setDailyTasksCompleted(newTaskCount)
      setWithdrawalPoints(newWithdrawalPoints)
      
      // Save the updated task count to localStorage
      const dataToSave = {
        withdrawalPoints: newWithdrawalPoints,
        streak,
        totalEarned,
        dailyTasksCompleted: newTaskCount,
        lastLoginDate,
      }
      localStorage.setItem("olympus-donation-data", JSON.stringify(dataToSave))
      
      // Show celebration animation
      const celebration = document.createElement("div")
      celebration.innerHTML = "🎉 +5 Points!"
      celebration.style.cssText =
        "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:2rem;z-index:9999;animation:depositSuccess 1s ease-out;pointer-events:none;color:#22c55e;font-weight:bold;"
      document.body.appendChild(celebration)
      setTimeout(() => {
        if (document.body.contains(celebration)) {
          document.body.removeChild(celebration)
        }
      }, 2000)
      
      console.log(`[v0] Daily task completed! Tasks: ${newTaskCount}/5, Points: ${newWithdrawalPoints}`)
    }
  }

  const handleWithdraw = () => {
    if (withdrawalPoints >= 75) { // Changed from 100 to 75 to match UI
      const withdrawAmount = Math.floor(withdrawalPoints / 75) * 75
      const remainingPoints = withdrawalPoints % 75

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

      // Show success message
      const successMessage = document.createElement("div")
      successMessage.innerHTML = `🎉 Withdrew ${withdrawAmount} points!<br/>Remaining: ${remainingPoints} points`
      successMessage.style.cssText =
        "position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);font-size:1.5rem;z-index:9999;animation:depositSuccess 2s ease-out;pointer-events:none;color:#22c55e;font-weight:bold;text-align:center;background:rgba(0,0,0,0.8);padding:20px;border-radius:10px;"
      document.body.appendChild(successMessage)
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage)
        }
      }, 3000)

      console.log(`[v0] Withdrawal successful! Amount: ${withdrawAmount}, Remaining: ${remainingPoints}`)
    }
  }

  return {
    completeDailyTask,
    handleWithdraw,
  }
}
