"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PhylogeneticTreeTool } from "@/components/ancestry/phylogenetic-tree-tool"

export default function PhylogeneticTreePageClient() {
  return (
    <Card className="max-w-4xl mx-auto mb-8">
      <CardHeader>
        <CardTitle>Phylogenetic Tree Builder</CardTitle>
        <CardDescription>
          Enter a root species to generate and visualize its phylogenetic tree. This tool helps trace evolutionary
          lineage and relationships.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PhylogeneticTreeTool />
      </CardContent>
    </Card>
  )
}
