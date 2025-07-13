"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface AmoebaProps {
  id: number
  initialX: number
  initialY: number
  fieldWidth: number
  fieldHeight: number
  chemicalField: number[][]
  onChemicalRelease: (x: number, y: number) => void
}

export const Amoeba: React.FC<AmoebaProps> = ({
  id,
  initialX,
  initialY,
  fieldWidth,
  fieldHeight,
  chemicalField,
  onChemicalRelease,
}) => {
  const [position, setPosition] = useState({ x: initialX, y: initialY })

  useEffect(() => {
    const move = () => {
      const dirs = [
        { dx: 1, dy: 0 }, // right
        { dx: -1, dy: 0 }, // left
        { dx: 0, dy: 1 }, // down
        { dx: 0, dy: -1 }, // up
        { dx: 0, dy: 0 }, // stay put (randomness)
      ]

      // Add randomness to choice
      const randomDir = dirs[Math.floor(Math.random() * dirs.length)]

      // Find best direction based on chemotaxis
      const bestDir = dirs.reduce(
        (best, current) => {
          const newX = position.x + current.dx
          const newY = position.y + current.dy

          // Check bounds
          if (newX < 0 || newX >= fieldWidth || newY < 0 || newY >= fieldHeight) {
            return best
          }

          const currentValue = chemicalField?.[newY]?.[newX] ?? -1
          return currentValue > best.value ? { dir: current, value: currentValue } : best
        },
        { dir: randomDir, value: -1 },
      )

      // Combine random walk with chemotaxis bias
      const finalDir = Math.random() > 0.3 ? bestDir.dir : randomDir

      let newX = position.x + finalDir.dx
      let newY = position.y + finalDir.dy

      // Final boundary check to prevent crashes
      newX = Math.max(0, Math.min(fieldWidth - 1, newX))
      newY = Math.max(0, Math.min(fieldHeight - 1, newY))

      setPosition({ x: newX, y: newY })
      onChemicalRelease(newX, newY)
    }

    const interval = setInterval(move, 300) // Move every 300ms
    return () => clearInterval(interval)
  }, [position, chemicalField, onChemicalRelease, fieldWidth, fieldHeight])

  return (
    <div
      style={{
        position: "absolute",
        left: `${position.x * 10}px`, // Scale position to fit visual grid
        top: `${position.y * 10}px`,
        width: "10px",
        height: "10px",
        borderRadius: "50%",
        backgroundColor: "limegreen",
        zIndex: 10,
        transition: "left 0.3s linear, top 0.3s linear",
      }}
    />
  )
}
