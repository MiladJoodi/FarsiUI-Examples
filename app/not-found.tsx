import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <p className="text-sm text-muted-foreground">۴۰۴</p>
      <h1 className="text-2xl font-semibold tracking-tight">صفحه پیدا نشد</h1>
      <p className="text-sm leading-relaxed text-muted-foreground">
        این مسیر وجود ندارد یا حذف شده است. از فهرست نمونه‌ها ادامه دهید.
      </p>
      <Link href="/examples" className={cn(buttonVariants(), "mt-2")}>
        بازگشت به نمونه‌ها
      </Link>
    </main>
  )
}
