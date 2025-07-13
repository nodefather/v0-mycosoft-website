"use client"

import Image from "next/image"
import type { FungiImage } from "@/types/fungi"
import { Card, CardContent } from "@/components/ui/card"

interface FungiGalleryProps {
  images: FungiImage[]
  activeImage: FungiImage
  setActiveImage: (image: FungiImage) => void
  altText: string
}

export function FungiGallery({ images, activeImage, setActiveImage, altText }: FungiGalleryProps) {
  if (!images || images.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square bg-muted flex items-center justify-center">
            <p className="text-muted-foreground">No Image</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={activeImage.imageUrl || "/placeholder.svg"}
              alt={activeImage.caption || altText}
              fill
              className="object-cover"
              sizes="(max-width: 1023px) 100vw, 40vw"
              priority
            />
          </div>
        </CardContent>
      </Card>
      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((image) => (
            <div
              key={image.id}
              className={`relative aspect-square rounded-md overflow-hidden border-2 cursor-pointer transition-all ${
                activeImage?.id === image.id
                  ? "border-emerald-500 scale-105"
                  : "border-transparent hover:border-muted-foreground"
              }`}
              onClick={() => setActiveImage(image)}
            >
              <Image
                src={image.imageUrl || "/placeholder.svg"}
                alt={image.caption || altText}
                fill
                className="object-cover"
                sizes="10vw"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
