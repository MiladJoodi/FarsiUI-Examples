import type { ReactNode } from "react"

import { ContactShell } from "@/components/contact-example/contact-shell"

export default function ContactExampleLayout({
  children,
}: {
  children: ReactNode
}) {
  return <ContactShell>{children}</ContactShell>
}
