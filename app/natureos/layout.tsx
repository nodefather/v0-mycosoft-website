import type React from "react"
import { DashboardNav } from "@/components/dashboard/nav"
import { TopNav } from "@/components/dashboard/top-nav"
import { SidebarProvider, Sidebar, SidebarContent, SidebarTrigger } from "@/components/ui/sidebar"

export default function NatureOSLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-[#0A1929] text-white">
      <TopNav />
      <SidebarProvider defaultOpen={false}>
        <div className="flex flex-1 h-[calc(100vh-3.5rem)]">
          <Sidebar className="border-r border-gray-800 md:sticky md:top-14 h-full">
            <div className="flex items-center justify-between p-2">
              <span className="font-semibold text-sm hidden md:block">Navigation</span>
              <SidebarTrigger />
            </div>
            <SidebarContent className="h-full">
              <div className="overflow-y-auto h-full">
                <DashboardNav />
              </div>
            </SidebarContent>
          </Sidebar>
          <div className="flex-1 overflow-auto">
            <main className="w-full">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </div>
  )
}
