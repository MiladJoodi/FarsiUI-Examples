"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

function showContactToast() {
  toast.custom(
    () => (
      <div className="contact-toast" role="status">
        <div>
          <p className="contact-toast-title">پیام ثبت شد</p>
          <p className="contact-toast-desc">
            در این نمونه ارسال واقعی انجام نمی‌شود.
          </p>
        </div>
      </div>
    ),
    { duration: 4200 }
  )
}

export function ContactView() {
  const [loading, setLoading] = React.useState(false)
  const formRef = React.useRef<HTMLFormElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      showContactToast()
      formRef.current?.reset()
    }, 400)
  }

  return (
    <div className="contact-main">
      <h1 className="contact-title">تماس با ما</h1>
      <p className="contact-lead">
        سوال، پیشنهاد یا درخواست دمو — فرم زیر را پر کنید. پاسخ در این نمونه
        نمایشی است.
      </p>

      <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="contact-name">
          نام
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue="سارا محمدی"
          />
        </label>
        <label htmlFor="contact-email">
          ایمیل
          <input
            id="contact-email"
            name="email"
            type="email"
            dir="ltr"
            required
            autoComplete="email"
            className="text-start"
            defaultValue="info@farsiui.ir"
          />
        </label>
        <label htmlFor="contact-message">
          پیام
          <textarea
            id="contact-message"
            name="message"
            required
            placeholder="متن پیام…"
            defaultValue="سلام، می‌خواهم دربارهٔ FarsiUI بیشتر بدانم."
          />
        </label>
        <Button
          type="submit"
          className="contact-submit w-full"
          disabled={loading}
        >
          {loading ? "در حال ارسال…" : "ارسال پیام"}
        </Button>
      </form>
    </div>
  )
}
