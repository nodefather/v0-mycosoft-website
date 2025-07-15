"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, GitCompareArrows, FileText, BarChart, Share2, TestTube2 } from "lucide-react"
import Link from "next/link"

const tools = [
  {
    name: "Phylogenetic Tree",
    href: "/ancestry/phylogenetic-tree",
    icon: Share2,
    description: "Build and visualize evolutionary trees in 3D.",
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
    name: "Metabolic Pathway Analysis",
    href: "/ancestry/metabolic-pathway",
    icon: TestTube2,
    description: "Analyze metabolic capabilities of species.",
  },
  {
    name: "DNA Visualization",
    href: "/ancestry/dna-visualization",
    icon: BarChart,
    description: "Visualize genetic data and structures.",
  },
]

export function BiologicalTools() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tools.map((tool) => (
        <Link href={tool.href} key={tool.name} className="block hover:scale-[1.02] transition-transform duration-200">
          <Card className="hover:bg-muted/50 transition-colors h-full border-l-4 border-transparent hover:border-emerald-500">
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
