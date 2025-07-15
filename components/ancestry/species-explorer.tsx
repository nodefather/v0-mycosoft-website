"use client"
import { useState, useEffect, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Search, AlertTriangle, SlidersHorizontal, X } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"

interface Species {
  id: number
  scientificName: string
  commonName: string
  family: string
  description: string
  imageUrl: string
  edibility: string
}

interface FilterOptions {
  edibility: string[]
  habitat: string[]
  capShape: string[]
}

function SpeciesList({ species }: { species: Species[] }) {
  if (!species || species.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No species found matching your criteria.</p>
      </div>
    )
  }
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {species.map((s) => {
        const edibility = s.edibility?.toLowerCase()
        let badgeVariant: "default" | "destructive" | "secondary" = "secondary"
        const badgeText = s.edibility || "Unknown"

        if (edibility?.includes("edible")) {
          badgeVariant = "default"
        } else if (edibility?.includes("poisonous") || edibility?.includes("toxic")) {
          badgeVariant = "destructive"
        }

        return (
          <Card key={s.id} className="overflow-hidden transition-all hover:shadow-lg flex flex-col group">
            <div className="aspect-[16/9] relative">
              <Image
                src={s.imageUrl || `/placeholder.svg?height=200&width=300&query=${s.scientificName}`}
                alt={s.scientificName}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <Badge
                variant={badgeVariant}
                className={`absolute top-2 right-2 ${
                  badgeVariant === "default" ? "bg-green-500 hover:bg-green-600 text-white" : ""
                }`}
              >
                {badgeText}
              </Badge>
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold italic group-hover:text-emerald-600">
                <Link href={`/ancestry/fungal-database/${s.id}`} className="hover:underline">
                  {s.scientificName}
                </Link>
              </CardTitle>
              <p className="text-sm text-muted-foreground">{s.commonName}</p>
            </CardHeader>
            <CardContent className="pb-4 flex-grow flex flex-col justify-between">
              <div>
                <p className="font-medium text-sm">Family:</p>
                <p className="text-sm text-muted-foreground">{s.family}</p>
              </div>
              <div className="mt-4">
                <Link
                  href={`/ancestry/fungal-database/${s.id}`}
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
          <Skeleton className="h-48 w-full" />
          <CardHeader>
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-1/2 mt-2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-4 w-full" />
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
  const [sort, setSort] = useState("scientificName")
  const [filters, setFilters] = useState({ edibility: "", habitat: "", capShape: "" })
  const [filterOptions, setFilterOptions] = useState<FilterOptions>({ edibility: [], habitat: [], capShape: [] })
  const [isLoadingFilters, setIsLoadingFilters] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setIsLoadingFilters(true)
        const response = await fetch("/api/species/filters")
        const data = await response.json()
        setFilterOptions(data)
      } catch (e) {
        console.error("Failed to fetch filter options", e)
      } finally {
        setIsLoadingFilters(false)
      }
    }
    fetchFilterOptions()
  }, [])

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
        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value)
        })

        const response = await fetch(`/api/species?${params.toString()}`)
        const data = await response.json()
        if (!data.ok) throw new Error(data.message || "An error occurred.")
        setSpecies(data.species || [])
        setTotalPages(data.totalPages || 1)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setIsLoading(false)
      }
    }
    startTransition(fetchData)
  }, [debouncedQuery, page, sort, filters])

  const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [filterName]: value }))
    setPage(1)
  }

  const clearFilters = () => {
    setFilters({ edibility: "", habitat: "", capShape: "" })
    setPage(1)
  }

  const areFiltersActive = Object.values(filters).some((v) => v !== "")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
            <Select value={sort} onValueChange={(v) => setSort(v)}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="scientificName">Scientific Name</SelectItem>
                <SelectItem value="commonName">Common Name</SelectItem>
                <SelectItem value="family">Family</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Accordion type="single" collapsible>
            <AccordionItem value="advanced-filters">
              <AccordionTrigger>
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Advanced Filters
                  {areFiltersActive && <div className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
              </AccordionTrigger>
              <AccordionContent className="pt-4">
                {isLoadingFilters ? (
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Select value={filters.edibility} onValueChange={(v) => handleFilterChange("edibility", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Edibility" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.edibility.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filters.habitat} onValueChange={(v) => handleFilterChange("habitat", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Habitat" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.habitat.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filters.capShape} onValueChange={(v) => handleFilterChange("capShape", v)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Filter by Cap Shape" />
                      </SelectTrigger>
                      <SelectContent>
                        {filterOptions.capShape.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                {areFiltersActive && (
                  <Button variant="ghost" size="sm" onClick={clearFilters} className="mt-4">
                    <X className="h-4 w-4 mr-2" />
                    Clear Filters
                  </Button>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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

      {isLoading || isPending ? <SpeciesExplorerSkeleton /> : <SpeciesList species={species} />}

      {totalPages > 1 && !isLoading && !isPending && (
        <div className="flex justify-between items-center">
          <Button variant="outline" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
            Previous
          </Button>
          <p className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </p>
          <Button variant="outline" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>
            Next
          </Button>
        </div>
      )}
    </div>
  )
}
