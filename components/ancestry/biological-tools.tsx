"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dna, Search, GitCompareArrows, FileText, Bot, BarChart } from "lucide-react"
import Link from "next/link"

const tools = [
  {
    name: "Phylogenetic Tree",
    href: "/ancestry/phylogenetic-tree",
    icon: Dna,
    description: "Build and visualize evolutionary trees.",
  },
  {
    name: "ITS Lookup",
    href: "/ancestry/its-lookup",
    icon: Search,
    description: "Identify species using ITS sequences.",
  },
  {
    name: "Sequence Alignment",
    href: "/ancestry/sequence-alignment",
    icon: GitCompareArrows,
    description: "Compare multiple DNA/protein sequences.",
  },
  {
    name: "Genome Annotation",
    href: "/ancestry/genome-annotation",
    icon: FileText,
    description: "Annotate genomic features.",
  },
  {
    name: "Interaction Prediction",
    href: "/ancestry/interaction-prediction",
    icon: Bot,
    description: "Predict molecular interactions.",
  },
  {
    name: "DNA Visualization",
    href: "/ancestry/dna-visualization",
    icon: BarChart,
    description: "Visualize genetic data.",
  },
]

export function BiologicalTools() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <Link href={tool.href} key={tool.name}>
          <Card className="hover:bg-muted/50 transition-colors h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{tool.name}</CardTitle>
              <tool.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">{tool.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
