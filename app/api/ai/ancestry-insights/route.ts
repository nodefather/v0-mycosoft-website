import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { prompt } = await req.json()

  const result = await streamText({
    model: openai("gpt-4o"),
    system: `You are an expert mycologist and evolutionary biologist. Your audience is intelligent and curious about the natural world. You are providing insights for a platform that is like "Ancestry.com for nature".`,
    prompt: `For the species "${prompt}", provide a concise but engaging summary of its evolutionary significance, key distinguishing characteristics, and its ecological role. Use a narrative tone. Structure your response with markdown for clear headings (e.g., ### Evolutionary Significance).`,
  })

  return result.toAIStreamResponse()
}
