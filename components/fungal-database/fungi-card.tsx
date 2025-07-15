import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Fungi } from "@/types/fungi"

interface FungiCardProps {
  fungi: Partial<Fungi> & {
    id: number
    scientificName: string
    commonName?: string
    family?: string
    imageUrl?: string
  }
}

export function FungiCard({ fungi }: FungiCardProps) {
  return (
    <Link href={`/ancestry/fungal-database/${fungi.id}`} className="group block h-full">
      <Card className="h-full overflow-hidden transition-all duration-300 group-hover:shadow-lg group-hover:border-emerald-500 flex flex-col">
        <CardHeader className="p-0">
          <div className="relative w-full h-48">
            <Image
              src={fungi.imageUrl || "/placeholder.svg?width=400&height=300&query=fungi"}
              alt={`Image of ${fungi.scientificName}`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg font-bold italic group-hover:text-emerald-600">
            {fungi.scientificName}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{fungi.commonName}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          {fungi.family && <Badge variant="secondary">{fungi.family}</Badge>}
        </CardFooter>
      </Card>
    </Link>
  )
}
