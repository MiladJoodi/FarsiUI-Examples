"use client"

import Link from "next/link"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

const BANNER_SLIDES = [
  {
    id: "atelier",
    tone: "warm",
    kicker: "اتلیه نورا",
    title: "خرید با سلیقه، نه فقط لیست کالا",
    text: "منتخب هفته را مثل ویترین سردبیری چیده‌ایم — الکترونیک، پوشاک و خانه.",
    cta: "ببین منتخب‌ها",
    href: "/examples/ecommerce",
  },
  {
    id: "tech",
    tone: "cool",
    kicker: "الکترونیک",
    title: "گجت‌های روزمره با دوام واقعی",
    text: "هدفون، ساعت و لوازم میز کار با فیلتر امتیاز و موجودی.",
    cta: "الکترونیک منتخب",
    href: "/examples/ecommerce?category=electronics",
  },
  {
    id: "home",
    tone: "clay",
    kicker: "خانه و آشپزخانه",
    title: "چیدمان آرام برای روزهای عادی",
    text: "از ماگ و چراغ مطالعه تا نظم‌دهنده و تابه — همه در یک نگاه.",
    cta: "برو به خانه",
    href: "/examples/ecommerce?category=home",
  },
] as const

export function HeroBannerSlider() {
  return (
    <section className="ecom-banner" aria-label="بنر فروشگاه">
      <Carousel
        opts={{
          align: "start",
          containScroll: "trimSnaps",
          skipSnaps: false,
          dragFree: false,
          loop: false,
          direction: "rtl",
        }}
        className="ecom-banner-carousel"
      >
        <CarouselContent className="-ms-0">
          {BANNER_SLIDES.map((slide, i) => (
            <CarouselItem key={slide.id} className="basis-full ps-0">
              <article
                className="ecom-banner-slide"
                data-tone={slide.tone}
              >
                <div className="ecom-banner-art" aria-hidden>
                  <span className="ecom-banner-orb ecom-banner-orb-a" />
                  <span className="ecom-banner-orb ecom-banner-orb-b" />
                  <span className="ecom-banner-frame" />
                  <span className="ecom-banner-slab" />
                  <span className="ecom-banner-chip" />
                </div>

                <div className="ecom-banner-copy">
                  <p className="ecom-banner-kicker">{slide.kicker}</p>
                  <h2>{slide.title}</h2>
                  <p className="ecom-banner-text">{slide.text}</p>
                  <Button
                    className="ecom-banner-cta"
                    size="sm"
                    nativeButton={false}
                    render={<Link href={slide.href} />}
                  >
                    {slide.cta}
                  </Button>
                </div>

                <span className="ecom-banner-index ecom-num" aria-hidden>
                  {i + 1} / {BANNER_SLIDES.length}
                </span>
              </article>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="ecom-banner-nav ecom-banner-nav-prev" />
        <CarouselNext className="ecom-banner-nav ecom-banner-nav-next" />
      </Carousel>
    </section>
  )
}
