"use client"

import { Button } from "@/components/ui/button"

import { useState, useEffect } from "react"
import { useParams, notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, ArrowLeft, Microscope, BookOpen, Sprout } from "lucide-react"

interface Species {
  id: number
  scientific_name: string
  common_name: string
  family: string
  description: string
  image_url: string
  characteristics: string[] | string
}

function SpeciesDetailSkeleton() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Skeleton className="h-8 w-32 mb-6" />
      <Card>
        <div className="grid md:grid-cols-2">
          <div className="aspect-square relative">
            <Skeleton className="h-full w-full" />
          </div>
          <div className="p-6">
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-6 w-1/2 mb-6" />
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Skeleton className="h-6 w-6 rounded-full" />
                <Skeleton className="h-5 w-1/3" />
              </div>
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
        <CardContent className="p-6 border-t">
          <Skeleton className="h-6 w-1/4 mb-4" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-8 w-24 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-28 rounded-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function SpeciesDetailPage() {
  const params = useParams()
  const id = params.id

  const [species, setSpecies] = useState<Species | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchSpecies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch(`/api/species?id=${id}`)
        const data = await response.json()

        if (!data.ok) {
          throw new Error(data.message || "Failed to fetch species data.")
        }
        setSpecies(data.species)
      } catch (e: any) {
        setError(e.message)
        if (e.message.includes("not found")) {
          notFound()
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpecies()
  }, [id])

  if (isLoading) {
    return <SpeciesDetailSkeleton />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <AlertTriangle className="h-12 w-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">An Error Occurred</h2>
        <p className="text-muted-foreground mb-6">{error}</p>
        <Link href="/ancestry/fungal-database">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Explorer
          </Button>
        </Link>
      </div>
    )
  }

  if (!species) {
    return null // notFound() is called in useEffect, so this is a fallback
  }

  const characteristicsArray =
    typeof species.characteristics === "string" ? JSON.parse(species.characteristics) : species.characteristics || []

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Link
        href="/ancestry/fungal-database"
        className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Fungal Database
      </Link>
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-square md:aspect-auto">
            <Image
              src={species.image_url || "/placeholder.svg?height=400&width=400&query=mushroom"}
              alt={species.scientific_name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-6 flex flex-col">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-3xl font-bold">{species.scientific_name}</CardTitle>
              <p className="text-lg text-muted-foreground">{species.common_name}</p>
            </CardHeader>
            <div className="space-y-4 flex-grow">
              <div className="flex items-center space-x-3">
                <Microscope className="h-5 w-5 text-muted-foreground" />
                <p>
                  <span className="font-semibold">Family:</span> {species.family}
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <BookOpen className="h-5 w-5 text-muted-foreground mt-1" />
                <div>
                  <p className="font-semibold">Description:</p>
                  <p className="text-muted-foreground">{species.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {characteristicsArray.length > 0 && (
          <CardContent className="p-6 border-t">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Sprout className="mr-2 h-5 w-5 text-emerald-600" />
              Characteristics
            </h3>
            <div className="flex flex-wrap gap-2">
              {characteristicsArray.map((char: string) => (
                <Badge key={char} variant="secondary" className="text-sm">
                  {char}
                </Badge>
              ))}
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
