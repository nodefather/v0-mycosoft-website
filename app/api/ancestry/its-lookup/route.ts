import { neon } from "@neondatabase/serverless"
import { type NextRequest, NextResponse } from "next/server"

// A mock mapping of ITS sequences to species IDs.
// In a real application, this would be a more complex database query.
const ITS_SEQUENCE_MAPPING: { [key: string]: number } = {
  GTCGATGAAGAACGCAGCG: 4, // Amanita muscaria
  ATTGATATCATATATATGC: 1, // Agaricus bisporus
  CGTAACAAGGTTTCCGTAG: 13, // Boletus edulis
  GAATTGCAGAATCCCGTGA: 2, // Pleurotus ostreatus
  TCCGTAGGTGAACCTGCGG: 10, // Cantharellus cibarius
}

export async function POST(request: NextRequest) {
  const sql = neon(process.env.DATABASE_URL!)

  try {
    const body = await request.json()
    const { sequence } = body

    if (!sequence || typeof sequence !== "string") {
      return NextResponse.json({ error: "ITS sequence is required and must be a string." }, { status: 400 })
    }

    const normalizedSequence = sequence.toUpperCase().trim()
    const speciesId = ITS_SEQUENCE_MAPPING[normalizedSequence]

    if (!speciesId) {
      return NextResponse.json({ message: "No matching species found for this ITS sequence." }, { status: 404 })
    }

    const result = await sql`
      SELECT id, scientific_name, common_name, image_url, description 
      FROM species 
      WHERE id = ${speciesId}
    `

    const species = result[0]

    if (!species) {
      // This case handles if the ID in the mapping doesn't exist in the species table
      return NextResponse.json({ message: "Species found in ITS mapping but not in database." }, { status: 404 })
    }

    return NextResponse.json(species)
  } catch (error) {
    console.error("ITS Lookup Error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "An internal server error occurred.", details: errorMessage }, { status: 500 })
  }
}
