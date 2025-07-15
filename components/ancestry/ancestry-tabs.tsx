"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { SpeciesExplorer } from "@/components/ancestry/species-explorer"
import { BiologicalTools } from "@/components/ancestry/biological-tools"
import { PhylogeneticTreeTool } from "@/components/ancestry/phylogenetic-tree-tool"
import { AncestryHome } from "@/components/ancestry/ancestry-home"

interface AncestryTabsProps {
  defaultTab?: string
}

export function AncestryTabs({ defaultTab = "overview" }: AncestryTabsProps) {
  return (
    <Tabs defaultValue={defaultTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="explorer">Explorer</TabsTrigger>
        <TabsTrigger value="tools">Analysis Tools</TabsTrigger>
        <TabsTrigger value="phylogeny">Phylogeny</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-6">
        <AncestryHome />
      </TabsContent>
      <TabsContent value="explorer" className="mt-6">
        <SpeciesExplorer />
      </TabsContent>
      <TabsContent value="tools" className="mt-6">
        <BiologicalTools />
      </TabsContent>
      <TabsContent value="phylogeny" className="mt-6">
        <PhylogeneticTreeTool />
      </TabsContent>
    </Tabs>
  )
}
