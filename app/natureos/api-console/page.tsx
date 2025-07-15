"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { ApiDocs } from "@/components/natureos/api-docs"

export default function ApiConsolePage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="API Console" text="Interact with the Mycosoft API in real-time." />
      <ApiDocs />
    </DashboardShell>
  )
}
