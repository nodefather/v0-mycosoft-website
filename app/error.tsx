;/>
\
1. **Delete** the top line `"use client"` – the file must be a Server Component.
\
2. **Replace** the entire component
with
:\

```tsx
// Global error boundary (Server Component)
import ErrorClient from "@/components/error-client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  // Forward everything to a Client component for interactivity
  return <ErrorClient error={error} reset={reset} />
}
