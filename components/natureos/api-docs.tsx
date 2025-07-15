"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const endpoints = [
  {
    method: "GET",
    path: "/api/species/{id}",
    description: "Retrieves detailed information about a specific fungal species.",
  },
  {
    method: "POST",
    path: "/api/species/submit",
    description: "Submits a new species for inclusion in the database.",
  },
  {
    method: "GET",
    path: "/api/compounds",
    description: "Searches for chemical compounds found in fungi.",
  },
  {
    method: "GET",
    path: "/api/natureos/stats",
    description: "Fetches real-time statistics for the NatureOS dashboard.",
  },
  {
    method: "GET",
    path: "/api/natureos/mycelium-network",
    description: "Returns the current topology of the mycelium network.",
  },
]

export function ApiDocs() {
  return (
    <div className="space-y-4">
      {endpoints.map((endpoint) => (
        <Card key={endpoint.path}>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Badge variant={endpoint.method === "GET" ? "default" : "secondary"}>{endpoint.method}</Badge>
              <CardTitle className="font-mono text-lg">{endpoint.path}</CardTitle>
            </div>
            <CardDescription>{endpoint.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-semibold">Example Response:</p>
            <pre className="mt-2 w-full overflow-x-auto rounded-md bg-muted p-4 text-sm">
              <code>{`{\n  "status": "success",\n  "data": { ... }\n}`}</code>
            </pre>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
