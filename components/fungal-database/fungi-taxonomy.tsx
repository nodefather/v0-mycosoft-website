import type { Fungi } from "@/types/fungi"

interface FungiTaxonomyProps {
  taxonomy: Partial<Fungi["taxonomy"]> | null | undefined
}

export function FungiTaxonomy({ taxonomy }: FungiTaxonomyProps) {
  if (!taxonomy) {
    return <p className="text-muted-foreground">No taxonomy data available.</p>
  }

  const taxonomyRanks = [
    { label: "Kingdom", value: taxonomy.kingdom },
    { label: "Phylum", value: taxonomy.phylum },
    { label: "Class", value: taxonomy.class },
    { label: "Order", value: taxonomy.order },
    { label: "Family", value: taxonomy.family },
    { label: "Genus", value: taxonomy.genus },
    { label: "Species", value: taxonomy.species },
  ]

  return (
    <div className="space-y-2 rounded-lg border p-4">
      {taxonomyRanks.map((rank) => (
        <div key={rank.label} className="flex justify-between items-center">
          <span className="font-semibold text-foreground">{rank.label}</span>
          <span className="text-muted-foreground italic">{rank.value || "N/A"}</span>
        </div>
      ))}
    </div>
  )
}
