import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InteractionPredictionTool } from "@/components/ancestry/interaction-prediction-tool"

export const metadata = {
  title: "Interaction Prediction | Fungal Ancestry",
  description: "Predict molecular interactions between different fungal species.",
}

export default function InteractionPredictionPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interaction Prediction Tool</CardTitle>
        <CardDescription>
          Predict potential molecular or ecological interactions between two different species using their IDs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <InteractionPredictionTool />
      </CardContent>
    </Card>
  )
}
