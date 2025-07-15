import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"

const growthLog = [
  {
    day: 1,
    stage: "Spore Germination",
    image: "/placeholder.svg?height=200&width=300",
    notes: "Spores have germinated, initial hyphae are visible.",
  },
  {
    day: 3,
    stage: "Mycelial Expansion",
    image: "/placeholder.svg?height=200&width=300",
    notes: "Mycelium is spreading across the substrate.",
  },
  {
    day: 7,
    stage: "Pinhead Formation",
    image: "/placeholder.svg?height=200&width=300",
    notes: "Primordia (pinheads) are beginning to form.",
  },
  {
    day: 10,
    stage: "Fruiting Body Development",
    image: "/placeholder.svg?height=200&width=300",
    notes: "Young fruiting bodies are developing, cap and stipe are distinguishable.",
  },
  {
    day: 14,
    stage: "Mature Fruiting Body",
    image: "/placeholder.svg?height=200&width=300",
    notes: "Mushroom is mature, gills are visible and ready for sporulation.",
  },
]

export default function MushroomSimPage() {
  return (
    <DashboardShell>
      <DashboardHeader
        heading="Mushroom Simulator"
        text="Observe the fascinating life cycle of Lentinula edodes (Shiitake)."
      />
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Shiitake Growth Simulation Log</CardTitle>
            <CardDescription>
              This simulation tracks the key stages of mushroom development over a 14-day period.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {growthLog.map((log) => (
              <div key={log.day} className="grid md:grid-cols-3 gap-4 items-start">
                <div className="md:col-span-1">
                  <div className="relative aspect-video rounded-md overflow-hidden border">
                    <Image src={log.image || "/placeholder.svg"} alt={log.stage} fill className="object-cover" />
                  </div>
                </div>
                <div className="md:col-span-2">
                  <div className="flex items-center gap-4 mb-2">
                    <Badge>Day {log.day}</Badge>
                    <h3 className="font-semibold text-lg">{log.stage}</h3>
                  </div>
                  <p className="text-muted-foreground">{log.notes}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}
