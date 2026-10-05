import Link from "next/link"
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-react"

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
    <article className="space-y-7">
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

      <header className="mx-auto max-w-2xl space-y-3.5 text-center">
        <PostMeta post={post} className="justify-center" />
        <h1 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
          {post.title}
        </h1>
        <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
          {post.excerpt}
        </p>
      </header>

      <PostCover
        post={post}
        large
        className="rounded-xl border border-foreground/8"
      />

      <div className="mx-auto flex max-w-2xl items-center gap-3 rounded-xl border border-foreground/8 bg-muted/20 px-3.5 py-3">
        <Avatar size="sm">
          <AvatarFallback className="bg-muted text-[0.65rem] text-muted-foreground">
            {author.initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 text-start">
          <p className="text-sm font-medium">{author.name}</p>
          <p className="text-xs leading-relaxed text-muted-foreground">
            {author.role} · {author.bio}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-2xl">
        <ArticleBlocks blocks={post.blocks} />
      </div>

      {(prev || next) && (
        <>
          <Separator className="opacity-60" />
          <nav
            aria-label="مطلب قبلی و بعدی"
            className="mx-auto grid max-w-2xl gap-3 sm:grid-cols-2"
          >
            {prev ? (
              <Link
                href={`${BLOG_BASE}/posts/${prev.slug}`}
                className="group flex flex-col gap-1.5 rounded-xl border border-foreground/8 bg-card/40 p-4 transition-colors hover:bg-muted/40"
              >
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <ArrowRightIcon className="size-3" />
                  مطلب قبلی
                </span>
                <p className="text-sm font-medium leading-snug transition-colors group-hover:text-foreground/80">
                  {prev.title}
                </p>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`${BLOG_BASE}/posts/${next.slug}`}
                className="group flex flex-col gap-1.5 rounded-xl border border-foreground/8 bg-card/40 p-4 text-end transition-colors hover:bg-muted/40 sm:ms-auto sm:text-start"
              >
                <span className="inline-flex items-center justify-end gap-1 text-xs text-muted-foreground sm:justify-start">
                  مطلب بعدی
                  <ArrowLeftIcon className="size-3" />
                </span>
                <p className="text-sm font-medium leading-snug transition-colors group-hover:text-foreground/80">
                  {next.title}
                </p>
              </Link>
            ) : null}
          </nav>
        </>
      )}

      <Separator className="opacity-60" />

      <section aria-labelledby="related-heading" className="space-y-3">
        <h2
          id="related-heading"
          className="text-base font-semibold tracking-tight"
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
