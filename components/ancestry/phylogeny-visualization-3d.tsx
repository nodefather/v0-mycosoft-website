"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import { gsap } from "gsap"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { X, Zap, Leaf, Bug, GitBranch, Wand2, Info, Loader2 } from "lucide-react"
import Image from "next/image"
import { useCompletion } from "ai/react"

interface Node {
  id: string
  name: string
  children?: Node[]
  distance?: number
  position?: THREE.Vector3
  object?: THREE.Object3D
  image_url?: string
  interactions?: { type: "symbiotic" | "parasitic" | "commensal"; with: string; description: string }[]
}

const mockInteractions: { [key: string]: Node["interactions"] } = {
  "Amanita muscaria": [
    { type: "symbiotic", with: "Birch Tree", description: "Forms ectomycorrhizal associations with roots." },
    { type: "parasitic", with: "Insects", description: "Can be toxic to flies that consume it." },
  ],
  "Agaricus bisporus": [{ type: "commensal", with: "Compost Bacteria", description: "Grows on compost heaps." }],
}

export default function PhylogenyVisualization({ rootSpeciesId }: { rootSpeciesId: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const sceneRef = useRef<any>(null)

  const {
    completion,
    isLoading: isAiLoading,
    handleSubmit,
  } = useCompletion({
    api: "/api/ai/ancestry-insights",
  })

  const handleGenerateInsights = () => {
    if (!selectedNode) return
    const e = new Event("submit", { bubbles: true, cancelable: true })
    const form = document.createElement("form")
    const input = document.createElement("input")
    input.name = "prompt"
    input.value = selectedNode.name
    form.appendChild(input)
    form.addEventListener("submit", handleSubmit)
    form.dispatchEvent(e)
  }

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

  const createScene = useCallback(() => {
    if (!containerRef.current) return
    const container = containerRef.current
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0x111827)
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 50
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
    scene.add(new THREE.AmbientLight(0xcccccc, 0.8))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
    dirLight.position.set(5, 5, 5)
    scene.add(dirLight)
    sceneRef.current = { scene, camera, renderer, labelRenderer, controls }
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

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node)
    if (sceneRef.current && node.position) {
      const { camera, controls } = sceneRef.current
      const targetPosition = node.position.clone()
      gsap.to(camera.position, {
        duration: 1.2,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z + 12,
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

  const createTree = useCallback(
    (treeData: Node) => {
      if (!sceneRef.current) return
      const { scene, camera } = sceneRef.current
      while (scene.children.length > 0) scene.remove(scene.children[0])
      scene.add(new THREE.AmbientLight(0xcccccc, 0.8))
      const dirLight = new THREE.DirectionalLight(0xffffff, 1.5)
      dirLight.position.set(5, 5, 5)
      scene.add(dirLight)

      const nodes: Node[] = []
      const lines: THREE.Line[] = []
      function traverse(node: Node, depth = 0, parentPos: THREE.Vector3 | null = null, angle = 0, radius = 0) {
        const position = new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, -depth * 8)
        node.position = position
        nodes.push(node)
        if (parentPos) {
          const points = [parentPos, position]
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const material = new THREE.LineBasicMaterial({ color: 0x4b5563, transparent: true, opacity: 0.6 })
          lines.push(new THREE.Line(geometry, material))
        }
        if (node.children) {
          const angleStep = (2 * Math.PI) / node.children.length
          node.children.forEach((child, i) =>
            traverse(child, depth + 1, position, angle + i * angleStep, depth * 4 + 4),
          )
        }
      }
      traverse(treeData)

      nodes.forEach((node) => {
        const isLeaf = !node.children || node.children.length === 0
        const geometry = new THREE.SphereGeometry(isLeaf ? 0.3 : 0.5, 32, 32)
        const material = new THREE.MeshStandardMaterial({
          color: isLeaf ? 0x10b981 : 0x3b82f6,
          roughness: 0.4,
          metalness: 0.1,
        })
        const sphere = new THREE.Mesh(geometry, material)
        sphere.position.copy(node.position!)
        sphere.userData = { node }
        scene.add(sphere)
        node.object = sphere
        const labelDiv = document.createElement("div")
        labelDiv.className = "text-white text-xs bg-gray-900/60 px-2 py-1 rounded-md pointer-events-none select-none"
        labelDiv.textContent = node.name
        const label = new CSS2DObject(labelDiv)
        label.position.copy(node.position!)
        label.position.y += 1
        scene.add(label)
      })
      lines.forEach((line) => scene.add(line))
      gsap.from(camera.position, { duration: 2, z: 150, ease: "power3.out" })

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

  useEffect(() => {
    const cleanupScene = createScene()
    return cleanupScene
  }, [createScene])

  useEffect(() => {
    fetchData(rootSpeciesId).then((data) => {
      if (data && sceneRef.current) createTree(data)
    })
  }, [rootSpeciesId, fetchData, createTree])

  return (
    <div className="w-full h-full relative">
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
        <div className="absolute top-4 left-4 bg-red-500/20 text-white p-4 rounded-lg z-20">
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

      {selectedNode && (
        <Card className="absolute top-4 right-4 w-96 max-h-[calc(100%-2rem)] flex flex-col bg-gray-800/80 backdrop-blur-sm border-gray-700 text-white z-10">
          <CardHeader className="flex flex-row items-start justify-between pb-2">
            <div className="space-y-1.5">
              <CardTitle className="text-xl">{selectedNode.name}</CardTitle>
              <CardDescription className="text-gray-400">ID: {selectedNode.id}</CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white -mt-2 -mr-2"
              onClick={() => setSelectedNode(null)}
            >
              <X className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="flex-grow overflow-y-auto">
            <div className="relative h-40 w-full rounded-md overflow-hidden mb-4 bg-gray-700">
              <Image
                src={selectedNode.image_url || `/placeholder.svg?height=160&width=350&query=${selectedNode.name}`}
                alt={`Image of ${selectedNode.name}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center">
                  <GitBranch className="h-4 w-4 mr-2 text-blue-400" />
                  Known Interactions
                </h4>
                {selectedNode.interactions?.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedNode.interactions.map((interaction, i) => (
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
                <div className="text-xs text-gray-300 bg-gray-900/50 p-3 rounded-md min-h-[80px]">
                  {completion ? (
                    completion
                  ) : (
                    <p className="text-gray-400 italic">
                      Click the button below to generate insights about this species' evolutionary history and
                      ecological role.
                    </p>
                  )}
                </div>
                <Button size="sm" onClick={handleGenerateInsights} disabled={isAiLoading} className="w-full mt-2">
                  {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Wand2 className="h-4 w-4 mr-2" />}
                  {isAiLoading ? "Generating..." : "Generate Insights"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
