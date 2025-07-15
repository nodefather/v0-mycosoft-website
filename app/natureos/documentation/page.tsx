import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocumentationPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="API Documentation" text="Your guide to integrating with the Mycosoft ecosystem." />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Getting Started</CardTitle>
            <CardDescription>
              Welcome to the Mycosoft API. This documentation provides all the information you need to connect your
              applications to our fungal intelligence network.
            </CardDescription>
          </CardHeader>
          <CardContent className="prose prose-stone dark:prose-invert max-w-none">
            <h3>Authentication</h3>
            <p>
              All API requests must be authenticated. Obtain your API key from the NatureOS settings panel. Include your
              API key in the `Authorization` header of your requests as a Bearer token.
            </p>
            <pre>
              <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
            </pre>
            <h3>Rate Limiting</h3>
            <p>
              Our API is rate-limited to ensure fair usage. The standard limit is 1,000 requests per minute. Check the
              `X-RateLimit-Remaining` header in the API response to see your remaining quota.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Core Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-stone dark:prose-invert max-w-none">
            <h4>
              <code>GET /api/species/search</code>
            </h4>
            <p>Search for species by name or characteristic.</p>
            <p>Query Parameters:</p>
            <ul>
              <li>
                <code>q</code> (string, required): The search term.
              </li>
              <li>
                <code>limit</code> (int, optional): Number of results to return. Default is 20.
              </li>
            </ul>
            <h4>
              <code>GET /api/species/{"{id}"}</code>
            </h4>
            <p>Retrieve detailed information for a single species by its Mycosoft ID.</p>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
