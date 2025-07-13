import { NextResponse } from "next/server"

// Mock data representing spore concentrations at different locations
const MOCK_SPORE_DATA = [
  { id: 1, species: "Amanita muscaria", lat: 47.6, lng: -122.3, concentration: 85 },
  { id: 2, species: "Penicillium", lat: 34.05, lng: -118.24, concentration: 120 },
  { id: 3, species: "Aspergillus niger", lat: 29.76, lng: -95.36, concentration: 200 },
  { id: 4, species: "Saccharomyces cerevisiae", lat: 40.71, lng: -74.0, concentration: 50 },
  { id: 5, species: "Amanita muscaria", lat: 49.28, lng: -123.12, concentration: 95 },
  { id: 6, species: "Penicillium", lat: 39.95, lng: -75.16, concentration: 150 },
  { id: 7, species: "Aspergillus niger", lat: 33.44, lng: -112.07, concentration: 250 },
  { id: 8, species: "Trichoderma", lat: 41.87, lng: -87.62, concentration: 180 },
  { id: 9, species: "Candida albicans", lat: 25.76, lng: -80.19, concentration: 40 },
  { id: 10, species: "Rhizopus stolonifer", lat: 36.16, lng: -86.78, concentration: 110 },
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const species = searchParams.get("species")

  let filteredData = MOCK_SPORE_DATA

  if (species && species !== "all") {
    filteredData = MOCK_SPORE_DATA.filter((d) => d.species.toLowerCase().includes(species.toLowerCase()))
  }

  return NextResponse.json(filteredData)
}
