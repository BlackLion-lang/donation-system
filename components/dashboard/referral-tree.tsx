"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronRight, Users, User, Copy, ExternalLink, TreePine } from "lucide-react"
import { cn } from "@/lib/utils"

interface ReferralNode {
  address: string
  level: number
  children: ReferralNode[]
  isExpanded?: boolean
  id?: string // Add unique identifier
}

interface ReferralTreeProps {
  rootAddress: string
  referrals: string[]
  maxDepth?: number
  onFetchReferrals?: (address: string) => Promise<string[]>
  stepCounts?: {
    step1: number
    step2: number
    step3: number
  }
  step2Data?: {
    step2_1: any
    step2_2: any
  }
  step3Data?: {
    step3_1: any
    step3_2: any
    step3_3: any
    step3_4: any
  }
}

interface TreeNodeProps {
  node: ReferralNode
  depth: number
  maxDepth: number
  onToggle: (node: ReferralNode) => void
  onCopy: (address: string) => void
  onView: (address: string) => void
}

const TreeNode: React.FC<TreeNodeProps> = ({ node, depth, maxDepth, onToggle, onCopy, onView }) => {
  const hasChildren = node.children && node.children.length > 0
  const isExpanded = node.isExpanded ?? false
  const isLeaf = !hasChildren
  

  return (
    <div className="relative">
      {/* Node Content */}
      <div 
        className={cn(
          "flex items-center gap-1 sm:gap-2 p-1.5 sm:p-3 rounded-lg border transition-all duration-200 hover:shadow-md",
          "bg-white/50 dark:bg-gray-800/50 border-green-500/20 hover:border-green-500/40",
          depth === 0 && "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30",
          (hasChildren || node.level <= 3) && "cursor-pointer"
        )}
        onClick={(e) => {
          // Only handle click if it's not on a button
          const target = e.target as HTMLElement
          if (e.target === e.currentTarget || !target.closest('button')) {
            if (hasChildren || node.level <= 3) {
              onToggle(node)
            }
          }
        }}
      >
         {/* Expand/Collapse Button */}
         {(hasChildren || node.level <= 3) && (
           <Button
             variant="ghost"
             size="sm"
             className="h-6 w-6 sm:h-8 sm:w-8 p-1 hover:bg-green-500/20 flex-shrink-0 border border-green-500/30 rounded-md"
             onClick={(e) => {
               e.preventDefault()
               e.stopPropagation() // Prevent the parent div click from firing
               onToggle(node)
             }}
           >
             {isExpanded ? (
               <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
             ) : (
               <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
             )}
           </Button>
         )}
        
        {/* Node Icon */}
        <div className={cn(
          "flex-shrink-0 w-5 h-5 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-white text-xs font-bold",
          depth === 0 
            ? "bg-gradient-to-br from-green-500 to-emerald-500" 
            : "bg-gradient-to-br from-blue-500 to-cyan-500"
        )}>
          {depth === 0 ? <User className="h-2.5 w-2.5 sm:h-4 sm:w-4" /> : <Users className="h-2 w-2 sm:h-3 sm:w-3" />}
        </div>

         {/* Address and Info */}
         <div className="flex-1 min-w-0">
           <p className="text-xs font-mono text-gray-900 dark:text-gray-300 truncate">
             {node.address === "0x0000000000000000000000000000000000000000" ? "Not yet" : 
              `${node.address.slice(0, 4)}...${node.address.slice(-3)}`}
           </p>
           <div className="flex items-center gap-1 mt-0.5">
             <Badge variant="outline" className="text-xs px-1.5 py-0.5">
             {node.level == 1 ? "Root" : `Step ${node.level - 1}`}
             </Badge>
             {hasChildren && (
               <Badge variant="secondary" className="text-xs bg-blue-500/20 text-blue-700 px-1.5 py-0.5">
                 {node.children.length}
               </Badge>
             )}
             {/* {node.level === 3 && (
               <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-700">
                 Step 3
               </Badge>
             )} */}
             {/* {node.level === 3 && hasChildren && (
               <Badge variant="secondary" className="text-xs bg-purple-500/20 text-purple-700">
                 Has {node.children.length} Step 3
               </Badge>
             )} */}
             {/* <Badge variant="outline" className="text-xs">
               {isExpanded ? "Expanded" : "Collapsed"}
             </Badge>
             {node.level === 3 && (
               <Badge variant="secondary" className="text-xs bg-yellow-500/20 text-yellow-700">
                 Click to expand
               </Badge>
             )} */}
           </div>
         </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-green-500/20"
            onClick={(e) => {
              e.stopPropagation()
              onCopy(node.address)
            }}
          >
            <Copy className="h-2 w-2 sm:h-3 sm:w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-green-500/20"
            onClick={(e) => {
              e.stopPropagation()
              onView(node.address)
            }}
          >
            <ExternalLink className="h-2 w-2 sm:h-3 sm:w-3" />
          </Button>
        </div>
      </div>

       {/* Children */}
       {hasChildren && isExpanded && (
         <div className="ml-4 sm:ml-6 mt-1 sm:mt-2 space-y-1 sm:space-y-2">
           {node.children.map((child, index) => (
             <div key={`${child.address}-${index}`} className="relative">
               {/* Connection Line - Vertical line from parent to child */}
               <div className="absolute -left-4 sm:-left-6 top-0 w-4 sm:w-6 h-4 sm:h-6">
                 {/* Vertical line */}
                 <div className="absolute left-0 top-0 w-0.5 h-4 sm:h-6 bg-green-500/30"></div>
                 {/* Horizontal line to child */}
                 <div className="absolute left-0 top-4 sm:top-6 w-4 sm:w-6 h-0.5 bg-green-500/30"></div>
               </div>
               
               {/* Child Node */}
               <TreeNode
                 node={child}
                 depth={depth + 1}
                 maxDepth={maxDepth}
                 onToggle={onToggle}
                 onCopy={onCopy}
                 onView={onView}
               />
             </div>
           ))}
         </div>
       )}
    </div>
  )
}

