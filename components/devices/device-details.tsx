"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table"
import { CheckCircle, BookOpen, ShoppingCart } from "lucide-react"
import type { Device } from "@/lib/devices"

interface DeviceDetailsProps {
  device: Device
}

export function DeviceDetails({ device }: DeviceDetailsProps) {
  const [mainImage, setMainImage] = useState(device.images.main)

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
    <div className="container py-8 md:py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Image Gallery */}
        <div>
          <div className="relative aspect-square w-full border rounded-lg overflow-hidden mb-4">
            <Image
              src={mainImage || "/placeholder.svg"}
              alt={`${device.name} main view`}
              fill
              className="object-contain p-4"
            />
          </div>
          <div className="grid grid-cols-4 gap-2">
            {[device.images.main, ...device.images.gallery].map((img, idx) => (
              <button
                key={idx}
                className={`relative aspect-square border rounded-md overflow-hidden transition-all ${mainImage === img ? "ring-2 ring-primary ring-offset-2" : "hover:opacity-80"}`}
                onClick={() => setMainImage(img)}
              >
                <Image
                  src={img || "/placeholder.svg"}
                  alt={`${device.name} thumbnail ${idx + 1}`}
                  fill
                  className="object-contain p-1"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Device Info */}
        <div className="space-y-6">
          <div>
            <Badge variant={getStatusVariant(device.status)}>{device.status}</Badge>
            <h1 className="text-3xl md:text-4xl font-bold mt-2">{device.name}</h1>
            <p className="text-lg text-muted-foreground mt-1">{device.tagline}</p>
          </div>

          <p className="text-base">{device.longDescription}</p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href={device.storeUrl} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button
                size="lg"
                className="w-full"
                disabled={device.status !== "Available" && device.status !== "Pre-order"}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {device.status === "Pre-order" ? "Pre-order Now" : "Buy Now"} ({device.price})
              </Button>
            </Link>
            <Link href={device.docsUrl} className="w-full">
              <Button size="lg" variant="outline" className="w-full bg-transparent">
                <BookOpen className="mr-2 h-5 w-5" />
                View Documentation
              </Button>
            </Link>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {device.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Specifications */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-4 text-center">Technical Specifications</h2>
        <Card className="max-w-3xl mx-auto">
          <CardContent className="p-0">
            <Table>
              <TableBody>
                {Object.entries(device.specs).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-semibold">{key}</TableCell>
                    <TableCell>{value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
