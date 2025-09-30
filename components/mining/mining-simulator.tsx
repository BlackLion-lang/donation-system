"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  Pickaxe, 
  Zap, 
  Clock, 
  Target, 
  CheckCircle, 
  AlertCircle,
  Flame,
  Coins,
  Activity
} from "lucide-react"

interface MiningSession {
  id: number
  clicks: number
  completed: boolean
  completedAt?: Date
}

interface MiningSimulatorProps {
  onPointsUpdate: (points: number) => void
  currentPoints: number
  maxPoints: number
}

export function MiningSimulator({ onPointsUpdate, currentPoints, maxPoints }: MiningSimulatorProps) {
  const [sessions, setSessions] = useState<MiningSession[]>([
    { id: 1, clicks: 0, completed: false },
    { id: 2, clicks: 0, completed: false },
    { id: 3, clicks: 0, completed: false }
  ])
  
  const [currentSession, setCurrentSession] = useState(1)
  const [isMining, setIsMining] = useState(false)
  const [lastResetDate, setLastResetDate] = useState<string>("")
  const [totalClicksToday, setTotalClicksToday] = useState(0)
  const [pointsPercentage, setPointsPercentage] = useState(0)
  const [timeUntilReset, setTimeUntilReset] = useState("")

  // Check if it's a new day and reset if needed (using UTC time like daily tasks)
  useEffect(() => {
    const utcNow = new Date()
    const today = utcNow.toISOString().split('T')[0] // UTC date in YYYY-MM-DD format
    const storedDate = localStorage.getItem('mining-last-reset')
    
    if (storedDate !== today) {
      // Reset everything for new day
      setSessions([
        { id: 1, clicks: 0, completed: false },
        { id: 2, clicks: 0, completed: false },
        { id: 3, clicks: 0, completed: false }
      ])
      setCurrentSession(1)
      setTotalClicksToday(0)
      setLastResetDate(today)
      localStorage.setItem('mining-last-reset', today)
      localStorage.setItem('mining-sessions', JSON.stringify([
        { id: 1, clicks: 0, completed: false },
        { id: 2, clicks: 0, completed: false },
        { id: 3, clicks: 0, completed: false }
      ]))
      onPointsUpdate(0)
    } else {
      // Load existing data
      const storedSessions = localStorage.getItem('mining-sessions')
      if (storedSessions) {
        const parsedSessions = JSON.parse(storedSessions)
        setSessions(parsedSessions)
        setTotalClicksToday(parsedSessions.reduce((sum: number, session: MiningSession) => sum + session.clicks, 0))
        
        // Find current session
        const nextIncomplete = parsedSessions.find((s: MiningSession) => !s.completed)
        if (nextIncomplete) {
          setCurrentSession(nextIncomplete.id)
        } else {
          setCurrentSession(3) // All sessions completed
        }
      }
      setLastResetDate(today)
    }
  }, [])

  // Update points percentage
  useEffect(() => {
    const percentage = (currentPoints / maxPoints) * 100
    setPointsPercentage(percentage)
  }, [currentPoints, maxPoints])

  // Calculate time until reset (same as daily tasks)
  useEffect(() => {
    const updateTimeUntilReset = () => {
      const utcNow = new Date()
      
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

  const handleMine = () => {
    if (isMining) return
    
    setIsMining(true)
    
    setSessions(prev => {
      const newSessions = [...prev]
      const sessionIndex = newSessions.findIndex(s => s.id === currentSession)
      
      if (sessionIndex !== -1 && !newSessions[sessionIndex].completed) {
        newSessions[sessionIndex].clicks += 1
        setTotalClicksToday(prev => prev + 1)
        
        // Check if session is complete (50 clicks)
        if (newSessions[sessionIndex].clicks >= 50) {
          newSessions[sessionIndex].completed = true
          newSessions[sessionIndex].completedAt = new Date()
          
          // Move to next session if available
          const nextSession = newSessions.find(s => !s.completed)
          if (nextSession) {
            setCurrentSession(nextSession.id)
          }
          
          // Calculate points (each session gives 33.33 points to reach 100 total)
          const completedSessions = newSessions.filter(s => s.completed).length
          const newPoints = Math.min(completedSessions * 33.33, 100)
          onPointsUpdate(newPoints)
        }
        
        // Save to localStorage
        localStorage.setItem('mining-sessions', JSON.stringify(newSessions))
      }
      
      return newSessions
    })
    
    // Reset mining state after animation
    setTimeout(() => {
      setIsMining(false)
    }, 200)
  }

  const completedSessions = sessions.filter(s => s.completed).length
  const canWithdraw = pointsPercentage >= 75
  const allSessionsComplete = completedSessions === 3

  return (
    <Card className="hover-lift border-0 shadow-lg bg-gradient-to-br from-slate-900/50 via-purple-900/30 to-blue-900/50 dark:from-slate-800/80 dark:via-purple-800/40 dark:to-blue-800/60">
      <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-yellow-500 text-white">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <CardTitle className="flex items-center gap-2">
              <Pickaxe className="h-6 w-6" />
              Mining Simulator
            </CardTitle>
            <CardDescription className="text-blue-100">
              Click to mine! Complete 3 sessions of 50 clicks each to grow your withdrawal points
            </CardDescription>
          </div>
          <div className="text-center sm:text-right bg-blue-500/20 rounded-lg px-4 py-2">
            <div className="text-sm text-blue-200">Next Reset</div>
            <div className="text-lg font-bold text-white">{timeUntilReset}</div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Withdrawal Points Bar */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-yellow-500" />
              <span className="font-semibold">Withdrawal Points (Grow through Mining)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-yellow-600">{Math.round(currentPoints)}/100</span>
              <Badge variant={canWithdraw ? "default" : "secondary"}>
                {canWithdraw ? "Can Withdraw" : "Need 75%+"}
              </Badge>
            </div>
          </div>
          
          <div className="relative">
            <Progress 
              value={pointsPercentage} 
              className="h-6 progress-animated"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-sm font-bold text-white drop-shadow-lg">
                {Math.round(pointsPercentage)}%
              </span>
            </div>
          </div>
          
          {!canWithdraw && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-sm text-yellow-700 dark:text-yellow-300">
                Need {Math.ceil(75 - pointsPercentage)}% more to withdraw
              </span>
            </div>
          )}
          
          {canWithdraw && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-sm text-green-700 dark:text-green-300">
                Ready to withdraw! Complete all 3 sessions for maximum points.
              </span>
            </div>
          )}
        </div>

        {/* Mining Sessions Progress */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                Daily Mining Sessions
              </h3>
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                {completedSessions}/3 Complete
              </Badge>
            </div>
            <div className="bg-blue-500/10 rounded-lg px-3 py-2 border border-blue-500/30">
              <div className="text-xs text-blue-300">Reset in</div>
              <div className="text-sm font-bold text-blue-200">{timeUntilReset}</div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3">
            {sessions.map((session) => (
              <div
                key={session.id}
                 className={`p-4 rounded-lg border-2 transition-all ${
                   session.completed
                     ? "bg-green-100 dark:bg-green-900/20 border-green-300 dark:border-green-700"
                     : session.id === currentSession
                     ? "bg-gradient-to-br from-blue-100 via-purple-100 to-yellow-100 dark:from-blue-900/20 dark:via-purple-900/20 dark:to-yellow-900/20 border-blue-300 dark:border-blue-700"
                     : "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600"
                 }`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center mb-2">
                    {session.completed ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                     ) : session.id === currentSession ? (
                       <Activity className="h-6 w-6 text-blue-500 animate-pulse" />
                     ) : (
                      <Clock className="h-6 w-6 text-gray-400" />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-1">Session {session.id}</h4>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {session.clicks}/50 clicks
                  </p>
                  <div className="mt-2">
                    <Progress 
                      value={(session.clicks / 50) * 100} 
                      className="h-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mining Button */}
        <div className="text-center space-y-4">
          {!allSessionsComplete ? (
            <>
              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Zap className="h-4 w-4" />
                <span>Session {currentSession} - {sessions[currentSession - 1]?.clicks || 0}/50 clicks</span>
              </div>
              
               <Button
                 onClick={handleMine}
                 disabled={isMining || allSessionsComplete}
                 size="lg"
                 className={`w-full h-16 text-xl font-bold transition-all duration-200 ${
                   isMining
                     ? "bg-gradient-to-r from-blue-400 via-purple-500 to-yellow-400 transform scale-95"
                     : "bg-gradient-to-r from-blue-500 via-purple-500 to-yellow-500 hover:from-blue-600 hover:via-purple-600 hover:to-yellow-600 hover:scale-105"
                 }`}
               >
                {isMining ? (
                  <>
                    <Flame className="mr-2 h-6 w-6 animate-pulse" />
                    Mining...
                  </>
                ) : (
                  <>
                    <Pickaxe className="mr-2 h-6 w-6" />
                    Click to Mine!
                  </>
                )}
              </Button>
            </>
          ) : (
            <div className="p-6 rounded-lg bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700">
              <div className="flex items-center justify-center gap-2 mb-2">
                <CheckCircle className="h-6 w-6 text-green-500" />
                <span className="text-lg font-semibold text-green-700 dark:text-green-300">
                  All Sessions Complete!
                </span>
              </div>
              <p className="text-sm text-green-600 dark:text-green-400">
                You've earned maximum withdrawal points for today. Come back tomorrow!
              </p>
            </div>
          )}
        </div>

        {/* Daily Stats */}
         <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
           <div className="text-center">
             <div className="text-2xl font-bold text-blue-600">{totalClicksToday}</div>
             <div className="text-xs text-gray-600 dark:text-gray-400">Total Clicks Today</div>
           </div>
           <div className="text-center">
             <div className="text-2xl font-bold text-purple-600">{completedSessions}</div>
             <div className="text-xs text-gray-600 dark:text-gray-400">Sessions Complete</div>
           </div>
           <div className="text-center bg-blue-500/10 rounded-lg p-3 border border-blue-500/30">
             <div className="text-lg font-bold text-blue-300">{timeUntilReset}</div>
             <div className="text-xs text-blue-400">Until Reset</div>
           </div>
         </div>
      </CardContent>
    </Card>
  )
}
