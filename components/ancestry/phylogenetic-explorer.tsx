"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Share2 } from "lucide-react"
import PhylogenyVisualization from "@/components/ancestry/phylogeny-visualization-3d"

export default function PhylogeneticExplorer() {
  const [rootId, setRootId] = useState("47177") // Default: Amanita muscaria
  const [submittedId, setSubmittedId] = useState("47177")
  const [loading, setLoading] = useState(false)

  const handleGenerateTree = () => {
    if (!rootId) return
    setLoading(true)
    setSubmittedId(rootId)
    // The visualization component will handle its own internal loading state for the data,
    // this button's loading state is just for user feedback on click.
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="space-y-6">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Generate a New Tree</CardTitle>
          <CardDescription>
            Enter the NCBI Taxonomy ID of the root species to generate its phylogenetic tree. Try `5040` for Boletus or
            `4751` for Fungi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Enter Root Species ID (e.g., 47177)"
              value={rootId}
              onChange={(e) => setRootId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleGenerateTree()}
            />
            <Button onClick={handleGenerateTree} disabled={loading} className="w-full sm:w-auto">
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Share2 className="h-4 w-4 mr-2" />}
              Generate
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="w-full h-[75vh] min-h-[650px] bg-gray-900 rounded-lg border border-gray-700 relative overflow-hidden">
        <PhylogenyVisualization rootSpeciesId={Number(submittedId)} />
      </div>
    </div>
  )
}
