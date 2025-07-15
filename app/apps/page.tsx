import { AppDirectory } from "@/components/apps/app-directory"

export default function AppsPage() {
  return (
    <div className="container py-6 md:py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <h1 className="text-4xl font-bold mb-8">Mycology Apps</h1>
        <p className="text-xl text-muted-foreground mb-12">
          Explore our suite of applications for fungal research, simulation, and data analysis.
        </p>
        <AppDirectory />
      </div>
    </div>
  )
}
