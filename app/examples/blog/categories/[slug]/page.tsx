import { notFound } from "next/navigation"

import { BlogCategoryView } from "@/components/blog/blog-category-view"
import { getCategoryBySlug } from "@/lib/mock/blog"

export default async function BlogCategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const category = getCategoryBySlug(slug)
  if (!category) notFound()
  return <BlogCategoryView category={category} />
}
