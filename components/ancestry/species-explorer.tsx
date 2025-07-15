"use client"
import { useState, useEffect, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Search, AlertTriangle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface Species {
  id: number
  scientific_name: string
  common_name: string
  family: string
  description: string
  image_url: string
  characteristics: string | string[]
}

interface SpeciesListProps {
  species: Species[]
}

function SpeciesList({ species }: SpeciesListProps) {
  if (species.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No species found matching your criteria.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {species.map((s) => {
        const characteristicsArray =
          typeof s.characteristics === "string"
            ? s.characteristics.split(",").map((c) => c.trim())
            : s.characteristics || []

        const isEdible = characteristicsArray.some((c) => c.toLowerCase() === "edible")
        const isPoisonous = characteristicsArray.some(
          (c) => c.toLowerCase() === "poisonous" || c.toLowerCase() === "toxic",
        )

        let badgeVariant: "default" | "destructive" | "secondary" = "secondary"
        let badgeText = "Unknown"

        if (isEdible) {
          badgeVariant = "default"
          badgeText = "Edible"
        } else if (isPoisonous) {
          badgeVariant = "destructive"
          badgeText = "Poisonous"
        }

        return (
          <Card key={s.id} className="overflow-hidden transition-all hover:shadow-lg flex flex-col">
            <div className="aspect-[16/9] relative">
              <Image
                src={s.image_url || `/placeholder.svg?height=200&width=300&query=${s.scientific_name}`}
                alt={s.scientific_name}
                fill
                className="object-cover"
              />
              <Badge
                variant={badgeVariant}
                className={`absolute top-2 right-2 ${isEdible ? "bg-green-500 hover:bg-green-600" : ""}`}
              >
                {badgeText}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">
                <Link href={`/ancestry/explorer/${s.id}`} className="hover:underline">
                  {s.scientific_name}
                </Link>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{s.common_name}</p>
            </CardHeader>
            <CardContent className="pb-4 flex-grow flex flex-col justify-between">
              <div>
                <div className="mb-2">
                  <p className="font-medium text-sm">Family:</p>
                  <p className="text-sm text-muted-foreground">{s.family}</p>
                </div>
                <div>
                  <p className="font-medium text-sm">Description:</p>
                  <p className="text-sm text-muted-foreground line-clamp-2">{s.description}</p>
                </div>
              </div>
              <div className="mt-4">
                <Link
                  href={`/ancestry/explorer/${s.id}`}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  View Details →
                </Link>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function SpeciesExplorerSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(9)].map((_, i) => (
        <Card key={i} className="overflow-hidden">
          <div className="aspect-[16/9] relative">
            <Skeleton className="h-full w-full absolute" />
          </div>
          <CardHeader className="pb-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-3/4" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

export function SpeciesExplorer() {
  const [species, setSpecies] = useState<Species[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [debouncedQuery, setDebouncedQuery] = useState("")
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [sort, setSort] = useState("scientific_name")
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery)
      setPage(1)
    }, 500)
    return () => clearTimeout(handler)
  }, [searchQuery])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams({
          search: debouncedQuery,
          sort: sort,
          page: page.toString(),
          limit: "9",
        })

        const response = await fetch(`/api/species?${params.toString()}`)
        const data = await response.json()

        if (!data.ok) {
          throw new Error(data.message || "An error occurred while fetching data.")
        }

        setSpecies(Array.isArray(data.species) ? data.species : [])
        setTotalPages(data.totalPages || 1)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }

    startTransition(() => {
      fetchData()
    })
  }, [debouncedQuery, page, sort])

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fungal Species Explorer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Search our comprehensive database of fungal species. Results will update automatically as you type.
          </p>
          <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by name or family..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scientific_name">Scientific Name</SelectItem>
                <SelectItem value="common_name">Common Name</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {error && (
        <Card className="bg-red-50 border-red-200 text-red-800">
          <CardContent className="pt-6 flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5" />
            <p>Error loading species: {error}</p>
          </CardContent>
        </Card>
      )}

      {isLoading || isPending ? (
        <SpeciesExplorerSkeleton />
      ) : (
        <SpeciesList species={Array.isArray(species) ? species : []} />
      )}

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            disabled={page === 1 || isLoading || isPending}
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
          >
            Previous
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <Button
            variant="outline"
            disabled={page === totalPages || isLoading || isPending}
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
