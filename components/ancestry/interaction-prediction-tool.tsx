"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState } from "react"

export function InteractionPredictionTool() {
  const [speciesId1, setSpeciesId1] = useState("")
  const [speciesId2, setSpeciesId2] = useState("")
  const [prediction, setPrediction] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handlePredict = async () => {
    setIsLoading(true)
    setError(null)
    setPrediction("")
    try {
      const response = await fetch("/api/ancestry/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool: "interaction-prediction", speciesId1, speciesId2 }),
      })
      if (!response.ok) throw new Error("Prediction failed")
      const data = await response.json()
      setPrediction(data.prediction)
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
        placeholder="Enter species ID 1..."
        value={speciesId1}
        onChange={(e) => setSpeciesId1(e.target.value)}
        disabled={isLoading}
      />
      <Input
        type="text"
        placeholder="Enter species ID 2..."
        value={speciesId2}
        onChange={(e) => setSpeciesId2(e.target.value)}
        disabled={isLoading}
      />
      <Button onClick={handlePredict} disabled={isLoading}>
        {isLoading ? "Predicting..." : "Predict"}
      </Button>
      {error && <p className="text-sm text-red-500">{error}</p>}
      {prediction && (
        <div>
          <h4 className="text-md font-medium">Prediction:</h4>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  )
}
