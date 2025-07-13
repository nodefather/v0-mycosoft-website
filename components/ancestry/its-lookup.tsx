"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function ITSLookupTool() {
  const [itsCode, setItsCode] = useState("")
  const [speciesName, setSpeciesName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLookup = async () => {
    setIsLoading(true)
    setError(null)
    setSpeciesName("")
    try {
      const response = await fetch("/api/ancestry/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "its-lookup", itsCode }),
      })
      if (!response.ok) throw new Error("Lookup failed")
      const data = await response.json()
      setSpeciesName(data.speciesName)
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
        placeholder="Enter ITS code..."
        value={itsCode}
        onChange={(e) => setItsCode(e.target.value)}
        disabled={isLoading}
      />
      <Button onClick={handleLookup} disabled={isLoading}>
        {isLoading ? "Looking up..." : "Lookup"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {speciesName && (
        <div>
          <h4 className="text-md font-medium">Species Name:</h4>
          <p>{speciesName}</p>
        </div>
      )}
    </div>
  )
}
