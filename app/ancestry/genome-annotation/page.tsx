import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GenomeAnnotationTool } from "@/components/ancestry/genome-annotation-tool"

export const metadata = {
  title: "Genome Annotation | Fungal Ancestry",
  description: "Automatically identify and label genes and other functional elements in a genome.",
}

export default function GenomeAnnotationPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Genome Annotation Tool</CardTitle>
        <CardDescription>
          Submit a genome ID to automatically identify genes and other biological features.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GenomeAnnotationTool />
      </CardContent>
    </Card>
  )
}
