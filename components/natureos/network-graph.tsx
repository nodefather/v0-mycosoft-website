"use client"

import { useEffect, useState, useRef } from "react"
import * as d3 from "d3"
import type { MyceliumNetworkData, NetworkNode, NetworkLink } from "@/types/natureos"
import { Loader2, AlertTriangle } from "lucide-react"

export function NetworkGraph() {
  const [data, setData] = useState<MyceliumNetworkData | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      // Use the public environment variable on the client-side
      const apiUrl = process.env.NEXT_PUBLIC_NATUREOS_API_URL
      if (!apiUrl) {
        setError("NatureOS API URL is not configured. Please set NEXT_PUBLIC_NATUREOS_API_URL.")
        setIsLoading(false)
        return
      }
      try {
        const response = await fetch(`${apiUrl}/mycelium-network`)
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.statusText}`)
        }
        const result: MyceliumNetworkData = await response.json()
        setData(result)
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred while fetching network data.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    if (isLoading || error || !data || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll("*").remove() // Clear previous render

    const width = svg.node()?.getBoundingClientRect().width || 800
    const height = svg.node()?.getBoundingClientRect().height || 600

    const simulation = d3
      .forceSimulation(data.nodes as d3.SimulationNodeDatum[])
      .force(
        "link",
        d3
          .forceLink(data.links)
          .id((d: any) => d.id)
          .distance(50),
      )
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2))

    const link = svg
      .append("g")
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .selectAll("line")
      .data(data.links)
      .join("line")
      .attr("stroke-width", (d) => Math.sqrt((d as NetworkLink).value))

    const node = svg
      .append("g")
      .attr("stroke", "#fff")
      .attr("stroke-width", 1.5)
      .selectAll("circle")
      .data(data.nodes)
      .join("circle")
      .attr("r", (d) => (d as NetworkNode).size || 5)
      .attr("fill", (d) => d3.schemeCategory10[(d as NetworkNode).group])
      .call(drag(simulation) as any)

    node.append("title").text((d) => (d as NetworkNode).id)

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => (d.source as any).x)
        .attr("y1", (d) => (d.source as any).y)
        .attr("x2", (d) => (d.target as any).x)
        .attr("y2", (d) => (d.target as any).y)

      node.attr("cx", (d) => (d as any).x).attr("cy", (d) => (d as any).y)
    })

    const zoom = d3.zoom().on("zoom", (event) => {
      svg.selectAll("g").attr("transform", event.transform)
    })
    svg.call(zoom as any)
  }, [data, isLoading, error])

  const drag = (simulation: d3.Simulation<d3.SimulationNodeDatum, undefined>) => {
    function dragstarted(event: d3.D3DragEvent<SVGCircleElement, NetworkNode, any>) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      event.subject.fx = event.subject.x
      event.subject.fy = event.subject.y
    }
    function dragged(event: d3.D3DragEvent<SVGCircleElement, NetworkNode, any>) {
      event.subject.fx = event.x
      event.subject.fy = event.y
    }
    function dragended(event: d3.D3DragEvent<SVGCircleElement, NetworkNode, any>) {
      if (!event.active) simulation.alphaTarget(0)
      event.subject.fx = null
      event.subject.fy = null
    }
    return d3.drag<SVGCircleElement, NetworkNode>().on("start", dragstarted).on("drag", dragged).on("end", dragended)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        <Loader2 className="mr-2 h-6 w-6 animate-spin" />
        <p>Loading Network Data...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-destructive">
        <AlertTriangle className="mr-2 h-6 w-6" />
        <p>Error loading network graph:</p>
        <p className="text-sm">{error}</p>
      </div>
    )
  }

  return <svg ref={svgRef} className="w-full h-full"></svg>
}
