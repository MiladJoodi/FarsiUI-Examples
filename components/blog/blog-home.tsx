"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { toPersianDigits } from "@/lib/digits"
import { formatCount } from "@/lib/format"
import {
  authors,
  categories,
  getFeaturedPost,
  getRecentPosts,
  getRecommendedPosts,
  posts,
  getAuthor,
  getCategory,
} from "@/lib/mock/blog"
import {
  PostCover,
  PostListItem,
  PostMeta,
} from "@/components/blog/blog-parts"
import { Button } from "@/components/ui/button"

const BLOG_BASE = "/examples/blog"

export function BlogHome() {
  const searchParams = useSearchParams()
  const q = (searchParams.get("q") ?? "").trim()

  const featured = getFeaturedPost()
  const recommended = getRecommendedPosts(featured.id, 3)
  const filtered = q
    ? posts.filter((p) => {
        const author = getAuthor(p.authorId)
        const category = getCategory(p.categoryId)
        const hay = `${p.title} ${p.excerpt} ${author.name} ${category.name}`
        return hay.includes(q)
      })
    : getRecentPosts(featured.id)

  if (q) {
    return (
      <section className="blog-article" aria-label="نتایج جستجو">
        <div className="blog-search-head">
          <div>
            <p className="blog-section-label">جستجو</p>
            <h2 className="m-0 text-xl font-bold tracking-tight">
              نتایج برای «{q}»
            </h2>
            <p className="mt-1 text-sm text-[var(--blog-mute)]">
              {formatCount(filtered.length)} مطلب
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="blog-btn blog-btn-soft"
            nativeButton={false}
            render={<Link href={BLOG_BASE} />}
          >
            پاک کردن جستجو
          </Button>
        </div>
        {filtered.length === 0 ? (
          <p className="blog-empty">مطلبی با این عبارت پیدا نشد.</p>
        ) : (
          <div className="blog-feed-panel">
            <ol className="blog-feed">
              {filtered.map((post, i) => (
                <PostListItem key={post.id} post={post} index={i} />
              ))}
            </ol>
          </div>
        )}
      </section>
    )
  }

  return (
    <>
      <section className="blog-lead" aria-labelledby="featured-heading">
        <div className="blog-lead-copy">
          <p id="featured-heading" className="blog-lead-kicker">
            مطلب روی جلد
          </p>
          <h2 className="blog-lead-title">
            <Link href={`${BLOG_BASE}/posts/${featured.slug}`}>
              {featured.title}
            </Link>
          </h2>
          <p className="blog-lead-excerpt">{featured.excerpt}</p>
          <PostMeta post={featured} />
          <div>
            <Button
              size="sm"
              className="blog-btn blog-btn-primary gap-1.5"
              nativeButton={false}
              render={<Link href={`${BLOG_BASE}/posts/${featured.slug}`} />}
            >
              خواندن مطلب
              <ArrowLeftIcon className="size-3.5" data-icon="inline-end" />
            </Button>
          </div>
        </div>
        <Link
          href={`${BLOG_BASE}/posts/${featured.slug}`}
          className="blog-lead-cover outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <PostCover post={featured} large className="size-full min-h-[12.5rem]" />
        </Link>
      </section>

      <div className="blog-home-grid">
        <section aria-labelledby="recent-heading">
          <div className="mb-2 flex items-baseline justify-between gap-3">
            <h2 id="recent-heading" className="blog-section-label m-0">
              تازه‌های حاشیه
            </h2>
            <span className="text-xs text-[var(--blog-mute)]">
              {formatCount(filtered.length)} مطلب
            </span>
          </div>
          <div className="blog-feed-panel">
            <ol className="blog-feed">
              {filtered.map((post, i) => (
                <PostListItem key={post.id} post={post} index={i} />
              ))}
            </ol>
          </div>
        </section>

        <aside className="blog-aside" aria-label="حاشیهٔ صفحه">
          <div className="blog-aside-block" data-tone="accent">
            <h2 className="blog-section-label">پیشنهاد سردبیر</h2>
            <ol className="blog-aside-list">
              {recommended.map((post, index) => (
                <li key={post.id}>
                  <Link href={`${BLOG_BASE}/posts/${post.slug}`}>
                    <span className="tabular-nums" dir="ltr">
                      {toPersianDigits(index + 1)}
                    </span>
                    {" — "}
                    {post.title}
                  </Link>
                  <span>{getCategory(post.categoryId).name}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="blog-aside-block">
            <h2 className="blog-section-label">موضوع‌ها</h2>
            <ul className="blog-aside-list">
              {categories.map((cat) => {
                const count = posts.filter((p) => p.categoryId === cat.id).length
                return (
                  <li key={cat.id}>
                    <Link href={`${BLOG_BASE}/categories/${cat.slug}`}>
                      {cat.name}
                    </Link>
                    <span>{toPersianDigits(count)} مطلب</span>
                  </li>
                )
              })}
            </ul>
          </div>

          <div className="blog-aside-block">
            <h2 className="blog-section-label">نویسندگان</h2>
            <ul className="blog-aside-list">
              {authors.map((author) => (
                <li key={author.id}>
                  <span className="text-sm font-semibold text-[var(--blog-ink)]">
                    {author.name}
                  </span>
                  <span>{author.role}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="blog-aside-block" data-tone="accent">
            <h2 className="blog-section-label">خبرنامه</h2>
            <div className="blog-newsletter">
              <p>هفته‌ای یک یادداشت کوتاه از حاشیه. در این دمو فقط نمایشی است.</p>
              <Button
                size="sm"
                className="blog-btn blog-btn-primary w-full"
                type="button"
              >
                عضویت نمایشی
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </>
  )
}
