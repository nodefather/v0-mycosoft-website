import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TestTube2 } from "lucide-react"

export default function MetabolicPathwayPage() {
  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <TestTube2 className="h-12 w-12 text-purple-500 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Metabolic Pathway Analysis</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          This tool is under construction. Soon, you'll be able to analyze and compare metabolic pathways across
          different fungal species.
        </p>
      </div>
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Our team is developing advanced features to visualize metabolic networks, identify key enzymes, and predict
            the production of secondary metabolites. Stay tuned for updates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
