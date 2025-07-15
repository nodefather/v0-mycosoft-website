"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { AncestryTabs } from "@/components/ancestry/ancestry-tabs"
import { useSearchParams } from "next/navigation"

export default function AncestryPageWrapper() {
  const searchParams = useSearchParams()
  const defaultTab = searchParams.get("tab") || "overview"

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Ancestry Database"
        text="Explore fungal genealogy, relationships, and biological data."
      />
      <div className="mt-4">
        <AncestryTabs defaultTab={defaultTab} />
      </div>
    </DashboardShell>
  )
}
