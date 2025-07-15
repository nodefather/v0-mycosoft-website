import { NextResponse } from "next/server"
import { getFungiPaginated } from "@/lib/database"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("search") || ""
  const sort = searchParams.get("sort") || "scientific_name"
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "9", 10)

  try {
    const { fungi, total, totalPages } = await getFungiPaginated({
      query,
      sort,
      page,
      limit,
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
    return NextResponse.json(
      {
        ok: false,
        message: "Failed to fetch species data",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
