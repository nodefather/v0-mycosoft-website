"use client"
import { CardDescription } from "@/components/ui/card"
import { useState } from "react"
import {
  Activity,
  AlertCircle,
  BarChart3,
  Bot,
  Bug,
  Cloud,
  Code,
  Database,
  Globe,
  LineChart,
  Microscope,
  MouseIcon,
  Network,
  PipetteIcon,
  Plus,
  Settings,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import dynamic from "next/dynamic"
import type { CircularProgressProps } from "@/components/dashboard/circular-progress"
import type { OverviewStats } from "@/types/natureos"
import Link from "next/link"

const AzureMap = dynamic(() => import("@/components/maps/azure-map").then((mod) => mod.AzureMap), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted/50 flex items-center justify-center">
      <p>Loading map...</p>
    </div>
  ),
})

const CircularProgressComponent = dynamic<CircularProgressProps>(
  () => import("@/components/dashboard/circular-progress").then((mod) => mod.CircularProgress),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full bg-muted/50 flex items-center justify-center">
        <p>Loading...</p>
      </div>
    ),
  },
)

interface NatureOSDashboardProps {
  initialStats: OverviewStats
}

export function NatureOSDashboard({ initialStats }: NatureOSDashboardProps) {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex flex-col gap-5 w-full">
      <Tabs defaultValue="overview" className="space-y-5 w-full" onValueChange={setActiveTab}>
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <TabsList className="w-full sm:w-auto">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="mycelium">Mycelium Network</TabsTrigger>
            <TabsTrigger value="devices">Devices</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Link href="/natureos/settings">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </Button>
            </Link>
            <Link href="/natureos/new-project">
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        <TabsContent value="overview" className="space-y-5">
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Nodes</CardTitle>
                <Network className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{Number(initialStats.activeNodes.value).toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">{initialStats.activeNodes.subtext}</p>
                <div className="mt-4">
                  <Progress value={initialStats.activeNodes.progress} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">API Requests</CardTitle>
                <Code className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{initialStats.apiRequests.value}</div>
                <p className="text-xs text-muted-foreground">{initialStats.apiRequests.subtext}</p>
                <div className="mt-4">
                  <Progress value={initialStats.apiRequests.progress} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Operations</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{initialStats.aiOperations.value}</div>
                <p className="text-xs text-muted-foreground">{initialStats.aiOperations.subtext}</p>
                <div className="mt-4">
                  <Progress value={initialStats.aiOperations.progress} />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
                <Database className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{initialStats.storageUsed.value}</div>
                <p className="text-xs text-muted-foreground">{initialStats.storageUsed.subtext}</p>
                <div className="mt-4">
                  <Progress value={initialStats.storageUsed.progress} />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Global Mycelium Network</CardTitle>
                <CardDescription>Live view of connected fungal intelligence nodes worldwide</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[400px]">
                  <AzureMap
                    className="rounded-none border-0"
                    deviceLocations={[
                      { id: "device-1", name: "Mushroom 1 - SF", location: [-122.4194, 37.7749], status: "active" },
                      { id: "device-2", name: "SporeBase - NYC", location: [-74.006, 40.7128], status: "active" },
                      {
                        id: "device-3",
                        name: "TruffleBot - Austin",
                        location: [-97.7431, 30.2672],
                        status: "inactive",
                      },
                      { id: "device-4", name: "Mushroom 1 - London", location: [-0.1278, 51.5074], status: "active" },
                      { id: "device-5", name: "SporeBase - Tokyo", location: [139.6503, 35.6762], status: "active" },
                      { id: "device-6", name: "MycoTenna - Berlin", location: [13.405, 52.52], status: "active" },
                      { id: "device-7", name: "ALARM - Sydney", location: [151.2093, -33.8688], status: "active" },
                    ]}
                  />
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-full lg:col-span-3">
              <CardHeader>
                <CardTitle>System Metrics</CardTitle>
                <CardDescription>Real-time performance indicators</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <CircularProgressComponent value={78} icon={LineChart} label="Growth Rate" />
                  <CircularProgressComponent value={92} icon={Network} label="Network Health" />
                  <CircularProgressComponent value={64} icon={Activity} label="Active Nodes" />
                  <CircularProgressComponent value={45} icon={Zap} label="Energy Usage" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Mycosoft Devices</CardTitle>
                <CardDescription>Status of connected hardware</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    {
                      name: "Mushroom 1",
                      count: 1245,
                      status: "Operational",
                      icon: MouseIcon,
                      href: "/natureos/devices",
                    },
                    { name: "SporeBase", count: 879, status: "Operational", icon: Database, href: "/natureos/devices" },
                    { name: "TruffleBot", count: 432, status: "Maintenance", icon: Bug, href: "/natureos/devices" },
                    { name: "ALARM", count: 2156, status: "Operational", icon: AlertCircle, href: "/natureos/devices" },
                    { name: "Petreus", count: 78, status: "Testing", icon: PipetteIcon, href: "/natureos/devices" },
                  ].map((device) => (
                    <Link
                      href={device.href}
                      key={device.name}
                      className="flex items-center hover:bg-muted/50 rounded-md p-2 -m-2 transition-colors"
                    >
                      <div className="mr-4 rounded-md bg-primary/10 p-2">
                        <device.icon className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium leading-none">{device.name}</p>
                        <p className="text-sm text-muted-foreground">{device.count} active</p>
                      </div>
                      <Badge variant={device.status === "Operational" ? "default" : "secondary"}>{device.status}</Badge>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest system events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { icon: Bot, text: "AI Model training completed", time: "2m ago", status: "success" },
                    { icon: AlertCircle, text: "High network load detected", time: "5m ago", status: "warning" },
                    { icon: Cloud, text: "New node cluster deployed", time: "15m ago", status: "success" },
                    { icon: Database, text: "Database backup completed", time: "1h ago", status: "success" },
                    { icon: Bug, text: "Anomaly detected in sector 7", time: "2h ago", status: "warning" },
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
            </Card>
            <Card className="col-span-full md:col-span-1">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Frequently used tools</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Link href="/myca-ai">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Bot className="mr-2 h-4 w-4" />
                      Launch AI Studio
                    </Button>
                  </Link>
                  <Link href="/natureos/mycelium-network">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Globe className="mr-2 h-4 w-4" />
                      View Global Network
                    </Button>
                  </Link>
                  <Link href="/natureos/documentation">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Code className="mr-2 h-4 w-4" />
                      API Documentation
                    </Button>
                  </Link>
                  <Link href="/natureos/cloud-storage">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <Cloud className="mr-2 h-4 w-4" />
                      Cloud Storage
                    </Button>
                  </Link>
                  <Link href="/natureos/apps/petri-dish-sim">
                    <Button className="w-full justify-start bg-transparent" variant="outline">
                      <PipetteIcon className="mr-2 h-4 w-4" />
                      Open Petri Simulator
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="mycelium" className="space-y-5">
          <div className="grid gap-5 md:grid-cols-1">
            <Card>
              <CardHeader>
                <CardTitle>Mycelium Network Status</CardTitle>
                <CardDescription>Real-time fungal network activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] w-full rounded-md border bg-muted/50">
                  <Link href="/natureos/mycelium-network">
                    <div className="h-full w-full flex items-center justify-center text-center hover:bg-muted transition-colors">
                      <div>
                        <Microscope className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                        <p className="text-muted-foreground">View Interactive Mycelium Network Visualization</p>
                        <Button variant="link" size="sm">
                          Launch Fullscreen
                        </Button>
                      </div>
                    </div>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-5">
          <div className="h-[500px] w-full rounded-md border bg-muted/50 flex items-center justify-center text-center">
            <Link href="/natureos/devices">
              <div>
                <MouseIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">View and manage all connected devices</p>
                <Button variant="link" size="sm">
                  Go to Devices Page
                </Button>
              </div>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-5">
          <div className="h-[500px] w-full rounded-md border bg-muted/50 flex items-center justify-center text-center">
            <Link href="/natureos/analytics">
              <div>
                <BarChart3 className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">Explore detailed system and network analytics</p>
                <Button variant="link" size="sm">
                  Go to Analytics Page
                </Button>
              </div>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
