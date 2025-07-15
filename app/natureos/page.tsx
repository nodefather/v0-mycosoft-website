import { NatureOSDashboard } from "@/components/dashboard/natureos-dashboard"
import type { OverviewStats } from "@/types/natureos"

// This function now fetches from the internal mock API route.
async function getOverviewStats(): Promise<OverviewStats> {
  try {
    // Using an absolute path for the fetch request on the server.
    // This requires knowing the full URL, which we can construct.
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
    const res = await fetch(`${baseUrl}/api/natureos/stats`, {
      next: { revalidate: 10 }, // Revalidate every 10 seconds
    })

    if (!res.ok) {
      console.error(`Failed to fetch overview stats: ${res.statusText}`)
      throw new Error("Failed to fetch overview stats")
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error("Error fetching NatureOS overview stats:", error)
    // Return fallback data on fetch error
    return {
      activeNodes: { value: 0, subtext: "Error loading", progress: 0 },
      apiRequests: { value: "0", subtext: "Error loading", progress: 0 },
      aiOperations: { value: "0", subtext: "Error loading", progress: 0 },
      storageUsed: { value: "0TB", subtext: "Error loading", progress: 0 },
    }
  }
}

export default async function NatureOSPage() {
  const stats = await getOverviewStats()

  return (
    <div className="h-full w-full">
      <NatureOSDashboard initialStats={stats} />
    </div>
  )
}
