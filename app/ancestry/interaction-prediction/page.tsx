import { Bot } from "lucide-react"

export default function InteractionPredictionPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
      <Bot className="h-16 w-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold">Interaction Prediction Tool</h1>
      <p className="text-muted-foreground mt-2">
        This tool is under construction. Soon you'll be able to predict molecular interactions.
      </p>
    </div>
  )
}
