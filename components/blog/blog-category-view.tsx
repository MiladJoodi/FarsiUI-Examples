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
    <div className="blog-article">
      <Breadcrumb className="mb-4">
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

      <header className="blog-cat-header">
        <p className="blog-section-label mb-0">موضوع</p>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
        <p className="mt-2 text-xs text-[var(--blog-mute)]">
          {formatCount(items.length)} مطلب
        </p>
      </header>

      {items.length === 0 ? (
        <p className="blog-empty">هنوز مطلبی در این موضوع نیست.</p>
      ) : (
        <div className="blog-feed-panel">
          <ol className="blog-feed">
            {items.map((post, i) => (
              <PostListItem key={post.id} post={post} index={i} />
            ))}
          </ol>
        </div>
      )}
    </div>
  )
}
