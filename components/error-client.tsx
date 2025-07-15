"use client"

import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

export default function ErrorClient({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Send the error to your monitoring service
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="container flex items-center justify-center min-h-[400px]">
      <Card className="max-w-md w-full">
        <CardHeader>
          <div className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            <CardTitle>Something went wrong!</CardTitle>
          </div>
          <CardDescription>{error.message || "An unexpected error occurred. Please try again."}</CardDescription>
        </CardHeader>

        <CardContent>
          {error.digest && <p className="text-sm text-muted-foreground">Error ID:&nbsp;{error.digest}</p>}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={() => (window.location.href = "/")}>
            Go&nbsp;Home
          </Button>
          {/* `reset()` re-renders the segment that threw */}
          <Button onClick={() => reset()}>Try&nbsp;Again</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
