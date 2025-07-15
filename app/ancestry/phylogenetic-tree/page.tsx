import PhylogeneticTreePageClient from "./PhylogeneticTreePageClient"

export const metadata = {
  title: "Phylogenetic Tree Builder | Fungal Ancestry",
  description: "Build and visualize evolutionary trees for fungal species.",
}

export default function PhylogeneticTreePage() {
  return <PhylogeneticTreePageClient />
}
