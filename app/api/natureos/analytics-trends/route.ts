import { NextResponse } from "next/server"

export async function GET() {
  const trends = {
    networkGrowth: [
      { name: "Jan", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "Feb", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "Mar", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "Apr", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "May", total: Math.floor(Math.random() * 5000) + 1000 },
      { name: "Jun", total: Math.floor(Math.random() * 5000) + 1000 },
    ],
    speciesDistribution: [
      { name: "Ascomycota", value: 450, fill: "#8884d8" },
      { name: "Basidiomycota", value: 300, fill: "#82ca9d" },
      { name: "Zygomycota", value: 150, fill: "#ffc658" },
      { name: "Chytridiomycota", value: 100, fill: "#ff8042" },
    ],
  }
  return NextResponse.json(trends)
}
