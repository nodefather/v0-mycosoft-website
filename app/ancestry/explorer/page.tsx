"use client"

import dynamic from "next/dynamic"
import { Suspense } from "react"
import { Loader2 } from "lucide-react"

/**
 * Lazy-load the heavy AncestryExplorer tool on the client
 * to avoid SSR issues with d3 / three-js dependencies.
 */
const AncestryExplorer = dynamic(() => import("@/components/ancestry/ancestry-explorer"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center py-8">
      <Loader2 className="animate-spin mr-2" />
      <span>Loading Ancestry Explorer…</span>
    </div>
  ),
})

/**
 * Ancestry Explorer main page
 * (required default export: `AncestryExplorerPage`)
 */
export default function AncestryExplorerPage() {
  return (
    <main className="flex flex-col gap-6 p-6 lg:p-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Ancestry Explorer</h1>
        <p className="text-muted-foreground max-w-2xl">
          Visualize phylogenetic relationships, browse genomic data, and interact with our Multi-Agent analysis results
          in real-time.
        </p>
      </header>

      <Suspense fallback={null /* dynamic() provides its own loader */}>
        <section className="rounded-lg border bg-card p-4 shadow-sm">
          <AncestryExplorer />
        </section>
      </Suspense>
    </main>
  )
}
