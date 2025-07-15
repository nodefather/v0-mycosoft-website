"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Network, Activity, Zap, LineChart, Globe } from "lucide-react"
import { useEffect, useState } from "react"
import dynamic from "next/dynamic"
import type { CircularProgressProps } from "@/components/dashboard/circular-progress"
import { NetworkGraph } from "@/components/natureos/network-graph"
import type { Node, Edge } from "reactflow"

const CircularProgressComponent = dynamic<CircularProgressProps>(
  () => import("@/components/dashboard/circular-progress").then((mod) => mod.CircularProgress),
  {
    ssr: false,
    loading: () => <p>Loading circular progress...</p>,
  },
)

export default function MyceliumNetworkPage() {
  const [isClient, setIsClient] = useState(false)
  const [nodes, setNodes] = useState<Node[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsClient(true)
    fetch("/api/natureos/mycelium-network")
      .then((res) => res.json())
      .then((data) => {
        setNodes(data.nodes)
        setEdges(data.edges)
        setIsLoading(false)
      })
  }, [])

  if (!isClient) {
    return null
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Mycelium Network" text="Visualize the real-time topology of your fungal network." />
      <div className="grid gap-5">
        <Tabs defaultValue="overview" className="space-y-5">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="health">Network Health</TabsTrigger>
            <TabsTrigger value="signals">Signal Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              <Card className="col-span-2">
                <CardHeader>
                  <CardTitle>Mycelium Network Status</CardTitle>
                  <CardDescription>Real-time fungal network activity</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] rounded-md border bg-muted/50 flex items-center justify-center">
                    <div className="text-center">
                      <Network className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Mycelium Network Visualization</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Network Health</CardTitle>
                  <CardDescription>Fungal intelligence metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Signal Strength</p>
                        <p className="text-sm text-muted-foreground">87% optimal</p>
                      </div>
                    </div>
                    <Progress value={87} />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Growth Rate</p>
                        <p className="text-sm text-muted-foreground">23% above baseline</p>
                      </div>
                    </div>
                    <Progress value={78} />

                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-sm font-medium leading-none">Nutrient Flow</p>
                        <p className="text-sm text-muted-foreground">Optimal distribution</p>
                      </div>
                    </div>
                    <Progress value={92} />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Mycelium Density</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1.87 g/cm³</div>
                  <p className="text-xs text-muted-foreground">+0.12 from last week</p>
                  <div className="mt-4 h-[60px]">
                    <div className="h-full w-full rounded-md bg-muted/50"></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Network Connections</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">12,543</div>
                  <p className="text-xs text-muted-foreground">+2,345 from last week</p>
                  <div className="mt-4 h-[60px]">
                    <div className="h-full w-full rounded-md bg-muted/50"></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Signal Propagation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">3.2 cm/s</div>
                  <p className="text-xs text-muted-foreground">+0.5 from baseline</p>
                  <div className="mt-4 h-[60px]">
                    <div className="h-full w-full rounded-md bg-muted/50"></div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Bioelectric Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">78 mV</div>
                  <p className="text-xs text-muted-foreground">+12 from baseline</p>
                  <div className="mt-4 h-[60px]">
                    <div className="h-full w-full rounded-md bg-muted/50"></div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Live Network Graph</CardTitle>
                <CardDescription>
                  This graph shows the active nodes and connections in your Mycosoft network. Drag nodes to rearrange
                  the layout.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="h-[500px] w-full flex items-center justify-center bg-muted rounded-lg">
                    <p>Loading network data...</p>
                  </div>
                ) : (
                  <NetworkGraph initialNodes={nodes} initialEdges={edges} />
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Connection Map</CardTitle>
                  <CardDescription>Geographical distribution of network nodes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] rounded-md border bg-muted/50 flex items-center justify-center">
                    <div className="text-center">
                      <Globe className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                      <p className="text-muted-foreground">Global Connection Map</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
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
          </TabsContent>

          <TabsContent value="health" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Network Health Dashboard</CardTitle>
                <CardDescription>Comprehensive health metrics for your mycelium network</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] rounded-md border bg-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <Activity className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Network Health Visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="signals" className="space-y-5">
            <Card>
              <CardHeader>
                <CardTitle>Signal Analysis</CardTitle>
                <CardDescription>Advanced analysis of mycelial network communication</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[500px] rounded-md border bg-muted/50 flex items-center justify-center">
                  <div className="text-center">
                    <Zap className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                    <p className="text-muted-foreground">Signal Analysis Dashboard</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardShell>
  )
}
