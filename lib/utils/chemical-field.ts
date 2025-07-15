export const createChemicalField = (width: number, height: number): number[][] =>
  Array.from({ length: height }, () => Array(width).fill(0))

/**
 * Simulates the diffusion and decay of chemicals in a 2D grid.
 * @param field The 2D grid of chemical concentrations.
 * @param diffusionRate The percentage of a cell's value that spreads to neighbors (0 to 1).
 * @param decayRate The percentage of a cell's value that is lost per step (0 to 1).
 * @returns A new 2D grid with updated chemical concentrations.
 */
export const diffuseAndDecay = (field: number[][], diffusionRate: number, decayRate: number): number[][] => {
  const height = field.length
  if (height === 0) return []
  const width = field[0].length
  if (width === 0) return [[]]

  const newField = createChemicalField(width, height)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let totalValue = field[y][x]
      if (totalValue === 0) continue

      // 1. Decay
      totalValue *= 1 - decayRate
      if (totalValue < 0.01) continue // Optimization: ignore tiny values

      // 2. Diffusion
      const diffusionAmount = totalValue * diffusionRate
      const remaining = totalValue - diffusionAmount

      newField[y][x] += remaining

      const neighbors = []
      if (y > 0) neighbors.push({ x, y: y - 1 })
      if (y < height - 1) neighbors.push({ x, y: y + 1 })
      if (x > 0) neighbors.push({ x: x - 1, y })
      if (x < width - 1) neighbors.push({ x: x + 1, y })
      // Add diagonals for smoother diffusion
      if (y > 0 && x > 0) neighbors.push({ x: x - 1, y: y - 1 })
      if (y > 0 && x < width - 1) neighbors.push({ x: x + 1, y: y - 1 })
      if (y < height - 1 && x > 0) neighbors.push({ x: x - 1, y: y + 1 })
      if (y < height - 1 && x < width - 1) neighbors.push({ x: x + 1, y: y + 1 })

      if (neighbors.length > 0) {
        const diffusionPerNeighbor = diffusionAmount / neighbors.length
        for (const neighbor of neighbors) {
          newField[neighbor.y][neighbor.x] += diffusionPerNeighbor
        }
      } else {
        newField[y][x] += diffusionAmount // Keep if no neighbors
      }
    }
  }

  return newField
}

// Alias for backward-compatibility
export const diffuseChemicals = diffuseAndDecay
