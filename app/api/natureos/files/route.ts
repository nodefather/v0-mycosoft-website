import { NextResponse } from "next/server"

export async function GET() {
  const files = [
    { name: "Project Alpha", type: "folder", size: "12.5 GB", modified: "2025-07-14" },
    { name: "Research Data", type: "folder", size: "128.2 GB", modified: "2025-07-12" },
    { name: "Simulations", type: "folder", size: "34.1 GB", modified: "2025-07-11" },
    { name: "publication_draft.docx", type: "file", size: "2.3 MB", modified: "2025-07-14" },
    { name: "network_topology.json", type: "file", size: "780 KB", modified: "2025-07-10" },
    { name: "presentation.pptx", type: "file", size: "15.6 MB", modified: "2025-07-09" },
  ]
  return NextResponse.json(files)
}
