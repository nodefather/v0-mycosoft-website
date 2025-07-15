"use client"

import { useState, Suspense } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Share2 } from "lucide-react"
import PhylogenyVisualization from "@/components/ancestry/phylogeny-visualization-3d"

function PhylogeneticTreePageClient() {
  const [rootId, setRootId] = useState("47177")
  const [submittedId, setSubmittedId] = useState("47177")
  const [loading, setLoading] = useState(false)

  const handleGenerateTree = () => {
    setLoading(true)
    setSubmittedId(rootId)
    // The visualization component will handle its own loading state
    // We can set a timeout to turn off the button's loading state
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Share2 className="h-12 w-12 text-blue-500 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Interactive Phylogenetic Tree</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Explore evolutionary relationships in a fully interactive 3D environment. Click on nodes to view details and
          interactions.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto mb-8">
        <CardHeader>
          <CardTitle>Generate Tree</CardTitle>
          <CardDescription>
            Enter the NCBI Taxonomy ID of the root species to generate its phylogenetic tree.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="Enter Root Species ID (e.g., 47177 for Amanita muscaria)"
            value={rootId}
            onChange={(e) => setRootId(e.target.value)}
          />
          <Button onClick={handleGenerateTree} disabled={loading} className="w-full sm:w-auto">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
            Generate
          </Button>
        </CardContent>
      </Card>

      <div className="w-full h-[70vh] min-h-[600px] bg-gray-900 rounded-lg border border-gray-700 relative">
        <PhylogenyVisualization rootSpeciesId={Number(submittedId)} />
      </div>
    </div>
  )
}

export default function PhylogeneticTreePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PhylogeneticTreePageClient />
    </Suspense>
  )
}
