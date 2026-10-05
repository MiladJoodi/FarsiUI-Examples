import type { Metadata } from "next"
import localFont from "next/font/local"
import { cookies } from "next/headers"
import Script from "next/script"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/layout/theme-provider"
import { DesignSystemPreviewProvider } from "@/components/design-system/design-system-preview"
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"
import {
  DESIGN_SYSTEM_BOOTSTRAP_SCRIPT,
  DESIGN_SYSTEM_COOKIE,
  DESIGN_SYSTEM_STYLE_CLASS,
  normalizeDesignSystemId,
  type DesignSystemCookieId,
} from "@/lib/design-system"

const vazirmatn = localFont({
  src: [
    {
      path: "../public/fonts/vazirmatn/Vazirmatn-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/vazirmatn/Vazirmatn-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../public/fonts/vazirmatn/Vazirmatn-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../public/fonts/vazirmatn/Vazirmatn-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
  fallback: ["Tahoma", "Arial", "sans-serif"],
})

export const metadata: Metadata = {
  title: "نمونه‌های FarsiUI",
  description: "نمونه‌های مستقل فارسی و RTL با FarsiUI",
  icons: {
    icon: [{ url: "/favicon.png", type: "image/png" }],
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const cookieStore = await cookies()
  const designSystemId = normalizeDesignSystemId(
    cookieStore.get(DESIGN_SYSTEM_COOKIE)?.value
  ) as DesignSystemCookieId
  const styleRootClass = DESIGN_SYSTEM_STYLE_CLASS[designSystemId]

  return (
    <html
      lang="fa"
      dir="rtl"
      suppressHydrationWarning
      className={cn(
        styleRootClass,
        "h-full antialiased",
        vazirmatn.variable,
        "font-sans"
      )}
    >
      <body
        suppressHydrationWarning
        className={cn(styleRootClass, "min-h-full flex flex-col font-sans")}
      >
        <Script
          id="farsiui-design-system-bootstrap"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{ __html: DESIGN_SYSTEM_BOOTSTRAP_SCRIPT }}
        />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <DesignSystemPreviewProvider initialDesignSystem={designSystemId}>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </DesignSystemPreviewProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
