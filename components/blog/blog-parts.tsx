import Link from "next/link"

import { toPersianDigits } from "@/lib/digits"
import {
  getAuthor,
  getCategory,
  type BlogPost,
} from "@/lib/mock/blog"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const BLOG_BASE = "/examples/blog"

export function PostMeta({
  post,
  className,
}: {
  post: BlogPost
  className?: string
}) {
  const author = getAuthor(post.authorId)
  const category = getCategory(post.categoryId)

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground",
        className
      )}
    >
      <Link
        href={`${BLOG_BASE}/categories/${category.slug}`}
        className="hover:text-foreground"
      >
        {category.name}
      </Link>
      <span aria-hidden>·</span>
      <span>{author.name}</span>
      <span aria-hidden>·</span>
      <time dateTime={post.publishedAt}>{toPersianDigits(post.publishedAt)}</time>
      <span aria-hidden>·</span>
      <span className="tabular-nums">
        {toPersianDigits(post.readingMinutes)} دقیقه مطالعه
      </span>
    </div>
  )
}

export function PostCover({
  post,
  className,
  large,
}: {
  post: BlogPost
  className?: string
  large?: boolean
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border",
        large ? "aspect-[21/9] sm:aspect-[2.4/1]" : "aspect-[16/10]",
        className
      )}
      style={{ backgroundColor: post.accent }}
      role="img"
      aria-label={`پوشش مطلب: ${post.title}`}
    >
      <div className="absolute inset-0 flex items-end p-4 sm:p-5">
        <span className="text-2xl font-semibold tracking-tight text-foreground/50 sm:text-3xl">
          {post.title.slice(0, 1)}
        </span>
      </div>
    </div>
  )
}

export function PostListItem({
  post,
  emphasize,
}: {
  post: BlogPost
  emphasize?: boolean
}) {
  const category = getCategory(post.categoryId)

  return (
    <article className="group grid gap-3 border-b py-5 last:border-0 sm:grid-cols-[minmax(0,1fr)_9.5rem] sm:gap-6 sm:py-6">
      <div className="min-w-0 space-y-2 order-2 sm:order-1">
        <Badge variant="secondary" className="font-normal">
          {category.name}
        </Badge>
        <h3
          className={cn(
            "text-balance font-semibold tracking-tight",
            emphasize ? "text-lg sm:text-xl" : "text-base sm:text-lg"
          )}
        >
          <Link
            href={`${BLOG_BASE}/posts/${post.slug}`}
            className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
          >
            {post.title}
          </Link>
        </h3>
        <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {post.excerpt}
        </p>
        <PostMeta post={post} />
      </div>
      <Link
        href={`${BLOG_BASE}/posts/${post.slug}`}
        className="order-1 block outline-none focus-visible:ring-2 focus-visible:ring-ring sm:order-2"
      >
        <PostCover post={post} className="sm:aspect-square" />
      </Link>
    </article>
  )
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          dir="ltr"
          className="rounded-md border bg-muted/50 px-1.5 py-0.5 font-mono text-[0.85em]"
        >
          {part.slice(1, -1)}
        </code>
      )
    }
    return <span key={i}>{part}</span>
  })
}

export function ArticleBlocks({
  blocks,
}: {
  blocks: BlogPost["blocks"]
}) {
  return (
    <div className="space-y-5 text-[0.9375rem] leading-8 text-foreground sm:text-base sm:leading-8">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return (
            <p key={index} className="text-pretty">
              {renderInline(block.text)}
            </p>
          )
        }
        if (block.type === "h2") {
          return (
            <h2
              key={index}
              className="scroll-mt-20 pt-2 text-lg font-semibold tracking-tight sm:text-xl"
            >
              {block.text}
            </h2>
          )
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-2 ps-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={index}
              className="border-s-2 border-foreground/25 ps-4 text-muted-foreground"
            >
              {block.text}
            </blockquote>
          )
        }
        if (block.type === "code") {
          return (
            <div
              key={index}
              className="overflow-hidden rounded-xl border bg-muted/30"
            >
              <div className="border-b px-3 py-1.5 text-[0.65rem] font-medium uppercase tracking-wide text-muted-foreground">
                {block.language}
              </div>
              <pre
                dir="ltr"
                className="overflow-x-auto p-3 text-start font-mono text-xs leading-relaxed"
              >
                <code>{block.code}</code>
              </pre>
            </div>
          )
        }
        return null
      })}
    </div>
  )
}
