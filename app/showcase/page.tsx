import type { Metadata } from "next"

import { CinematicShowcase } from "@/components/showcase/cinematic-showcase"

export const metadata: Metadata = {
  title: "FarsiUI Showcase",
  description: "15-second cinematic product showcase of FarsiUI interfaces",
}

export default function ShowcasePage() {
  return <CinematicShowcase />
}
