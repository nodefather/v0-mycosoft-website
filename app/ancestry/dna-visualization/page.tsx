import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { DnaVisualizerTool } from "@/components/ancestry/dna-visualizer-tool"

export const metadata = {
  title: "DNA Visualization | Fungal Ancestry",
  description: "Visualize genetic data and structures in 3D.",
}

export default function DnaVisualizationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>3D DNA Visualization</CardTitle>
        <CardDescription>Generate and interact with a 3D visualization of a DNA helix structure.</CardDescription>
      </CardHeader>
      <CardContent>
        <DnaVisualizerTool />
      </CardContent>
    </Card>
  )
}
