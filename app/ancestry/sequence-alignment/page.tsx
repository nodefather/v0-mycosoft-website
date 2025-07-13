"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dna, GitCompareArrows, Loader2 } from "lucide-react"

interface AlignmentResult {
  score: number
  alignment1: string
  alignment2: string
}

export default function SequenceAlignmentPage() {
  const [sequence1, setSequence1] = useState("GATTACA")
  const [sequence2, setSequence2] = useState("GCATGCU")
  const [result, setResult] = useState<AlignmentResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleAlign = async () => {
    if (!sequence1 || !sequence2) {
      setError("Please enter two sequences to align.")
      return
    }
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch("/api/ancestry/sequence-alignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sequence1, sequence2 }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "An error occurred during alignment.")
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
        <GitCompareArrows className="h-12 w-12 text-green-500 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Sequence Alignment</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Compare two DNA/RNA sequences to find similarities and differences using global alignment.
        </p>
      </div>

      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Enter Sequences</CardTitle>
          <CardDescription>Provide two sequences to be aligned.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Textarea
              placeholder="Sequence 1"
              value={sequence1}
              onChange={(e) => setSequence1(e.target.value)}
              className="font-mono h-32"
            />
            <Textarea
              placeholder="Sequence 2"
              value={sequence2}
              onChange={(e) => setSequence2(e.target.value)}
              className="font-mono h-32"
            />
          </div>
          <Button onClick={handleAlign} disabled={loading} className="w-full">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Dna className="h-4 w-4 mr-2" />}
            Align Sequences
          </Button>
        </CardContent>
      </Card>

      <div className="mt-8 max-w-4xl mx-auto">
        {loading && (
          <div className="flex flex-col items-center justify-center text-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="mt-4 text-muted-foreground">Aligning sequences...</p>
          </div>
        )}
        {error && <p className="text-red-500 text-center">{error}</p>}
        {result && (
          <Card>
            <CardHeader>
              <CardTitle>Alignment Result</CardTitle>
              <CardDescription>
                Alignment Score: <span className="font-bold text-primary">{result.score}</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-4 bg-muted rounded-lg font-mono text-sm overflow-x-auto">
                <p>{result.alignment1}</p>
                <p>
                  {result.alignment1.split("").map((char, i) => (
                    <span key={i}>{char === result.alignment2[i] ? "|" : " "}</span>
                  ))}
                </p>
                <p>{result.alignment2}</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
