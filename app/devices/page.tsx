import type { Metadata } from "next"
import { devices } from "@/lib/devices"
import { DeviceGrid } from "@/components/devices/device-grid"

export const metadata: Metadata = {
  title: "Mycosoft Devices",
  description:
    "Explore our suite of advanced hardware for fungal intelligence, environmental monitoring, and biological computing.",
}

export default function DevicesPage() {
  return (
    <div className="container py-6 md:py-10">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight">Mycosoft Hardware</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our suite of devices forms a seamless bridge between the digital world and natural biological systems. From
          environmental monitoring to advanced laboratory research, our hardware is designed to unlock the potential of
          fungal intelligence.
        </p>
      </div>
      <div className="mt-12">
        <DeviceGrid devices={devices} />
      </div>
    </div>
  )
}
