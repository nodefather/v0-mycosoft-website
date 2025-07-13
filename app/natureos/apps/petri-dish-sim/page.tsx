"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Beaker, TestTube, Info } from "lucide-react"
import { DETAILED_SPECIES_DATA, type DetailedSpecies, type GrowthParameter } from "@/lib/data/detailed-species"
import { createChemicalField, diffuseAndDecay } from "@/lib/utils/chemical-field"

const RENDER_SCALE = 2
const DISH_WIDTH = 750 * RENDER_SCALE
const DISH_HEIGHT = 750 * RENDER_SCALE
const DISH_RADIUS = 375 * RENDER_SCALE

type Compound = { name: string; color: string }
type SpeciesKey = keyof typeof DETAILED_SPECIES_DATA

const agarProperties = {
  pda: { name: "Potato Dextrose Agar (PDA)", nutrientLevel: 120, leachingFactor: 0.02 },
  maltExtract: { name: "Malt Extract Agar (MEA)", nutrientLevel: 110, leachingFactor: 0.02 },
  nutrientAgar: { name: "Nutrient Agar (NA)", nutrientLevel: 100, leachingFactor: 0.03 },
  trypticSoy: { name: "Tryptic Soy Agar (TSA)", nutrientLevel: 125, leachingFactor: 0.02 },
  lb: { name: "Luria-Bertani (LB) Agar", nutrientLevel: 115, leachingFactor: 0.03 },
  waterAgar: { name: "Water Agar", nutrientLevel: 20, leachingFactor: 0.1 },
  minimal: { name: "Minimal Medium (M9) Agar", nutrientLevel: 40, leachingFactor: 0.08 },
  sabouraud: { name: "Sabouraud Dextrose Agar (SDA)", nutrientLevel: 130, leachingFactor: 0.01 },
  yepd: { name: "YEPD Agar", nutrientLevel: 140, leachingFactor: 0.01 },
  czapekDox: { name: "Czapek-Dox Agar", nutrientLevel: 90, leachingFactor: 0.04 },
  cornMeal: { name: "Corn Meal Agar", nutrientLevel: 70, leachingFactor: 0.05 },
  birdSeed: { name: "Bird Seed Agar", nutrientLevel: 85, leachingFactor: 0.04 },
  blood: { name: "Blood Agar (BAP)", nutrientLevel: 150, leachingFactor: 0.01 },
  macconkey: { name: "MacConkey Agar", nutrientLevel: 95, leachingFactor: 0.03 },
  emb: { name: "EMB Agar", nutrientLevel: 90, leachingFactor: 0.03 },
  charcoal: { name: "Charcoal Agar", nutrientLevel: 80, leachingFactor: 0.05 },
} as const
type AgarKey = keyof typeof agarProperties

