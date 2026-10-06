"use client"

import Image from "next/image"
import type { ReactNode } from "react"

import { authBrandName, authBrandTagline } from "@/lib/mock/auth"

export function AuthStage({ children }: { children: ReactNode }) {
  return (
    <div className="auth-stage">
      <div className="auth-visual" aria-hidden>
        <Image
          src="/parsian.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="auth-visual-img"
        />
        <div className="auth-visual-veil" />
      </div>

      <aside className="auth-brand-plane">
        <div className="auth-brand-foot">
          <h1 className="auth-hero-title">
            {authBrandName}
            <span className="auth-brand-mark" aria-hidden />
          </h1>
          <p className="auth-hero-line">{authBrandTagline}</p>
          <p className="auth-hero-lead">
            ساخته‌شده با{" "}
            <a
              href="https://farsiui.ir"
              target="_blank"
              rel="noopener noreferrer"
              className="auth-credit-link"
              dir="ltr"
            >
              FarsiUI
            </a>
          </p>
        </div>
      </aside>

      <section className="auth-rail" aria-label="فرم احراز هویت">
        <div className="auth-rail-inner">{children}</div>
      </section>
    </div>
  )
}
