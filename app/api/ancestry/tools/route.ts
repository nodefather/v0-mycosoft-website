import { type NextRequest, NextResponse } from "next/server"

const mockResponses: Record<string, any> = {
  "dna-search": {
    results: [
      { id: "seq1", match: "Hericium erinaceus", similarity: "99.8%" },
      { id: "seq2", match: "Ganoderma lucidum", similarity: "98.2%" },
    ],
  },
  "its-lookup": {
    speciesName: "Hericium erinaceus",
  },
  "sequence-alignment": {
    alignment: "Sequence 1: ATCG... \nSequence 2: ATCG...",
  },
  "genome-annotation": {
    annotation: "Annotation complete. Found 12,500 genes.",
  },
  "interaction-prediction": {
    prediction: "Predicted interaction: Mycorrhizal with Quercus alba (White Oak).",
  },
}

export async function POST(request: NextRequest) {
  try {
    const { tool } = await request.json()

    if (tool && mockResponses[tool]) {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 750))
      return NextResponse.json(mockResponses[tool])
    } else {
      return NextResponse.json({ error: "Invalid tool specified" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
