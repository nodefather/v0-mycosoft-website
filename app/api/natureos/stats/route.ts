import { NextResponse } from "next/server"

export async function GET() {
  const stats = {
    activeNodes: {
      value: 2350,
      change: 180,
      progress: 65,
    },
    apiRequests: {
      value: "1.2M",
      subValue: "23k requests/min",
      progress: 78,
    },
    aiOperations: {
      value: "845k",
      subValue: "98.2% success rate",
      progress: 98,
    },
    storageUsed: {
      value: "1.8TB",
      subValue: "of 2.5TB total",
      progress: 72,
    },
  }
  return NextResponse.json(stats)
}
