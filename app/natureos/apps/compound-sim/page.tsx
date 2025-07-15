"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"
import { FlaskConical, Zap } from "lucide-react"

const compounds = ["Psilocybin", "Muscarine", "Ibotenic Acid", "Amatoxin", "Cordycepin"]

export default function CompoundSimPage() {
  const [compoundA, setCompoundA] = useState<string | null>(null)
  const [compoundB, setCompoundB] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)

  const handleSimulate = () => {
    if (compoundA && compoundB) {
      if (compoundA === compoundB) {
        setResult("Cannot simulate a compound with itself.")
        return
      }
      setResult(
        `Simulating interaction between ${compoundA} and ${compoundB}... A synergistic effect is observed, potentially increasing neuro-receptor affinity by 15%. Further wet-lab analysis is required.`,
      )
    }
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Compound Analyzer" text="Simulate interactions between fungal compounds." />
      <Card>
        <CardHeader>
          <CardTitle>Interaction Simulator</CardTitle>
          <CardDescription>Select two compounds to simulate their potential interactions.</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <Select onValueChange={setCompoundA}>
              <SelectTrigger>
                <SelectValue placeholder="Select Compound A" />
              </SelectTrigger>
              <SelectContent>
                {compounds.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select onValueChange={setCompoundB}>
              <SelectTrigger>
                <SelectValue placeholder="Select Compound B" />
              </SelectTrigger>
              <SelectContent>
                {compounds.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button onClick={handleSimulate} disabled={!compoundA || !compoundB} className="w-full">
              <Zap className="mr-2 h-4 w-4" />
              Simulate Interaction
            </Button>
          </div>
          <div className="rounded-lg border bg-muted/50 p-4 min-h-[150px] flex items-center justify-center">
            {result ? (
              <p className="text-center">{result}</p>
            ) : (
              <div className="text-center text-muted-foreground">
                <FlaskConical className="mx-auto h-8 w-8 mb-2" />
                <p>Simulation results will appear here.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardShell>
  )
}
