import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Network, Code, Bot, Database, Activity, Zap, AlertCircle, Cloud, Bug } from "lucide-react"
import dynamic from "next/dynamic"
import type { CircularProgressProps } from "@/components/dashboard/circular-progress"

const AzureMap = dynamic(() => import("@/components/maps/azure-map").then((mod) => mod.AzureMap), {
  ssr: false,
  loading: () => (
    <div className="h-[400px] w-full bg-muted rounded-md flex items-center justify-center">Loading Map...</div>
  ),
})

const CircularProgressComponent = dynamic<CircularProgressProps>(
  () => import("@/components/dashboard/circular-progress").then((mod) => mod.CircularProgress),
  {
    ssr: false,
  },
)

async function getStats() {
  // In a real app, you'd fetch from your API endpoint
  // For this example, we'll return mock data directly
  return {
    activeNodes: { value: 2350, change: 180, progress: 65 },
    apiRequests: { value: "1.2M", subValue: "23k requests/min", progress: 78 },
    aiOperations: { value: "845k", subValue: "98.2% success rate", progress: 98 },
    storageUsed: { value: "1.8TB", subValue: "of 2.5TB total", progress: 72 },
  }
}

export default async function NatureOSPage() {
  const stats = await getStats()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="NatureOS Dashboard"
        text="Your central hub for fungal intelligence and data analysis."
      />
      <div className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
              <Network className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeNodes.value.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+{stats.activeNodes.change} from last hour</p>
              <Progress value={stats.activeNodes.progress} className="mt-4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">API Requests</CardTitle>
              <Code className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.apiRequests.value}</div>
              <p className="text-xs text-muted-foreground">{stats.apiRequests.subValue}</p>
              <Progress value={stats.apiRequests.progress} className="mt-4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Operations</CardTitle>
              <Bot className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.aiOperations.value}</div>
              <p className="text-xs text-muted-foreground">{stats.aiOperations.subValue}</p>
              <Progress value={stats.aiOperations.progress} className="mt-4" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
              <Database className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.storageUsed.value}</div>
              <p className="text-xs text-muted-foreground">{stats.storageUsed.subValue}</p>
              <Progress value={stats.storageUsed.progress} className="mt-4" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-full lg:col-span-4">
            <CardHeader>
              <CardTitle>Global Mycelium Network</CardTitle>
              <CardDescription>Live view of connected fungal intelligence nodes worldwide.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[400px]">
                <AzureMap
                  className="rounded-b-lg border-0"
                  deviceLocations={[
                    { id: "device-1", name: "Mushroom 1 - SF", location: [-122.4194, 37.7749], status: "active" },
                    { id: "device-2", name: "SporeBase - NYC", location: [-74.006, 40.7128], status: "active" },
                    { id: "device-4", name: "Mushroom 1 - London", location: [-0.1278, 51.5074], status: "active" },
                    { id: "device-5", name: "SporeBase - Tokyo", location: [139.6503, 35.6762], status: "active" },
                  ]}
                />
              </div>
            </CardContent>
          </Card>
          <Card className="col-span-full lg:col-span-3">
            <CardHeader>
              <CardTitle>System Metrics</CardTitle>
              <CardDescription>Real-time performance indicators.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <CircularProgressComponent value={78} icon={Activity} label="Growth Rate" />
                <CircularProgressComponent value={92} icon={Network} label="Network Health" />
                <CircularProgressComponent value={81} icon={Bot} label="AI Confidence" />
                <CircularProgressComponent value={45} icon={Zap} label="Energy Usage" />
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest system events and alerts from your network.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: Bot, text: "AI Model 'MycoGPT-4o' training completed", time: "2m ago", status: "success" },
                {
                  icon: AlertCircle,
                  text: "High network load detected in EU-Central-1",
                  time: "5m ago",
                  status: "warning",
                },
                {
                  icon: Cloud,
                  text: "New node cluster 'Aspergillus-3' deployed successfully",
                  time: "15m ago",
                  status: "success",
                },
                {
                  icon: Database,
                  text: "Database backup 'species_db_20250714.bak' completed",
                  time: "1h ago",
                  status: "success",
                },
                {
                  icon: Bug,
                  text: "Anomaly detected in TruffleBot sensor readings",
                  time: "2h ago",
                  status: "warning",
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div
                    className={`p-2 rounded-full ${item.status === "success" ? "bg-green-500/20" : "bg-yellow-500/20"}`}
                  >
                    <item.icon
                      className={`h-4 w-4 ${item.status === "success" ? "text-green-500" : "text-yellow-500"}`}
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm">{item.text}</p>
                    <p className="text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full bg-transparent">
              View All Activity
            </Button>
          </CardFooter>
        </Card>
      </div>
    </DashboardShell>
  )
}
