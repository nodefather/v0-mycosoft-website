import type { Metadata } from "next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { ParallaxSection } from "@/components/parallax-section"
import { MotionCard } from "@/components/motion-card"
import { MotionContent } from "@/components/motion-content"
import { MotionBanner } from "@/components/motion-banner"

export const metadata: Metadata = {
  title: "About Mycosoft - The Fungal Intelligence Platform",
  description: "Learn about Mycosoft's mission to advance fungal intelligence research and technology",
}

const team = [
  { name: "Dr. Elara Vance", role: "Founder & CEO", avatar: "/placeholder.svg?height=100&width=100" },
  { name: "Dr. Kenji Tanaka", role: "Head of Research", avatar: "/placeholder.svg?height=100&width=100" },
  { name: "Aria Chen", role: "Lead Engineer, NatureOS", avatar: "/placeholder.svg?height=100&width=100" },
]

export default function AboutPage() {
  const technologies = [
    {
      title: "Materials from Mycelium",
      description:
        "Mycosoft focuses on the development of sustainable materials derived from mycelium. These materials can be used as eco-friendly alternatives to plastics, packaging, and even construction materials. Our research explores the incredible versatility of mycelium as a foundation for future innovations.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/materials%20from%20mycelium'-Zq3b3VgIAcDLm54IGuDhxzmZjcpBqC.webp",
    },
    {
      title: "Programming of Fungi",
      description:
        "By tapping into the natural electrical activity of fungi, Mycosoft is developing ways to process and interpret these bioelectric signals. This involves creating interfaces and devices that can read, amplify, and program fungi's electrical responses for various applications. The goal is to integrate fungal networks into the world of electronic systems.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/programming%20of%20fungi-A8i9CFcUQZu1rK4R3DVaaP5wR9H0zI.webp",
    },
    {
      title: "Hydrocarbon Material Science",
      description:
        "We are exploring the role of fungi in breaking down hydrocarbons and their potential for environmental remediation. In parallel, food fungi are being studied for their ability to be fed and programmed to enhance biological computing processes. This unique intersection of fungi and material science opens new frontiers in sustainability.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/hydrocarbon%20material%20science-wcEO75pjUfwXiebntL6AGEGvg4fPf2.webp",
    },
    {
      title: "Environmental Monitoring",
      description:
        "Mycosoft is building devices designed for studying nature and fungi growth in their natural habitats. These smart sensors will monitor real-time environmental data like temperature, humidity, and CO2 levels. The goal is to create a global network for studying fungal behavior and environmental health.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/enviornmental%20monitoring-ErgsKkzWy106AEq6Ak8G1GrpLHtyTu.webp",
    },
    {
      title: "Smart Lab Equipment",
      description:
        "In laboratory environments, our technology aims to automate and smartly monitor the growth and health of fungi in petri dishes and farm environments. By incorporating data-gathering sensors and AI-powered tools, we aim to improve precision and efficiency in scientific research and commercial farming.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/smart%20lab%20equipment-z3U2lh0DJDiLs1nRgfkfFyhWTfuroY.webp",
    },
    {
      title: "Biological Computing",
      description:
        "One of Mycosoft's long-term visions is to grow biological computing components from mycelium and fungi. This includes developing organic capacitors, batteries, transistors, resistors, and other essential electronic components. Our goal is to use mycelium as a sustainable alternative for growing and building next-generation hardware.",
      image:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/biological%20computing-oqSPxCwmNWtBJ4fQ91qWdTmQDPyMYL.webp",
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <section className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">About Mycosoft</h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
          We are a biotechnology company pioneering the field of Fungal Intelligence to solve some of the world's most
          pressing challenges.
        </p>
      </section>

      <Card className="mb-12">
        <div className="grid md:grid-cols-2">
          <div className="p-8 flex flex-col justify-center">
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground">
              To harness the untapped potential of fungi to create sustainable technologies, advanced computational
              systems, and novel therapeutics. We believe the mycelial network is nature's original internet, and by
              learning its language, we can build a better world.
            </p>
          </div>
          <div className="relative h-64 md:h-auto">
            <Image
              src="/placeholder.svg?height=400&width=600"
              alt="Mycelium Network"
              layout="fill"
              objectFit="cover"
              className="rounded-r-lg"
            />
          </div>
        </div>
      </Card>

      <section>
        <h2 className="text-3xl font-bold text-center mb-8">Meet the Team</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {team.map((member) => (
            <Card key={member.name} className="text-center">
              <CardHeader className="items-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={member.avatar || "/placeholder.svg"} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <CardTitle>{member.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-primary">{member.role}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Add animated banner */}
      <MotionBanner
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/rs=w_1160,h_663-ESVi80C1sa4fkioBNtFcVtPlY1TkSq.webp"
        alt="Digital illustration of a mushroom merging with circuit board patterns"
      />

      <h1 className="text-4xl font-bold mb-8">About Mycosoft</h1>

      <div className="prose dark:prose-invert max-w-none">
        <p className="text-xl text-muted-foreground mb-8">
          Mycosoft is pioneering the integration of fungal intelligence with modern technology, creating a new paradigm
          for sustainable computing and environmental solutions.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">Mycelium Is The New Silicon</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/intelligence-fongique-scaled-e1632953070192.jpg-QcSkd9zn4uJrg5TC8gwWf8IOlxQiVj.jpeg"
              alt="Bioluminescent mycelial networks visualization"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4">What Is Mycelium</h3>
            <p className="text-muted-foreground">
              Mycelium is the intricate underground network of fungal threads that connect ecosystems, acting as
              nature's biological internet. It plays a vital role in nutrient cycling, communication between plants, and
              environmental health.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4">Mycology Technology Using Mycelium</h3>
            <p className="text-muted-foreground">
              Mycosoft's Mycology Technology harnesses the power of mycelium—the root network of fungi—to develop
              sustainable materials and innovative biological computing solutions. Mycosoft aims to bridge the gap
              between biology and technology by integrating mycelial networks with advanced sensors and electronics,
              creating eco-friendly devices like Mushroom One that monitor and interact with the natural environment.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/IMG_20220324_143121_323.jpg-cphIZ5pntD4qD7iMr7TVIpjrGONH3S.webp"
                alt="Laboratory setup with electronic sensors on mushroom"
                fill
                className="object-cover"
              />
            </div>
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/PXL_20241213_012410908.jpg-g6CqHJf7cfQPMRBbNIfFnb84vHNXrK.jpeg"
                alt="Biocomputing device with fungal specimen"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold mt-8 mb-4">Why We Use Mycelium</h3>
        <Card className="p-6 bg-primary/5 border-primary/10 mb-12">
          <h4 className="text-lg font-semibold mb-4">Mycosoft Laboratory - Mushroom Machines</h4>
          <p className="text-muted-foreground">
            At Mycosoft, we harness the extraordinary properties of mycelium to create a seamless interface between
            biological systems and computers. Mycelium, the intricate network of fungal threads beneath the soil,
            functions as nature's ultimate connector, akin to a UART or USB port for all organisms on Earth. This
            biological marvel acts as an electrical conduit, efficiently transmitting signals across vast distances,
            similar to a nervous system. It also serves as a circulatory network, distributing nutrients and chemicals,
            much like a digestive system and vascular network combined. Mycelium's ability to process and respond to
            environmental stimuli positions it as a brain-like entity, capable of complex decision-making and
            adaptation. Its chemical composition allows it to act as a natural computer, processing information through
            biochemical pathways. By leveraging these multifaceted capabilities, we transform mycelium into a living
            interface for advanced computing, enabling unprecedented integration and interaction with the natural world.
          </p>
        </Card>

        <p className="text-muted-foreground mb-12">
          At Mycosoft, we harness mycelium as the foundation of our technology, similar to how Intel uses silicon for
          processors. Mycelium's natural conductivity, responsiveness to environmental signals, and adaptability make it
          the perfect medium for creating biological computers, environmental sensors, and smart systems. By integrating
          mycelium into hardware, we're pioneering a new wave of bio-computing, capable of interacting with nature in
          ways traditional technology cannot.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">What We Do</h2>

        <div className="grid gap-12">
          {technologies.map((tech, index) => (
            <ParallaxSection key={tech.title}>
              <MotionCard index={index}>
                <div className="relative aspect-video md:aspect-square">
                  <Image
                    src={tech.image || "/placeholder.svg"}
                    alt={tech.title}
                    fill
                    className="object-cover rounded-t-lg md:rounded-l-lg md:rounded-t-none"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-4">{tech.title}</h3>
                  <p className="text-muted-foreground">{tech.description}</p>
                </div>
              </MotionCard>
            </ParallaxSection>
          ))}
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4">Our Future</h2>
        <Card className="p-6 bg-primary/5 border-primary/10">
          <MotionContent>
            <p className="text-muted-foreground">
              Looking ahead, Mycosoft is dedicated to the ambitious goal of building the world's first biological
              computer. This revolutionary device will harness the natural intelligence and connectivity of mycelium,
              offering transformative benefits in environmental monitoring, data processing, and sustainable technology.
              Our future-focused vision aims to unlock new levels of interaction between biological systems and advanced
              computing, creating a harmonious blend of nature and innovation. The biological computer will not only
              enhance our understanding of the environment but also pave the way for groundbreaking applications in
              various industries, driving Mycosoft's mission to lead the way in eco-friendly technological advancements.
            </p>
          </MotionContent>
        </Card>

        <h2 className="text-2xl font-bold mt-12 mb-4">Innovation Through Nature</h2>
        <p>
          By studying how fungi process information and communicate, we're developing new approaches to computing,
          environmental monitoring, and biological data processing. Our technology mimics nature's most efficient
          networks to create more sustainable solutions.
        </p>

        <div className="grid md:grid-cols-2 gap-8 my-12">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-2">Research Focus</h3>
            <ul className="space-y-2">
              <li>• Fungal network intelligence</li>
              <li>• Biocomputing systems</li>
              <li>• Environmental monitoring</li>
              <li>• Sustainable technology</li>
            </ul>
          </Card>
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-2">Technology Areas</h3>
            <ul className="space-y-2">
              <li>• Mycelial computing</li>
              <li>• Fungal sensors</li>
              <li>• Bioremediation</li>
              <li>• Natural algorithms</li>
            </ul>
          </Card>
        </div>

        <h2 className="text-2xl font-bold mt-12 mb-4">Our Commitment</h2>
        <p>
          We're committed to developing technology that works in harmony with nature. Our devices and applications are
          designed to be environmentally conscious, using minimal resources while maximizing their positive impact on
          the world.
        </p>

        <h2 className="text-2xl font-bold mt-12 mb-4">Join Our Journey</h2>
        <p>
          Whether you're a researcher, developer, or enthusiast, there are many ways to get involved with Mycosoft.
          Explore our devices, try our applications, or contribute to our growing knowledge base about fungal
          intelligence.
        </p>
      </div>
    </div>
  )
}
