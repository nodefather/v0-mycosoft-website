import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const search = searchParams.get("search") || ""
  const sort = searchParams.get("sort") || "scientific_name"
  const page = Number.parseInt(searchParams.get("page") || "1", 10)
  const limit = Number.parseInt(searchParams.get("limit") || "9", 10)
  const offset = (page - 1) * limit

  try {
    let dbUrl = process.env.DATABASE_URL
    if (!dbUrl) {
      throw new Error("DATABASE_URL environment variable is not set.")
    }

    // --- NEW: normalise for Neon driver --------------------
    // Neon expects "postgresql://", but many env vars still use "postgres://"
    if (dbUrl.startsWith("postgres://")) {
      dbUrl = dbUrl.replace("postgres://", "postgresql://")
    }
    // --------------------------------------------------------

    const sql = neon(dbUrl)

    // Handle request for a single species by ID
    if (id) {
      const speciesResult = await sql`SELECT * FROM species WHERE id = ${Number(id)}`
      if (speciesResult.length === 0) {
        return NextResponse.json({ ok: false, message: "Species not found" }, { status: 404 })
      }
      return NextResponse.json({ ok: true, species: speciesResult[0] })
    }

    // Base query
    let query = sql`SELECT * FROM species`
    let countQuery = sql`SELECT COUNT(*) FROM species`

    // Add search condition
    if (search) {
      const searchTerm = `%${search}%`
      const whereClause = sql`WHERE scientific_name ILIKE ${searchTerm} OR common_name ILIKE ${searchTerm} OR family ILIKE ${searchTerm}`
      query = sql`SELECT * FROM species ${whereClause}`
      countQuery = sql`SELECT COUNT(*) FROM species ${whereClause}`
    }

    // Add sorting
    const validSortColumns = ["scientific_name", "common_name", "family"]
    const sortColumn = validSortColumns.includes(sort) ? sort : "scientific_name"
    query = sql`${query} ORDER BY ${sql(sortColumn)} ASC`

    // Add pagination
    query = sql`${query} LIMIT ${limit} OFFSET ${offset}`

    // Execute queries
    const [species, totalResult] = await Promise.all([query, countQuery])
    const total = Number(totalResult[0].count)

    return NextResponse.json({
      ok: true,
      species,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error("🛑 Error fetching species:", error)
    return NextResponse.json(
      {
        ok: false,
        message: error instanceof Error ? error.message : "An unknown error occurred.",
      },
      { status: 500 },
    )
  }
}
