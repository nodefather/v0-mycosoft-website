import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// A simplified mock function to generate a tree structure.
// In a real application, this would involve complex queries or a graph database.
async function generateTreeData(rootId: number) {
  const sql = neon(process.env.DATABASE_URL!)

  // Find the root species
  const rootSpeciesResult = await sql`SELECT id, scientific_name, common_name FROM species WHERE id = ${rootId}`
  if (rootSpeciesResult.length === 0) {
    return null
  }
  const rootSpecies = rootSpeciesResult[0]

  const tree = {
    name: rootSpecies.scientific_name,
    attributes: {
      "Common Name": rootSpecies.common_name || "N/A",
    },
    children: [] as any[],
  }

  // Find a few 'children' - for this demo, we'll just grab a few other random species
  // to simulate a descendant tree.
  const childrenResult =
    await sql`SELECT id, scientific_name, common_name FROM species WHERE id != ${rootId} ORDER BY RANDOM() LIMIT 3`

  for (const child of childrenResult) {
    const grandChildrenResult =
      await sql`SELECT id, scientific_name, common_name FROM species WHERE id NOT IN (${rootId}, ${child.id}) ORDER BY RANDOM() LIMIT 2`
    const grandChildren = grandChildrenResult.map((gc) => ({
      name: gc.scientific_name,
      attributes: { "Common Name": gc.common_name || "N/A" },
    }))

    tree.children.push({
      name: child.scientific_name,
      attributes: {
        "Common Name": child.common_name || "N/A",
      },
      children: grandChildren,
    })
  }

  return tree
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const rootId = searchParams.get("rootId")

  if (!rootId) {
    return NextResponse.json({ error: "A rootId parameter is required." }, { status: 400 })
  }

  try {
    const treeData = await generateTreeData(Number.parseInt(rootId, 10))
    if (!treeData) {
      return NextResponse.json({ error: "Root species not found." }, { status: 404 })
    }
    return NextResponse.json(treeData)
  } catch (error) {
    console.error("Phylogenetic Tree Error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "An internal server error occurred.", details: errorMessage }, { status: 500 })
  }
}
