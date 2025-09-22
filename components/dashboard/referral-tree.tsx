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
  
  console.log(`TreeNode: ${node.address}, level: ${node.level}, hasChildren: ${hasChildren}, isExpanded: ${isExpanded}`)

  return (
    <div className="relative">
      {/* Node Content */}
      <div 
        className={cn(
          "flex items-center gap-1 sm:gap-2 p-1.5 sm:p-3 rounded-lg border transition-all duration-200 hover:shadow-md cursor-pointer",
          "bg-white/50 dark:bg-gray-800/50 border-green-500/20 hover:border-green-500/40",
          depth === 0 && "bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-green-500/30"
        )}
        onClick={() => {
          if (hasChildren || node.level === 3) {
            console.log(`Clicking entire node: ${node.address}, level: ${node.level}`)
            onToggle(node)
          }
        }}
      >
         {/* Expand/Collapse Button */}
         {(hasChildren || node.level === 3) && (
           <Button
             variant="ghost"
             size="sm"
             className="h-4 w-4 sm:h-6 sm:w-6 p-0 hover:bg-green-500/20"
             onClick={() => {
               console.log(`Clicking toggle for node: ${node.address}, level: ${node.level}, hasChildren: ${hasChildren}`)
               onToggle(node)
             }}
           >
             {isExpanded ? (
               <ChevronDown className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
             ) : (
               <ChevronRight className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
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
            onClick={() => onCopy(node.address)}
          >
            <Copy className="h-2 w-2 sm:h-3 sm:w-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-green-500/20"
            onClick={() => onView(node.address)}
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

export const ReferralTree: React.FC<ReferralTreeProps> = ({ 
  rootAddress, 
  referrals, 
  maxDepth = 3,
  onFetchReferrals
}) => {
  const [treeData, setTreeData] = useState<ReferralNode>(() => ({
    address: rootAddress,
    level: 1,
    children: [],
    isExpanded: true
  }))
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)

  // Build proper tree structure with all levels
  React.useEffect(() => {
    const buildTreeStructure = async () => {
      setLoading(true)
      
      try {
        console.log("ReferralTree - referrals:", referrals)
        
        // Step 1: Direct referrals (first 2)
        const step1Referrals = referrals.slice(0, 2).filter(addr => 
          addr && addr !== "0x0000000000000000000000000000000000000000"
        )
        
        // Step 2: Each step1 referral's referrals (next 4 addresses)
        const step2Referrals: string[] = []
        for (let i = 0; i < 2; i++) {
          const step2Start = 2 + (i * 2)
          step2Referrals.push(
            referrals[step2Start] || "0x0000000000000000000000000000000000000000",
            referrals[step2Start + 1] || "0x0000000000000000000000000000000000000000"
          )
        }
        
        // Step 3: Each step2 referral's referrals (next 8 addresses)
        const step3Referrals: string[] = []
        for (let i = 0; i < 4; i++) {
          const step3Start = 6 + (i * 2)
          step3Referrals.push(
            referrals[step3Start] || "0x0000000000000000000000000000000000000000",
            referrals[step3Start + 1] || "0x0000000000000000000000000000000000000000"
          )
        }
        
        console.log("Step 1 referrals:", step1Referrals)
        console.log("Step 2 referrals:", step2Referrals)
        console.log("Step 3 referrals:", step3Referrals)
        
        // Build the complete tree structure
        const tree: ReferralNode = {
          address: rootAddress,
          level: 1,
          id: `root-${Date.now()}`,
          children: step1Referrals.map((addr, index) => ({
            address: addr,
            level: 2,
            id: `step1-${index}-${Date.now()}`,
            children: step2Referrals.slice(index * 2, (index * 2) + 2).map((step2Addr, step2Index) => ({
              address: step2Addr,
              level: 3,
              id: `step2-${index}-${step2Index}-${Date.now()}`,
              children: step3Referrals.slice((index * 2 + step2Index) * 2, ((index * 2 + step2Index) * 2) + 2).map((step3Addr, step3Index) => ({
                address: step3Addr,
                level: 4,
                id: `step3-${index}-${step2Index}-${step3Index}-${Date.now()}`,
                children: [],
                isExpanded: false
              })),
              isExpanded: false
            })),
            isExpanded: false
          })),
          isExpanded: true
        }

        console.log("Complete tree structure built:", tree)
        setTreeData(tree)
      } catch (error) {
        console.error("Error building tree structure:", error)
      } finally {
        setLoading(false)
      }
    }

    buildTreeStructure()
  }, [rootAddress, referrals, maxDepth])

  const handleToggle = (node: ReferralNode) => {
    console.log(`Attempting to toggle node: ${node.address}, level: ${node.level}, id: ${node.id}`)
    console.log(`Current tree data before toggle:`, treeData)
    
    const updateNode = (current: ReferralNode): ReferralNode => {
      console.log(`Checking node: ${current.address} (id: ${current.id}) against target: ${node.address} (id: ${node.id})`)
      
      // Use ID for matching if available, fallback to address
      const isMatch = (current.id && node.id) ? 
        current.id === node.id : 
        current.address === node.address
      
      if (isMatch) {
        console.log(`Found matching node: ${current.address}, current expanded: ${current.isExpanded}, will toggle to: ${!current.isExpanded}`)
        console.log(`Node has ${current.children?.length || 0} children`)
        const updatedNode = { ...current, isExpanded: !current.isExpanded }
        console.log(`Updated node:`, updatedNode)
        return updatedNode
      }
      
      if (current.children && current.children.length > 0) {
        console.log(`Searching children of: ${current.address}`)
        const updatedChildren = current.children.map(updateNode)
        return {
          ...current,
          children: updatedChildren
        }
      }
      
      return current
    }

    const newTreeData = updateNode(treeData)
    console.log("New tree data after toggle:", newTreeData)
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
               {treeData.children?.filter(child => child.address !== "0x0000000000000000000000000000000000000000").length || 0}
             </p>
             <p className="text-xs text-muted-foreground">Step 1 (2 max)</p>
           </div>
           <div className="text-center">
             <p className="text-lg font-bold text-blue-500">
               {treeData.children?.reduce((sum, child) => 
                 sum + (child.children?.filter(grandChild => grandChild.address !== "0x0000000000000000000000000000000000000000").length || 0), 0) || 0}
             </p>
             <p className="text-xs text-muted-foreground">Step 2 (4 max)</p>
           </div>
           <div className="text-center">
             <p className="text-lg font-bold text-purple-500">
               {treeData.children?.reduce((sum, child) => 
                 sum + (child.children?.reduce((childSum, grandChild) => 
                   childSum + (grandChild.children?.filter(ggChild => ggChild.address !== "0x0000000000000000000000000000000000000000").length || 0), 0) || 0), 0) || 0}
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
