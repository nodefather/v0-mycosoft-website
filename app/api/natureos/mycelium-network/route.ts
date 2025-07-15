import { NextResponse } from "next/server"
import type { MyceliumNetworkData } from "@/types/natureos"

export async function GET() {
  // Mock data for the network graph
  const data: MyceliumNetworkData = {
    nodes: [
      { id: "Core-1", group: 1, size: 15 },
      { id: "EU-West-1a", group: 2, size: 10 },
      { id: "EU-West-1b", group: 2, size: 10 },
      { id: "US-East-1a", group: 3, size: 10 },
      { id: "US-East-1b", group: 3, size: 10 },
      { id: "Asia-SE-1a", group: 4, size: 10 },
      { id: "Device-A1", group: 5, size: 5 },
      { id: "Device-B2", group: 5, size: 5 },
      { id: "Device-C3", group: 5, size: 5 },
    ],
    links: [
      { source: "Core-1", target: "EU-West-1a", value: 8 },
      { source: "Core-1", target: "EU-West-1b", value: 8 },
      { source: "Core-1", target: "US-East-1a", value: 10 },
      { source: "Core-1", target: "US-East-1b", value: 10 },
      { source: "Core-1", target: "Asia-SE-1a", value: 5 },
      { source: "EU-West-1a", target: "EU-West-1b", value: 3 },
      { source: "US-East-1a", target: "US-East-1b", value: 3 },
      { source: "EU-West-1a", target: "Device-A1", value: 1 },
      { source: "US-East-1b", target: "Device-B2", value: 1 },
      { source: "Asia-SE-1a", target: "Device-C3", value: 1 },
    ],
  }
  return NextResponse.json(data)
}
