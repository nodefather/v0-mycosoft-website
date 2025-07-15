"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AncestryHome } from "./ancestry-home"
import { SpeciesExplorer } from "./species-explorer"
import { BiologicalTools } from "./biological-tools"
import PhylogeneticExplorer from "./phylogenetic-explorer"
import { useRouter, useSearchParams } from "next/navigation"

interface AncestryTabsProps {
  defaultTab: string
}

export function AncestryTabs({ defaultTab }: AncestryTabsProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const onTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("tab", value)
    router.push(`/natureos/apps/ancestry?${params.toString()}`)
  }

  return (
    <Tabs defaultValue={defaultTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="explorer">Species Explorer</TabsTrigger>
        <TabsTrigger value="phylogenetic-explorer">Phylogenetic Explorer</TabsTrigger>
        <TabsTrigger value="tools">Analysis Tools</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="mt-4">
        <AncestryHome />
      </TabsContent>
      <TabsContent value="explorer" className="mt-4">
        <SpeciesExplorer />
      </TabsContent>
      <TabsContent value="phylogenetic-explorer" className="mt-4">
        <PhylogeneticExplorer />
      </TabsContent>
      <TabsContent value="tools" className="mt-4">
        <BiologicalTools />
      </TabsContent>
    </Tabs>
  )
}
