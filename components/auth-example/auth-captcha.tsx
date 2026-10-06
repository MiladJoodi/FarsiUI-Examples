"use client"

import { CheckIcon, ChevronLeftIcon, RefreshCwIcon, ShieldCheckIcon } from "lucide-react"
import * as React from "react"

import { cn } from "@/lib/utils"

type AuthCaptchaProps = {
  verified: boolean
  onVerifiedChange: (ok: boolean) => void
  className?: string
}

const THUMB = 44
const TOLERANCE = 0.05

/** Demo-only puzzle slider captcha — not real bot protection. */
export function AuthCaptcha({
  verified,
  onVerifiedChange,
  className,
}: AuthCaptchaProps) {
  const trackRef = React.useRef<HTMLDivElement>(null)
  const [target, setTarget] = React.useState(0.68)
  const [pos, setPos] = React.useState(0)
  const [dragging, setDragging] = React.useState(false)
  const [shake, setShake] = React.useState(false)
  const dragStart = React.useRef({ x: 0, pos: 0 })

  const reset = React.useCallback(() => {
    onVerifiedChange(false)
    setPos(0)
    setShake(false)
    setDragging(false)
    setTarget(0.48 + Math.random() * 0.36)
  }, [onVerifiedChange])

  React.useEffect(() => {
    setTarget(0.48 + Math.random() * 0.36)
  }, [])

  function travel() {
    const el = trackRef.current
    if (!el) return 1
    return Math.max(1, el.clientWidth - THUMB)
  }

  function offset(p: number) {
    return `calc(${p * 100}% - ${p * THUMB}px)`
  }

  function tryVerify(p: number) {
    if (Math.abs(p - target) <= TOLERANCE) {
      setPos(target)
      onVerifiedChange(true)
      return true
    }
    return false
  }

  function onPointerDown(e: React.PointerEvent<HTMLButtonElement>) {
    if (verified) return
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
    dragStart.current = { x: e.clientX, pos }
  }

  function onPointerMove(e: React.PointerEvent<HTMLButtonElement>) {
    if (!dragging || verified) return
    // RTL: drag toward the left increases progress
    const delta = (dragStart.current.x - e.clientX) / travel()
    setPos(Math.min(1, Math.max(0, dragStart.current.pos + delta)))
  }

  function onPointerUp() {
    if (!dragging) return
    setDragging(false)
    if (verified) return
    if (tryVerify(pos)) return
    setShake(true)
    window.setTimeout(() => {
      setShake(false)
      setPos(0)
    }, 320)
  }

  return (
    <div
      className={cn("auth-captcha", className)}
      data-ok={verified ? "true" : "false"}
      data-shake={shake ? "true" : "false"}
    >
      <div className="auth-captcha-head">
        <span className="auth-captcha-label">
          <ShieldCheckIcon className="size-3.5" aria-hidden />
          تأیید انسان بودن
        </span>
        <button
          type="button"
          className="auth-captcha-refresh"
          onClick={reset}
          aria-label="تازه‌سازی کپچا"
        >
          <RefreshCwIcon className="size-3.5" />
        </button>
      </div>

      <div className="auth-captcha-scene" aria-hidden>
        <div
          className="auth-captcha-bg"
          style={{ backgroundImage: "url(/parsian.jpg)" }}
        />
        <div className="auth-captcha-glow" />
        <div className="auth-captcha-veil" />
        <div className="auth-captcha-grid" />
        <div
          className="auth-captcha-slot"
          style={{ insetInlineStart: offset(target) }}
          data-ok={verified ? "true" : "false"}
        />
        <div
          className="auth-captcha-piece"
          style={{
            insetInlineStart: offset(pos),
            backgroundImage: "url(/parsian.jpg)",
            backgroundPosition: `${target * 100}% 42%`,
          }}
          data-dragging={dragging ? "true" : "false"}
          data-ok={verified ? "true" : "false"}
        />
        {verified ? (
          <div className="auth-captcha-ok">
            <CheckIcon className="size-3.5" strokeWidth={2.6} />
            تأیید شد
          </div>
        ) : null}
      </div>

      <div
        ref={trackRef}
        className="auth-captcha-track"
        data-ok={verified ? "true" : "false"}
      >
        <div
          className="auth-captcha-fill"
          style={{ width: `calc(${pos * 100}% )` }}
        />
        <p className="auth-captcha-hint">
          {verified ? "هویت تأیید شد" : "قطعه را روی جای خالی بکشید"}
        </p>
        <button
          type="button"
          className="auth-captcha-thumb"
          aria-label="کشیدن قطعه کپچا"
          role="slider"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(pos * 100)}
          disabled={verified}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{ insetInlineStart: offset(pos) }}
        >
          {verified ? (
            <CheckIcon className="size-4" strokeWidth={2.5} />
          ) : (
            <span className="auth-captcha-thumb-chevs" dir="ltr" aria-hidden>
              <ChevronLeftIcon className="size-3.5" strokeWidth={2.6} />
              <ChevronLeftIcon className="size-3.5 -ms-2" strokeWidth={2.6} />
            </span>
          )}
        </button>
      </div>
    </div>
  )
}
