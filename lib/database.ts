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

    const total = countRows[0]?.count ?? 0
    const totalPages = Math.max(1, Math.ceil(total / limitNum))

    return { fungi: fungiRows, total, totalPages, page: pageNum }
  } catch (error) {
    console.error("🛑 Error fetching paginated fungi:", error)
    return { fungi: [], total: 0, totalPages: 1, page: 1 }
  }
}

export async function getFungiById(id: number): Promise<any | null> {
  try {
    const results = await sql`
      SELECT * FROM species WHERE id = ${id};
    `
    if (results.length === 0) return null
    // Assuming the structure of species table matches what FungiProfile expects
    return results[0]
  } catch (error) {
    console.error(`🛑 Error fetching fungi with ID ${id}:`, error)
    return null
  }
}
