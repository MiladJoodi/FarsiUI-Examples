import Link from "next/link"

import { formatCount } from "@/lib/format"
import {
  getPostsByCategory,
  type BlogCategory,
} from "@/lib/mock/blog"
import { PostListItem } from "@/components/blog/blog-parts"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const BLOG_BASE = "/examples/blog"

export function BlogCategoryView({ category }: { category: BlogCategory }) {
  const items = getPostsByCategory(category.id)

  return (
    <div className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={BLOG_BASE} />}>
              حاشیه
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{category.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="max-w-2xl space-y-3">
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {category.name}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          {category.description}
        </p>
        <p className="text-xs text-muted-foreground">
          {formatCount(items.length)} مطلب
        </p>
      </header>

      <div>
        {items.length === 0 ? (
          <p className="border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
            هنوز مطلبی در این موضوع نیست.
          </p>
        ) : (
          items.map((post) => <PostListItem key={post.id} post={post} />)
        )}
      </div>
    </div>
  )
}
