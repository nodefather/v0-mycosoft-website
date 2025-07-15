"use client"

import type React from "react"

import { useState } from "react"
import type { Fungi, FungiImage } from "@/types/fungi"
import { Leaf, MapPin, Calendar, Microscope, Droplet, Utensils } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FungiTaxonomy } from "@/components/fungal-database/fungi-taxonomy"
import { FungiCharacteristicsTable } from "@/components/fungal-database/fungi-characteristics-table"
import { FungiGallery } from "@/components/fungal-database/fungi-gallery"

interface FungiProfileProps {
  fungi: Fungi
}

export function FungiProfile({ fungi }: FungiProfileProps) {
  const [activeImage, setActiveImage] = useState<FungiImage>(
    fungi.images?.[0] || {
      id: 0,
      fungiId: fungi.id,
      imageUrl: "/placeholder.svg",
      caption: "No image available",
      isPrimary: true,
      createdAt: "",
    },
  )

  const getBadgeClass = (value: string | undefined) => {
    if (!value) return "bg-gray-500 hover:bg-gray-600 text-white"
    const lowerValue = value.toLowerCase()
    if (lowerValue.includes("choice") || lowerValue.includes("good")) {
      return "bg-green-600 hover:bg-green-700 text-white"
    }
    if (lowerValue.includes("edible")) {
      return "bg-green-500 hover:bg-green-600 text-white"
    }
    if (lowerValue.includes("poisonous") || lowerValue.includes("toxic")) {
      return "bg-red-600 hover:bg-red-700 text-white"
    }
    if (lowerValue.includes("caution")) {
      return "bg-yellow-500 hover:bg-yellow-600 text-white"
    }
    return "bg-gray-500 hover:bg-gray-600 text-white"
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2">
          <FungiGallery
            images={fungi.images}
            activeImage={activeImage}
            setActiveImage={setActiveImage}
            altText={fungi.scientificName}
          />
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div>
            <h1 className="text-4xl font-bold italic text-gray-800 dark:text-gray-100">{fungi.scientificName}</h1>
            <p className="text-2xl text-muted-foreground mt-1">{fungi.commonName}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge className={getBadgeClass(fungi.edibility)}>{fungi.edibility || "Unknown"}</Badge>
            {fungi.toxicity && fungi.toxicity.toLowerCase() !== "none" && (
              <Badge variant="destructive">{fungi.toxicity}</Badge>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <InfoItem icon={Microscope} label="Family" value={fungi.taxonomy?.family} />
            <InfoItem icon={Leaf} label="Genus" value={fungi.taxonomy?.genus} />
            <InfoItem icon={MapPin} label="Habitat" value={fungi.habitat} />
            <InfoItem icon={Droplet} label="Substrate" value={fungi.characteristics?.substrate} />
            <InfoItem icon={Calendar} label="Season" value={fungi.season} />
            <InfoItem icon={Utensils} label="Population" value={fungi.characteristics?.population} />
          </div>

          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
              <TabsTrigger value="taxonomy">Taxonomy</TabsTrigger>
            </TabsList>
            <TabsContent value="description" className="pt-4 text-muted-foreground prose dark:prose-invert max-w-none">
              <h3 className="font-semibold text-lg text-foreground">Description</h3>
              <p>{fungi.description}</p>
              <h3 className="font-semibold text-lg text-foreground mt-4">Ecology & Notes</h3>
              <p>{fungi.ecology}</p>
              <p>{fungi.notes}</p>
            </TabsContent>
            <TabsContent value="characteristics" className="pt-4">
              <FungiCharacteristicsTable characteristics={fungi.characteristics} />
            </TabsContent>
            <TabsContent value="taxonomy" className="pt-4">
              <FungiTaxonomy taxonomy={fungi.taxonomy} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

const InfoItem = ({
  icon: Icon,
  label,
  value,
}: { icon: React.ElementType; label: string; value: string | undefined }) => (
  <div className="flex items-start gap-3">
    <Icon className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
    <div>
      <p className="font-semibold text-foreground">{label}</p>
      <p className="text-muted-foreground">{value || "N/A"}</p>
    </div>
  </div>
)
