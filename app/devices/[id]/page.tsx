import { notFound } from "next/navigation"
import { getDeviceById, devices } from "@/lib/devices"
import { DeviceDetails } from "@/components/devices/device-details"
import type { Metadata } from "next"

interface DevicePageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: DevicePageProps): Promise<Metadata> {
  const device = getDeviceById(params.id)

  if (!device) {
    return {
      title: "Device Not Found",
    }
  }

  return {
    title: `${device.name} - Mycosoft Devices`,
    description: device.tagline,
  }
}

export async function generateStaticParams() {
  return devices.map((device) => ({
    id: device.id,
  }))
}

export default function DevicePage({ params }: DevicePageProps) {
  const device = getDeviceById(params.id)

  if (!device) {
    notFound()
  }

  return <DeviceDetails device={device} />
}
