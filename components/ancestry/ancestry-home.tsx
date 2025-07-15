"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { GitBranch, Microscope, Search } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export function AncestryHome() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold tracking-tight">The Complete Fungal Lineage</h2>
          <p className="text-muted-foreground text-lg">
            Dive into the most comprehensive fungal database ever assembled. Explore evolutionary trees, analyze genetic
            data, and uncover the hidden connections within the fungal kingdom.
          </p>
          <div className="flex gap-4">
            <Button size="lg" asChild>
              <Link href="/natureos/apps/ancestry?tab=explorer">
                <Search className="mr-2 h-5 w-5" />
                Explore Species
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/natureos/apps/ancestry?tab=tools">
                <Microscope className="mr-2 h-5 w-5" />
                Analysis Tools
              </Link>
            </Button>
          </div>
        </div>
        <div className="relative h-80 w-full rounded-lg overflow-hidden">
          <Image
            src="/interconnected-ancestors.png"
            alt="Interconnected fungal ancestors visualization"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5 text-green-600" />
              Powerful Explorer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Search, filter, and sort through thousands of species with detailed profiles, high-resolution imagery, and
              taxonomic data.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Microscope className="h-5 w-5 text-green-600" />
              Advanced Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Utilize a suite of biological tools for DNA sequencing, ITS lookup, sequence alignment, and more.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="h-5 w-5 text-green-600" />
              Interactive Phylogeny
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Visualize evolutionary relationships and trace the lineage of fungal species through interactive 3D trees.
            </p>
            <Button variant="link" className="px-0 pt-2" asChild>
              <Link href="/natureos/apps/ancestry?tab=phylogenetic-explorer">Launch Explorer &rarr;</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
