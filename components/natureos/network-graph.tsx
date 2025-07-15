"use client"

import { useCallback } from "react"
import ReactFlow, {
  Controls,
  Background,
  addEdge,
  type Connection,
  type Edge,
  type Node,
  useNodesState,
  useEdgesState,
} from "reactflow"
import "reactflow/dist/style.css"

interface NetworkGraphProps {
  initialNodes: Node[]
  initialEdges: Edge[]
}

export function NetworkGraph({ initialNodes, initialEdges }: NetworkGraphProps) {
  const [nodes, , onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback((params: Edge | Connection) => setEdges((els) => addEdge(params, els)), [setEdges])

  return (
    <div style={{ height: "500px", width: "100%" }} className="rounded-lg border">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Controls />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}
