import type { Fungi } from "@/types/fungi"

interface FungiCharacteristicsTableProps {
  characteristics: Partial<Fungi["characteristics"]> | null | undefined
}

export function FungiCharacteristicsTable({ characteristics }: FungiCharacteristicsTableProps) {
  if (!characteristics || Object.keys(characteristics).length === 0) {
    return <p className="text-muted-foreground">No characteristics data available.</p>
  }

  const characteristicsMap = {
    capShape: "Cap Shape",
    hymeniumType: "Hymenium Type",
    stipeCharacter: "Stipe Character",
    sporePrintColor: "Spore Print Color",
    ecologicalType: "Ecological Type",
    population: "Population",
    substrate: "Substrate",
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <tbody className="divide-y divide-gray-200 bg-white dark:divide-gray-700 dark:bg-gray-900">
          {Object.entries(characteristicsMap).map(([key, label]) => {
            const value = characteristics[key as keyof typeof characteristics]
            if (!value) return null
            return (
              <tr key={key}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                  {label}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {String(value)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
