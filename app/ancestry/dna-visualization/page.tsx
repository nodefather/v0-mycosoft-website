import { BarChart } from "lucide-react"

export default function DnaVisualizationPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
      <BarChart className="h-16 w-16 text-yellow-500 mb-4" />
      <h1 className="text-3xl font-bold">DNA Visualization Tool</h1>
      <p className="text-muted-foreground mt-2">
        This tool is under construction. Soon you'll be able to generate insightful charts from your genetic data.
      </p>
    </div>
  )
}
