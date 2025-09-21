"use client"

import { useState } from "react"
import { useDonation } from "@/contexts/donation-context"

export function useGames() {
  const { withdrawalPoints, setWithdrawalPoints, setTotalEarned } = useDonation()

  const [coinFlipResult, setCoinFlipResult] = useState("")
  const [isFlipping, setIsFlipping] = useState(false)
  const [diceResult, setDiceResult] = useState(0)
  const [isRolling, setIsRolling] = useState(false)
  const [spinResult, setSpinResult] = useState("")
  const [isSpinning, setIsSpinning] = useState(false)
  const [showWinEffect, setShowWinEffect] = useState(false)
  const [showParticles, setShowParticles] = useState(false)
  const [gameWinType, setGameWinType] = useState("")

  const playCoinFlip = () => {
    if (withdrawalPoints < 5) {
      alert("Need at least 5 withdrawal points to play!")
      return
    }

    setIsFlipping(true)
    setWithdrawalPoints((prev) => prev - 5)
    setShowWinEffect(false)
    setCoinFlipResult("")

    const targetSide = Math.random() > 0.5 ? "Heads" : "Tails"
    const animalPart = targetSide === "Heads" ? "🦅 Eagle Head" : "🐉 Dragon Tail"

    setTimeout(() => {
      const result = Math.random() > 0.5 ? "Heads" : "Tails"
      const resultAnimal = result === "Heads" ? "🦅 Eagle Head" : "🐉 Dragon Tail"

      if (Math.random() > 0.6) {
        setWithdrawalPoints((prev) => Math.min(100, prev + 10))
        setTotalEarned((prev) => prev + 2)
        setCoinFlipResult(`${resultAnimal} - Victory! +10 points`)
        setShowWinEffect(true)
        setShowParticles(true)
        setGameWinType("coin")
        setTimeout(() => {
          setShowWinEffect(false)
          setShowParticles(false)
        }, 2000)
      } else {
        setCoinFlipResult(`${resultAnimal} - Try again!`)
      }
      setIsFlipping(false)
    }, 2000)
  }

  const rollDice = () => {
    if (withdrawalPoints < 3) {
      alert("Need at least 3 withdrawal points to play!")
      return
    }

    setIsRolling(true)
    setWithdrawalPoints((prev) => prev - 3)
    setShowWinEffect(false)
    setDiceResult(0)

    setTimeout(() => {
      const result = Math.floor(Math.random() * 6) + 1
      setDiceResult(result)

      if (result >= 5) {
        setWithdrawalPoints((prev) => Math.min(100, prev + 8))
        setTotalEarned((prev) => prev + 1)
        setShowWinEffect(true)
        setShowParticles(true)
        setGameWinType("dice")
        setTimeout(() => {
          setShowWinEffect(false)
          setShowParticles(false)
        }, 2000)
      }
      setIsRolling(false)
    }, 1500)
  }

  const spinWheel = () => {
    if (withdrawalPoints < 10) {
      alert("Need at least 10 withdrawal points to play!")
      return
    }

    setIsSpinning(true)
    setWithdrawalPoints((prev) => prev - 10)
    setShowWinEffect(false)
    setSpinResult("")

    setTimeout(() => {
      const outcomes = [
        { text: "Better luck next time!", points: 0 },
        { text: "Small win! +5 points", points: 5 },
        { text: "Nice! +15 points", points: 15 },
        { text: "Jackpot! +25 points", points: 25 },
      ]

      const weights = [50, 30, 15, 5]
      const random = Math.random() * 100
      let cumulative = 0
      let selectedOutcome = outcomes[0]

      for (let i = 0; i < outcomes.length; i++) {
        cumulative += weights[i]
        if (random <= cumulative) {
          selectedOutcome = outcomes[i]
          break
        }
      }

      setSpinResult(selectedOutcome.text)
      if (selectedOutcome.points > 0) {
        setWithdrawalPoints((prev) => Math.min(100, prev + selectedOutcome.points))
        setTotalEarned((prev) => prev + Math.floor(selectedOutcome.points / 5))
        setShowWinEffect(true)
        setShowParticles(true)
        setGameWinType(selectedOutcome.points >= 20 ? "jackpot" : "spin")
        setTimeout(() => {
          setShowWinEffect(false)
          setShowParticles(false)
        }, 3000)
      }
      setIsSpinning(false)
    }, 3000)
  }

  return {
    coinFlipResult,
    isFlipping,
    diceResult,
    isRolling,
    spinResult,
    isSpinning,
    showWinEffect,
    showParticles,
    gameWinType,
    playCoinFlip,
    rollDice,
    spinWheel,
  }
}
