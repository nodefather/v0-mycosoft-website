import { NextResponse } from "next/server"

export async function GET() {
  // Mock data simulating a live API response
  const stats = {
    activeNodes: { value: 2350, subtext: "+180 from last hour", progress: 65 },
    apiRequests: { value: "1.2M", subtext: "23k requests/min", progress: 78 },
    aiOperations: { value: "845k", subtext: "98.2% success rate", progress: 98 },
    storageUsed: { value: "1.8TB", subtext: "of 2.5TB total", progress: 72 },
  }
  return NextResponse.json(stats)
}
