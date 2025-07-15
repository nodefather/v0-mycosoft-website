import { Button } from "@/components/ui/button"
import { getFungiById } from "@/lib/database"
import { FungiProfile } from "@/components/fungal-database/fungi-profile"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import type { Fungi } from "@/types/fungi"

interface FungiDetailPageProps {
  params: {
    id: string
  }
}

export default async function FungiDetailPage({ params }: FungiDetailPageProps) {
  const id = Number(params.id)
  if (isNaN(id)) {
    notFound()
  }

  const fungi = await getFungiById(id)

  if (!fungi) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button variant="outline" asChild>
          <Link href="/natureos/apps/ancestry">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Ancestry Explorer
          </Link>
        </Button>
      </div>
      <FungiProfile fungi={fungi as Fungi} />
    </div>
  )
}
