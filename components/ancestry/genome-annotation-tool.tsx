"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function GenomeAnnotationTool() {
  const [genomeId, setGenomeId] = useState("")
  const [annotation, setAnnotation] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAnnotate = async () => {
    setIsLoading(true)
    setError(null)
    setAnnotation("")
    try {
      const response = await fetch("/api/ancestry/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "genome-annotation", genomeId }),
      })
      if (!response.ok) throw new Error("Annotation failed")
      const data = await response.json()
      setAnnotation(data.annotation)
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
        placeholder="Enter genome ID..."
        value={genomeId}
        onChange={(e) => setGenomeId(e.target.value)}
        disabled={isLoading}
      />
      <Button onClick={handleAnnotate} disabled={isLoading}>
        {isLoading ? "Annotating..." : "Annotate"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {annotation && (
        <div>
          <h4 className="text-md font-medium">Annotation:</h4>
          <p>{annotation}</p>
        </div>
      )}
    </div>
  )
}
