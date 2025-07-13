"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Dna, Loader2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface SpeciesResult {
  id: number
  scientific_name: string
  common_name: string
  image_url: string
  description: string
}

export default function ItsLookupPage() {
  const [sequence, setSequence] = useState("")
  const [result, setResult] = useState<SpeciesResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [searched, setSearched] = useState(false)

  const handleSearch = async () => {
    if (!sequence) {
      setError("Please enter an ITS sequence.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)
    setSearched(true)

    try {
      const response = await fetch("/api/ancestry/its-lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "An error occurred.")
      }

      setResult(data)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred."
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Dna className="h-12 w-12 text-blue-500 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">ITS Sequence Lookup</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Identify fungal species by their Internal Transcribed Spacer (ITS) DNA sequence. Enter a sequence below to
          search our database.
        </p>
        <p className="text-xs text-muted-foreground mt-2">
          (Try: <code className="bg-muted p-1 rounded">GTCGATGAAGAACGCAGCG</code>)
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Search Sequence</CardTitle>
          <CardDescription>Enter the ITS sequence you want to identify.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., GTCGATGAAGAACGCAGCG..."
              value={sequence}
              onChange={(e) => setSequence(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <Button onClick={handleSearch} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              <span className="sr-only">Search</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8 max-w-2xl mx-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Searching database...</p>
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {!loading && !error && searched && !result && (
          <div className="text-center p-8">
            <p className="text-muted-foreground">No matching species found for this sequence.</p>
          </div>
        )}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>{result.scientific_name}</CardTitle>
              <CardDescription>{result.common_name}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <Image
                  src={result.image_url || "/placeholder.svg?text=No+Image"}
                  alt={`Image of ${result.scientific_name}`}
                  fill
                  className="object-cover"
                />
              </div>
              <p className="text-sm text-muted-foreground">{result.description}</p>
            </CardContent>
            <CardFooter>
              <Link href={`/ancestry/fungal-database/${result.id}`} className="w-full">
                <Button variant="outline" className="w-full bg-transparent">
                  View Full Profile
                </Button>
              </Link>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}
