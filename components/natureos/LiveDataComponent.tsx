"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function LiveDataComponent() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/dashboard")
        if (!response.ok) {
          throw new Error("Failed to fetch live data")
        }
        const result = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const interval = setInterval(fetchData, 5000) // Refresh every 5 seconds

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Network Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Loading live data...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Live Network Status</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Live Network Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <h3 className="font-semibold">Network Health</h3>
            <p>
              Status: <Badge>{data.networkHealth.status}</Badge>
            </p>
            <p>Connections: {data.networkHealth.connections}</p>
            <p>Throughput: {data.networkHealth.throughput}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.1 } }}>
            <h3 className="font-semibold">Live Readings</h3>
            {data.liveData.readings.map((reading: any, index: number) => (
              <div key={index}>
                {reading.device}: {reading.value}
              </div>
            ))}
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.2 } }}>
            <h3 className="font-semibold">Trending Compounds</h3>
            <ul>
              {data.insights.trendingCompounds.map((compound: string, index: number) => (
                <li key={index}>{compound}</li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { delay: 0.3 } }}>
            <h3 className="font-semibold">Recent Discoveries</h3>
            <ul>
              {data.insights.recentDiscoveries.map((discovery: string, index: number) => (
                <li key={index}>{discovery}</li>
              ))}
            </ul>
          </motion.div>
        </div>
      </CardContent>
    </Card>
  )
}