export default function PetriDishSim() {
  const baseCanvasRef = useRef<HTMLCanvasElement>(null)
  const compoundCanvasRef = useRef<HTMLCanvasElement>(null)
  const organismCanvasRef = useRef<HTMLCanvasElement>(null)

  const nutrientGridRef = useRef<number[][]>([])
  const occupancyGridRef = useRef<any[][]>([])
  const compoundFieldsRef = useRef<Record<string, { grid: number[][]; color: string }>>({})
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const frameCounterRef = useRef(0)

  const [organisms, setOrganisms] = useState<any[]>([])
  const [selectedTool, setSelectedTool] = useState<"inoculate" | "contaminate" | "bioSampler">("inoculate")
  const [selectedSpecies, setSelectedSpecies] = useState<SpeciesKey>("lionsMane")
  const [selectedContaminant, setSelectedContaminant] = useState<SpeciesKey>("trichoderma")
  const [agarType, setAgarType] = useState<AgarKey>("pda")
  const [speed, setSpeed] = useState(5)
  const [pH, setPH] = useState(6.0)
  const [temperature, setTemperature] = useState(70)
  const [humidity, setHumidity] = useState(90)
  const [isRunning, setIsRunning] = useState(false)
  const [tissueSamples, setTissueSamples] = useState<any[]>([])
  const [selectedSample, setSelectedSample] = useState<any | null>(null)

  const initializeGrids = useCallback(() => {
    const nutrientLevel = agarProperties[agarType].nutrientLevel
    nutrientGridRef.current = Array.from({ length: DISH_HEIGHT }, () => Array(DISH_WIDTH).fill(nutrientLevel))
    occupancyGridRef.current = Array.from({ length: DISH_HEIGHT }, () => Array(DISH_WIDTH).fill(null))
    compoundFieldsRef.current = {}
  }, [agarType])

  const drawPlate = useCallback(() => {
    const ctx = baseCanvasRef.current?.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, DISH_WIDTH, DISH_HEIGHT)
    ctx.fillStyle = "#1a1a1a"
    ctx.fillRect(0, 0, DISH_WIDTH, DISH_HEIGHT)
    ctx.beginPath()
    ctx.arc(DISH_WIDTH / 2, DISH_HEIGHT / 2, DISH_RADIUS, 0, Math.PI * 2)
    ctx.fillStyle = "rgba(255,255,255,0.05)"
    ctx.fill()
    ctx.lineWidth = 2 * RENDER_SCALE
    ctx.strokeStyle = "rgba(255,255,255,0.5)"
    ctx.stroke()
  }, [])

  const drawCompoundFields = useCallback(() => {
    const ctx = compoundCanvasRef.current?.getContext("2d")
    if (!ctx) return
    ctx.clearRect(0, 0, DISH_WIDTH, DISH_HEIGHT)

    for (const { grid, color } of Object.values(compoundFieldsRef.current)) {
      for (let y = 0; y < DISH_HEIGHT; y += 2) {
        for (let x = 0; x < DISH_WIDTH; x += 2) {
          const concentration = grid[y][x]
          if (concentration > 1) {
            ctx.fillStyle = color
            ctx.globalAlpha = Math.min(1, concentration / 100)
            ctx.beginPath()
            ctx.arc(x, y, (concentration / 20) * RENDER_SCALE, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
    }
    ctx.globalAlpha = 1.0
  }, [])

  useEffect(() => {
    initializeGrids()
    drawPlate()
  }, [initializeGrids, drawPlate])

  const calculateGrowthFactor = (current: number, parameter: GrowthParameter) => {
    const { optimal, lethal } = parameter
    const [optimalMin, optimalMax] = optimal
    const [lethalMin, lethalMax] = lethal

    if (current >= optimalMin && current <= optimalMax) return 1.0
    if (current < lethalMin || current > lethalMax) return 0.0
    if (current < optimalMin) return (current - lethalMin) / (optimalMin - lethalMin)
    if (current > optimalMax) return (lethalMax - current) / (lethalMax - optimalMax)
    return 0
  }

  const calculateGrowthModifier = useCallback(
    (species: DetailedSpecies) => {
      const p = species.growthParameters
      const tempFactor = calculateGrowthFactor(temperature, p.temperature)
      const phFactor = calculateGrowthFactor(pH, p.ph)
      const humidityFactor = calculateGrowthFactor(humidity, p.humidity)
      const agarFactor = p.agarPreferences[agarType] ?? 0.1
      return tempFactor * phFactor * humidityFactor * agarFactor
    },
    [temperature, pH, humidity, agarType],
  )

  const growthSuitability = useMemo(() => {
    const speciesKey = selectedTool === "inoculate" ? (selectedSample?.species ?? selectedSpecies) : selectedContaminant
    const species = DETAILED_SPECIES_DATA[speciesKey]
    if (!species) return 0
    return calculateGrowthModifier(species) * 100
  }, [selectedTool, selectedSample, selectedSpecies, selectedContaminant, calculateGrowthModifier])

  const produceCompound = useCallback((compound: Compound, x: number, y: number) => {
    if (!compoundFieldsRef.current[compound.name]) {
      compoundFieldsRef.current[compound.name] = {
        grid: createChemicalField(DISH_WIDTH, DISH_HEIGHT),
        color: compound.color,
      }
    }
    const gX = Math.floor(x)
    const gY = Math.floor(y)
    if (gX >= 0 && gX < DISH_WIDTH && gY >= 0 && gY < DISH_HEIGHT) {
      compoundFieldsRef.current[compound.name].grid[gY][gX] += 20
    }
  }, [])

  const simulateFungalGrowth = useCallback(
    (org: any, species: DetailedSpecies, growthModifier: number) => {
      const ctx = organismCanvasRef.current?.getContext("2d")
      if (!ctx) return org

      const effectiveGrowthRate = species.growthRate * growthModifier * RENDER_SCALE
      if (effectiveGrowthRate <= 0) return org

      const p = species.growthParameters
      const newBranchesToAdd: any[] = []
      const branchesToRemove: number[] = []

      ctx.fillStyle = `${species.color}80` // Semi-transparent for density buildup

      org.branches.forEach((branch: any, index: number) => {
        const newX = branch.x + Math.cos(branch.angle) * effectiveGrowthRate
        const newY = branch.y + Math.sin(branch.angle) * effectiveGrowthRate
        const gX = Math.floor(newX)
        const gY = Math.floor(newY)

        const isOutOfBounds = Math.hypot(newX - DISH_WIDTH / 2, newY - DISH_HEIGHT / 2) > DISH_RADIUS
        const isGridOutOfBounds = gX < 0 || gX >= DISH_WIDTH || gY < 0 || gY >= DISH_HEIGHT
        if (isOutOfBounds || isGridOutOfBounds) {
          branchesToRemove.push(index)
          return
        }

        const resident = occupancyGridRef.current[gY][gX]
        const hasNoNutrients = nutrientGridRef.current[gY][gX] <= 0
        const isOccupied = resident && resident.id !== org.id

        if (hasNoNutrients || isOccupied) {
          branchesToRemove.push(index)
          if (isOccupied && species.produces) {
            const residentProp = DETAILED_SPECIES_DATA[resident.species as SpeciesKey]
            if (residentProp) {
              species.produces.forEach((prod) => {
                if (prod.on === residentProp.type) {
                  produceCompound(prod.compound, newX, newY)
                }
              })
            }
          }
          return
        }

        nutrientGridRef.current[gY][gX] -= 1
        occupancyGridRef.current[gY][gX] = org

        ctx.beginPath()
        ctx.arc(newX, newY, p.lineWidth * RENDER_SCALE, 0, Math.PI * 2)
        ctx.fill()

        branch.x = newX
        branch.y = newY
        branch.angle += (Math.random() - 0.5) * p.angleVariance

        if (Math.random() < p.branchingFactor) {
          newBranchesToAdd.push({
            x: newX,
            y: newY,
            angle: branch.angle + (Math.random() > 0.5 ? 1 : -1) * (Math.PI / 4),
          })
        }
      })

      for (let i = branchesToRemove.length - 1; i >= 0; i--) {
        org.branches.splice(branchesToRemove[i], 1)
      }
      org.branches.push(...newBranchesToAdd)
      return org
    },
    [produceCompound],
  )

  const simulateColonyGrowth = useCallback((org: any, species: DetailedSpecies, growthModifier: number) => {
    const ctx = organismCanvasRef.current?.getContext("2d")
    if (!ctx) return org

    const effectiveGrowthRate = species.growthRate * growthModifier
    if (effectiveGrowthRate <= 0) return org

    const p = species.growthParameters
    const newRadius = org.radius + effectiveGrowthRate * 0.1 * RENDER_SCALE

    ctx.fillStyle = `${species.color}B3`

    const pointsToAdd = p.branchingFactor * 10 // More points for faster growing species
    for (let i = 0; i < pointsToAdd; i++) {
      const angle = Math.random() * Math.PI * 2
      const r = org.radius + (Math.random() - 0.5) * 2 * RENDER_SCALE
      const newX = org.x + Math.cos(angle) * r
      const newY = org.y + Math.sin(angle) * r
      const gX = Math.floor(newX)
      const gY = Math.floor(newY)

      const isOutOfBounds = gX < 0 || gX >= DISH_WIDTH || gY < 0 || gY >= DISH_HEIGHT
      if (isOutOfBounds) continue

      const resident = occupancyGridRef.current[gY][gX]
      const hasNoNutrients = nutrientGridRef.current[gY][gX] <= 0
      const isOccupied = resident && resident.id !== org.id

      if (!hasNoNutrients && !isOccupied) {
        ctx.beginPath()
        ctx.arc(newX, newY, 1.5 * RENDER_SCALE, 0, Math.PI * 2)
        ctx.fill()
        occupancyGridRef.current[gY][gX] = org
        nutrientGridRef.current[gY][gX] = Math.max(0, nutrientGridRef.current[gY][gX] - 0.05)
      }
    }

    return { ...org, radius: newRadius }
  }, [])

  const simulateSlimeMoldGrowth = useCallback((org: any, species: DetailedSpecies, growthModifier: number) => {
    const ctx = organismCanvasRef.current?.getContext("2d")
    if (!ctx) return org

    const effectiveGrowthRate = species.growthRate * growthModifier * RENDER_SCALE
    if (effectiveGrowthRate <= 0) return org

    const p = species.growthParameters
    const newBranchesToAdd: any[] = []
    const branchesToRemove: number[] = []

    org.branches.forEach((branch: any, index: number) => {
      let bestAngle = branch.angle
      let maxNutrients = -1

      for (let i = -1; i <= 1; i++) {
        const angle = branch.angle + i * p.angleVariance * 0.5
        const checkX = Math.floor(branch.x + Math.cos(angle) * effectiveGrowthRate * 5)
        const checkY = Math.floor(branch.y + Math.sin(angle) * effectiveGrowthRate * 5)

        if (checkX >= 0 && checkX < DISH_WIDTH && checkY >= 0 && checkY < DISH_HEIGHT) {
          const nutrientLevel = nutrientGridRef.current[checkY][checkX]
          if (nutrientLevel > maxNutrients) {
            maxNutrients = nutrientLevel
            bestAngle = angle
          }
        }
      }
      branch.angle = bestAngle

      const newX = branch.x + Math.cos(branch.angle) * effectiveGrowthRate
      const newY = branch.y + Math.sin(branch.angle) * effectiveGrowthRate
      const gX = Math.floor(newX)
      const gY = Math.floor(newY)

      const isOutOfBounds = Math.hypot(newX - DISH_WIDTH / 2, newY - DISH_HEIGHT / 2) > DISH_RADIUS
      const isGridOutOfBounds = gX < 0 || gX >= DISH_WIDTH || gY < 0 || gY >= DISH_HEIGHT
      if (isOutOfBounds || isGridOutOfBounds) {
        branchesToRemove.push(index)
        return
      }

      const resident = occupancyGridRef.current[gY][gX]
      const hasNoNutrients = nutrientGridRef.current[gY][gX] <= 0
      const isOccupied = resident && resident.id !== org.id

      if (hasNoNutrients || isOccupied) {
        branchesToRemove.push(index)
        return
      }

      nutrientGridRef.current[gY][gX] -= 1.5
      occupancyGridRef.current[gY][gX] = org

      ctx.beginPath()
      ctx.moveTo(branch.x, branch.y)
      ctx.lineTo(newX, newY)
      ctx.strokeStyle = species.color
      ctx.lineWidth = p.lineWidth * RENDER_SCALE + nutrientGridRef.current[gY][gX] / 100
      ctx.stroke()

      branch.x = newX
      branch.y = newY

      if (Math.random() < p.branchingFactor) {
        newBranchesToAdd.push({
          x: newX,
          y: newY,
          angle: branch.angle + (Math.random() - 0.5) * Math.PI,
        })
      } else if (Math.random() < 0.005) {
        branchesToRemove.push(index)
      }
    })

    for (let i = branchesToRemove.length - 1; i >= 0; i--) {
      org.branches.splice(branchesToRemove[i], 1)
    }
    org.branches.push(...newBranchesToAdd)
    return org
  }, [])

  const simulateVirusSpread = useCallback((org: any, species: DetailedSpecies, growthModifier: number) => {
    const ctx = organismCanvasRef.current?.getContext("2d")
    if (!ctx || !species.hosts || species.hosts.length === 0) return org

    const effectiveGrowthRate = species.growthRate * growthModifier
    if (effectiveGrowthRate <= 0) return org

    const newParticles: any[] = []
    const particlesToRemove: number[] = []

    org.particles.forEach((particle: any, index: number) => {
      particle.x += (Math.random() - 0.5) * 2 * RENDER_SCALE
      particle.y += (Math.random() - 0.5) * 2 * RENDER_SCALE
      const gX = Math.floor(particle.x)
      const gY = Math.floor(particle.y)

      const isOutOfBounds = gX < 0 || gX >= DISH_WIDTH || gY < 0 || gY >= DISH_HEIGHT
      if (isOutOfBounds) {
        particlesToRemove.push(index)
        return
      }

      const resident = occupancyGridRef.current[gY][gX]
      if (resident && resident.id !== org.id) {
        const residentSpecies = DETAILED_SPECIES_DATA[resident.species as SpeciesKey]
        if (residentSpecies && species.hosts?.includes(residentSpecies.type)) {
          ctx.beginPath()
          ctx.arc(gX, gY, 2 * RENDER_SCALE, 0, Math.PI * 2)
          ctx.fillStyle = "#1a1a1a"
          ctx.fill()

          occupancyGridRef.current[gY][gX] = null
          nutrientGridRef.current[gY][gX] = 0

          if (Math.random() < effectiveGrowthRate) {
            for (let i = 0; i < 5; i++) {
              newParticles.push({
                x: gX + (Math.random() - 0.5) * 5 * RENDER_SCALE,
                y: gY + (Math.random() - 0.5) * 5 * RENDER_SCALE,
              })
            }
          }
          particlesToRemove.push(index)
        }
      }
    })

    for (let i = particlesToRemove.length - 1; i >= 0; i--) {
      org.particles.splice(particlesToRemove[i], 1)
    }
    org.particles.push(...newParticles)

    ctx.fillStyle = species.color
    org.particles.forEach((p: any) => {
      ctx.fillRect(p.x, p.y, RENDER_SCALE, RENDER_SCALE)
    })

    return org
  }, [])

  const BEHAVIOR_MAP = {
    fungus: simulateFungalGrowth,
    mold: simulateFungalGrowth,
    mildew: simulateFungalGrowth,
    bacterium: simulateColonyGrowth,
    yeast: simulateColonyGrowth,
    slime_mold: simulateSlimeMoldGrowth,
    virus: simulateVirusSpread,
  }

  const simulateStep = useCallback(() => {
    setOrganisms((currentOrganisms) => {
      if (currentOrganisms.length === 0) return []
      return currentOrganisms
        .map((org) => {
          const species = DETAILED_SPECIES_DATA[org.species as SpeciesKey]
          if (!species) return org
          const growthModifier = calculateGrowthModifier(species)
          const behavior = BEHAVIOR_MAP[species.type as keyof typeof BEHAVIOR_MAP]

          if (behavior) {
            return behavior(org, species, growthModifier)
          }
          return org
        })
        .filter((o) => {
          if (o.branches) return o.branches.length > 0
          if (o.radius) return o.radius > 0
          if (o.particles) return o.particles.length > 0
          return false
        })
    })

    frameCounterRef.current++
    if (frameCounterRef.current % 5 === 0) {
      // Diffusion and Decay step
      nutrientGridRef.current = diffuseAndDecay(
        nutrientGridRef.current,
        agarProperties[agarType].leachingFactor,
        0.0001,
      )
      for (const compoundName in compoundFieldsRef.current) {
        compoundFieldsRef.current[compoundName].grid = diffuseAndDecay(
          compoundFieldsRef.current[compoundName].grid,
          0.2, // diffusionRate
          0.005, // decayRate
        )
      }
      requestAnimationFrame(drawCompoundFields)
    }
  }, [calculateGrowthModifier, agarType, drawCompoundFields])

  useEffect(() => {
    if (isRunning) {
      simulationIntervalRef.current = setInterval(simulateStep, Math.max(10, 200 / speed))
    } else if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current)
    }
    return () => {
      if (simulationIntervalRef.current) clearInterval(simulationIntervalRef.current)
    }
  }, [isRunning, speed, simulateStep])

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const scaleX = e.currentTarget.width / rect.width
    const scaleY = e.currentTarget.height / rect.height
    const x = (e.clientX - rect.left) * scaleX
    const y = (e.clientY - rect.top) * scaleY

    if (Math.hypot(x - DISH_WIDTH / 2, y - DISH_HEIGHT / 2) > DISH_RADIUS) return

    if (selectedTool === "bioSampler") {
      const gX = Math.floor(x),
        gY = Math.floor(y)
      const target = occupancyGridRef.current[gY]?.[gX]
      const compounds = new Set<string>()
      for (let i = -5; i <= 5; i++) {
        for (let j = -5; j <= 5; j++) {
          const checkY = gY + i
          const checkX = gX + j
          if (checkY >= 0 && checkY < DISH_HEIGHT && checkX >= 0 && checkX < DISH_WIDTH) {
            for (const compoundName in compoundFieldsRef.current) {
              if (compoundFieldsRef.current[compoundName].grid[checkY][checkX] > 10) {
                compounds.add(compoundName)
              }
            }
          }
        }
      }
      if (target) {
        const info = DETAILED_SPECIES_DATA[target.species as SpeciesKey]
        const sample = {
          id: Date.now(),
          species: target.species,
          name: info.name,
          color: info.color,
          compounds: Array.from(compounds),
        }
        setTissueSamples((prev) => [...prev.filter((s) => s.name !== sample.name), sample])
      }
      return
    }

    const speciesKey: SpeciesKey =
      selectedTool === "inoculate" ? (selectedSample?.species ?? selectedSpecies) : selectedContaminant
    const species = DETAILED_SPECIES_DATA[speciesKey]
    if (!species) return

    let organism: any
    switch (species.type) {
      case "fungus":
      case "mold":
      case "mildew":
        organism = {
          id: Math.random(),
          species: speciesKey,
          branches: Array.from({ length: 16 }, (_, i) => ({ x, y, angle: (i / 16) * Math.PI * 2 })),
        }
        break
      case "bacterium":
      case "yeast":
        organism = { id: Math.random(), species: speciesKey, x, y, radius: 1 * RENDER_SCALE }
        break
      case "slime_mold":
        organism = {
          id: Math.random(),
          species: speciesKey,
          branches: Array.from({ length: 20 }, (_, i) => ({ x, y, angle: (i / 20) * Math.PI * 2 })),
        }
        break
      case "virus":
        organism = {
          id: Math.random(),
          species: speciesKey,
          particles: Array.from({ length: 20 }, () => ({ x, y })),
        }
        break
      default:
        // Special handling for Streptomyces which is a bacterium but grows like a fungus
        if (speciesKey === "streptomyces") {
          organism = {
            id: Math.random(),
            species: speciesKey,
            branches: Array.from({ length: 16 }, (_, i) => ({ x, y, angle: (i / 16) * Math.PI * 2 })),
          }
          break
        }
        console.warn(`Unhandled species type for placement: ${species.type}`)
        return
    }
    setOrganisms((prev) => [...prev, organism])
  }

  const handleReset = () => {
    setIsRunning(false)
    setOrganisms([])
    setTissueSamples([])
    setSelectedSample(null)
    initializeGrids()
    drawPlate()
    const organismCtx = organismCanvasRef.current?.getContext("2d")
    const compoundCtx = compoundCanvasRef.current?.getContext("2d")
    organismCtx?.clearRect(0, 0, DISH_WIDTH, DISH_HEIGHT)
    compoundCtx?.clearRect(0, 0, DISH_WIDTH, DISH_HEIGHT)
  }

  return (
    <TooltipProvider>
      <div className="container mx-auto p-4">
        <h1 className="mb-4 text-center text-4xl font-bold">Data-Driven Life Simulator</h1>
        <div className="flex flex-col gap-8 lg:flex-row">
          <div className="lg:w-1/3 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Simulation Controls</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Tools</Label>
                  <div className="flex gap-2">
                    <Button
                      variant={selectedTool === "inoculate" ? "secondary" : "outline"}
                      onClick={() => setSelectedTool("inoculate")}
                    >
                      Inoculate
                    </Button>
                    <Button
                      variant={selectedTool === "contaminate" ? "secondary" : "outline"}
                      onClick={() => setSelectedTool("contaminate")}
                    >
                      Contaminate
                    </Button>
                    <Button
                      variant={selectedTool === "bioSampler" ? "secondary" : "outline"}
                      onClick={() => setSelectedTool("bioSampler")}
                    >
                      Bio-Sample
                    </Button>
                  </div>
                </div>

                {selectedTool === "inoculate" && !selectedSample && (
                  <div className="space-y-2">
                    <Label>Organism to Inoculate</Label>
                    <Select value={selectedSpecies} onValueChange={(val) => setSelectedSpecies(val as SpeciesKey)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DETAILED_SPECIES_DATA)
                          .filter(([, p]) => ["fungus", "yeast", "bacterium", "slime_mold"].includes(p.type))
                          .map(([k, p]) => (
                            <SelectItem key={k} value={k}>
                              {p.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {selectedTool === "contaminate" && (
                  <div className="space-y-2">
                    <Label>Contaminant</Label>
                    <Select
                      value={selectedContaminant}
                      onValueChange={(val) => setSelectedContaminant(val as SpeciesKey)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(DETAILED_SPECIES_DATA)
                          .filter(([, p]) => ["mold", "mildew", "virus", "bacterium", "yeast"].includes(p.type))
                          .map(([k, p]) => (
                            <SelectItem key={k} value={k}>
                              {p.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Agar Type</Label>
                  <Select value={agarType} onValueChange={(val) => setAgarType(val as AgarKey)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(agarProperties).map(([k, v]) => (
                        <SelectItem key={k} value={k}>
                          {v.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-3 rounded-lg bg-muted border space-y-3">
                  <div className="flex justify-between items-center">
                    <Label className="flex items-center gap-1.5">
                      Growth Suitability
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="w-4 h-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent>
                          How well the current environment matches the selected organism's ideal conditions.
                        </TooltipContent>
                      </Tooltip>
                    </Label>
                    <Badge
                      variant={
                        growthSuitability > 75 ? "default" : growthSuitability > 25 ? "secondary" : "destructive"
                      }
                    >
                      {growthSuitability.toFixed(0)}%
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <Label>Temperature: {temperature}°F</Label>
                    <Slider value={[temperature]} onValueChange={([t]) => setTemperature(t)} min={30} max={120} />
                  </div>
                  <div className="space-y-2">
                    <Label>pH: {pH.toFixed(1)}</Label>
                    <Slider value={[pH]} onValueChange={([v]) => setPH(v)} min={2} max={12} step={0.1} />
                  </div>
                  <div className="space-y-2">
                    <Label>Humidity: {humidity}%</Label>
                    <Slider value={[humidity]} onValueChange={([h]) => setHumidity(h)} min={40} max={100} />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Speed: {speed}×</Label>
                  <Slider value={[speed]} onValueChange={([s]) => setSpeed(s)} min={1} max={20} />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button onClick={() => setIsRunning((r) => !r)}>{isRunning ? "Pause" : "Start"}</Button>
                  <Button variant="destructive" onClick={handleReset}>
                    Reset Lab
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TestTube className="mr-2 h-4 w-4 flex-shrink-0" /> Culture & Compound Bank
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tissueSamples.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Use the Bio-Sampler tool on interaction zones.</p>
                ) : (
                  <div className="space-y-2">
                    {tissueSamples.map((s) => (
                      <Button
                        key={s.id}
                        variant={selectedSample?.id === s.id ? "secondary" : "outline"}
                        className="w-full justify-start text-left h-auto p-2"
                        onClick={() => {
                          setSelectedSample(s)
                          setSelectedTool("inoculate")
                        }}
                      >
                        <Beaker className="mr-2 h-4 w-4 flex-shrink-0" style={{ color: s.color }} />
                        <div className="flex-grow">
                          <span className="font-bold">{s.name}</span>
                          {s.compounds.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {s.compounds.map((c: string) => (
                                <Badge key={c} variant="outline">
                                  {c}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </Button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="relative flex-grow flex items-center justify-center p-4">
            <div className="relative w-full max-w-[750px] aspect-square">
              <canvas
                ref={baseCanvasRef}
                width={DISH_WIDTH}
                height={DISH_HEIGHT}
                className="absolute top-0 left-0 w-full h-full rounded-full"
              />
              <canvas
                ref={compoundCanvasRef}
                width={DISH_WIDTH}
                height={DISH_HEIGHT}
                className="absolute top-0 left-0 w-full h-full rounded-full pointer-events-none"
              />
              <canvas
                ref={organismCanvasRef}
                width={DISH_WIDTH}
                height={DISH_HEIGHT}
                className="absolute top-0 left-0 w-full h-full cursor-crosshair rounded-full"
                onClick={handleCanvasClick}
              />
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  )
}
