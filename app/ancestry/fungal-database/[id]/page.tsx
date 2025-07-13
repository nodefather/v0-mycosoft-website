"use client"

import { Button } from "@/components/ui/button"
import { getFungiById } from "@/lib/database"
import { FungiProfile } from "@/components/fungal-database/fungi-profile"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

interface Species {
  id: number
  scientific_name: string
  common_name: string
  family: string
  description: string
  image_url: string
  characteristics: string[] | string
}

interface FungiDetailPageProps {
  params: {
    id: string
  }
}

function SpeciesDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="h-8 w-32 mb-6"></div>
      <div className="grid md:grid-cols-2">
        <div className="aspect-square relative">
          <div className="h-full w-full"></div>
        </div>
        <div className="p-6">
          <div className="h-8 w-3/4 mb-2"></div>
          <div className="h-6 w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 rounded-full"></div>
              <div className="h-5 w-1/3"></div>
            </div>
            <div className="h-20 w-full"></div>
          </div>
        </div>
      </div>
      <div className="p-6 border-t">
        <div className="h-6 w-1/4 mb-4"></div>
        <div className="flex flex-wrap gap-2">
          <div className="h-8 w-24 rounded-full"></div>
          <div className="h-8 w-20 rounded-full"></div>
          <div className="h-8 w-28 rounded-full"></div>
        </div>
      </div>
    </div>
  )
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
          <Link href="/ancestry/fungal-database">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Database
          </Link>
        </Button>
      </div>
      <FungiProfile fungi={fungi} />
    </div>
  )
}
