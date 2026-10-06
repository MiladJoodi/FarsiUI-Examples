"use client"

import * as React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

const requestTopics = [
  { value: "general", label: "پیام عمومی" },
  { value: "support", label: "پشتیبانی" },
  { value: "sales", label: "درخواست همکاری / فروش" },
  { value: "demo", label: "درخواست دمو" },
] as const

function showContactToast() {
  toast.custom(
    () => (
      <div className="contact-toast" role="status">
        <div>
          <p className="contact-toast-title">پیام ثبت شد</p>
          <p className="contact-toast-desc">به‌زودی پاسخ می‌دهیم.</p>
        </div>
      </div>
    ),
    { duration: 3800 }
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
    }, 450)
  }

  return (
    <div className="contact-main">
      <header className="contact-intro">
        <h1 className="contact-title">تماس با ما</h1>
        <p className="contact-lead">
          فرم تماس ساده برای پیام و درخواست — پاسخ را از همین مسیر پیگیری
          می‌کنیم.
        </p>
      </header>

      <form ref={formRef} className="contact-form" onSubmit={handleSubmit}>
        <label htmlFor="contact-name">
          نام
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="نام و نام خانوادگی"
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
            placeholder="name@example.com"
          />
        </label>

        <label htmlFor="contact-topic">
          نوع درخواست
          <select id="contact-topic" name="topic" required defaultValue="">
            <option value="" disabled>
              انتخاب کنید…
            </option>
            {requestTopics.map((topic) => (
              <option key={topic.value} value={topic.value}>
                {topic.label}
              </option>
            ))}
          </select>
        </label>

        <label htmlFor="contact-message">
          پیام
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="متن پیام یا جزئیات درخواست…"
          />
        </label>

        <Button
          type="submit"
          className="contact-submit w-full"
          disabled={loading}
        >
          {loading ? "در حال ارسال…" : "ارسال"}
        </Button>
      </form>
    </div>
  )
}
