import { neon } from "@neondatabase/serverless"
import type { Fungi } from "@/types/fungi"

// Initialize the SQL client with the database URL
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
}): Promise<{ fungi: any[]; total: number; totalPages: number; page: number }> {
  const pageNum = page || 1
  const limitNum = limit || 9
  const offset = (pageNum - 1) * limitNum

  let whereClause = "WHERE 1=1"
  const params: any[] = []

  if (query) {
    whereClause += ` AND (
      scientific_name ILIKE $${params.length + 1} OR
      common_name ILIKE $${params.length + 1} OR
      family ILIKE $${params.length + 1}
    )`
    params.push(`%${query}%`)
  }

  const validSortColumns = ["scientific_name", "common_name", "family"]
  const sortColumn = validSortColumns.includes(sort || "") ? sort : "scientific_name"
  const orderByClause = `ORDER BY ${sortColumn} ASC`

  const dataQuery = `SELECT id, scientific_name, common_name, family, description, image_url, characteristics FROM species ${whereClause} ${orderByClause} LIMIT $${
    params.length + 1
  } OFFSET $${params.length + 2}`
  const countQuery = `SELECT COUNT(*) FROM species ${whereClause}`

  const dataParams = [...params, limitNum, offset]
  const countParams = [...params]

  try {
    const [fungiResult, countResult] = await Promise.all([
      sql.unsafe(dataQuery, dataParams),
      sql.unsafe(countQuery, countParams),
    ])

    const total = Number.parseInt(countResult.rows[0].count, 10)
    const totalPages = Math.ceil(total / limitNum)

    return {
      fungi: fungiResult.rows,
      total,
      totalPages,
      page: pageNum,
    }
  } catch (error) {
    console.error("Error fetching paginated fungi:", error)
    return { fungi: [], total: 0, totalPages: 1, page: 1 }
  }
}

export async function getFungiById(id: number): Promise<Fungi | null> {
  try {
    const [fungi] = await sql<Fungi[]>`
      SELECT * FROM fungi WHERE id = ${id}
    `

    if (!fungi) return null

    const [characteristics] = await sql`
      SELECT * FROM fungi_characteristics WHERE fungi_id = ${id}
    `
    const images = await sql`
      SELECT * FROM fungi_images WHERE fungi_id = ${id} ORDER BY is_primary DESC
    `
    const [taxonomy] = await sql`
      SELECT * FROM taxonomic_classification WHERE fungi_id = ${id}
    `

    return {
      ...fungi,
      characteristics,
      images,
      taxonomy,
    }
  } catch (error) {
    console.error(`Error fetching fungi with ID ${id}:`, error)
    return null
  }
}

export async function getUniqueValues(field: string) {
  try {
    const result = await sql`
      SELECT DISTINCT ${sql(field)} as value
      FROM fungi
      WHERE ${sql(field)} IS NOT NULL
      ORDER BY value ASC
    `
    return result.map((row: any) => row.value)
  } catch (error) {
    console.error(`Error getting unique values for ${field}:`, error)
    return []
  }
}
