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
import { CreditCard, CheckCircle, AlertCircle, ArrowRight, Sparkles, Trophy, Copy } from "lucide-react"
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
  // currentLevelData: Level
  // currentLevel: number
  // referrals: number
  // totalEarned: number
  // balance: number
  // isConnected: boolean
  // isDepositModalOpen: boolean
  // setIsDepositModalOpen: (open: boolean) => void
  // depositAmount: string
  // setDepositAmount: (amount: string) => void
  // isProcessingDeposit: boolean
  // processDeposit: () => void
  // walletAddress: `0x${string}` | undefined
  currentLevelData: Level
  walletAddress: `0x${string}` | undefined
}

export function LevelCard({ currentLevelData, walletAddress }: LevelCardProps) {
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false)
  const [referrerAddress, setReferrerAddress] = useState("")
  const [approved, setApproved] = useState(false)
  const [balanceUSDT, setBalanceUSDT] = useState("0")
  // const progressToNext = (referrals / 8) * 100
  // const [amount, setAmount] = useState("")

  // Safely use useAccount hook
  let address: `0x${string}` | undefined = undefined
  let isConnected = false

  try {
    const account = useAccount()
    address = account.address
    isConnected = account.isConnected
  } catch (error) {
    console.log("[v0] Wagmi context not available in LevelCard")
  }

  // ---------------- READ USER DATA ----------------
  let user: any = null
  let referrals = 0
  let currentLevel = 1
  let totalEarned = 0
  let balance = 0
  let progressToNext = 0
  let levelDepositAmount: number = 0

  try {
    const userData = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "users",
      args: address ? [address] : undefined,
      query: { enabled: !!address },
    })
    user = userData.data
    console.log("debug->users", user)
    referrals = user ? Number((user as any)[2]) : 0
    currentLevel = user ? Number((user as any)[3]) : 1
    totalEarned = user ? Number(formatUnits((user as any)[4], 6)) : 0
    balance = user ? Number(formatUnits((user as any)[5], 6)) : 0
    progressToNext = (referrals / 8) * 100

    const levelsData = useReadContract({
      address: CONTRACTS.Referral_ADDRESS as `0x${string}`,
      abi: ABIS.Referral,
      functionName: "levels",
      args: currentLevel ? [currentLevel] : undefined,
      query: { enabled: !!address },
    })
    const levels = levelsData.data
    levelDepositAmount = levels ? Number(formatUnits((levels as any)[0], 18)) : 0
    console.log("debug->levelDepositAmount", levelDepositAmount)
  } catch (error) {
    console.log("[v0] Wagmi context not available for user data")
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
    console.log("[v0] Wagmi context not available for USDT balance")
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
    console.log("[v0] Wagmi context not available for contract writes")
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
    const finalReferrer = refAddress || referrerAddress || "0x0000000000000000000000000000000000000000"
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
      console.log('Current URL:', window.location.href);
      console.log('Search string:', window.location.search);
      
      const urlParams = new URLSearchParams(window.location.search);
      const urlRef = urlParams.get('ref');
      
      console.log('Direct URL ref:', urlRef);
      console.log('All URL params:', Object.fromEntries(urlParams.entries()));
      
      setFinalRef(urlRef);
      console.log('Referral code from URL (in useEffect):', urlRef);
    }
  }, []);
  
  // Debug logging
  console.log('Referral code from URL (outside useEffect):', finalRef);
  
  if (finalRef) {
      try {
          console.log('Original ref code:', finalRef);
          const decodedAddress = rot13(finalRef);
          console.log('Decoded address:', decodedAddress);
          console.log('Is valid address?', Web3.utils.isAddress(decodedAddress));
          
          if (Web3.utils.isAddress(decodedAddress)) {
              cookies.set('ref', finalRef);
              console.log('Valid referrer address detected:', decodedAddress);
          } else {
              console.log('Invalid referrer address:', decodedAddress);
              console.log('Address length:', decodedAddress.length);
              console.log('Address starts with 0x?', decodedAddress.startsWith('0x'));
          }
      } catch (error) {
          console.log('Error decoding referrer:', error);
      }
  }
  
  let refAddress: string = "0x0000000000000000000000000000000000000000";
  if (cookies.get('ref')) {
      try {
          const decodedAddress = rot13(cookies.get('ref'));
          if (Web3.utils.isAddress(decodedAddress)) {
              refAddress = decodedAddress;
          }
      } catch (error) {
          console.log('Error processing stored referrer:', error);
      }
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
    {/* <div className="mb-4 p-4 bg-white-100 border border-yellow-300 rounded-lg text-sm">
      <h3 className="font-bold mb-2 text-yellow-800">Debug Info:</h3>
      <p><strong>URL Ref:</strong> {finalRef || 'None'}</p>
      <p><strong>Decoded Address:</strong> {finalRef ? rot13(finalRef) : 'None'}</p>
      <p><strong>Is Valid Address:</strong> {finalRef ? (Web3.utils.isAddress(rot13(finalRef)) ? 'Yes' : 'No') : 'N/A'}</p>
      <p><strong>Current URL:</strong> {typeof window !== 'undefined' ? window.location.href : 'Server'}</p>
      <p><strong>Search String:</strong> {typeof window !== 'undefined' ? window.location.search : 'Server'}</p>
    </div> */}
    
    <Card className=" hover-lift slide-in-up">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <CardTitle className="text-xl sm:text-2xl flex items-center gap-2">
              <span className="text-2xl sm:text-3xl float-animation">{currentLevelData.icon}</span>
              <div>
                <div className="text-base sm:text-xl">{currentLevelData.name}</div>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="secondary" className="text-xs holographic">
                    Level {currentLevel}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    <span className="hidden sm:inline">{currentLevelData.category}</span>
                    <span className="sm:hidden">Cat {currentLevel}</span>
                  </Badge>
                </div>
              </div>

            </CardTitle>
            <CardDescription className="mt-2 text-sm italic text-muted-foreground">
              "{currentLevelData.description}"
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
                <p className="text-xs text-muted-foreground mt-1">From 8 referrals</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-4">
              <span>ROI:</span>
              <span className="font-bold text-green-500">
                +{((currentLevelData.reward / currentLevelData.amount - 1) * 100).toFixed(0)}%
              </span>
              <ArrowRight className="h-4 w-4" />
              <span>Complete your network to unlock rewards</span>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-2">Network Progress</span>
            <span className="font-semibold">{referrals}/8 referrals</span>
          </div>
          <div className="relative">
            <Progress value={progressToNext} className="h-4 progress-animated" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-semibold text-white drop-shadow-lg">{Math.round(progressToNext)}%</span>
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
                <span className="text-xl sm:text-2xl">{currentLevelData.icon}</span>
                <span className="text-sm sm:text-base">Deposit for {currentLevelData.name}</span>
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
    
    {/* Referral Link Section */}
    <div className="space-y-3 p-4 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
      <div className="flex items-center gap-2">
        <Copy className="h-4 w-4 text-blue-500" />
        <span className="text-sm font-medium text-blue-500">Your Referral Link</span>
      </div>
      <div className="flex gap-2">
        <Input
          value={address ? `${BASE_URL}/?ref=${rot13(address)}` : `${BASE_URL}/?ref=`}
          readOnly
          className="text-xs font-mono"
        />
        <Button
          onClick={handleCopyReferral}
          size="sm"
          variant="outline"
          className="shrink-0"
        >
          {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      <p className="text-xs text-muted-foreground">
        Share this link to earn rewards when others join through your referral
      </p>
    </div>
    </>
  )
}
