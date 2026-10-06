import Link from "next/link"

import { toPersianDigits } from "@/lib/digits"
import {
  getAuthor,
  getCategory,
  type BlogPost,
} from "@/lib/mock/blog"
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

  return (
    <div className={cn("blog-meta", className)}>
      <span>{author.name}</span>
      <span className="blog-meta-dot" aria-hidden>
        ·
      </span>
      <time dateTime={post.publishedAt}>
        {toPersianDigits(post.publishedAt)}
      </time>
      <span className="blog-meta-dot" aria-hidden>
        ·
      </span>
      <span>{toPersianDigits(post.readingMinutes)} دقیقه</span>
    </div>
  )
}

/** Category-tinted ink field — typographic cover, not a wireframe. */
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
  const initial = category.name.trim().charAt(0)

  return (
    <div
      className={cn(
        "blog-cover",
        large && "blog-cover-large",
        className
      )}
      data-cat={post.categoryId}
      role="img"
      aria-label={`پوشش مطلب: ${post.title}`}
    >
      <div className="blog-cover-mark">
        <span className="blog-cover-initial" aria-hidden>
          {initial}
        </span>
        <span className="blog-cover-label">{category.name}</span>
      </div>
    </div>
  )
}

export function PostListItem({
  post,
  index,
}: {
  post: BlogPost
  index?: number
}) {
  const category = getCategory(post.categoryId)
  const num =
    typeof index === "number" ? toPersianDigits(index + 1).padStart(2, "۰") : null

  return (
    <li className="blog-feed-item">
      {num ? (
        <span className="blog-feed-num" aria-hidden>
          {num}
        </span>
      ) : (
        <span className="blog-feed-num" aria-hidden>
          —
        </span>
      )}
      <div className="blog-feed-body">
        <Link
          href={`${BLOG_BASE}/categories/${category.slug}`}
          className="blog-feed-cat"
        >
          {category.name}
        </Link>
        <h3 className="blog-feed-title">
          <Link href={`${BLOG_BASE}/posts/${post.slug}`}>{post.title}</Link>
        </h3>
        <p className="blog-feed-excerpt line-clamp-2">{post.excerpt}</p>
        <PostMeta post={post} />
      </div>
      <Link
        href={`${BLOG_BASE}/posts/${post.slug}`}
        className="blog-feed-thumb outline-none focus-visible:ring-2 focus-visible:ring-ring"
        tabIndex={-1}
        aria-hidden
      >
        <PostCover post={post} className="aspect-square size-full" />
      </Link>
    </li>
  )
}

function renderInline(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g)
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={i}
          dir="ltr"
          className="rounded-md bg-[color-mix(in_oklch,var(--blog-ink)_8%,transparent)] px-1.5 py-0.5 font-mono text-[0.85em]"
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
    <div className="blog-prose">
      {blocks.map((block, index) => {
        if (block.type === "p") {
          return <p key={index}>{renderInline(block.text)}</p>
        }
        if (block.type === "h2") {
          return <h2 key={index}>{block.text}</h2>
        }
        if (block.type === "ul") {
          return (
            <ul key={index}>
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )
        }
        if (block.type === "quote") {
          return <blockquote key={index}>{block.text}</blockquote>
        }
        if (block.type === "code") {
          return (
            <pre key={index}>
              <code>{block.code}</code>
            </pre>
          )
        }
        return null
      })}
    </div>
  )
}
