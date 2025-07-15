"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ITSLookupTool } from "@/components/ancestry/its-lookup"

interface SpeciesResult {
  id: number
  scientific_name: string
  common_name: string
  image_url: string
  description: string
}

export default function ITSClientPage() {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>ITS Lookup Tool</CardTitle>
        <CardDescription>
          Identify fungal species by providing their Internal Transcribed Spacer (ITS) sequence code.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ITSLookupTool />
      </CardContent>
    </Card>
  )
}
