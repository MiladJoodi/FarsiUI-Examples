"use client"

import { useEffect, useState } from "react"

import { cn } from "@/lib/utils"

import "./cinematic-showcase.css"

/**
 * Exact 15s product reel using FarsiUI screenshots only.
 * Camera / depth / lighting create interest — UI pixels never change.
 *
 * 0–3s   Introduction (wide → push-in)
 * 3–7s   Component showcase (close-ups)
 * 7–11s  Detail sweeps
 * 11–15s Conclusion (zoom-out, centered)
 */

type Motion =
  | "intro"
  | "close-a"
  | "close-b"
  | "sweep-a"
  | "sweep-b"
  | "outro"

type Shot = {
  src: string
  alt: string
  motion: Motion
  durationMs: number
  depthClass: string
  /** Slightly tighter frame for close-up beats */
  frame?: "wide" | "tight"
}

const SHOTS: Shot[] = [
  {
    src: "/showcase/01-landing-hero.png",
    alt: "FarsiUI",
    motion: "intro",
    durationMs: 3000,
    depthClass: "reel-depth",
    frame: "wide",
  },
  {
    src: "/showcase/06-dashboard.png",
    alt: "FarsiUI",
    motion: "close-a",
    durationMs: 2000,
    depthClass: "reel-depth-short",
    frame: "tight",
  },
  {
    src: "/showcase/04-ecommerce.png",
    alt: "FarsiUI",
    motion: "close-b",
    durationMs: 2000,
    depthClass: "reel-depth-short",
    frame: "tight",
  },
  {
    src: "/showcase/05-team-chat.png",
    alt: "FarsiUI",
    motion: "sweep-a",
    durationMs: 2000,
    depthClass: "reel-depth-short",
    frame: "wide",
  },
  {
    src: "/showcase/07-ai-assistant.png",
    alt: "FarsiUI",
    motion: "sweep-b",
    durationMs: 2000,
    depthClass: "reel-depth-short",
    frame: "wide",
  },
  {
    src: "/showcase/01-landing-hero.png",
    alt: "FarsiUI",
    motion: "outro",
    durationMs: 4000,
    depthClass: "reel-depth-outro",
    frame: "wide",
  },
]

const FADE_MS = 420

const MOTION_CLASS: Record<Motion, string> = {
  intro: "reel-cam-intro",
  "close-a": "reel-cam-close-a",
  "close-b": "reel-cam-close-b",
  "sweep-a": "reel-cam-sweep-a",
  "sweep-b": "reel-cam-sweep-b",
  outro: "reel-cam-outro",
}

export function CinematicShowcase() {
  const [index, setIndex] = useState(0)
  const [reduced, setReduced] = useState(false)
  const [cycle, setCycle] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduced(mq.matches)
    const onChange = () => setReduced(mq.matches)
    mq.addEventListener("change", onChange)
    return () => mq.removeEventListener("change", onChange)
  }, [])

  useEffect(() => {
    if (reduced) return
    const duration = SHOTS[index]?.durationMs ?? 3000
    const id = window.setTimeout(() => {
      setIndex((i) => {
        const next = (i + 1) % SHOTS.length
        if (next === 0) setCycle((c) => c + 1)
        return next
      })
    }, duration)
    return () => window.clearTimeout(id)
  }, [index, reduced, cycle])

  return (
    <div
      className="relative h-dvh w-dvw overflow-hidden bg-[#090909]"
      style={{ perspective: "1680px" }}
      aria-label="FarsiUI 15-second product showcase"
    >
      {/* Studio lighting only — no UI chrome, no text */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 68% 52% at 50% 40%, rgba(255,255,255,0.055), transparent 68%), radial-gradient(ellipse 45% 35% at 72% 78%, rgba(170,110,70,0.045), transparent 60%)",
        }}
      />

      {SHOTS.map((shot, i) => {
        const active = i === index
        const prev = i === (index - 1 + SHOTS.length) % SHOTS.length
        const visible = reduced ? active : active || prev
        const tight = shot.frame === "tight"

        return (
          <div
            key={`${shot.src}-${shot.motion}-${i}`}
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              tight ? "px-[4vw] py-[5vh]" : "px-[8vw] py-[9vh]",
              "transition-opacity ease-in-out",
              active ? "opacity-100" : "opacity-0",
              !visible && "pointer-events-none"
            )}
            style={{
              transitionDuration: `${FADE_MS}ms`,
              zIndex: active ? 2 : prev ? 1 : 0,
            }}
            aria-hidden={!active}
          >
            <div
              aria-hidden
              className={cn(
                "absolute rounded-[1.25rem] bg-white/5 blur-2xl",
                tight
                  ? "h-[52%] w-[min(62vw,820px)]"
                  : "h-[56%] w-[min(68vw,900px)]",
                active && !reduced && shot.depthClass
              )}
              style={{ transform: "translateZ(-130px) scale(1.04)" }}
            />

            <div
              key={`${shot.motion}-${active ? `${index}-${cycle}` : "idle"}`}
              className={cn(
                "relative overflow-hidden rounded-[0.8rem]",
                tight
                  ? "w-[min(94vw,1200px)]"
                  : "w-[min(84vw,1040px)]",
                "shadow-[0_36px_110px_rgba(0,0,0,0.62),0_0_0_1px_rgba(255,255,255,0.05)]",
                "will-change-transform",
                active && !reduced && MOTION_CLASS[shot.motion]
              )}
              style={{
                transformStyle: "preserve-3d",
                backfaceVisibility: "hidden",
              }}
            >
              {/* Exact provided screenshot — never redesigned */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.src}
                alt={shot.alt}
                draggable={false}
                className="pointer-events-none block h-auto w-full select-none"
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
