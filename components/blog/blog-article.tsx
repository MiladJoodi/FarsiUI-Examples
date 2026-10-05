import Link from "next/link"

import {
  getAuthor,
  getCategory,
  getRelatedPosts,
  type BlogPost,
} from "@/lib/mock/blog"
import {
  ArticleBlocks,
  PostCover,
  PostListItem,
  PostMeta,
} from "@/components/blog/blog-parts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"

const BLOG_BASE = "/examples/blog"

export function BlogArticle({
  post,
  prev,
  next,
}: {
  post: BlogPost
  prev?: BlogPost | null
  next?: BlogPost | null
}) {
  const author = getAuthor(post.authorId)
  const category = getCategory(post.categoryId)
  const related = getRelatedPosts(post, 3)

  return (
    <article className="space-y-8">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link href={BLOG_BASE} />}>
              حاشیه
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              render={
                <Link href={`${BLOG_BASE}/categories/${category.slug}`} />
              }
            >
              {category.name}
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="line-clamp-1">
              {post.title}
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <header className="mx-auto max-w-2xl space-y-4 text-center sm:space-y-5">
        <PostMeta post={post} className="justify-center" />
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
          {post.title}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
          {post.excerpt}
        </p>
      </header>

      <PostCover post={post} large />

      <div className="mx-auto flex max-w-2xl items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback className="text-[0.65rem]">
            {author.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 text-start">
          <p className="text-sm font-medium">{author.name}</p>
          <p className="text-xs text-muted-foreground">
            {author.role} · {author.bio}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <ArticleBlocks blocks={post.blocks} />
      </div>

      {(prev || next) && (
        <>
          <Separator />
          <nav
            aria-label="مطلب قبلی و بعدی"
            className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`${BLOG_BASE}/posts/${prev.slug}`}
                className="rounded-xl border p-4 transition-colors hover:bg-muted/40"
              >
                <p className="text-xs text-muted-foreground">مطلب قبلی</p>
                <p className="mt-1 text-sm font-medium leading-snug">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`${BLOG_BASE}/posts/${next.slug}`}
                className="rounded-xl border p-4 text-end transition-colors hover:bg-muted/40 sm:text-start"
              >
                <p className="text-xs text-muted-foreground">مطلب بعدی</p>
                <p className="mt-1 text-sm font-medium leading-snug">
                  {next.title}
                </p>
              </Link>
            ) : null}
          </nav>
        </>
      )}

      <Separator />

      <section aria-labelledby="related-heading" className="space-y-2">
        <h2
          id="related-heading"
          className="text-lg font-semibold tracking-tight"
        >
          مطالب مرتبط
        </h2>
        <div>
          {related.map((item) => (
            <PostListItem key={item.id} post={item} />
          ))}
        </div>
      </section>
    </article>
  )
}
