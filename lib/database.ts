import { neon } from "@neondatabase/serverless"
import type { Fungi } from "@/types/fungi"

/**
 * Singleton Neon client.
 * NOTE: `NEON_DATABASE_URL` must be set (starts with postgresql:// or postgres://).
 */
const sql = neon(process.env.NEON_DATABASE_URL || "")

/* -------------------------------------------------------------------------- */
/*                               Paginated list                               */
/* -------------------------------------------------------------------------- */

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

  /* ---------- build WHERE clause + params ---------- */
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

  /* ---------- sorting ---------- */
  const validSortColumns = ["scientific_name", "common_name", "family"]
  const sortColumn = validSortColumns.includes(sort || "") ? sort : "scientific_name"
  const orderByClause = `ORDER BY ${sortColumn} ASC`

  /* ---------- main & count queries ---------- */
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

  const countQuery = `
    SELECT COUNT(*)::int AS count
      FROM species
      ${whereClause};
  `

  const dataParams = [...params, limitNum, offset]
  const countParams = [...params]

  try {
    /* neon.sql & neon.unsafe return the rows array directly */
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

/* -------------------------------------------------------------------------- */
/*                            Single-species detail                           */
/* -------------------------------------------------------------------------- */

export async function getFungiById(id: number): Promise<Fungi | null> {
  try {
    const [fungi] = await sql<Fungi[]>`
      SELECT * FROM fungi WHERE id = ${id};
    `
    if (!fungi) return null

    const [characteristics] = await sql<any[]>`
      SELECT * FROM fungi_characteristics WHERE fungi_id = ${id};
    `
    const images = await sql<any[]>`
      SELECT * FROM fungi_images WHERE fungi_id = ${id} ORDER BY is_primary DESC;
    `
    const [taxonomy] = await sql<any[]>`
      SELECT * FROM taxonomic_classification WHERE fungi_id = ${id};
    `

    return {
      ...fungi,
      characteristics: characteristics ?? {},
      images: images ?? [],
      taxonomy: taxonomy ?? {},
    } as Fungi
  } catch (error) {
    console.error(`🛑 Error fetching fungi with ID ${id}:`, error)
    return null
  }
}

/* -------------------------------------------------------------------------- */
/*                           Helper: distinct values                          */
/* -------------------------------------------------------------------------- */

export async function getUniqueValues(field: string) {
  try {
    const result = await sql<any[]>`
      SELECT DISTINCT ${sql(field)} AS value
        FROM fungi
       WHERE ${sql(field)} IS NOT NULL
       ORDER BY value ASC;
    `
    return result.map((row) => row.value)
  } catch (error) {
    console.error(`🛑 Error getting unique values for ${field}:`, error)
    return []
  }
}
