import { openai } from "@ai-sdk/openai"
import { groq } from "@ai-sdk/grok"
import { streamText, type AIModel } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { prompt, model: modelId } = await req.json()

  let model: AIModel
  switch (modelId) {
    case "grok":
      model = groq("llama3-70b-8192")
      break
    case "openai":
    default:
      model = openai("gpt-4o")
      break
  }

  const result = await streamText({
    model: model,
    system: `You are an expert mycologist and evolutionary biologist. Your audience is intelligent and curious about the natural world. You are providing insights for a platform that is like "Ancestry.com for nature".`,
    prompt: `For the species "${prompt}", provide a concise but engaging summary of its evolutionary significance, key distinguishing characteristics, and its ecological role. Use a narrative tone. Structure your response with markdown for clear headings (e.g., ### Evolutionary Significance).`,
  })

  return result.toAIStreamResponse()
}
