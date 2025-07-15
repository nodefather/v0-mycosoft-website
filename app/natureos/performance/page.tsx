import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { PerformanceCharts } from "@/components/natureos/performance-charts"

export default function PerformancePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Performance" text="Monitor real-time system performance and energy consumption." />
      <div className="grid gap-6">
        <PerformanceCharts />
      </div>
    </DashboardShell>
  )
}
