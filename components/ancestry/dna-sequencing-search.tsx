"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function DNASequencingSearch() {
  const [sequence, setSequence] = useState("")
  const [results, setResults] = useState<{ id: string; match: string; similarity: string }[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async () => {
    setIsLoading(true)
    setError(null)
    setResults([])
    try {
      const response = await fetch("/api/ancestry/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "dna-search", sequence }),
      })
      if (!response.ok) throw new Error("Search failed")
      const data = await response.json()
      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Enter DNA sequence..."
        value={sequence}
        onChange={(e) => setSequence(e.target.value)}
        disabled={isLoading}
      />
      <Button onClick={handleSearch} disabled={isLoading}>
        {isLoading ? "Searching..." : "Search"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {results.length > 0 && (
        <div>
          <h4 className="text-md font-medium">Search Results:</h4>
          <ul className="list-disc pl-5 text-sm">
            {results.map((result) => (
              <li key={result.id}>
                {result.match} (Similarity: {result.similarity})
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
