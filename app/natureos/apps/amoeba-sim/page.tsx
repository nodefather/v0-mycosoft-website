"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { Amoeba } from "@/components/apps/amoeba-sim/amoeba"
import { createChemicalField, diffuseChemicals } from "@/lib/utils/chemical-field"

const FIELD_WIDTH = 40 // Grid units
const FIELD_HEIGHT = 40 // Grid units
const PIXEL_SCALE = 10 // Each grid unit is 10px

const AmoebaSimulatorPage: React.FC = () => {
  const [chemicalField, setChemicalField] = useState(() => createChemicalField(FIELD_WIDTH, FIELD_HEIGHT))
  const [isRunning, setIsRunning] = useState(true)

  const handleChemicalRelease = useCallback((x: number, y: number) => {
    setChemicalField((prevField) => {
      const newField = prevField.map((row) => [...row])
      if (newField[y] && newField[y][x] !== undefined) {
        newField[y][x] = Math.min(255, newField[y][x] + 10) // Add chemical, cap at 255
      }
      return newField
    })
  }, [])

  useEffect(() => {
    if (!isRunning) return

    const diffusionInterval = setInterval(() => {
      setChemicalField((prevField) => diffuseChemicals(prevField))
    }, 500) // Diffuse chemicals every 500ms

    return () => clearInterval(diffusionInterval)
  }, [isRunning])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white p-4">
      <h1 className="text-3xl font-bold mb-4">Amoeba Chemotaxis Simulator</h1>
      <div
        style={{
          width: FIELD_WIDTH * PIXEL_SCALE,
          height: FIELD_HEIGHT * PIXEL_SCALE,
          position: "relative",
          backgroundColor: "black",
          border: "1px solid #444",
        }}
      >
        <Amoeba
          id={1}
          initialX={20}
          initialY={20}
          chemicalField={chemicalField}
          onChemicalRelease={handleChemicalRelease}
          fieldWidth={FIELD_WIDTH}
          fieldHeight={FIELD_HEIGHT}
        />
        <Amoeba
          id={2}
          initialX={10}
          initialY={10}
          chemicalField={chemicalField}
          onChemicalRelease={handleChemicalRelease}
          fieldWidth={FIELD_WIDTH}
          fieldHeight={FIELD_HEIGHT}
        />
      </div>
      <p className="mt-4 text-gray-400">
        Amoebas (green dots) move towards higher chemical concentrations which they also secrete.
      </p>
    </div>
  )
}

export default AmoebaSimulatorPage
