"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SequenceAlignmentTool } from "@/components/ancestry/sequence-alignment-tool"

interface AlignmentResult {
  score: number
  alignment1: string
  alignment2: string
}

export default function SequenceAlignmentClientPage() {
  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Sequence Alignment Tool</CardTitle>
        <CardDescription>
          Compare two DNA or protein sequences to identify regions of similarity that may be a consequence of
          functional, structural, or evolutionary relationships.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SequenceAlignmentTool />
      </CardContent>
    </Card>
  )
}
