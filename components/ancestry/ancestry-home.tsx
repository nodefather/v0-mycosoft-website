"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dna, Search, GitCompareArrows, FileText, Bot, BarChart } from "lucide-react"
import Link from "next/link"

const tools = [
  {
    title: "Phylogenetic Tree Tool",
    description: "Visualize evolutionary relationships and build phylogenetic trees from your data.",
    icon: <Dna className="h-8 w-8 text-emerald-500" />,
    link: "/ancestry/phylogenetic-tree",
  },
  {
    title: "ITS Lookup",
    description: "Quickly search the Internal Transcribed Spacer (ITS) region for species identification.",
    icon: <Search className="h-8 w-8 text-blue-500" />,
    link: "/ancestry/its-lookup",
  },
  {
    title: "Sequence Alignment",
    description: "Align multiple DNA or protein sequences to find regions of similarity.",
    icon: <GitCompareArrows className="h-8 w-8 text-purple-500" />,
    link: "/ancestry/sequence-alignment",
  },
  {
    title: "Genome Annotation",
    description: "Identify genes and other biological features in your genomic data.",
    icon: <FileText className="h-8 w-8 text-orange-500" />,
    link: "/ancestry/genome-annotation",
  },
  {
    title: "Interaction Prediction",
    description: "Predict potential interactions between different fungal species or proteins.",
    icon: <Bot className="h-8 w-8 text-red-500" />,
    link: "/ancestry/interaction-prediction",
  },
  {
    title: "DNA Visualization",
    description: "Generate insightful charts and visualizations from your genetic data.",
    icon: <BarChart className="h-8 w-8 text-yellow-500" />,
    link: "/ancestry/dna-visualization",
  },
]

export function AncestryHome() {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Ancestry Analysis Toolkit</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl mx-auto">
          A comprehensive suite of bioinformatics tools designed for fungal genetics research. Explore, analyze, and
          visualize your data with cutting-edge technology.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <Link href={tool.link} key={tool.title} className="group">
            <Card className="h-full transition-all hover:shadow-lg hover:border-emerald-500/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-semibold">{tool.title}</CardTitle>
                {tool.icon}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tool.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
