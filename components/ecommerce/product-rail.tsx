"use client"

import Link from "next/link"
import * as React from "react"

import type { Product } from "@/lib/mock/ecommerce"
import { ProductCard } from "@/components/ecommerce/product-card"
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

export function ProductRail({
  title,
  subtitle,
  products,
  href,
  autoPlay = false,
}: {
  title: string
  subtitle?: string
  products: Product[]
  href?: string
  /** حرکت آرام خودکار — هنگام کشیدن متوقف می‌شود */
  autoPlay?: boolean
}) {
  const [api, setApi] = React.useState<CarouselApi>()

  React.useEffect(() => {
    if (!api || !autoPlay) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let paused = false
    let resumeTimer: number | undefined

    const clearResume = () => {
      if (resumeTimer !== undefined) {
        window.clearTimeout(resumeTimer)
        resumeTimer = undefined
      }
    }

    const hold = () => {
      paused = true
      clearResume()
    }

    const softResume = () => {
      clearResume()
      resumeTimer = window.setTimeout(() => {
        paused = false
      }, 5000)
    }

    api.on("pointerDown", hold)
    api.on("pointerUp", softResume)
    api.on("settle", softResume)

    const root = api.rootNode()
    root.addEventListener("pointerenter", hold)
    root.addEventListener("pointerleave", softResume)

    const id = window.setInterval(() => {
      if (paused) return
      if (api.canScrollNext()) api.scrollNext()
      else api.scrollTo(0)
    }, 4500)

    return () => {
      window.clearInterval(id)
      clearResume()
      api.off("pointerDown", hold)
      api.off("pointerUp", softResume)
      api.off("settle", softResume)
      root.removeEventListener("pointerenter", hold)
      root.removeEventListener("pointerleave", softResume)
    }
  }, [api, autoPlay])

  if (products.length === 0) return null

  return (
    <section className="ecom-rail" aria-label={title}>
      <div className="ecom-rail-head">
        <div className="min-w-0">
          <h2>{title}</h2>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {href ? (
          <Button
            variant="ghost"
            size="sm"
            className="ecom-rail-more shrink-0"
            nativeButton={false}
            render={<Link href={href} />}
          >
            همه
          </Button>
        ) : null}
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          skipSnaps: false,
          dragFree: false,
          loop: false,
          direction: "rtl",
        }}
        className="ecom-rail-carousel"
      >
        <CarouselContent className="-ms-3 sm:-ms-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className="ps-3 basis-[78%] sm:ps-4 sm:basis-[46%] md:basis-[32%] xl:basis-[24%]"
            >
              <ProductCard product={product} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ecom-rail-nav ecom-rail-nav-prev hidden md:inline-flex" />
        <CarouselNext className="ecom-rail-nav ecom-rail-nav-next hidden md:inline-flex" />
      </Carousel>
    </section>
  )
}
