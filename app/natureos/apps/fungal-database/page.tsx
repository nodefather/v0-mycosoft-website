import { SpeciesExplorer } from "@/components/ancestry/species-explorer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

function SpeciesExplorerSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(9)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <Skeleton className="h-48 w-full" />
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export default function FungalDatabasePage() {
  return (
    <div className="p-4 md:p-8 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Fungal Database Explorer</CardTitle>
          <CardDescription>Search, filter, and explore our comprehensive database of fungal species.</CardDescription>
        </CardHeader>
      </Card>
      <Suspense fallback={<SpeciesExplorerSkeleton />}>
        <SpeciesExplorer />
      </Suspense>
    </div>
  )
}
