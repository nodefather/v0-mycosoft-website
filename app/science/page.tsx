import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, BrainCircuit, Leaf, FlaskConical } from "lucide-react"
import Image from "next/image"

const publications = [
  { title: "Bioelectric Signaling in Mycelial Networks", journal: "Journal of Fungal Intelligence, 2025" },
  { title: "Distributed Computing Through Fungal Networks", journal: "Biological Computing Quarterly, 2025" },
  {
    title: "Environmental Monitoring Using Mycelium-Based Sensors",
    journal: "Environmental Science & Technology, 2025",
  },
]

const researchAreas = [
  {
    title: "Fungal Intelligence",
    icon: BrainCircuit,
    description:
      "Exploring the computational capabilities of mycelial networks and their potential for decentralized data processing.",
  },
  {
    title: "Bioremediation",
    icon: Leaf,
    description: "Developing fungal strains capable of breaking down pollutants and restoring ecological balance.",
  },
  {
    title: "Novel Compounds",
    icon: FlaskConical,
    description: "Discovering and synthesizing new medicinal and industrial compounds from rare fungal species.",
  },
]

export default function SciencePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">The Science of Mycosoft</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          At Mycosoft, we are dedicated to unlocking the secrets of the fungal kingdom to build a more sustainable and
          intelligent future.
        </p>
      </section>

      <div className="relative w-full h-64 md:h-96 rounded-lg overflow-hidden mb-12">
        <Image src="/placeholder.svg?height=600&width=1200" alt="Mycosoft Laboratory" layout="fill" objectFit="cover" />
      </div>

      <section className="mb-12">
        <h2 className="text-3xl font-bold text-center mb-8">Our Research Areas</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {researchAreas.map((area) => (
            <Card key={area.title}>
              <CardHeader className="items-center">
                <div className="p-3 rounded-full bg-primary/10 mb-2">
                  <area.icon className="h-8 w-8 text-primary" />
                </div>
                <CardTitle>{area.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-center text-muted-foreground">{area.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Recent Publications</h2>
        <Card>
          <CardContent className="pt-6">
            <ul className="space-y-4">
              {publications.map((pub) => (
                <li key={pub.title} className="flex items-start gap-4">
                  <div className="p-2 rounded-md bg-muted">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{pub.title}</h3>
                    <p className="text-sm text-muted-foreground">{pub.journal}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
