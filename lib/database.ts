import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.NEON_DATABASE_URL || "")

export async function getFungiPaginated({
  query,
  sort,
  page,
  limit,
}: {
  query?: string
  sort?: string
  page?: number
  limit?: number
}): Promise<{
  fungi: any[]
  total: number
  totalPages: number
  page: number
}> {
  const pageNum = page && page > 0 ? page : 1
  const limitNum = limit && limit > 0 ? limit : 9
  const offset = (pageNum - 1) * limitNum

  let whereClause = "WHERE 1=1"
  const params: any[] = []

  if (query) {
    whereClause += ` AND (
      scientific_name ILIKE $${params.length + 1} OR
      common_name     ILIKE $${params.length + 1} OR
      family          ILIKE $${params.length + 1}
    )`
    params.push(`%${query}%`)
  }

  const validSortColumns = ["scientific_name", "common_name", "family"]
  const sortColumn = validSortColumns.includes(sort || "") ? sort : "scientific_name"
  const orderByClause = `ORDER BY ${sortColumn} ASC`

  const dataQuery = `
    SELECT id,
           scientific_name,
           common_name,
           family,
           description,
           image_url,
           characteristics
      FROM species
      ${whereClause}
      ${orderByClause}
      LIMIT  $${params.length + 1}
      OFFSET $${params.length + 2};
  `
  const countQuery = `SELECT COUNT(*)::int AS count FROM species ${whereClause};`
  const dataParams = [...params, limitNum, offset]
  const countParams = [...params]

  try {
    const [fungiRows, countRows] = await Promise.all([
      sql.unsafe(dataQuery, dataParams),
      sql.unsafe(countQuery, countParams),
    ])

    const total = (countRows[0] as any)?.count ?? 0
    const totalPages = Math.max(1, Math.ceil(total / limitNum))

    return { fungi: fungiRows as any[], total, totalPages, page: pageNum }
  } catch (error) {
    console.error("🛑 Error fetching paginated fungi:", error)
    return { fungi: [], total: 0, totalPages: 1, page: 1 }
  }
}

export async function getFungiById(id: number): Promise<any | null> {
  if (isNaN(id)) {
    console.error("🛑 Invalid ID provided to getFungiById:", id)
    return null
  }
  try {
    const results = await sql`
      SELECT * FROM species WHERE id = ${id};
    `
    if (results.length === 0) return null

    const fungi = results[0]

    // Manually construct the nested structure FungiProfile expects
    // This is a transitional step to bridge the flat DB schema and the component's expectation
    return {
      ...fungi,
      id: fungi.id,
      scientificName: fungi.scientific_name,
      commonName: fungi.common_name,
      description: fungi.description,
      edibility: fungi.edibility,
      habitat: fungi.habitat,
      season: fungi.season,
      ecology: fungi.ecology,
      notes: fungi.notes,
      // Assume characteristics and images are JSONB columns
      characteristics:
        typeof fungi.characteristics === "string" ? JSON.parse(fungi.characteristics) : fungi.characteristics,
      images: typeof fungi.images === "string" ? JSON.parse(fungi.images) : fungi.images,
      // Construct taxonomy object from flat columns
      taxonomy: {
        kingdom: fungi.kingdom,
        phylum: fungi.phylum,
        class: fungi.class,
        order: fungi.order,
        family: fungi.family,
        genus: fungi.genus,
        species: fungi.scientific_name,
      },
    }
  } catch (error) {
    console.error(`🛑 Error fetching fungi with ID ${id}:`, error)
    return null
  }
}
