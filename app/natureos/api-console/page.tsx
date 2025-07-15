import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { ApiConsoleClient } from "@/components/natureos/api-console-client"

export default function ApiConsolePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="API Console" text="Test and interact with the NatureOS API endpoints." />
      <div>
        <ApiConsoleClient />
      </div>
    </DashboardShell>
  )
}
