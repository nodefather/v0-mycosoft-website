"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Loader2 } from "lucide-react"

const apiEndpoints = [
  { value: "/api/natureos/stats", method: "GET" },
  { value: "/api/natureos/mycelium-network", method: "GET" },
  { value: "/api/natureos/files", method: "GET" },
  { value: "/api/species", method: "GET" },
  { value: "/api/species/submit", method: "POST" },
]

export function ApiConsoleClient() {
  const [selectedEndpoint, setSelectedEndpoint] = useState(apiEndpoints[0].value)
  const [requestBody, setRequestBody] = useState("")
  const [response, setResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendRequest = async () => {
    setIsLoading(true)
    setResponse("")
    const endpointInfo = apiEndpoints.find((e) => e.value === selectedEndpoint)
    if (!endpointInfo) return

    try {
      const options: RequestInit = {
        method: endpointInfo.method,
        headers: {
          "Content-Type": "application/json",
        },
      }
      if (endpointInfo.method === "POST" && requestBody) {
        options.body = requestBody
      }

      const res = await fetch(selectedEndpoint, options)
      const data = await res.json()
      setResponse(JSON.stringify(data, null, 2))
    } catch (error) {
      setResponse(error instanceof Error ? error.message : "An unknown error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>API Console</CardTitle>
        <CardDescription>Interact with the Mycosoft API directly from your browser.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Select value={selectedEndpoint} onValueChange={setSelectedEndpoint}>
            <SelectTrigger>
              <SelectValue placeholder="Select an endpoint" />
            </SelectTrigger>
            <SelectContent>
              {apiEndpoints.map((endpoint) => (
                <SelectItem key={endpoint.value} value={endpoint.value}>
                  <span className="font-mono text-xs bg-muted px-1 py-0.5 rounded-sm mr-2">{endpoint.method}</span>
                  {endpoint.value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSendRequest} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Request"}
          </Button>
        </div>
        <div>
          <label htmlFor="request-body" className="text-sm font-medium">
            Request Body (for POST)
          </label>
          <Textarea
            id="request-body"
            placeholder='{ "key": "value" }'
            value={requestBody}
            onChange={(e) => setRequestBody(e.target.value)}
            className="font-mono mt-1"
            disabled={apiEndpoints.find((e) => e.value === selectedEndpoint)?.method !== "POST"}
          />
        </div>
        <div>
          <label htmlFor="response-body" className="text-sm font-medium">
            Response
          </label>
          <Textarea
            id="response-body"
            readOnly
            value={response}
            placeholder="API response will appear here..."
            className="font-mono mt-1 h-64 bg-muted"
          />
        </div>
      </CardContent>
    </Card>
  )
}
