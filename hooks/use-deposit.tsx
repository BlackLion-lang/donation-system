"use client"

import { useState } from "react"
import { useDonation } from "@/contexts/donation-context"
import { levelsData } from "@/lib/levels"

export function useDeposit() {
  const { currentLevel, balance, setBalance, transactions, setTransactions } = useDonation()

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [depositAmount, setDepositAmount] = useState("")
  const [isProcessingDeposit, setIsProcessingDeposit] = useState(false)

  const processDeposit = async () => {
    const currentLevelData = levelsData[currentLevel - 1]
    const requiredAmount = currentLevelData.amount

    if (Number.parseFloat(depositAmount) !== requiredAmount) {
      alert(`You must deposit exactly $${requiredAmount} for ${currentLevelData.name}`)
      return
    }

    if (balance < requiredAmount) {
      alert("Insufficient balance. Please add funds to your wallet.")
      return
    }

    setIsProcessingDeposit(true)

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 3000))

    // Update balance and add transaction
    setBalance((prev) => prev - requiredAmount)
    const newTransaction = {
      id: transactions.length + 1,
      type: "deposit" as const,
      amount: requiredAmount,
      level: currentLevel,
      status: "completed" as const,
      date: new Date().toISOString().split("T")[0],
    }
    setTransactions((prev) => [newTransaction, ...prev])

    // Trigger success animation
    const successElement = document.createElement("div")
    successElement.innerHTML = "🎉 Deposit Successful! 🎉"
    successElement.className =
      "fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold text-green-500 z-50 deposit-success"
    document.body.appendChild(successElement)
    setTimeout(() => document.body.removeChild(successElement), 2000)

    setIsProcessingDeposit(false)
    setIsDepositModalOpen(false)
    setDepositAmount("")
  }

  return {
    isDepositModalOpen,
    setIsDepositModalOpen,
    depositAmount,
    setDepositAmount,
    isProcessingDeposit,
    processDeposit,
  }
}
