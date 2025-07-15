import type { LucideIcon } from "lucide-react"

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

interface DetailedFeature {
  title: string
  description: string
  bulletPoints: string[]
  image: string
}

export interface Device {
  id: string
  name: string
  tagline: string
  description: string
  longDescription: string
  status: "Available" | "Pre-order" | "In Development" | "Out of Stock"
  price: string
  images: {
    main: string
    gallery: string[]
  }
  specs: { [key: string]: string }
  features: string[]
  docsUrl: string
  storeUrl: string
}

export const devices: Device[] = [
  {
    id: "mushroom-1",
    name: "Mushroom 1",
    tagline: "Ground-Based Fungal Intelligence Station",
    description:
      "The cornerstone of our environmental monitoring network. Mushroom 1 connects directly to mycelial networks to gather and transmit data in real-time.",
    longDescription:
      "Mushroom 1 is a state-of-the-art bio-sensor designed to be deployed directly into natural environments. It establishes a symbiotic connection with local fungal networks, allowing it to monitor bioelectric signals, nutrient flow, and environmental conditions with unparalleled accuracy. Built with durable, eco-friendly materials, it's the perfect tool for researchers, conservationists, and agriculturalists.",
    status: "Available",
    price: "$499",
    images: {
      main: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mushroom-1-device-main.png",
      gallery: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mushroom-1-gallery-1.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mushroom-1-gallery-2.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/mushroom-1-gallery-3.png",
      ],
    },
    specs: {
      Connectivity: "Mycelial Interface, LoRaWAN, Wi-Fi",
      Sensors: "Bioelectric Potential, Temperature, Humidity, CO2, VOC",
      Power: "Solar Panel with 72-hour Battery Backup",
      Dimensions: "15cm x 10cm x 10cm",
      "Ingress Protection": "IP67",
    },
    features: [
      "Direct mycelial network interface",
      "Real-time data streaming to NatureOS",
      "Solar-powered and self-sustaining",
      "Durable, all-weather construction",
    ],
    docsUrl: "/natureos/documentation/mushroom-1",
    storeUrl: "https://store.mycosoft.com/mushroom-1",
  },
  {
    id: "alarm",
    name: "ALARM",
    tagline: "Advanced Lidar-Assisted Recognition of Mold",
    description: "Protect your indoor environments with ALARM, the smart mold detection and prevention system.",
    longDescription:
      "The ALARM device is an essential tool for maintaining healthy indoor air quality. It uses a combination of advanced sensors, including Lidar, to actively scan for airborne mold spores and monitor surfaces for potential growth conditions. When a threat is detected, ALARM alerts you through NatureOS and can trigger air purification systems, providing proactive protection for homes, labs, and commercial buildings.",
    status: "Available",
    price: "$249",
    images: {
      main: "/images/alarm-logo.png",
      gallery: ["/images/alarm-mold.png", "/images/alarm-components.png"],
    },
    specs: {
      Connectivity: "Wi-Fi, Bluetooth 5.0",
      Sensors: "Lidar Particle Scanner, Temperature, Humidity, VOC",
      Power: "USB-C or 24-hour Battery Backup",
      Dimensions: "8cm x 8cm x 12cm",
      Coverage: "Up to 1500 sq. ft.",
    },
    features: [
      "Proactive mold detection",
      "Air quality monitoring",
      "Integrates with smart home systems",
      "Detailed reporting in NatureOS",
    ],
    docsUrl: "/natureos/documentation/alarm",
    storeUrl: "https://store.mycosoft.com/alarm",
  },
  {
    id: "sporebase",
    name: "SporeBase",
    tagline: "Distributed Spore Collection & Analysis Network",
    description:
      "A global network of spore collectors providing invaluable data for allergy forecasts, and ecological research.",
    longDescription:
      "SporeBase is a decentralized network of automated spore traps. Each unit collects and analyzes airborne particles, identifying fungal spores with high precision using microscopic imaging and AI. The data is aggregated in NatureOS to create global and regional maps of spore distribution, aiding in allergy prediction, agricultural planning, and biodiversity studies.",
    status: "Pre-order",
    price: "$799",
    images: {
      main: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sporebase-main.png",
      gallery: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sporebase-gallery-1.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/sporebase-gallery-2.png",
      ],
    },
    specs: {
      Connectivity: "Cellular LTE, Wi-Fi",
      Sensors: "Automated Spore Trap, Microscopic Imager, Weather Sensors",
      Power: "Solar Panel with 96-hour Battery Backup",
      Dimensions: "25cm x 25cm x 40cm",
      "Ingress Protection": "IP68",
    },
    features: [
      "Automated spore identification",
      "Global data network",
      "Weather-resistant for outdoor deployment",
      "Long-term ecological monitoring",
    ],
    docsUrl: "/natureos/documentation/sporebase",
    storeUrl: "https://store.mycosoft.com/sporebase",
  },
  {
    id: "petreus",
    name: "Petreus",
    tagline: "The Computational Petri Dish Platform",
    description: "Automate and accelerate your mycological research with a smart, connected petri dish environment.",
    longDescription:
      "Petreus revolutionizes laboratory work by integrating sensing and automation directly into the petri dish. This platform allows for precise control and monitoring of environmental conditions like temperature, humidity, and gas composition, while continuously capturing high-resolution images of fungal growth. All data is streamed to NatureOS for advanced analysis, simulation, and record-keeping.",
    status: "In Development",
    price: "Contact for Quote",
    images: {
      main: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/petreus-main.png",
      gallery: [
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/petreus-gallery-1.png",
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/petreus-gallery-2.png",
      ],
    },
    specs: {
      Connectivity: "Wi-Fi, Ethernet",
      Sensors: "HD Camera, Temperature, Humidity, CO2, O2",
      Features: "Programmable Environment, Time-lapse Imaging, Automated Data Logging",
      Compatibility: "Standard 90mm Petri Dishes",
      Power: "AC Adapter",
    },
    features: [
      "Precise environmental control",
      "Automated time-lapse imaging",
      "Real-time data logging to NatureOS",
      "Accelerates experimental workflows",
    ],
    docsUrl: "/natureos/documentation/petreus",
    storeUrl: "",
  },
]

export const getDeviceById = (id: string): Device | undefined => {
  return devices.find((device) => device.id === id)
}
