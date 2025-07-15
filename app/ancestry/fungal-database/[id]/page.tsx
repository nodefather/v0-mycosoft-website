import { Suspense } from "react"
import { notFound } from "next/navigation"
import { FungiProfile } from "@/components/fungal-database/fungi-profile"
import { FungiProfileSkeleton } from "@/components/fungal-database/fungi-profile-skeleton"
import { getFungiById } from "@/lib/database"
import type { Metadata } from "next"

interface FungiProfilePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: FungiProfilePageProps): Promise<Metadata> {
  const fungi = await getFungiById(Number.parseInt(params.id, 10))

  if (!fungi) {
    return {
      title: "Fungi Not Found | Mycosoft",
    }
  }

  return {
    title: `${fungi.scientificName} | Mycosoft Fungal Database`,
    description: fungi.description?.substring(0, 160) || `Details for ${fungi.scientificName}`,
  }
}

export default async function FungiProfilePage({ params }: FungiProfilePageProps) {
  const fungi = await getFungiById(Number.parseInt(params.id, 10))

  if (!fungi) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<FungiProfileSkeleton />}>
        <FungiProfile fungi={fungi} />
      </Suspense>
    </div>
  )
}
