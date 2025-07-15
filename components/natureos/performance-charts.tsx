"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

const mockPerformanceData = [
  { name: "10:00", cpu: 40, memory: 2400, network: 200 },
  { name: "10:05", cpu: 30, memory: 2210, network: 220 },
  { name: "10:10", cpu: 20, memory: 2290, network: 250 },
  { name: "10:15", cpu: 27, memory: 2000, network: 280 },
  { name: "10:20", cpu: 18, memory: 2181, network: 190 },
  { name: "10:25", cpu: 23, memory: 2500, network: 300 },
  { name: "10:30", cpu: 34, memory: 2100, network: 320 },
]

const mockEnergyData = [
  { name: "10:00", usage: 120, efficiency: 0.85 },
  { name: "10:05", usage: 115, efficiency: 0.88 },
  { name: "10:10", usage: 110, efficiency: 0.9 },
  { name: "10:15", usage: 125, efficiency: 0.82 },
  { name: "10:20", usage: 130, efficiency: 0.8 },
  { name: "10:25", usage: 122, efficiency: 0.86 },
  { name: "10:30", usage: 118, efficiency: 0.87 },
]

export const PerformanceCharts = () => {
  return (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>System Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockPerformanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="cpu" stroke="#8884d8" name="CPU (%)" />
              <Line type="monotone" dataKey="memory" stroke="#82ca9d" name="Memory (MB)" />
              <Line type="monotone" dataKey="network" stroke="#ffc658" name="Network (Mbps)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Energy Consumption</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={mockEnergyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Legend />
              <Line yAxisId="left" type="monotone" dataKey="usage" stroke="#8884d8" name="Usage (kWh)" />
              <Line yAxisId="right" type="monotone" dataKey="efficiency" stroke="#82ca9d" name="Efficiency" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
