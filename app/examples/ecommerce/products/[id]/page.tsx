import { notFound } from "next/navigation"

import { ProductDetailView } from "@/components/ecommerce/product-detail-view"
import { getProductById } from "@/lib/mock/ecommerce"

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const product = getProductById(id)
  if (!product) notFound()
  return <ProductDetailView product={product} />
}
