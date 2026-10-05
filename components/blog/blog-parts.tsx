import Link from "next/link"
import { ImageIcon } from "lucide-react"

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
        className="text-foreground/70 transition-colors hover:text-foreground"
      >
        {category.name}
      </Link>
      <span aria-hidden className="text-foreground/20">
        ·
      </span>
      <span>{author.name}</span>
      <span aria-hidden className="text-foreground/20">
        ·
      </span>
      <time dateTime={post.publishedAt}>
        {toPersianDigits(post.publishedAt)}
      </time>
      <span aria-hidden className="text-foreground/20">
        ·
      </span>
      <span>
        {toPersianDigits(post.readingMinutes)} دقیقه مطالعه
      </span>
    </div>
  )
}

/** Neutral gray wireframe cover — solid gray so it reads in light mode. */
export function PostCover({
  post,
  className,
  large,
}: {
  post: BlogPost
  className?: string
  large?: boolean
}) {
  const category = getCategory(post.categoryId)

  return (
    <div
      className={cn(
        "blog-cover relative flex items-center justify-center overflow-hidden",
        large ? "aspect-[21/9] sm:aspect-[2.35/1]" : "aspect-[16/10]",
        className
      )}
      role="img"
      aria-label={`پوشش مطلب: ${post.title}`}
    >
      <div
        className={cn(
          "blog-cover-frame relative z-[1] flex flex-col items-center rounded-lg",
          large ? "gap-2 px-6 py-5 sm:px-8 sm:py-6" : "gap-1.5 px-4 py-3.5"
        )}
      >
        <ImageIcon
          className={cn(
            "text-foreground/45 stroke-[1.25]",
            large ? "size-8 sm:size-9" : "size-6"
          )}
          aria-hidden
        />
        <span className="text-[0.65rem] font-medium tracking-wide text-foreground/55">
          {category.name}
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
    <article className="group grid gap-3 border-b border-foreground/8 py-5 last:border-0 sm:grid-cols-[minmax(0,1fr)_8.5rem] sm:items-start sm:gap-5 sm:py-5">
      <div className="order-2 min-w-0 space-y-2 sm:order-1">
        <Badge
          variant="secondary"
          className="font-normal tracking-normal text-muted-foreground"
        >
          {category.name}
        </Badge>
        <h3
          className={cn(
            "text-balance font-semibold tracking-tight",
            emphasize ? "text-base sm:text-lg" : "text-sm sm:text-base"
          )}
        >
          <Link
            href={`${BLOG_BASE}/posts/${post.slug}`}
            className="outline-none transition-colors hover:text-foreground/75 focus-visible:ring-2 focus-visible:ring-ring"
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
        className="order-1 block overflow-hidden rounded-lg outline-none ring-offset-background transition-opacity group-hover:opacity-90 focus-visible:ring-2 focus-visible:ring-ring sm:order-2"
      >
        <PostCover post={post} className="rounded-lg sm:aspect-square" />
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
          className="rounded-md bg-muted/70 px-1.5 py-0.5 font-mono text-[0.85em]"
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
    <div className="space-y-5 text-[0.9375rem] leading-8 text-foreground/90 sm:text-[0.975rem] sm:leading-8">
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
              className="scroll-mt-20 pt-3 text-lg font-semibold tracking-tight text-foreground sm:text-xl"
            >
              {block.text}
            </h2>
          )
        }
        if (block.type === "ul") {
          return (
            <ul key={index} className="list-disc space-y-2 ps-5 marker:text-muted-foreground">
              {block.items.map((item) => (
                <li key={item} className="ps-1">
                  {item}
                </li>
              ))}
            </ul>
          )
        }
        if (block.type === "quote") {
          return (
            <blockquote
              key={index}
              className="border-s-2 border-foreground/15 bg-muted/30 py-3 ps-4 pe-3 text-[0.95em] leading-relaxed text-muted-foreground"
            >
              {block.text}
            </blockquote>
          )
        }
        if (block.type === "code") {
          return (
            <div
              key={index}
              className="overflow-hidden rounded-xl bg-[oklch(0.22_0.02_260)] text-[oklch(0.92_0.01_100)] shadow-sm dark:bg-[oklch(0.18_0.02_260)]"
            >
              <div className="border-b border-white/8 px-3 py-1.5 text-[0.65rem] font-medium tracking-wide text-white/45 uppercase">
                {block.language}
              </div>
              <pre
                dir="ltr"
                className="overflow-x-auto p-3.5 text-start font-mono text-xs leading-relaxed"
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
