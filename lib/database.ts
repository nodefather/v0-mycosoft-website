import { neon } from "@neondatabase/serverless"
import type { Fungi } from "@/types/fungi"

const sql = neon(process.env.NEON_DATABASE_URL || "")

// Helper to convert snake_case keys from DB to camelCase for client
const toCamelCase = (obj: any): any => {
  if (Array.isArray(obj)) {
    return obj.map((v) => toCamelCase(v))
  }
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      const camelKey = key.replace(/_([a-z])/g, (g) => g[1].toUpperCase())
      result[camelKey] = toCamelCase(obj[key])
      return result
    }, {} as any)
  }
  return obj
}

// Helper to convert camelCase sort key from client to snake_case for DB
const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`)

export async function getFilterOptions(): Promise<{ edibility: string[]; habitat: string[]; capShape: string[] }> {
  try {
    // These queries assume 'edibility' and 'habitat' are top-level columns,
    // and 'capShape' is a key within a JSONB 'characteristics' column.
    const edibilityQuery = sql`SELECT DISTINCT edibility FROM species WHERE edibility IS NOT NULL AND edibility != '' ORDER BY edibility ASC;`
    const habitatQuery = sql`SELECT DISTINCT habitat FROM species WHERE habitat IS NOT NULL AND habitat != '' ORDER BY habitat ASC;`
    const capShapeQuery = sql`SELECT DISTINCT characteristics->>'capShape' AS cap_shape FROM species WHERE characteristics->>'capShape' IS NOT NULL AND characteristics->>'capShape' != '' ORDER BY cap_shape ASC;`

    const [edibilityResults, habitatResults, capShapeResults] = await Promise.all([
      edibilityQuery,
      habitatQuery,
      capShapeQuery,
    ])

    const edibility = edibilityResults.map((row: any) => row.edibility)
    const habitat = habitatResults.map((row: any) => row.habitat)
    const capShape = capShapeResults.map((row: any) => row.cap_shape)

    return { edibility, habitat, capShape }
  } catch (error) {
    console.error("🛑 Error fetching filter options:", error)
    return { edibility: [], habitat: [], capShape: [] }
  }
}

export async function getFungiPaginated({
  query,
  sort,
  page,
  limit,
  filters,
}: {
  query?: string
  sort?: string
  page?: number
  limit?: number
  filters?: { edibility?: string; habitat?: string; capShape?: string }
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

  // Add advanced filters
  if (filters?.edibility) {
    whereClause += ` AND edibility = $${params.length + 1}`
    params.push(filters.edibility)
  }
  if (filters?.habitat) {
    whereClause += ` AND habitat = $${params.length + 1}`
    params.push(filters.habitat)
  }
  if (filters?.capShape) {
    whereClause += ` AND characteristics->>'capShape' = $${params.length + 1}`
    params.push(filters.capShape)
  }

  const snakeCaseSort = sort ? toSnakeCase(sort) : "scientific_name"
  const validSortColumns = ["scientific_name", "common_name", "family"]
  const sortColumn = validSortColumns.includes(snakeCaseSort) ? snakeCaseSort : "scientific_name"
  const orderByClause = `ORDER BY ${sortColumn} ASC`

  const dataQuery = `
    SELECT id,
           scientific_name,
           common_name,
           family,
           description,
           image_url,
           edibility
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

    return { fungi: toCamelCase(fungiRows), total, totalPages, page: pageNum }
  } catch (error) {
    console.error("🛑 Error fetching paginated fungi:", error)
    throw new Error("Database query failed.")
  }
}

export async function getFungiById(id: number): Promise<Fungi | null> {
  if (isNaN(id)) {
    console.error("🛑 Invalid ID provided to getFungiById:", id)
    return null
  }
  try {
    const results = await sql`
      SELECT * FROM species WHERE id = ${id};
    `
    if (results.length === 0) return null
    return toCamelCase(results[0]) as Fungi
  } catch (error) {
    console.error(`🛑 Error fetching fungi with ID ${id}:`, error)
    return null
  }
}
