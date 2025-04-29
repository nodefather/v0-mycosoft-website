"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import * as atlas from "azure-maps-control"
import "azure-maps-control/dist/atlas.min.css"

interface DeviceLocation {
  id: string
  name: string
  location: [number, number] // [longitude, latitude]
  status: "active" | "inactive"
}

interface AzureMapProps {
  className?: string
  deviceLocations?: DeviceLocation[]
  onDeviceClick?: (deviceId: string) => void
}

const defaultDevices: DeviceLocation[] = [
  {
    id: "device-1",
    name: "Mushroom 1 - SF",
    location: [-122.4194, 37.7749], // San Francisco
    status: "active",
  },
  {
    id: "device-2",
    name: "SporeBase - NYC",
    location: [-74.006, 40.7128], // New York
    status: "active",
  },
  {
    id: "device-3",
    name: "TruffleBot - Austin",
    location: [-97.7431, 30.2672], // Austin
    status: "inactive",
  },
]

export function AzureMap({ className, deviceLocations = defaultDevices, onDeviceClick }: AzureMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<atlas.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authInfo, setAuthInfo] = useState<{ token: string; clientId: string } | null>(null)

  // Fetch authentication token from our secure API endpoint
  useEffect(() => {
    async function fetchAuthInfo() {
      try {
        const response = await fetch("/api/maps/auth")
        if (!response.ok) {
          throw new Error("Failed to fetch authentication token")
        }
        const data = await response.json()
        setAuthInfo(data)
      } catch (err) {
        console.error("Error fetching auth token:", err)
        setError("Failed to authenticate with Azure Maps")
        setIsLoading(false)
      }
    }

    fetchAuthInfo()
  }, [])

  useEffect(() => {
    if (!mapRef.current || map || !authInfo) return

    try {
      if (!authInfo.token || !authInfo.clientId) {
        throw new Error("Azure Maps authentication information is missing")
      }

      // Initialize map with anonymous authentication
      const newMap = new atlas.Map(mapRef.current, {
        authOptions: {
          authType: "anonymous",
          clientId: authInfo.clientId,
          getToken: async () => {
            try {
              // Fetch token from our secure API
              const response = await fetch("/api/maps/auth")
              if (!response.ok) {
                throw new Error(`Failed to get map authentication: ${response.status}`)
              }
              const authData = await response.json()
              return authData.clientId // Use the client ID for anonymous auth
            } catch (error) {
              console.error("Map authentication error:", error)
              throw error
            }
          },
        },
        center: [-95.7129, 37.0902], // Center of US
        zoom: 3,
        style: "night",
        view: "Auto",
      })

      // Wait for the map to load
      newMap.events.add("load", () => {
        setIsLoading(false)

        // Create a data source for devices
        const source = new atlas.source.DataSource()
        newMap.sources.add(source)

        // Add device points to the map
        deviceLocations.forEach((device) => {
          const point = new atlas.Shape(new atlas.data.Point(device.location), {
            id: device.id,
            name: device.name,
            status: device.status,
          })
          source.add(point)
        })

        // Add a symbol layer for device markers
        newMap.layers.add(
          new atlas.layer.SymbolLayer(source, undefined, {
            iconOptions: {
              image: "marker-blue",
              size: 0.8,
              allowOverlap: true,
            },
            filter: ["==", ["get", "status"], "active"],
          }),
        )

        // Add a symbol layer for inactive devices
        newMap.layers.add(
          new atlas.layer.SymbolLayer(source, undefined, {
            iconOptions: {
              image: "marker-red",
              size: 0.8,
              allowOverlap: true,
            },
            filter: ["==", ["get", "status"], "inactive"],
          }),
        )

        // Add a glow effect for active devices
        newMap.layers.add(
          new atlas.layer.BubbleLayer(source, undefined, {
            radius: 20,
            color: ["case", ["==", ["get", "status"], "active"], "rgba(0, 150, 255, 0.2)", "rgba(255, 0, 0, 0.2)"],
            blur: 1,
            strokeWidth: 0,
            filter: ["has", "status"],
          }),
        )

        // Add click event
        newMap.events.add("click", "symbol", (e) => {
          if (e.shapes && e.shapes[0]) {
            const deviceId = e.shapes[0].getId()
            onDeviceClick?.(deviceId)
          }
        })

        // Add hover state
        let hoveredId: string | null = null

        newMap.events.add("mouseover", "symbol", (e) => {
          if (e.shapes && e.shapes[0]) {
            const shape = e.shapes[0]
            hoveredId = shape.getId()

            // Show popup
            const popup = new atlas.Popup({
              pixelOffset: [0, -30],
            })

            const properties = shape.getProperties()
            popup.setOptions({
              content: `<div class="p-2">
               <p class="font-bold">${properties.name}</p>
               <p class="text-sm ${properties.status === "active" ? "text-green-500" : "text-red-500"}">
                 ${properties.status === "active" ? "Active" : "Inactive"}
               </p>
             </div>`,
              position: shape.getCoordinates(),
            })

            popup.open(newMap)
          }
        })

        newMap.events.add("mouseout", "symbol", () => {
          hoveredId = null
          newMap.popups.clear()
        })
      })

      setMap(newMap)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to initialize map")
      setIsLoading(false)
    }

    return () => {
      if (map) {
        map.dispose()
      }
    }
  }, [map, deviceLocations, onDeviceClick, authInfo])

  return (
    <Card className={className}>
      <div className="relative w-full h-[400px] bg-zinc-900">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center space-y-2">
              <p className="text-destructive font-semibold">Failed to load map</p>
              <p className="text-sm text-muted-foreground">{error}</p>
            </div>
          </div>
        )}
        <div ref={mapRef} className="w-full h-full [&_.azure-maps-control-container]:!hidden" />
      </div>
    </Card>
  )
}
