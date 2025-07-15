"use client"

import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useEffect, useState } from "react"

type TrendData = {
  networkGrowth: { name: string; total: number }[]
  speciesDistribution: { name: string; value: number; fill: string }[]
}

export default function AnalyticsPage() {
  const [trends, setTrends] = useState<TrendData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetch("/api/natureos/analytics-trends")
      .then((res) => res.json())
      .then((data) => {
        setTrends(data)
        setIsLoading(false)
      })
  }, [])

  if (isLoading) {
    return (
      <DashboardShell>
        <DashboardHeader heading="Analytics" text="Loading analytics data..." />
        <div className="h-[600px] w-full flex items-center justify-center bg-muted rounded-lg">
          <p>Loading charts...</p>
        </div>
      </DashboardShell>
    )
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Analytics" text="Deep dive into your network's performance and data trends." />
      <div className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Network Growth</CardTitle>
            <CardDescription>Node count over the last 6 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={trends?.networkGrowth}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#8884d8" name="Active Nodes" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Species Distribution</CardTitle>
            <CardDescription>Breakdown of detected species by phylum.</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={trends?.speciesDistribution}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {trends?.speciesDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
