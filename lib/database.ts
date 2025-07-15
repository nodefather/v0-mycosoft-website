import { neon } from "@neondatabase/serverless"
import type { Fungi } from "@/types/fungi"

const sql = neon(process.env.NEON_DATABASE_URL || "")

// Helper to convert snake_case keys to camelCase
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
           characteristics,
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
    return { fungi: [], total: 0, totalPages: 1, page: 1 }
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

    const fungiData = results[0]

    // The toCamelCase function will handle the conversion
    return toCamelCase(fungiData) as Fungi
  } catch (error) {
    console.error(`🛑 Error fetching fungi with ID ${id}:`, error)
    return null
  }
}
