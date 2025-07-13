import { FileText } from "lucide-react"

export default function GenomeAnnotationPage() {
  return (
    <div className="flex flex-col items-center justify-center text-center p-8 h-full">
      <FileText className="h-16 w-16 text-orange-500 mb-4" />
      <h1 className="text-3xl font-bold">Genome Annotation Tool</h1>
      <p className="text-muted-foreground mt-2">
        This tool is under construction. Soon you'll be able to identify genes and other biological features.
      </p>
    </div>
  )
}
