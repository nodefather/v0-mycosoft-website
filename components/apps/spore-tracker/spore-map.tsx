"use client"

import { useEffect, useRef, useState } from "react"
import { Loader2 } from "lucide-react"
import * as atlas from "azure-maps-control"
import "azure-maps-control/dist/atlas.min.css"

interface SporeMapProps {
  mapType: "satellite" | "topographic" | "street"
  showWindOverlay: boolean
  showSporeDetectors: boolean
  showHeatmap: boolean
  selectedRegion: string | null
  zoomLevel: number
  onZoomChange: (zoom: number) => void
  onRegionSelect: (region: string | null) => void
}

// Sample spore detector locations
const sporeDetectors = [
  { id: "sd-1", name: "SporeBase Alpha", location: [-122.4194, 37.7749], status: "active", sporeCount: 1245 }, // San Francisco
  { id: "sd-2", name: "SporeBase Beta", location: [-74.006, 40.7128], status: "active", sporeCount: 987 }, // New York
  { id: "sd-3", name: "SporeBase Gamma", location: [-0.1278, 51.5074], status: "active", sporeCount: 1532 }, // London
  { id: "sd-4", name: "SporeBase Delta", location: [139.6503, 35.6762], status: "active", sporeCount: 2103 }, // Tokyo
  { id: "sd-5", name: "SporeBase Epsilon", location: [151.2093, -33.8688], status: "active", sporeCount: 876 }, // Sydney
  { id: "sd-6", name: "SporeBase Zeta", location: [13.405, 52.52], status: "active", sporeCount: 1345 }, // Berlin
  { id: "sd-7", name: "SporeBase Eta", location: [2.3522, 48.8566], status: "active", sporeCount: 1678 }, // Paris
  { id: "sd-8", name: "SporeBase Theta", location: [-118.2437, 34.0522], status: "active", sporeCount: 1432 }, // Los Angeles
  { id: "sd-9", name: "SporeBase Iota", location: [-43.1729, -22.9068], status: "active", sporeCount: 956 }, // Rio de Janeiro
  { id: "sd-10", name: "SporeBase Kappa", location: [28.0473, -26.2041], status: "active", sporeCount: 789 }, // Johannesburg
  { id: "sd-11", name: "SporeBase Lambda", location: [77.209, 28.6139], status: "active", sporeCount: 1876 }, // New Delhi
  { id: "sd-12", name: "SporeBase Mu", location: [116.4074, 39.9042], status: "active", sporeCount: 2345 }, // Beijing
]

// Sample high spore concentration regions for heatmap
const sporeHeatmapData = [
  { location: new atlas.data.Position(-122.4194, 37.7749), intensity: 0.8 }, // San Francisco
  { location: new atlas.data.Position(-74.006, 40.7128), intensity: 0.7 }, // New York
  { location: new atlas.data.Position(-0.1278, 51.5074), intensity: 0.9 }, // London
  { location: new atlas.data.Position(139.6503, 35.6762), intensity: 1.0 }, // Tokyo
  { location: new atlas.data.Position(151.2093, -33.8688), intensity: 0.6 }, // Sydney
  { location: new atlas.data.Position(13.405, 52.52), intensity: 0.8 }, // Berlin
  { location: new atlas.data.Position(2.3522, 48.8566), intensity: 0.9 }, // Paris
  { location: new atlas.data.Position(-118.2437, 34.0522), intensity: 0.7 }, // Los Angeles
  { location: new atlas.data.Position(-43.1729, -22.9068), intensity: 0.6 }, // Rio de Janeiro
  { location: new atlas.data.Position(28.0473, -26.2041), intensity: 0.5 }, // Johannesburg
  { location: new atlas.data.Position(77.209, 28.6139), intensity: 0.9 }, // New Delhi
  { location: new atlas.data.Position(116.4074, 39.9042), intensity: 1.0 }, // Beijing
]

