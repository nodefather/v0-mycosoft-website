import { NextResponse } from "next/server"
import type { FileNode } from "@/types/natureos"

export async function GET() {
  // Mock data for the file browser
  const files: FileNode[] = [
    { id: "1", name: "Research Data", type: "folder", modified: "2025-07-10T14:48:00.000Z", size: "1.2 GB" },
    { id: "2", name: "Simulations", type: "folder", modified: "2025-07-12T09:22:00.000Z", size: "5.8 GB" },
    { id: "3", name: "AI Models", type: "folder", modified: "2025-07-14T11:30:00.000Z", size: "12.1 GB" },
    { id: "4", name: "README.md", type: "file", modified: "2025-07-01T10:00:00.000Z", size: "1.5 KB" },
    { id: "5", name: "quarterly_report.pdf", type: "file", modified: "2025-07-05T18:45:00.000Z", size: "5.2 MB" },
  ]
  return NextResponse.json(files)
}
