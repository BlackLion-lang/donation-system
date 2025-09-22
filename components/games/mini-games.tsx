"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useGames } from "@/hooks/use-games"
import { useDonation } from "@/contexts/donation-context"

export function MiniGames() {
  const { withdrawalPoints } = useDonation()
  const {
    coinFlipResult,
    isFlipping,
    selectedSide,
    setSelectedSide,
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
  } = useGames()

  return (
    <Card className="">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">🎮 Mini Games</CardTitle>
        <CardDescription>Play simple games to earn withdrawal points and rewards</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          {showParticles && (
            <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
              <div className="particle-explosion">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className={`particle ${gameWinType === "jackpot" ? "particle-gold" : "particle-green"}`}
                    style={{
                      left: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: `${1 + Math.random()}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Coin Flip Game */}
            <Card
              className={`hover-lift holographic transition-all duration-300 ${showWinEffect && gameWinType === "coin" ? "ring-4 ring-green-400 shadow-2xl shadow-green-400/50" : ""}`}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-lg">🦅 Mythical Coin Flip🐉</CardTitle>
                <CardDescription>Cost: 5 points | Win: +10 points</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="h-20 flex flex-col items-center justify-center relative">
                  {isFlipping ? (
                    <div className="relative">
                      <div className="coin-flip-enhanced relative">
                        <div className="coin-side coin-heads absolute inset-0 flex items-center justify-center text-3xl">
                          🦅
                        </div>
                        <div className="coin-side coin-tails absolute inset-0 flex items-center justify-center text-3xl">
                          🐉
                        </div>
                      </div>
                      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
                        <div className="text-xs text-green-400 font-bold animate-pulse">Potential: +10 points</div>
                      </div>
                      <div className="absolute inset-0 coin-glow"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="space-y-2">
                        <div className="text-4xl">
                          {coinFlipResult ? (coinFlipResult.includes("🦅") ? "🦅" : "🐉") : "🦅 vs 🐉"}
                        </div>
                        <div
                          className={`text-lg transition-all duration-500 ${
                            coinFlipResult.includes("Victory") 
                              ? "text-green-400 font-bold animate-pulse" 
                              : coinFlipResult.includes("Try again") 
                                ? "text-red-400 font-bold" 
                                : "text-gray-400"
                          }`}
                        >
                          {coinFlipResult ? 
                            (coinFlipResult.includes("Victory") ? "Victory! +10 points" : "Try again!") 
                            : "Choose your destiny!"
                          }
                        </div>
                      </div>
                    </div>
                  )}
                  {showWinEffect && gameWinType === "coin" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="win-burst text-6xl">🏆</div>
                    </div>
                  )}
                </div>
                
                {/* Selection Buttons */}
                {!isFlipping && (
                  <div className="flex gap-2 mb-3">
                    <Button
                      onClick={() => setSelectedSide("eagle")}
                      variant={selectedSide === "eagle" ? "default" : "outline"}
                      className={`flex-1 transition-all duration-300 ${
                        selectedSide === "eagle" 
                          ? "bg-blue-500 hover:bg-blue-600 text-white" 
                          : "hover:bg-blue-50"
                      }`}
                    >
                      🦅 Eagle
                    </Button>
                    <Button
                      onClick={() => setSelectedSide("dragon")}
                      variant={selectedSide === "dragon" ? "default" : "outline"}
                      className={`flex-1 transition-all duration-300 ${
                        selectedSide === "dragon" 
                          ? "bg-red-500 hover:bg-red-600 text-white" 
                          : "hover:bg-red-50"
                      }`}
                    >
                      🐉 Dragon
                    </Button>
                  </div>
                )}
                
                <Button
                  onClick={() => playCoinFlip(selectedSide!)}
                  disabled={isFlipping || withdrawalPoints < 5 || !selectedSide}
                  className={`w-full transition-all duration-300 ${isFlipping ? "animate-pulse" : "hover:scale-105"}`}
                >
                  {isFlipping ? "Flipping..." : selectedSide ? `Flip for ${selectedSide === "eagle" ? "🦅 Eagle" : "🐉 Dragon"}` : "Select Eagle or Dragon"}
                </Button>
              </CardContent>
            </Card>

            {/* Dice Roll Game */}
            <Card
              className={`hover-lift holographic transition-all duration-300 ${showWinEffect && gameWinType === "dice" ? "ring-4 ring-green-400 shadow-2xl shadow-green-400/50" : ""}`}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-lg">🎲 Lucky Dice</CardTitle>
                <CardDescription>Cost: 3 points | Win on 5-6: +8 points</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="h-16 flex items-center justify-center relative">
                  {isRolling ? (
                    <div className="relative">
                      <div className="dice-roll text-4xl">🎲</div>
                      <div className="absolute inset-0 dice-trail"></div>
                    </div>
                  ) : (
                    <div
                      className={`text-4xl transition-all duration-500 ${diceResult >= 5 ? "text-green-400 animate-bounce" : ""}`}
                    >
                      {diceResult ? `🎲 ${diceResult}` : "🎲"}
                    </div>
                  )}
                  {showWinEffect && gameWinType === "dice" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="win-burst text-6xl">✨</div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={rollDice}
                  disabled={isRolling || withdrawalPoints < 3}
                  className={`w-full transition-all duration-300 ${isRolling ? "animate-pulse" : "hover:scale-105"}`}
                >
                  {isRolling ? "Rolling..." : "Roll Dice"}
                </Button>
                {diceResult > 0 && (
                  <p
                    className={`text-sm transition-all duration-500 ${diceResult >= 5 ? "text-green-500 font-bold animate-pulse" : "text-muted-foreground"}`}
                  >
                    {diceResult >= 5 ? "🎉 You won!" : "Try again!"}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Spin Wheel Game */}
            <Card
              className={`hover-lift holographic transition-all duration-300 ${showWinEffect && (gameWinType === "spin" || gameWinType === "jackpot") ? `ring-4 ${gameWinType === "jackpot" ? "ring-yellow-400 shadow-2xl shadow-yellow-400/50" : "ring-green-400 shadow-2xl shadow-green-400/50"}` : ""}`}
            >
              <CardHeader className="text-center">
                <CardTitle className="text-lg">🎡 Spin Wheel</CardTitle>
                <CardDescription>Cost: 10 points | Win up to +25 points</CardDescription>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="h-16 flex items-center justify-center relative">
                  {isSpinning ? (
                    <div className="relative">
                      <div className="wheel-spin text-4xl">🎡</div>
                      <div className="absolute inset-0 wheel-rainbow"></div>
                    </div>
                  ) : (
                    <div
                      className={`text-sm px-2 transition-all duration-500 ${spinResult.includes("Jackpot") ? "text-yellow-400 font-bold animate-pulse" : spinResult.includes("win") ? "text-green-400 font-semibold" : ""}`}
                    >
                      {spinResult || "Spin for prizes!"}
                    </div>
                  )}
                  {showWinEffect && gameWinType === "jackpot" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="jackpot-burst text-6xl">💰</div>
                    </div>
                  )}
                  {showWinEffect && gameWinType === "spin" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="win-burst text-6xl">🌟</div>
                    </div>
                  )}
                </div>
                <Button
                  onClick={spinWheel}
                  disabled={isSpinning || withdrawalPoints < 10}
                  className={`w-full transition-all duration-300 ${isSpinning ? "animate-pulse" : "hover:scale-105"}`}
                >
                  {isSpinning ? "Spinning..." : "Spin Wheel"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted/20 rounded-lg">
          <h3 className="font-semibold mb-2">Game Rules:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Use withdrawal points to play games</li>
            <li>• Win points to increase your withdrawal eligibility</li>
            <li>• Complete daily tasks to earn more points</li>
            <li>• Maintain 100% points to unlock withdrawals</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
