"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import { gsap } from "gsap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { X, Zap, Leaf, Bug, GitBranch, Wand2, Info, Loader2, Search, RefreshCw, Eye, EyeOff } from "lucide-react"
import Image from "next/image"
import { useCompletion } from "ai/react"

// Interfaces and Mocks
interface Node {
  id: string
  name: string
  children?: Node[]
  image_url?: string
  position?: THREE.Vector3
  object?: THREE.Object3D
  labelObject?: CSS2DObject
  interactions?: { type: "symbiotic" | "parasitic" | "commensal"; with: string; description: string }[]
}
const mockInteractions: { [key: string]: Node["interactions"] } = {
  "Amanita muscaria": [
    { type: "symbiotic", with: "Birch Tree", description: "Forms ectomycorrhizal associations with roots." },
    { type: "parasitic", with: "Insects", description: "Can be toxic to flies that consume it." },
  ],
  "Agaricus bisporus": [{ type: "commensal", with: "Compost Bacteria", description: "Grows on compost heaps." }],
}

// Helper Components
const ControlPanel = ({
  onReset,
  onToggleLabels,
  onSearch,
}: { onReset: () => void; onToggleLabels: (visible: boolean) => void; onSearch: (query: string) => void }) => {
  const [labelsVisible, setLabelsVisible] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")

  const handleToggle = () => {
    const newVisibility = !labelsVisible
    setLabelsVisible(newVisibility)
    onToggleLabels(newVisibility)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch(searchQuery)
  }

  return (
    <div className="absolute top-4 left-4 bg-gray-800/50 backdrop-blur-sm border border-gray-700 p-2 rounded-lg flex items-center gap-2 z-10">
      <Button variant="ghost" size="icon" onClick={onReset} title="Reset View">
        <RefreshCw className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" onClick={handleToggle} title="Toggle Labels">
        {labelsVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
      <form onSubmit={handleSearch} className="flex items-center gap-1">
        <Input
          placeholder="Search species..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-8 text-xs bg-gray-900/80 border-gray-600"
        />
        <Button variant="ghost" size="icon" type="submit" title="Search">
          <Search className="h-4 w-4" />
        </Button>
      </form>
    </div>
  )
}

const SpeciesDetailPanel = ({ node, onClose }: { node: Node; onClose: () => void }) => {
  const [aiModel, setAiModel] = useState("openai")
  const {
    completion,
    isLoading: isAiLoading,
    handleSubmit,
  } = useCompletion({
    api: "/api/ai/ancestry-insights",
    body: { model: aiModel },
  })

  const handleGenerateInsights = () => {
    const e = new Event("submit", { bubbles: true, cancelable: true })
    const form = document.createElement("form")
    const input = document.createElement("input")
    input.name = "prompt"
    input.value = node.name
    form.appendChild(input)
    form.addEventListener("submit", handleSubmit)
    form.dispatchEvent(e)
  }

  return (
    <Card className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] flex flex-col bg-gray-800/80 backdrop-blur-sm border-gray-700 text-white z-10">
      <CardHeader className="flex flex-row items-start justify-between pb-2">
        <div className="space-y-1.5">
          <CardTitle className="text-xl">{node.name}</CardTitle>
          <CardDescription className="text-gray-400">ID: {node.id}</CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white -mt-2 -mr-2" onClick={onClose}>
          <X className="h-5 w-5" />
        </Button>
      </CardHeader>
      <CardContent className="flex-grow overflow-y-auto space-y-4">
        <div className="relative h-40 w-full rounded-md overflow-hidden bg-gray-700">
          <Image
            src={node.image_url || `/placeholder.svg?height=160&width=350&query=${node.name.replace(/\s/g, "+")}`}
            alt={`Image of ${node.name}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center">
            <GitBranch className="h-4 w-4 mr-2 text-blue-400" />
            Known Interactions
          </h4>
          {node.interactions?.length > 0 ? (
            <ul className="space-y-2">
              {node.interactions.map((interaction, i) => (
                <li key={i} className="text-xs p-2 bg-gray-700/50 rounded-md">
                  <p className="font-bold flex items-center">
                    {interaction.type === "symbiotic" && <Leaf className="h-3 w-3 mr-1 text-green-400" />}
                    {interaction.type === "parasitic" && <Bug className="h-3 w-3 mr-1 text-red-400" />}
                    {interaction.type === "commensal" && <Zap className="h-3 w-3 mr-1 text-yellow-400" />}
                    {interaction.with} ({interaction.type})
                  </p>
                  <p className="text-gray-300">{interaction.description}</p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-400">No interaction data available.</p>
          )}
        </div>
        <div>
          <h4 className="font-semibold text-sm mb-2 flex items-center">
            <Wand2 className="h-4 w-4 mr-2 text-purple-400" />
            AI-Generated Insights
          </h4>
          <div
            className="text-xs text-gray-300 bg-gray-900/50 p-3 rounded-md min-h-[80px] prose prose-sm prose-invert max-w-none"
            dangerouslySetInnerHTML={{
              __html:
                completion ||
                "<p class='text-gray-400 italic'>Select a model and click Generate to learn about this species.</p>",
            }}
          />
          <div className="flex gap-2 mt-2">
            <Select value={aiModel} onValueChange={setAiModel}>
              <SelectTrigger className="w-full bg-gray-700 border-gray-600">
                <SelectValue placeholder="Select AI Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">GPT-4o</SelectItem>
                <SelectItem value="grok">Grok (Llama 3)</SelectItem>
              </SelectContent>
            </Select>
            <Button size="sm" onClick={handleGenerateInsights} disabled={isAiLoading} className="w-full">
              {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
              {isAiLoading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Visualization Component
export default function PhylogenyVisualization({ rootSpeciesId }: { rootSpeciesId: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const sceneRef = useRef<any>(null)
  const allNodesRef = useRef<Node[]>([])

  const fetchData = useCallback(async (rootId: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/ancestry/tree/${rootId}`)
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
      const data = await response.json()
      const addInteractions = (node: Node) => {
        if (mockInteractions[node.name]) node.interactions = mockInteractions[node.name]
        if (node.children) node.children.forEach(addInteractions)
      }
      addInteractions(data)
      return data
    } catch (err: any) {
      setError(err.message || "Failed to fetch tree data.")
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const focusOnNode = useCallback((node: Node) => {
    if (sceneRef.current && node.position) {
      const { camera, controls } = sceneRef.current
      const targetPosition = node.position.clone()
      gsap.to(camera.position, {
        duration: 1.2,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z + 15,
        ease: "power3.inOut",
      })
      gsap.to(controls.target, {
        duration: 1.2,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        ease: "power3.inOut",
      })
    }
  }, [])

  const handleNodeClick = useCallback(
    (node: Node) => {
      setSelectedNode(node)
      focusOnNode(node)
    },
    [focusOnNode],
  )

  const createTree = useCallback(
    (treeData: Node) => {
      if (!sceneRef.current) return
      const { scene, camera } = sceneRef.current
      while (scene.children.length > 0) scene.remove(scene.children[0])
      scene.add(new THREE.AmbientLight(0xcccccc, 0.8))
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
      dirLight.position.set(10, 10, 10)
      scene.add(dirLight)

      const nodes: Node[] = []
      const lines: THREE.Line[] = []
      const textureLoader = new THREE.TextureLoader()

      function traverse(node: Node, depth = 0, parentPos: THREE.Vector3 | null = null, angle = 0, radius = 0) {
        const position = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, -depth * 12)
        node.position = position
        nodes.push(node)
        if (parentPos) {
          const points = [parentPos, position]
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const material = new THREE.LineBasicMaterial({ color: 0x4b5563, transparent: true, opacity: 0.6 })
          lines.push(new THREE.Line(geometry, material))
        }
        if (node.children) {
          const angleStep = (Math.PI * 1.8) / (node.children.length > 1 ? node.children.length - 1 : 1) - Math.PI * 0.9
          node.children.forEach((child, i) =>
            traverse(child, depth + 1, position, angle + i * angleStep, depth * 6 + 8),
          )
        }
      }
      traverse(treeData)
      allNodesRef.current = nodes

      nodes.forEach((node) => {
        const isLeaf = !node.children || node.children.length === 0
        const imageUrl = node.image_url || `/placeholder.svg?height=64&width=64&query=${node.name.replace(/\s/g, "+")}`
        const map = textureLoader.load(imageUrl)
        const material = new THREE.SpriteMaterial({ map: map, color: 0xffffff, fog: true })
        const sprite = new THREE.Sprite(material)
        sprite.scale.set(isLeaf ? 1.5 : 1, isLeaf ? 1.5 : 1, 1)
        sprite.position.copy(node.position!)
        sprite.userData = { node }
        scene.add(sprite)
        node.object = sprite

        const labelDiv = document.createElement("div")
        labelDiv.className = "text-white text-xs bg-gray-900/60 px-2 py-1 rounded-md pointer-events-none select-none"
        labelDiv.textContent = node.name
        const label = new CSS2DObject(labelDiv)
        label.position.copy(node.position!)
        label.position.y += 1.2
        scene.add(label)
        node.labelObject = label
      })
      lines.forEach((line) => scene.add(line))
      gsap.from(camera.position, { duration: 2, z: 200, ease: "power3.out" })

      const raycaster = new THREE.Raycaster()
      const mouse = new THREE.Vector2()
      const onClick = (event: MouseEvent) => {
        if (!containerRef.current) return
        const rect = containerRef.current.getBoundingClientRect()
        mouse.x = ((event.clientX - rect.left) / containerRef.current.clientWidth) * 2 - 1
        mouse.y = -((event.clientY - rect.top) / containerRef.current.clientHeight) * 2 + 1
        raycaster.setFromCamera(mouse, sceneRef.current.camera)
        const intersects = raycaster.intersectObjects(scene.children)
        for (const intersect of intersects) {
          if (intersect.object.userData.node) {
            handleNodeClick(intersect.object.userData.node)
            return
          }
        }
      }
      containerRef.current.addEventListener("click", onClick)
      return () => containerRef.current?.removeEventListener("click", onClick)
    },
    [handleNodeClick],
  )

  const createScene = useCallback(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111827)
    scene.fog = new THREE.Fog(0x111827, 50, 150)
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 100
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(container.clientWidth, container.clientHeight)
    labelRenderer.domElement.style.position = "absolute"
    labelRenderer.domElement.style.top = "0px"
    labelRenderer.domElement.style.pointerEvents = "none"
    container.appendChild(labelRenderer.domElement)
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.minDistance = 5
    controls.maxDistance = 120
    sceneRef.current = { scene, camera, renderer, labelRenderer, controls, initialCameraPos: camera.position.clone() }
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
    animate()
    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(container.clientWidth, container.clientHeight)
      labelRenderer.setSize(container.clientWidth, container.clientHeight)
    }
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (container) container.innerHTML = ""
    }
  }, [])

  useEffect(() => {
    const cleanupScene = createScene()
    fetchData(rootSpeciesId).then((data) => {
      if (data && sceneRef.current) createTree(data)
    })
    return cleanupScene
  }, [rootSpeciesId, createScene, fetchData, createTree])

  // Control Panel Handlers
  const handleResetView = () => {
    if (!sceneRef.current) return
    const { camera, controls, initialCameraPos } = sceneRef.current
    gsap.to(camera.position, {
      duration: 1,
      x: initialCameraPos.x,
      y: initialCameraPos.y,
      z: initialCameraPos.z,
      ease: "power3.inOut",
    })
    gsap.to(controls.target, { duration: 1, x: 0, y: 0, z: 0, ease: "power3.inOut" })
  }
  const handleToggleLabels = (visible: boolean) => {
    allNodesRef.current.forEach((node) => {
      if (node.labelObject) node.labelObject.visible = visible
    })
  }
  const handleSearch = (query: string) => {
    const targetNode = allNodesRef.current.find((node) => node.name.toLowerCase().includes(query.toLowerCase()))
    if (targetNode) {
      handleNodeClick(targetNode)
    } else {
      // Maybe show a toast notification
      console.log("Species not found in current tree")
    }
  }

  return (
    <div className="w-full h-full relative">
      <ControlPanel onReset={handleResetView} onToggleLabels={handleToggleLabels} onSearch={handleSearch} />
      <div ref={containerRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-900/70 z-20">
          <div className="text-center text-white">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4" />
            <p>Building Phylogenetic Tree...</p>
          </div>
        </div>
      )}
      {error && (
        <div className="absolute top-20 left-4 bg-red-500/20 text-white p-4 rounded-lg z-20">
          <p>Error: {error}</p>
        </div>
      )}
      {showInstructions && (
        <Alert className="absolute bottom-4 left-4 max-w-md bg-gray-800/80 backdrop-blur-sm border-gray-700 text-white z-10">
          <Info className="h-4 w-4" />
          <AlertTitle>Controls</AlertTitle>
          <AlertDescription>Click & Drag to rotate. Scroll to zoom. Click any node to view details.</AlertDescription>
          <button onClick={() => setShowInstructions(false)} className="absolute top-2 right-2 p-1">
            <X className="h-4 w-4" />
          </button>
        </Alert>
      )}
      {selectedNode && <SpeciesDetailPanel node={selectedNode} onClose={() => setSelectedNode(null)} />}
    </div>
  )
}
