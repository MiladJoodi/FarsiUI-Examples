import { ProductsCatalog } from "@/components/products/products-catalog"

export default function ProductsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-1">
        <h1 className="text-lg font-semibold tracking-tight">کاتالوگ محصولات</h1>
        <p className="text-sm text-muted-foreground">
          نمای کارتی موجودی، فروش و دسته‌بندی کالاها
        </p>
      </div>
      <ProductsCatalog />
    </div>
  )
}
