"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import { gsap } from "gsap"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, Zap, Leaf, Bug, GitBranch } from "lucide-react"

interface Node {
  id: string
  name: string
  children?: Node[]
  distance?: number
  position?: THREE.Vector3
  object?: THREE.Object3D
  interactions?: { type: "symbiotic" | "parasitic" | "commensal"; with: string; description: string }[]
}

const mockInteractions: { [key: string]: Node["interactions"] } = {
  "Amanita muscaria": [
    {
      type: "symbiotic",
      with: "Birch Tree",
      description: "Forms ectomycorrhizal associations with roots, aiding nutrient uptake.",
    },
    { type: "parasitic", with: "Insects", description: "Can be toxic to flies that consume it." },
  ],
  "Agaricus bisporus": [
    {
      type: "commensal",
      with: "Compost Bacteria",
      description: "Grows on compost heaps, breaking down organic matter.",
    },
  ],
}

export default function PhylogenyVisualization({ rootSpeciesId }: { rootSpeciesId: number }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const sceneRef = useRef<any>(null)

  const fetchData = useCallback(async (rootId: number) => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`/api/ancestry/tree/${rootId}`)
      if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
      const data = await response.json()
      // Add mock interactions for demo purposes
      const addInteractions = (node: Node) => {
        if (mockInteractions[node.name]) {
          node.interactions = mockInteractions[node.name]
        }
        if (node.children) {
          node.children.forEach(addInteractions)
        }
      }
      addInteractions(data)
      return data
    } catch (err: any) {
      console.error("Error fetching tree data:", err)
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
    scene.background = new THREE.Color(0x111827) // gray-900

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000)
    camera.position.z = 25

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(container.clientWidth, container.clientHeight)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)

    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(container.clientWidth, container.clientHeight)
    labelRenderer.domElement.style.position = "absolute"
    labelRenderer.domElement.style.top = "0px"
    container.appendChild(labelRenderer.domElement)

    const controls = new OrbitControls(camera, labelRenderer.domElement)
    controls.enableDamping = true
    controls.minDistance = 5
    controls.maxDistance = 100

    scene.add(new THREE.AmbientLight(0xcccccc, 0.5))
    const dirLight = new THREE.DirectionalLight(0xffffff, 1)
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
      container.innerHTML = ""
    }
  }, [])

  const handleNodeClick = useCallback((node: Node) => {
    setSelectedNode(node)
    if (sceneRef.current && node.position) {
      const { camera, controls } = sceneRef.current
      const targetPosition = node.position.clone()
      gsap.to(camera.position, {
        duration: 1,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z + 10,
        ease: "power2.inOut",
      })
      gsap.to(controls.target, {
        duration: 1,
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        ease: "power2.inOut",
      })
    }
  }, [])

  const createTree = useCallback(
    (treeData: Node) => {
      if (!sceneRef.current) return
      const { scene } = sceneRef.current
      // Clear previous tree
      while (scene.children.length > 0) {
        scene.remove(scene.children[0])
      }
      scene.add(new THREE.AmbientLight(0xcccccc, 0.5))
      const dirLight = new THREE.DirectionalLight(0xffffff, 1)
      dirLight.position.set(5, 5, 5)
      scene.add(dirLight)

      const nodes: Node[] = []
      const lines: THREE.Line[] = []

      function traverse(node: Node, depth = 0, parentPos: THREE.Vector3 | null = null) {
        const position = new THREE.Vector3(
          (Math.random() - 0.5) * depth * 10,
          (Math.random() - 0.5) * depth * 10,
          -depth * 10,
        )
        node.position = position
        nodes.push(node)

        if (parentPos) {
          const points = [parentPos, position]
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          const material = new THREE.LineBasicMaterial({ color: 0x4b5563, transparent: true, opacity: 0.5 })
          lines.push(new THREE.Line(geometry, material))
        }

        if (node.children) {
          node.children.forEach((child) => traverse(child, depth + 1, position))
        }
      }
      traverse(treeData)

      nodes.forEach((node) => {
        const isLeaf = !node.children || node.children.length === 0
        const geometry = new THREE.SphereGeometry(isLeaf ? 0.4 : 0.6, 32, 32)
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
        labelDiv.className = "text-white text-xs bg-gray-800/50 px-2 py-1 rounded-md pointer-events-none"
        labelDiv.textContent = node.name
        const label = new CSS2DObject(labelDiv)
        label.position.copy(node.position!)
        label.position.y += 1
        scene.add(label)
      })

      lines.forEach((line) => scene.add(line))

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
      if (data && sceneRef.current) {
        createTree(data)
      }
    })
  }, [rootSpeciesId, fetchData, createTree])

  return (
    <div className="w-full h-full relative">
      <div ref={containerRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-gray-900/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {error && (
        <div className="absolute top-4 left-4 bg-red-500/20 text-white p-4 rounded-lg">
          <p>Error: {error}</p>
        </div>
      )}
      {selectedNode && (
        <Card className="absolute top-4 right-4 w-80 bg-gray-800/80 backdrop-blur-sm border-gray-700 text-white">
          <CardHeader className="flex flex-row items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-lg">{selectedNode.name}</CardTitle>
              <p className="text-xs text-gray-400">{selectedNode.id}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white"
              onClick={() => setSelectedNode(null)}
            >
              <X className="h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            <h4 className="font-semibold text-sm mb-2 flex items-center">
              <GitBranch className="h-4 w-4 mr-2" />
              Interactions
            </h4>
            {selectedNode.interactions && selectedNode.interactions.length > 0 ? (
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
          </CardContent>
        </Card>
      )}
    </div>
  )
}
