import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BarChart2 } from "lucide-react"

export default function ReportsPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Report Generator" text="Create and export custom reports from the fungal database." />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate a New Report</CardTitle>
            <CardDescription>
              Select your criteria to generate a custom report. This feature is currently under development.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-lg">
              <div className="text-center">
                <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">Report generation tools will be available here.</p>
              </div>
            </div>
            <Button disabled>Generate Report</Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
