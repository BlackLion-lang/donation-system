"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import rot13 from '../../utils/encode'
import Cookies from 'universal-cookie';
import Web3 from "web3"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, CheckCircle, AlertCircle, ArrowRight, Sparkles, Trophy, Copy, Users, ExternalLink, UserCheck } from "lucide-react"
import { ReferralTree } from "./referral-tree"
import { formatUnits, parseUnits } from "viem"
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi"
import { CONTRACTS, ABIS } from "@/constant/constant"

interface Level {
  id: number
  name: string
  amount: number
  reward: number
  category: string
  icon: string
  description: string
}

interface LevelCardProps {
  currentLevelData: Level
  walletAddress: `0x${string}` | undefined
}

export function LevelCard({ currentLevelData, walletAddress }: LevelCardProps) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [referrerAddress, setReferrerAddress] = useState("")
  const [approved, setApproved] = useState(false)
  const [balanceUSDT, setBalanceUSDT] = useState("0")

  // Safely use useAccount hook
  let address: `0x${string}` | undefined = undefined
  let isConnected = false

  try {
    const account = useAccount()
    address = account.address
    isConnected = account.isConnected
  } catch (error) {
  }

  // ---------------- READ USER DATA ----------------
  let user: any = null
  let getReferral: any = null
  let getReferral1: any = null
  let getReferral2: any = null
  let getReferral3_1: any = null
  let getReferral3_2: any = null
  let getReferral3_3: any = null
  let getReferral3_4: any = null
  let registered: any = null
  let referrals = 0
  let currentLevel = 1
  let totalEarned = 0
  let balance = 0
  let progressToNext = 0
  let levelDepositAmount: number = 0
  let totalTreeReferrals = 0
  let step1Count = 0
  let step2Count = 0
  let step3Count = 0

  try {
    const userData = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "users",
      args: address ? [address] : undefined,
      query: { enabled: !!address },
    })
    user = userData.data
    registered = user ? (user as any)[0] : false
    referrals = user ? Number((user as any)[2]) : 0
    currentLevel = user ? Number((user as any)[3]) == 0 ? 1 : Number((user as any)[3]) : 1
    totalEarned = user ? Number(formatUnits((user as any)[4], 6)) : 0
    balance = user ? Number(formatUnits((user as any)[5], 6)) : 0

    const getReferralData = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "getReferrals",
      args: address ? [address] : undefined,
      query: { enabled: !!address },
    })
    getReferral = getReferralData.data
    
    // Calculate progress based on tree structure - matching referral tree logic exactly
    // Since referral tree now only shows first 2 referrals and fetches others dynamically,
    // we should calculate progress based on the full referral array like before
    
    // Get referral counts from contract (depth 1, 2, 3)
    const referralCountsData = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "getReferralCounts",
      args: address ? [address] : undefined,
      query: { enabled: !!address },
    })
    const referralCounts = referralCountsData.data

    // Use contract's referral counts for accurate calculation
    if (referralCounts) {
      step1Count = Number((referralCounts as any)[0]) || 0  // depth 1
      step2Count = Number((referralCounts as any)[1]) || 0  // depth 2  
      step3Count = Number((referralCounts as any)[2]) || 0  // depth 3
    } else {
      // Fallback to static calculation if contract data not available
      const step1Referrals = getReferral ? getReferral.slice(0, 2).filter((addr: any) => addr && addr !== "0x0000000000000000000000000000000000000000") : []
      step1Count = step1Referrals.length
      step2Count = 0
      step3Count = 0
    }
    
    // Progress based on tree completion: Step 1 (2) + Step 2 (4) + Step 3 (8) = 14 total
    totalTreeReferrals = step1Count + step2Count + step3Count
    progressToNext = (totalTreeReferrals / 14) * 100
    

    const getReferralData1 = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "getReferrals",
      args: getReferral && getReferral[1] ? [getReferral[1]] : undefined,
      query: { enabled: !!(getReferral && getReferral[1]) },
    })
    getReferral1 = getReferralData1.data

    // Pre-fetch referrals for Step 1 addresses to enable proper tree functionality
    const getReferralData2 = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "getReferrals",
      args: getReferral && getReferral[0] ? [getReferral[0]] : undefined,
      query: { enabled: !!(getReferral && getReferral[0]) },
    })
    getReferral2 = getReferralData2.data
    // console.log("debug->getReferral2", getReferral2);

    // Pre-fetch Step 3 referrals for Step 2 addresses
    // Get Step 2 addresses from both getReferral2 and getReferral1
    const step2Addresses = [
      ...(getReferral2 ? (getReferral2 as any).slice(0, 2) : []),
      ...(getReferral1 ? (getReferral1 as any).slice(0, 2) : [])
    ].filter(addr => addr && addr !== "0x0000000000000000000000000000000000000000")
    // console.log("debug->step2Addresses", step2Addresses);

    // Fetch Step 3 referrals for first Step 2 address (from getReferral2[0])
    const getReferral3Data1 = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "getReferrals",
      args: getReferral2 && (getReferral2 as any)[0] ? [(getReferral2 as any)[0]] : undefined,
      query: { enabled: !!(getReferral2 && (getReferral2 as any)[0]) },
    })
    getReferral3_1 = getReferral3Data1.data

    // Fetch Step 3 referrals for second Step 2 address (from getReferral2[1])
    const getReferral3Data2 = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "getReferrals",
      args: getReferral2 && (getReferral2 as any)[1] ? [(getReferral2 as any)[1]] : undefined,
      query: { enabled: !!(getReferral2 && (getReferral2 as any)[1]) },
    })
    getReferral3_2 = getReferral3Data2.data

    // Fetch Step 3 referrals for third Step 2 address (from getReferral1[0])
    const getReferral3Data3 = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "getReferrals",
      args: getReferral1 && (getReferral1 as any)[0] ? [(getReferral1 as any)[0]] : undefined,
      query: { enabled: !!(getReferral1 && (getReferral1 as any)[0]) },
    })
    getReferral3_3 = getReferral3Data3.data

    // Fetch Step 3 referrals for fourth Step 2 address (from getReferral1[1])
    const getReferral3Data4 = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "getReferrals",
      args: getReferral1 && (getReferral1 as any)[1] ? [(getReferral1 as any)[1]] : undefined,
      query: { enabled: !!(getReferral1 && (getReferral1 as any)[1]) },
    })
    getReferral3_4 = getReferral3Data4.data


    const levelsData = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "levels",
      args: currentLevel ? [currentLevel] : undefined,
    })
    const levels = levelsData.data
    levelDepositAmount = levels ? Number(formatUnits((levels as any)[0], 18)) : 0
  } catch (error) {
  }

  let usdtBalance: any = null
  try {
    const balanceData = useReadContract({
      address: CONTRACTS.USDT_ADDRESS as `0x${string}`,
      abi: ABIS.USDT,
      functionName: "balanceOf",
      args: address ? [address] : undefined,
      query: { enabled: !!address },
    })
    usdtBalance = balanceData.data
  } catch (error) {
  }

  // const { data: isApproved } = useReadContract({
  //   address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
  //   abi: ABIS.Referral,
  //   functionName: "isApproved",
  //   args: address ? [address] : undefined,
  // })

  // ---------------- APPROVE USDT & DEPOSIT ----------------
  let approve: any = null
  let deposit: any = null
  let isApproving = false
  let isDepositing = false
  let approveSuccess = false
  let depositSuccess = false
  try {
    const approveHook = useWriteContract()
    approve = approveHook.writeContract
    isApproving = approveHook.isPending
    const approveSuccess = approveHook.isSuccess
    const depositHook = useWriteContract()
    deposit = depositHook.writeContract
    isDepositing = depositHook.isPending
    const depositSuccess = depositHook.isSuccess
    // When approve tx succeeds, mark approved
    if (approveSuccess && !approved) {
      setApproved(true)
    }
    // if (depositSuccess && !approved) {
    //   setApproved(true)
    // }
  } catch (error) {
  }

  // ---------------- HANDLERS ----------------
  const handleApprove = () => {
    if (!levelDepositAmount || !approve) return
    approve({
      address: CONTRACTS.USDT_ADDRESS as `0x${string}`,
      abi: ABIS.USDT,
      functionName: "approve",
      args: [CONTRACTS.Referral_ADDRESS, parseUnits(levelDepositAmount.toString(), 18)],
    })
  }

  const handleDeposit = () => {
    if (!levelDepositAmount || !deposit) return
    // Use the referrer from URL/cookies if available, otherwise use the manual input
    let finalReferrer = refAddress || "0x0000000000000000000000000000000000000000"
    
    // Safety check: Never use user's own address as referrer
    if (finalReferrer === address) {
      finalReferrer = "0x0000000000000000000000000000000000000000";
    }
    
    
    deposit({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "join",
      args: [finalReferrer, currentLevel],
    })
  }

  // Generate referral code and copy
  const cookies = new Cookies();
  
  // Use direct URL parsing instead of useSearchParams
  const [finalRef, setFinalRef] = useState<string | null>(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      
      const urlParams = new URLSearchParams(window.location.search);
      const urlRef = urlParams.get('ref');
      
      
      setFinalRef(urlRef);
    }
  }, []);
  
  
  if (finalRef) {
      try {
          const decodedAddress = rot13(finalRef);
          
          if (Web3.utils.isAddress(decodedAddress)) {
              cookies.set('ref', finalRef);
          } else {
          }
      } catch (error) {
      }
  }
  
  let refAddress: string = "0x0000000000000000000000000000000000000000";
  
  if (cookies.get('ref')) {
      try {
          const decodedAddress = rot13(cookies.get('ref'));
          
          if (Web3.utils.isAddress(decodedAddress) && decodedAddress !== address) {
              refAddress = decodedAddress;
          } else if (decodedAddress === address) {
              refAddress = "0x0000000000000000000000000000000000000000";
          } else {
              refAddress = "0x0000000000000000000000000000000000000000";
          }
      } catch (error) {
          refAddress = "0x0000000000000000000000000000000000000000";
      }
  } else {
  }
  

  const BASE_URL = 'localhost:3000';
  const [copied, setCopied] = useState(false);
  const handleCopyReferral = () => {
      const referralLink = address ? `${BASE_URL}/?ref=${rot13(address)}` : `${BASE_URL}/?ref=`
      navigator.clipboard.writeText(referralLink).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
      });
  };

  useEffect(() => {
    if (usdtBalance) setBalanceUSDT(formatUnits(usdtBalance as bigint, 18))
  }, [usdtBalance])

  return (
    <>
    {/* Temporary Debug Panel */}
    
    <Card className=" hover-lift slide-in-up">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <span className="text-2xl sm:text-3xl float-animation">{currentLevelData?.icon || "🏆"}</span>
              <div>
                <div className="text-base sm:text-xl">{currentLevelData?.name || "Loading..."}</div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs holographic">
                    Level {currentLevel}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <span className="hidden sm:inline">{currentLevelData?.category || "Category"}</span>
                    <span className="sm:hidden">Cat {currentLevel}</span>
                  </Badge>
                </div>
              </div>

            </CardTitle>
            <CardDescription className="mt-2 text-sm italic text-muted-foreground">
              "{currentLevelData?.description || "Loading level information..."}"
            </CardDescription>
          </div>
          <div className="text-center sm:text-right">
            <div className="text-sm text-muted-foreground">Total Earned</div>
            <div className="text-xl sm:text-2xl font-bold text-green-500 coin-flip">${totalEarned}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-green-500/5 via-blue-500/5 to-purple-500/5 border border-green-500/20 p-6">
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-transparent opacity-50"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-500" />
                Investment Opportunity
              </h3>
              <Badge variant="secondary" className="holographic">
                8x Return
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-500/20 to-green-600/10 border border-green-500/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CreditCard className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">Investment</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-green-500">${levelDepositAmount}</p>
                <p className="text-xs text-muted-foreground mt-1">One-time payment</p>
              </div>

              <div className="text-center p-4 rounded-lg bg-gradient-to-br from-yellow-500/20 to-yellow-600/10 border border-yellow-500/30">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium text-yellow-500">Potential Reward</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-500">${levelDepositAmount * 8}</p>
                <p className="text-xs text-muted-foreground mt-1">8x Return</p>
              </div>
            </div>

            {/* <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <span>ROI:</span>
              <span className="font-bold text-green-500">
                +{currentLevelData ? ((currentLevelData.reward / currentLevelData.amount - 1) * 100).toFixed(0) : "0"}%
              </span>
              <ArrowRight className="h-4 w-4" />
              <span>Complete your network to unlock rewards</span>
            </div> */}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">Tree Network Progress</span>
            <span className="font-semibold">{totalTreeReferrals}/14 referrals</span>
          </div>
          <div className="relative">
            <Progress value={progressToNext} className="h-4 progress-animated" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-white drop-shadow-lg">{Math.round(progressToNext)}%</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs text-muted-foreground">
            <div className="text-center">
              <div className="font-semibold text-green-500">Step 1: {step1Count}/2</div>
              <div className="text-xs">Direct</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-blue-500">Step 2: {step2Count}/4</div>
              <div className="text-xs">Their referrals</div>
            </div>
            <div className="text-center">
              <div className="font-semibold text-purple-500">Step 3: {step3Count}/8</div>
              <div className="text-xs">Third level</div>
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Level {currentLevel}</span>
            <span>Level {currentLevel + 1}</span>
          </div>
        </div>

        <Dialog open={isDepositModalOpen} onOpenChange={setIsDepositModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full deposit-button hover-lift" size="lg" disabled={!isConnected}>
              <CreditCard className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="text-sm sm:text-base">
                Deposit ${levelDepositAmount} - Start Level {currentLevel}
              </span>
            </Button>
          </DialogTrigger>
          <DialogContent className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-md z-50">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <span className="text-xl sm:text-2xl">{currentLevelData?.icon || "🏆"}</span>
                <span className="text-sm sm:text-base">Deposit for {currentLevelData?.name || "Level"}</span>
              </DialogTitle>
              <DialogDescription className="text-sm">
                Make your investment to start your heroic journey at Level {currentLevel}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-center">
                <div className="p-3 sm:p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                  <p className="text-sm text-muted-foreground">Required Amount</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-500">${levelDepositAmount}</p>
                </div>
                <div className="p-3 sm:p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <p className="text-sm text-muted-foreground">Expected Return</p>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-500">${levelDepositAmount * 8}</p>
                </div>
              </div>

                <div className="space-y-2">
                  <Label htmlFor="referrer-address">
                    Referrer Address {finalRef && <span className="text-green-500">(Auto-detected)</span>}
                  </Label>
                  <Input
                    id="referrer-address"
                    type="text"
                    // placeholder="0x..."
                    value={finalRef ? refAddress : (referrerAddress || "0x0000000000000000000000000000000000000000")}
                    onChange={(e) => setReferrerAddress(e.target.value)}
                    readOnly={!!finalRef}
                    disabled={!!finalRef}
                    className={`text-center text-lg font-semibold h-12 ${finalRef ? ' cursor-not-allowed' : ''}`}
                  />
                  {refAddress && refAddress !== "0x0000000000000000000000000000000000000000" && (
                    <p className="text-xs text-green-500 text-center">
                      Referrer automatically detected from your referral link.
                    </p>
                  )}
                  {finalRef && refAddress === "0x0000000000000000000000000000000000000000" && (
                    <p className="text-xs text-red-500 text-center">
                      Invalid referral link. Please check the link or enter referrer manually.
                    </p>
                  )}
                  {!finalRef && !refAddress && (
                    <p className="text-xs text-muted-foreground text-center">
                      Enter referrer address or visit with a referral link
                    </p>
                  )}
                  {!isConnected && (
                    <div className="flex items-center gap-2 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                      <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                      <p className="text-sm text-yellow-500">Please connect your wallet to continue</p>
                    </div>
                  )}
                </div>

              <div className="flex items-center gap-2 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                <AlertCircle className="h-4 w-4 text-blue-500 flex-shrink-0" />
                <p className="text-sm text-blue-500">Your wallet balance: {balanceUSDT} USDT</p>
              </div>

              {/* <Button
                onClick={processDeposit}
                className="w-full deposit-button h-12"
                size="lg"
                disabled={isProcessingDeposit || !depositAmount}
              >
                {isProcessingDeposit ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    <span className="text-sm sm:text-base">Processing Transaction...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    <span className="text-sm sm:text-base">Confirm Deposit</span>
                  </>
                )}
              </Button> */}
              {!approved ? (
                <Button
                  onClick={handleApprove}
                  className="w-full deposit-button h-12"
                  disabled={isApproving || !levelDepositAmount}
                >
                  {isApproving ? "Approving..." : "Approve USDT"}
                </Button>
              ) : (
                <Button
                  onClick={handleDeposit}
                  disabled={isDepositing || !levelDepositAmount}
                  className="w-full deposit-button h-12"
                >
                  {isDepositing ? "Depositing..." : "Confirm Deposit"}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>

    {/* Referral Network Section - Always Visible */}
    <Card className="hover-lift scale-in holographic border-green-200 dark:border-green-800">
      <CardHeader className="bg-gradient-to-r text-white">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Your Referral Network
        </CardTitle>
        <CardDescription className="text-green-100">
          Build your network and earn rewards through referrals
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 p-6">

        {/* Referral Tree Visualization - Only show if there are referrals */}
        {getReferral && getReferral.length > 0 && (
          <div className="space-y-4">
            {/* <h3 className="text-lg font-semibold text-center">Your Referral Tree</h3> */}
            <ReferralTree 
              rootAddress={address || "0x0000000000000000000000000000000000000000"}
              referrals={getReferral}
              maxDepth={3}
              stepCounts={{
                step1: step1Count,
                step2: step2Count,
                step3: step3Count
              }}
              // Pass pre-fetched data for better performance
              step2Data={{
                step2_1: getReferral2, // Step 2 data for first Step 1 address
                step2_2: getReferral1  // Step 2 data for second Step 1 address
              }}
              step3Data={{
                step3_1: getReferral3_1,
                step3_2: getReferral3_2,
                step3_3: getReferral3_3,
                step3_4: getReferral3_4
              }}
              onFetchReferrals={async (addr: string) => {
                console.log(`=== FETCHING REFERRALS FOR: ${addr} ===`)
                console.log(`getReferral array:`, getReferral)
                console.log(`getReferral2:`, getReferral2)
                console.log(`getReferral1:`, getReferral1)
                console.log(`getReferral2 type:`, typeof getReferral2)
                console.log(`getReferral2 is null:`, getReferral2 === null)
                console.log(`getReferral2 is undefined:`, getReferral2 === undefined)
                
                // Use pre-fetched referral data for Step 1 addresses
                if (getReferral && getReferral.length > 0) {
                  if (addr === getReferral[0]) {
                    console.log(`Matched first Step 1 address: ${addr}`)
                    if (getReferral2 && (getReferral2 as any).length > 0) {
                      const result = (getReferral2 as any).slice(0, 2)
                      console.log(`Returning Step 2 referrals for first Step 1:`, result)
                      return result
                    } else {
                      console.log(`No Step 2 data for first Step 1 address - getReferral2 is:`, getReferral2)
                      // Return empty array with 2 slots to maintain tree structure
                      return ["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000"]
                    }
                  } else if (addr === getReferral[1]) {
                    console.log(`Matched second Step 1 address: ${addr}`)
                    if (getReferral1 && (getReferral1 as any).length > 0) {
                      const result = (getReferral1 as any).slice(0, 2)
                      console.log(`Returning Step 2 referrals for second Step 1:`, result)
                      return result
                    } else {
                      console.log(`No Step 2 data for second Step 1 address - getReferral1 is:`, getReferral1)
                      // Return empty array with 2 slots to maintain tree structure
                      return ["0x0000000000000000000000000000000000000000", "0x0000000000000000000000000000000000000000"]
                    }
                  } else {
                    console.log(`Address ${addr} not found in Step 1 addresses - checking Step 2 addresses`)
                    // Check if this is a Step 2 address (from getReferral2 or getReferral1)
                    const step2Addresses = [
                      ...(getReferral2 ? (getReferral2 as any).slice(0, 2) : []),
                      ...(getReferral1 ? (getReferral1 as any).slice(0, 2) : [])
                    ].filter(addr => addr && addr !== "0x0000000000000000000000000000000000000000")
                    console.log(`Step 2 addresses:`, step2Addresses)
                    
                    if (step2Addresses.includes(addr)) {
                      console.log(`Address ${addr} is a Step 2 address - fetching Step 3 referrals`)
                      // Check which Step 2 address this is and return corresponding Step 3 referrals
                      if (getReferral2 && (getReferral2 as any)[0] === addr) {
                        console.log(`Matched first Step 2 address from getReferral2: ${addr}`)
                        if (getReferral3_1 && (getReferral3_1 as any).length > 0) {
                          const result = (getReferral3_1 as any).slice(0, 2)
                          console.log(`Returning Step 3 referrals for first Step 2:`, result)
                          return result
                        }
                      } else if (getReferral2 && (getReferral2 as any)[1] === addr) {
                        console.log(`Matched second Step 2 address from getReferral2: ${addr}`)
                        if (getReferral3_2 && (getReferral3_2 as any).length > 0) {
                          const result = (getReferral3_2 as any).slice(0, 2)
                          console.log(`Returning Step 3 referrals for second Step 2:`, result)
                          return result
                        }
                      } else if (getReferral1 && (getReferral1 as any)[0] === addr) {
                        console.log(`Matched third Step 2 address from getReferral1: ${addr}`)
                        if (getReferral3_3 && (getReferral3_3 as any).length > 0) {
                          const result = (getReferral3_3 as any).slice(0, 2)
                          console.log(`Returning Step 3 referrals for third Step 2:`, result)
                          return result
                        }
                      } else if (getReferral1 && (getReferral1 as any)[1] === addr) {
                        console.log(`Matched fourth Step 2 address from getReferral1: ${addr}`)
                        if (getReferral3_4 && (getReferral3_4 as any).length > 0) {
                          const result = (getReferral3_4 as any).slice(0, 2)
                          console.log(`Returning Step 3 referrals for fourth Step 2:`, result)
                          return result
                        }
                      }
                      console.log(`No Step 3 data found for Step 2 address: ${addr}`)
                      return []
                    } else {
                      console.log(`Address ${addr} not found in any Step 2 addresses`)
                    }
                  }
                } else {
                  console.log(`No Step 1 referrals available`)
                }
                console.log(`No referrals found for address: ${addr}`)
                return []
              }}
            />
          </div>
        )}

        {/* No Referrals Message */}
        {(!getReferral || getReferral.length === 0) && (
          <div className="text-center py-8">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Users className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Start Building Your Network</h3>
            <p className="text-muted-foreground mb-4">
              Share your referral link to start earning rewards from your network
            </p>
          </div>
        )}

        {/* Referral Link Section */}
        <div className="space-y-4 p-6 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
          <div className="flex items-center gap-2">
            <Copy className="h-5 w-5 text-blue-500" />
            <span className="text-lg font-semibold text-blue-500">Your Referral Link</span>
          </div>
          <div className="flex gap-2">
            <Input
              value={address ? `${BASE_URL}/?ref=${rot13(address)}` : `${BASE_URL}/?ref=`}
              readOnly
              className="text-sm font-mono text-black bg-white dark:bg-gray-800"
            />
            <Button
              onClick={handleCopyReferral}
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6"
            >
              {copied ? <CheckCircle className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              {copied ? "Copied!" : "Copy Link"}
            </Button>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Earn rewards when others join through your referral link</span>
          </div>
        </div>
      </CardContent>
    </Card>
    </>
  )
}
