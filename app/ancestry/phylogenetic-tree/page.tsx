"use client"

import { useState, useEffect } from "react"
import Tree from "react-d3-tree"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Share2 } from "lucide-react"
import type { RawNodeDatum } from "react-d3-tree/lib/types/types/common"

export default function PhylogeneticTreePage() {
  const [treeData, setTreeData] = useState<RawNodeDatum | null>(null)
  const [rootId, setRootId] = useState("47177") // Default to Amanita muscaria
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTreeData = async (id: string) => {
    if (!id) {
      setError("Please enter a Root Species ID.")
      return
    }
    setLoading(true)
    setError(null)
    setTreeData(null)

    try {
      const response = await fetch(`/api/ancestry/phylogenetic-tree?rootId=${id}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch tree data.")
      }
      setTreeData(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTreeData(rootId)
  }, [])

  const handleGenerateTree = () => {
    fetchTreeData(rootId)
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Share2 className="h-12 w-12 text-blue-500 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Phylogenetic Tree</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Visualize the evolutionary relationships between species, starting from a root organism.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Generate Tree</CardTitle>
          <CardDescription>Enter the ID of the root species to generate its phylogenetic tree.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Enter Root Species ID (e.g., 47177)"
            value={rootId}
            onChange={(e) => setRootId(e.target.value)}
          />
          <Button onClick={handleGenerateTree} disabled={loading} className="w-full sm:w-auto">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
            Generate
          </Button>
        </CardContent>
      </Card>

      <div className="w-full h-[600px] bg-muted rounded-lg border flex items-center justify-center">
        {loading && (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mx-auto" />
            <p className="mt-4 text-muted-foreground">Generating tree...</p>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {treeData && (
          <Tree
            data={treeData}
            orientation="vertical"
            pathFunc="step"
            separation={{ siblings: 1.5, nonSiblings: 2 }}
            nodeSize={{ x: 200, y: 200 }}
            translate={{ x: 400, y: 50 }}
            rootNodeClassName="node__root"
            branchNodeClassName="node__branch"
            leafNodeClassName="node__leaf"
          />
        )}
        {!loading && !error && !treeData && (
          <p className="text-muted-foreground">Enter a Root ID to generate a tree.</p>
        )}
      </div>
      <style jsx global>{`
        .node__root > circle {
          fill: #ef4444;
        }
        .node__branch > circle {
          fill: #3b82f6;
        }
        .node__leaf > circle {
          fill: #22c55e;
          stroke: #16a34a;
        }
        .rd3t-link {
            stroke: #94a3b8;
            stroke-width: 2px;
        }
        .rd3t-node text {
            font-size: 14px;
            font-family: sans-serif;
        }
      `}</style>
    </div>
  )
}
