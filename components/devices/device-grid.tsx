import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Device } from "@/lib/devices"

interface DeviceGridProps {
  devices: Device[]
}

export function DeviceGrid({ devices }: DeviceGridProps) {
  const getStatusVariant = (status: Device["status"]) => {
    switch (status) {
      case "Available":
        return "default"
      case "Pre-order":
        return "secondary"
      case "In Development":
        return "outline"
      case "Out of Stock":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {devices.map((device) => (
        <Card
          key={device.id}
          className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <Link href={`/devices/${device.id}`} className="flex flex-col h-full">
            <CardHeader>
              <div className="relative aspect-video w-full mb-4">
                <Image
                  src={device.images.main || "/placeholder.svg"}
                  alt={`${device.name} main image`}
                  fill
                  className="object-contain rounded-t-lg"
                />
              </div>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{device.name}</CardTitle>
                <Badge variant={getStatusVariant(device.status)}>{device.status}</Badge>
              </div>
              <CardDescription>{device.tagline}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-sm text-muted-foreground line-clamp-3">{device.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full bg-transparent">
                Learn More
              </Button>
            </CardFooter>
          </Link>
        </Card>
      ))}
    </div>
  )
}
