import { NextResponse } from "next/server"
import { getFilterOptions } from "@/lib/database"

export async function GET() {
  try {
    const filters = await getFilterOptions()
    return NextResponse.json(filters)
  } catch (error) {
    console.error("API Error fetching filter options:", error)
    return NextResponse.json({ message: "Failed to fetch filter options" }, { status: 500 })
  }
}
