"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Wind, SlidersHorizontal } from "lucide-react"
import dynamic from "next/dynamic"
import "leaflet/dist/leaflet.css"

const MapContainer = dynamic(() => import("react-leaflet").then((mod) => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then((mod) => mod.TileLayer), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then((mod) => mod.Circle), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then((mod) => mod.Popup), { ssr: false })

type SporeDataPoint = {
  id: number
  species: string
  lat: number
  lng: number
  concentration: number
}

const SPECIES_FILTERS = [
  "All",
  "Amanita muscaria",
  "Penicillium",
  "Aspergillus niger",
  "Saccharomyces cerevisiae",
  "Trichoderma",
  "Candida albicans",
  "Rhizopus stolonifer",
]

export default function SporeTrackerPage() {
  const [sporeData, setSporeData] = useState<SporeDataPoint[]>([])
  const [filteredData, setFilteredData] = useState<SporeDataPoint[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSpecies, setSelectedSpecies] = useState("All")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const res = await fetch("/api/spores")
        const data = await res.json()
        setSporeData(data)
        setFilteredData(data)
      } catch (error) {
        console.error("Failed to fetch spore data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (selectedSpecies === "All") {
      setFilteredData(sporeData)
    } else {
      setFilteredData(sporeData.filter((d) => d.species === selectedSpecies))
    }
  }, [selectedSpecies, sporeData])

  if (!isClient) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading Map...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="flex flex-col items-center text-center mb-8">
        <Wind className="h-12 w-12 text-cyan-500 mb-4" />
        <h1 className="text-4xl font-bold tracking-tight">Spore Tracker</h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">
          Visualize real-time and historical spore dispersal patterns across the globe.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <Card className="lg:w-1/3">
          <CardHeader>
            <CardTitle className="flex items-center">
              <SlidersHorizontal className="h-5 w-5 mr-2" />
              Filters & Data
            </CardTitle>
            <CardDescription>Control the data displayed on the map.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="species-filter" className="font-medium">
                Filter by Species
              </label>
              <Select value={selectedSpecies} onValueChange={setSelectedSpecies}>
                <SelectTrigger id="species-filter">
                  <SelectValue placeholder="Select a species" />
                </SelectTrigger>
                <SelectContent>
                  {SPECIES_FILTERS.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Data Points ({filteredData.length})</h3>
              <div className="max-h-[450px] overflow-y-auto pr-2">
                {loading ? (
                  <p>Loading data...</p>
                ) : (
                  <ul className="space-y-2 text-sm">
                    {filteredData.map((d) => (
                      <li key={d.id} className="p-2 rounded-md bg-muted/50">
                        <p className="font-semibold">{d.species}</p>
                        <p className="text-muted-foreground">Concentration: {d.concentration} spores/m³</p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex-grow">
          <div className="h-[600px] w-full rounded-lg border overflow-hidden">
            <MapContainer
              center={[39.8283, -98.5795]}
              zoom={4}
              style={{ height: "100%", width: "100%", backgroundColor: "#1a202c" }}
            >
              <TileLayer
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              />
              {filteredData.map((d) => {
                const position: [number, number] = [d.lat, d.lng]
                const maxConcentration = 300
                const radius = 10000 + (d.concentration / maxConcentration) * 150000
                const opacity = 0.3 + (d.concentration / maxConcentration) * 0.5

                return (
                  <Circle
                    key={d.id}
                    center={position}
                    radius={radius}
                    pathOptions={{
                      color: "#10b981",
                      fillColor: "#10b981",
                      fillOpacity: opacity,
                      weight: 1,
                    }}
                  >
                    <Popup>
                      <div className="font-sans">
                        <p className="font-bold text-md">{d.species}</p>
                        <p>Concentration: {d.concentration} spores/m³</p>
                        <p>
                          Location: {d.lat.toFixed(2)}, {d.lng.toFixed(2)}
                        </p>
                      </div>
                    </Popup>
                  </Circle>
                )
              })}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