export function SporeMap({
  mapType,
  showWindOverlay,
  showSporeDetectors,
  showHeatmap,
  selectedRegion,
  zoomLevel,
  onZoomChange,
  onRegionSelect,
}: SporeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<atlas.Map | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [authInfo, setAuthInfo] = useState<{ clientId: string } | null>(null)
  const [dataSource, setDataSource] = useState<atlas.source.DataSource | null>(null)
  const [heatmapLayer, setHeatmapLayer] = useState<atlas.layer.HeatMapLayer | null>(null)
  const [windLayer, setWindLayer] = useState<atlas.layer.ImageLayer | null>(null)

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

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map || !authInfo) return

    try {
      if (!authInfo.clientId) {
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
        center: [0, 30], // Center of the world
        zoom: zoomLevel,
        style: mapType === "satellite" ? "satellite" : mapType === "topographic" ? "terrain" : "road",
        view: "Auto",
      })

      // Wait for the map to load
      newMap.events.add("load", () => {
        setIsLoading(false)

        // Create a data source for spore detectors
        const source = new atlas.source.DataSource()
        setDataSource(source)
        newMap.sources.add(source)

        // Add spore detector points to the map
        sporeDetectors.forEach((detector) => {
          const point = new atlas.Shape(new atlas.data.Point(detector.location), {
            id: detector.id,
            name: detector.name,
            status: detector.status,
            sporeCount: detector.sporeCount,
          })
          source.add(point)
        })

        // Add a symbol layer for spore detector markers
        newMap.layers.add(
          new atlas.layer.SymbolLayer(source, "spore-detectors", {
            iconOptions: {
              image: "marker-blue",
              size: 0.8,
              allowOverlap: true,
            },
            filter: ["==", ["get", "status"], "active"],
          }),
        )

        // Add a glow effect for active detectors
        newMap.layers.add(
          new atlas.layer.BubbleLayer(source, "detector-glow", {
            radius: 20,
            color: "rgba(0, 150, 255, 0.2)",
            blur: 1,
            strokeWidth: 0,
            filter: ["has", "status"],
          }),
        )

        // Add heatmap layer
        const heatmap = new atlas.layer.HeatMapLayer(source, "spore-heatmap", {
          radius: 20,
          opacity: 0.8,
          intensity: 0.5,
          color: {
            stops: [
              [0, "rgba(0, 255, 0, 0)"],
              [0.3, "rgba(0, 255, 0, 0.5)"],
              [0.5, "rgba(255, 255, 0, 0.7)"],
              [0.7, "rgba(255, 128, 0, 0.8)"],
              [1, "rgba(255, 0, 0, 1)"],
            ],
          },
        })
        setHeatmapLayer(heatmap)
        newMap.layers.add(heatmap)

        // Add wind overlay layer (mock)
        const windOverlayLayer = new atlas.layer.ImageLayer({
          url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wind-overlay-map-transparent-Yx9Yx9Yx9Yx9Yx9Yx9Yx9Yx9Yx9Yx9.png",
          coordinates: [
            [-180, 85],
            [180, 85],
            [180, -85],
            [-180, -85],
          ],
          opacity: 0.7,
        })
        setWindLayer(windOverlayLayer)
        newMap.layers.add(windOverlayLayer)

        // Add click event for spore detectors
        newMap.events.add("click", "spore-detectors", (e) => {
          if (e.shapes && e.shapes[0]) {
            const properties = e.shapes[0].getProperties()
            onRegionSelect(properties.name)
          }
        })

        // Add hover state
        newMap.events.add("mouseover", "spore-detectors", (e) => {
          if (e.shapes && e.shapes[0]) {
            const shape = e.shapes[0]
            const properties = shape.getProperties()

            // Show popup
            const popup = new atlas.Popup({
              pixelOffset: [0, -30],
            })

            popup.setOptions({
              content: `<div class="p-2">
                <p class="font-bold">${properties.name}</p>
                <p class="text-sm">Spore Count: ${properties.sporeCount.toLocaleString()}</p>
                <p class="text-sm text-green-500">Status: Active</p>
              </div>`,
              position: shape.getCoordinates(),
            })

            popup.open(newMap)
          }
        })

        newMap.events.add("mouseout", "spore-detectors", () => {
          newMap.popups.clear()
        })

        // Update zoom level when map is zoomed
        newMap.events.add("zoom", () => {
          const currentZoom = Math.round(newMap.getCamera().zoom)
          onZoomChange(currentZoom)
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
  }, [mapType, zoomLevel, onZoomChange, onRegionSelect, map, authInfo])

  // Update map style when mapType changes
  useEffect(() => {
    if (map) {
      let style = "road"
      if (mapType === "satellite") style = "satellite"
      else if (mapType === "topographic") style = "terrain"

      map.setStyle({ style })
    }
  }, [map, mapType])

  // Update zoom level when zoomLevel prop changes
  useEffect(() => {
    if (map) {
      const currentZoom = Math.round(map.getCamera().zoom)
      if (currentZoom !== zoomLevel) {
        map.setCamera({ zoom: zoomLevel })
      }
    }
  }, [map, zoomLevel])

  // Toggle wind overlay visibility
  useEffect(() => {
    if (windLayer) {
      windLayer.setOptions({ visible: showWindOverlay })
    }
  }, [windLayer, showWindOverlay])

  // Toggle spore detectors visibility
  useEffect(() => {
    if (map) {
      const detectorLayer = map.layers.getLayerById("spore-detectors")
      const glowLayer = map.layers.getLayerById("detector-glow")

      if (detectorLayer) {
        detectorLayer.setOptions({ visible: showSporeDetectors })
      }

      if (glowLayer) {
        glowLayer.setOptions({ visible: showSporeDetectors })
      }
    }
  }, [map, showSporeDetectors])

  // Toggle heatmap visibility
  useEffect(() => {
    if (heatmapLayer) {
      heatmapLayer.setOptions({ visible: showHeatmap })
    }
  }, [heatmapLayer, showHeatmap])

  return (
    <div className="relative w-full h-[600px] bg-zinc-900">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
          <div className="text-center space-y-2">
            <p className="text-destructive font-semibold">Failed to load map</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      )}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  )
}