// Helper function to validate and filter addresses
const isValidAddress = (address: string): boolean => {
  if (!address) return false
  if (address === "0x0000000000000000000000000000000000000000") return false
  if (address.length < 5) return false // More lenient validation
  return true
}

const getValidAddress = (address: string): string => {
  return isValidAddress(address) ? address : "0x0000000000000000000000000000000000000000"
}

export const ReferralTree: React.FC<ReferralTreeProps> = ({ 
  rootAddress, 
  referrals, 
  maxDepth = 3,
  onFetchReferrals,
  stepCounts,
  step2Data,
  step3Data
}) => {
  const [treeData, setTreeData] = useState<ReferralNode>(() => ({
    address: rootAddress,
    level: 1,
    children: [],
    isExpanded: true
  }))
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  // Build proper tree structure with all levels - only when referrals actually change
  React.useEffect(() => {
    const buildTreeStructure = async () => {
      setLoading(true)
      
      try {
        // Step 1: Direct referrals (first 2)
        const step1Referrals = referrals.slice(0, 2).filter(isValidAddress)
        
        // Step 2 and Step 3: These will be fetched dynamically when nodes are expanded
        // We can't calculate them statically because we need to fetch each address's referrals
        const step2Referrals: string[] = []
        const step3Referrals: string[] = []
        
        // Build the complete tree structure with pre-fetched data
        const tree: ReferralNode = {
          address: rootAddress,
          level: 1,
          id: `root-${Date.now()}`,
          children: [
            // Step 1 - First address with its Step 2 children
            {
              address: getValidAddress(referrals[0] || ""),
              level: 2,
              id: `step1-0-${Date.now()}`,
              children: step2Data?.step2_1 && (step2Data.step2_1 as any).length > 0 ? [
                {
                  address: getValidAddress((step2Data.step2_1 as any).slice(0, 2)[0] || ""),
                  level: 3,
                  id: `step2-0-${Date.now()}`,
                  children: step3Data?.step3_1 && (step3Data.step3_1 as any).length > 0 ? [
                    {
                      address: getValidAddress((step3Data.step3_1 as any).slice(0, 2)[0] || ""),
                      level: 4,
                      id: `step3-0-${Date.now()}`,
                      children: [],
                      isExpanded: false
                    },
                    {
                      address: getValidAddress((step3Data.step3_1 as any).slice(0, 2)[1] || ""),
                      level: 4,
                      id: `step3-1-${Date.now()}`,
                      children: [],
                      isExpanded: false
                    }
                  ] : [],
                  isExpanded: false
                },
                {
                  address: getValidAddress((step2Data.step2_1 as any).slice(0, 2)[1] || ""),
                  level: 3,
                  id: `step2-1-${Date.now()}`,
                  children: step3Data?.step3_2 && (step3Data.step3_2 as any).length > 0 ? [
                    {
                      address: getValidAddress((step3Data.step3_2 as any).slice(0, 2)[0] || ""),
                      level: 4,
                      id: `step3-2-${Date.now()}`,
                      children: [],
                      isExpanded: false
                    },
                    {
                      address: getValidAddress((step3Data.step3_2 as any).slice(0, 2)[1] || ""),
                      level: 4,
                      id: `step3-3-${Date.now()}`,
                      children: [],
                      isExpanded: false
                    }
                  ] : [],
                  isExpanded: false
                }
              ] : [],
              isExpanded: false
            },
            // Step 1 - Second address with its Step 2 children
            {
              address: getValidAddress(referrals[1] || ""),
              level: 2,
              id: `step1-1-${Date.now()}`,
              children: step2Data?.step2_2 && (step2Data.step2_2 as any).length > 0 ? [
                {
                  address: getValidAddress((step2Data.step2_2 as any).slice(0, 2)[0] || ""),
                  level: 3,
                  id: `step2-2-${Date.now()}`,
                  children: step3Data?.step3_3 && (step3Data.step3_3 as any).length > 0 ? [
                    {
                      address: getValidAddress((step3Data.step3_3 as any).slice(0, 2)[0] || ""),
                      level: 4,
                      id: `step3-4-${Date.now()}`,
                      children: [],
                      isExpanded: false
                    },
                    {
                      address: getValidAddress((step3Data.step3_3 as any).slice(0, 2)[1] || ""),
                      level: 4,
                      id: `step3-5-${Date.now()}`,
                      children: [],
                      isExpanded: false
                    }
                  ] : [],
                  isExpanded: false
                },
                {
                  address: getValidAddress((step2Data.step2_2 as any).slice(0, 2)[1] || ""),
                  level: 3,
                  id: `step2-3-${Date.now()}`,
                  children: step3Data?.step3_4 && (step3Data.step3_4 as any).length > 0 ? [
                    {
                      address: getValidAddress((step3Data.step3_4 as any).slice(0, 2)[0] || ""),
                      level: 4,
                      id: `step3-6-${Date.now()}`,
                      children: [],
                      isExpanded: false
                    },
                    {
                      address: getValidAddress((step3Data.step3_4 as any).slice(0, 2)[1] || ""),
                      level: 4,
                      id: `step3-7-${Date.now()}`,
                      children: [],
                      isExpanded: false
                    }
                  ] : [],
                  isExpanded: false
                }
              ] : [],
              isExpanded: false
            }
          ],
          isExpanded: true
        }

        setTreeData(tree)
      } catch (error) {
        console.error("Error building tree structure:", error)
      } finally {
        setLoading(false)
      }
    }

    buildTreeStructure()
  }, [rootAddress, JSON.stringify(referrals), maxDepth])

  const handleToggle = async (node: ReferralNode) => {
    
    const updateNode = async (current: ReferralNode): Promise<ReferralNode> => {
      // Use ID for matching if available, fallback to address
      const isMatch = (current.id && node.id) ? 
        current.id === node.id : 
        current.address === node.address
      
      if (isMatch) {
        // If expanding and no children exist, fetch them from contract
        if (!current.isExpanded && (!current.children || current.children.length === 0) && onFetchReferrals) {
          try {
            const fetchedReferrals = await onFetchReferrals(current.address)
            
            // Create children from fetched referrals (always show 2 slots)
            const children = [
              {
                address: getValidAddress(fetchedReferrals[0] || ""),
                level: current.level + 1,
                id: `${current.id}-child-0-${Date.now()}`,
                children: [],
                isExpanded: false
              },
              {
                address: getValidAddress(fetchedReferrals[1] || ""),
                level: current.level + 1,
                id: `${current.id}-child-1-${Date.now()}`,
                children: [],
                isExpanded: false
              }
            ]
            
            const updatedNode = { 
              ...current, 
              isExpanded: !current.isExpanded,
              children: children
            }
            return updatedNode
          } catch (error) {
            console.error(`Error fetching referrals for ${current.address}:`, error)
            // Fallback to just toggling without fetching
            return { ...current, isExpanded: !current.isExpanded }
          }
        } else {
          return { ...current, isExpanded: !current.isExpanded }
        }
      }
      
      if (current.children && current.children.length > 0) {
        const updatedChildren = await Promise.all(current.children.map(updateNode))
        return {
          ...current,
          children: updatedChildren
        }
      }
      
      return current
    }

    const newTreeData = await updateNode(treeData)
    setTreeData(newTreeData)
  }

  const handleCopy = (address: string) => {
    navigator.clipboard.writeText(address)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleView = (address: string) => {
    const explorerUrl = `https://bscscan.com/address/${address}`
    window.open(explorerUrl, '_blank')
  }

  const expandAll = () => {
    const expandAllNodes = (node: ReferralNode): ReferralNode => {
      return {
        ...node,
        isExpanded: true,
        children: node.children?.map(expandAllNodes) || []
      }
    }
    setTreeData(expandAllNodes(treeData))
  }

  const countTotalNodes = (node: ReferralNode): number => {
    return 1 + (node.children?.reduce((sum, child) => sum + countTotalNodes(child), 0) || 0)
  }

  const totalNodes = countTotalNodes(treeData)

  return (
    <Card className="hover-lift slide-in-up">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TreePine className="h-10 w-10 text-green-500" />
            <div>
              <CardTitle className="text-lg">Referral Tree</CardTitle>
              <CardDescription className="text-sm">
                Your complete referral network structure
              </CardDescription>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-500/20 text-green-700">
            {totalNodes} total nodes
          </Badge>
        </div>
      </CardHeader>
      
       <CardContent className="space-y-4">
         {/* Tree Visualization */}
         {loading ? (
           <div className="flex items-center justify-center py-8">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
             <span className="ml-2 text-sm text-muted-foreground">Loading tree structure...</span>
           </div>
         ) : (
           <div className="relative overflow-x-auto">
             <div className="min-w-max p-2 sm:p-4">
               {/* Tree Structure - Top to Bottom Flow */}
               <div className="relative">
                 {/* Root Address - Top */}
                 <div className="flex items-center justify-center mb-2 sm:mb-4">
                   <div className="text-sm text-muted-foreground bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30 text-center">
                     <span className="hidden sm:inline">Root Address (You) - Click to show 2 Step 1 addresses</span>
                     <span className="sm:hidden">Root (You) - Tap to expand</span>
                   </div>
                 </div>
                 
                 <TreeNode
                   node={treeData}
                   depth={0}
                   maxDepth={maxDepth}
                   onToggle={handleToggle}
                   onCopy={handleCopy}
                   onView={handleView}
                 />
               </div>
             </div>
           </div>
         )}

         {/* Tree Stats */}
         <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20">
           <div className="text-center">
             <p className="text-lg font-bold text-green-500">
               {stepCounts?.step1 || treeData.children?.filter(child => isValidAddress(child.address)).length || 0}
             </p>
             <p className="text-xs text-muted-foreground">Step 1 (2 max)</p>
           </div>
           <div className="text-center">
             <p className="text-lg font-bold text-blue-500">
               {stepCounts?.step2 || treeData.children?.reduce((sum, child) => 
                 sum + (child.children?.filter(grandChild => isValidAddress(grandChild.address)).length || 0), 0) || 0}
             </p>
             <p className="text-xs text-muted-foreground">Step 2 (4 max)</p>
           </div>
           <div className="text-center">
             <p className="text-lg font-bold text-purple-500">
               {stepCounts?.step3 || treeData.children?.reduce((sum, child) => 
                 sum + (child.children?.reduce((childSum, grandChild) => 
                   childSum + (grandChild.children?.filter(ggChild => isValidAddress(ggChild.address)).length || 0), 0) || 0), 0) || 0}
             </p>
             <p className="text-xs text-muted-foreground">Step 3 (8 max)</p>
           </div>
           <div className="text-center">
             <p className="text-lg font-bold text-orange-500">{totalNodes - 1}</p>
             <p className="text-xs text-muted-foreground">Total</p>
           </div>
         </div>

         {/* Debug Info */}
         {/* <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-yellow-500/5 to-orange-500/5 border border-yellow-500/20">
           <div className="flex items-center gap-2 text-sm font-medium text-yellow-500 mb-2">
             <TreePine className="h-4 w-4" />
             Tree Structure Debug
           </div>
           <div className="text-xs text-muted-foreground">
             <p>Total nodes: {totalNodes}</p>
             <p>Step 1 nodes: {treeData.children?.length || 0}</p>
             <p>Step 2 nodes: {treeData.children?.reduce((sum, child) => sum + (child.children?.length || 0), 0) || 0}</p>
             <p>Step 3 nodes: {treeData.children?.reduce((sum, child) => 
               sum + (child.children?.reduce((childSum, grandChild) => 
                 childSum + (grandChild.children?.length || 0), 0) || 0), 0) || 0}</p>
           </div>
         </div> */}

         {/* Tree Structure Legend */}
         <div className="space-y-2 p-4 rounded-lg bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-blue-500/20">
           <div className="flex items-center gap-2 text-sm font-medium text-blue-500 mb-2">
             <TreePine className="h-4 w-4" />
             Tree Structure Flow
           </div>
           <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-green-500"></div>
               <span>Click Root → Shows 2 Step 1 addresses</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-blue-500"></div>
               <span>Click Step 1 → Shows 4 Step 2 addresses</span>
             </div>
             <div className="flex items-center gap-2">
               <div className="w-3 h-3 rounded-full bg-purple-500"></div>
               <span>Click Step 2 → Shows 8 Step 3 addresses</span>
             </div>
           </div>
           <div className="flex items-center justify-between mt-2">
             <div className="text-xs text-muted-foreground">
               Click arrows to expand/collapse branches. Tree flows from top (you) to bottom (referrals).
             </div>
             <div className="flex gap-2">
               <Button
                 onClick={expandAll}
                 size="sm"
                 variant="outline"
                 className="text-xs h-6 px-2"
               >
                 Expand All
               </Button>
             </div>
           </div>
         </div>
      </CardContent>
    </Card>
  )
}
