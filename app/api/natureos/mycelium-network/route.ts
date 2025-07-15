import { NextResponse } from "next/server"

export async function GET() {
  const networkData = {
    nodes: [
      { id: "1", type: "input", data: { label: "Core Node A" }, position: { x: 250, y: 5 } },
      { id: "2", data: { label: "Sub-Node B" }, position: { x: 100, y: 100 } },
      { id: "3", data: { label: "Sub-Node C" }, position: { x: 400, y: 100 } },
      { id: "4", data: { label: "Peripheral D" }, position: { x: 100, y: 200 } },
      { id: "5", type: "output", data: { label: "Gateway E" }, position: { x: 250, y: 300 } },
      { id: "6", data: { label: "Peripheral F" }, position: { x: 400, y: 200 } },
    ],
    edges: [
      { id: "e1-2", source: "1", target: "2", animated: true },
      { id: "e1-3", source: "1", target: "3", animated: true },
      { id: "e2-4", source: "2", target: "4" },
      { id: "e3-6", source: "3", target: "6" },
      { id: "e4-5", source: "4", target: "5" },
      { id: "e6-5", source: "6", target: "5" },
    ],
  }
  return NextResponse.json(networkData)
}
