import { type NextRequest, NextResponse } from "next/server"

// A simple implementation of the Needleman-Wunsch algorithm for global sequence alignment.
function needlemanWunsch(seq1: string, seq2: string, match = 1, mismatch = -1, gap = -2) {
  const n = seq1.length
  const m = seq2.length
  const dp = Array(n + 1)
    .fill(null)
    .map(() => Array(m + 1).fill(0))

  for (let i = 0; i <= n; i++) {
    dp[i][0] = i * gap
  }
  for (let j = 0; j <= m; j++) {
    dp[0][j] = j * gap
  }

  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const matchScore = dp[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? match : mismatch)
      const gap1 = dp[i - 1][j] + gap
      const gap2 = dp[i][j - 1] + gap
      dp[i][j] = Math.max(matchScore, gap1, gap2)
    }
  }

  let align1 = ""
  let align2 = ""
  let i = n
  let j = m

  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && dp[i][j] === dp[i - 1][j - 1] + (seq1[i - 1] === seq2[j - 1] ? match : mismatch)) {
      align1 = seq1[i - 1] + align1
      align2 = seq2[j - 1] + align2
      i--
      j--
    } else if (i > 0 && dp[i][j] === dp[i - 1][j] + gap) {
      align1 = seq1[i - 1] + align1
      align2 = "-" + align2
      i--
    } else {
      align1 = "-" + align1
      align2 = seq2[j - 1] + align2
      j--
    }
  }

  return {
    score: dp[n][m],
    alignment1: align1,
    alignment2: align2,
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { sequence1, sequence2 } = body

    if (!sequence1 || !sequence2 || typeof sequence1 !== "string" || typeof sequence2 !== "string") {
      return NextResponse.json({ error: "Two sequences are required and must be strings." }, { status: 400 })
    }

    const result = needlemanWunsch(sequence1.toUpperCase(), sequence2.toUpperCase())
    return NextResponse.json(result)
  } catch (error) {
    console.error("Sequence Alignment Error:", error)
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred"
    return NextResponse.json({ error: "An internal server error occurred.", details: errorMessage }, { status: 500 })
  }
}
