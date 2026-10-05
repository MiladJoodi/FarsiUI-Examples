import { Suspense } from "react"

import { CatalogView } from "@/components/ecommerce/catalog-view"

export default function EcommercePage() {
  return (
    <Suspense
      fallback={
        <div className="py-16 text-center text-sm text-muted-foreground">
          در حال بارگذاری فروشگاه…
        </div>
      }
    >
      <CatalogView />
    </Suspense>
  )
}
