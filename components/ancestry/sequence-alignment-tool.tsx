"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function SequenceAlignmentTool() {
  const [sequence1, setSequence1] = useState("")
  const [sequence2, setSequence2] = useState("")
  const [alignment, setAlignment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAlign = async () => {
    setIsLoading(true)
    setError(null)
    setAlignment("")
    try {
      const response = await fetch("/api/ancestry/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "sequence-alignment", sequence1, sequence2 }),
      })
      if (!response.ok) throw new Error("Alignment failed")
      const data = await response.json()
      setAlignment(data.alignment)
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
        placeholder="Enter sequence 1..."
        value={sequence1}
        onChange={(e) => setSequence1(e.target.value)}
        disabled={isLoading}
      />
      <Input
        type="text"
        placeholder="Enter sequence 2..."
        value={sequence2}
        onChange={(e) => setSequence2(e.target.value)}
        disabled={isLoading}
      />
      <Button onClick={handleAlign} disabled={isLoading}>
        {isLoading ? "Aligning..." : "Align"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {alignment && (
        <div>
          <h4 className="text-md font-medium">Alignment:</h4>
          <p className="text-sm whitespace-pre-wrap">{alignment}</p>
        </div>
      )}
    </div>
  )
}
