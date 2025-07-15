import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocumentationPage() {
  const id = "SPECIES_ID" // Declare the variable here

  return (
    <DashboardShell>
      <DashboardHeader
        heading="NatureOS Documentation"
        text="Find all the information you need to use the NatureOS API."
      />
      <div className="space-y-6 prose prose-invert max-w-none">
        <Card>
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              Welcome to the NatureOS API documentation. Our API provides programmatic access to the vast datasets and
              computational tools within the Mycosoft ecosystem. Whether you're fetching species data, analyzing
              mycelial network telemetry, or submitting new research, our RESTful API is designed to be predictable and
              easy to use.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Authentication</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              All API requests must be authenticated using an API key. You can generate and manage your API keys from
              the settings page. Include your API key in the `Authorization` header of your requests.
            </p>
            <pre>
              <code>{"Authorization: Bearer YOUR_API_KEY"}</code>
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Core Endpoints</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold">GET /api/species</h3>
              <p>Retrieves a paginated list of fungal species. Supports searching, sorting, and filtering.</p>
            </div>
            <div>
              <h3 className="font-semibold">GET /api/species/{id}</h3>
              <p>Retrieves detailed information for a specific species by its ID.</p>
            </div>
            <div>
              <h3 className="font-semibold">GET /api/natureos/stats</h3>
              <p>Returns real-time overview statistics for the entire NatureOS network.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
