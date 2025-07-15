import { NatureOSDashboard } from "@/components/dashboard/natureos-dashboard"
import type { OverviewStats } from "@/types/natureos"

async function getOverviewStats(): Promise<OverviewStats> {
  const apiUrl = process.env.NATUREOS_API_URL
  if (!apiUrl) {
    console.error("NATUREOS_API_URL environment variable is not set.")
    // Return fallback data if the API URL is not configured
    return {
      activeNodes: { value: 0, subtext: "+0 from last hour", progress: 0 },
      apiRequests: { value: "0", subtext: "0 requests/min", progress: 0 },
      aiOperations: { value: "0", subtext: "0% success rate", progress: 0 },
      storageUsed: { value: "0TB", subtext: "of 0TB total", progress: 0 },
    }
  }

  try {
    // Fetch data from your live backend
    const res = await fetch(`${apiUrl}/overview`, {
      next: { revalidate: 60 }, // Revalidate data every 60 seconds
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
      activeNodes: { value: 0, subtext: "+0 from last hour", progress: 0 },
      apiRequests: { value: "0", subtext: "0 requests/min", progress: 0 },
      aiOperations: { value: "0", subtext: "0% success rate", progress: 0 },
      storageUsed: { value: "0TB", subtext: "of 0TB total", progress: 0 },
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
