import { NextResponse } from "next/server"
import { getFungiPaginated } from "@/lib/database"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("search") || ""
    const sort = searchParams.get("sort") || "scientificName"
    const page = Number.parseInt(searchParams.get("page") || "1", 10)
    const limit = Number.parseInt(searchParams.get("limit") || "9", 10)

    const filters = {
      edibility: searchParams.getAll("edibility"),
      habitat: searchParams.getAll("habitat"),
      capShape: searchParams.getAll("capShape"),
    }

    if (isNaN(page) || isNaN(limit)) {
      return NextResponse.json({ ok: false, message: "Invalid page or limit parameter" }, { status: 400 })
    }

    const { fungi, total, totalPages } = await getFungiPaginated({
      query,
      sort,
      page,
      limit,
      filters,
    })

    return NextResponse.json({
      ok: true,
      species: fungi,
      total,
      totalPages,
      page,
    })
  } catch (error) {
    console.error("API Error fetching species:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch species data",
        error: errorMessage,
      },
      { status: 500 },
    )
  }
}
