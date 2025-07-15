// Global error boundary ─ Server Component (NO "use client")
import ErrorClient from "@/components/error-client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Forward the error data and reset callback to the client component
  return <ErrorClient error={error} reset={reset} />
}
