"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ArrowLeftIcon } from "lucide-react"

import { toPersianDigits } from "@/lib/digits"
import { formatCount } from "@/lib/format"
import {
  authors,
  blogName,
  blogTagline,
  categories,
  getAuthor,
  getCategory,
  getFeaturedPost,
  getRecentPosts,
  getRecommendedPosts,
  posts,
} from "@/lib/mock/blog"
import {
  PostCover,
  PostListItem,
  PostMeta,
} from "@/components/blog/blog-parts"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

  return (
    <div className="space-y-10">
      <header className="max-w-2xl space-y-2.5">
        <p className="text-xs font-medium tracking-[0.14em] text-muted-foreground">
          {blogTagline}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          {blogName}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground">
          یادداشت‌های کوتاه درباره طراحی محصول، دسترس‌پذیری و ساخت رابط‌های
          فارسی.
        </p>
      </header>

      {q ? (
        <section className="space-y-4" aria-label="نتایج جستجو">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div className="space-y-1">
              <h2 className="text-base font-semibold tracking-tight">
                نتایج جستجو
              </h2>
              <p className="text-sm text-muted-foreground">
                {formatCount(filtered.length)} مطلب برای «{q}»
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
          <div className="rounded-xl border border-foreground/8 bg-card/40 px-4 sm:px-5">
            {filtered.length === 0 ? (
              <p className="px-1 py-12 text-center text-sm text-muted-foreground">
                مطلبی با این عبارت پیدا نشد.
              </p>
            ) : (
              filtered.map((post) => (
                <PostListItem key={post.id} post={post} />
              ))
            )}
          </div>
        </section>
      ) : (
        <>
          <section aria-labelledby="featured-heading" className="space-y-4">
            <h2
              id="featured-heading"
              className="text-xs font-medium tracking-[0.14em] text-muted-foreground"
            >
              مطلب ویژه
            </h2>
            <article className="overflow-hidden rounded-2xl border border-foreground/8 bg-card/50 shadow-xs">
              <Link
                href={`${BLOG_BASE}/posts/${featured.slug}`}
                className="block outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset"
              >
                <PostCover
                  post={featured}
                  large
                  className="rounded-none border-0"
                />
              </Link>
              <div className="space-y-3 p-5 sm:p-6">
                <PostMeta post={featured} />
                <h3 className="max-w-3xl text-balance text-xl font-semibold tracking-tight sm:text-2xl">
                  <Link
                    href={`${BLOG_BASE}/posts/${featured.slug}`}
                    className="outline-none transition-colors hover:text-foreground/80 focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {featured.title}
                  </Link>
                </h3>
                <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground">
                  {featured.excerpt}
                </p>
                <Button
                  size="sm"
                  className="blog-btn blog-btn-primary gap-1.5"
                  nativeButton={false}
                  render={
                    <Link href={`${BLOG_BASE}/posts/${featured.slug}`} />
                  }
                >
                  خواندن مطلب
                  <ArrowLeftIcon className="size-3.5" data-icon="inline-end" />
                </Button>
              </div>
            </article>
          </section>

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_13.5rem] lg:gap-12">
            <section aria-labelledby="recent-heading">
              <div className="mb-1 flex items-baseline justify-between gap-3">
                <h2
                  id="recent-heading"
                  className="text-base font-semibold tracking-tight"
                >
                  تازه‌ها
                </h2>
                <span className="text-xs text-muted-foreground">
                  {formatCount(filtered.length)} مطلب
                </span>
              </div>
              <div>
                {filtered.map((post) => (
                  <PostListItem key={post.id} post={post} />
                ))}
              </div>
            </section>

            <aside className="space-y-8 lg:sticky lg:top-20 lg:self-start">
              <section
                aria-labelledby="recommended-heading"
                className="space-y-3"
              >
                <h2
                  id="recommended-heading"
                  className="text-xs font-medium tracking-[0.14em] text-muted-foreground"
                >
                  پیشنهاد سردبیر
                </h2>
                <ol className="space-y-0.5">
                  {recommended.map((post, index) => (
                    <li key={post.id} className="flex h-8 items-center gap-2">
                      <span className="w-4 shrink-0 text-xs text-muted-foreground/70">
                        {toPersianDigits(index + 1)}
                      </span>
                      <Link
                        href={`${BLOG_BASE}/posts/${post.slug}`}
                        className="truncate text-sm font-medium whitespace-nowrap transition-colors hover:text-foreground/75"
                      >
                        {post.title}
                      </Link>
                    </li>
                  ))}
                </ol>
              </section>

              <section aria-labelledby="topics-heading" className="space-y-3">
                <h2
                  id="topics-heading"
                  className="text-xs font-medium tracking-[0.14em] text-muted-foreground"
                >
                  موضوع‌ها
                </h2>
                <ul className="space-y-0.5">
                  {categories.map((cat) => {
                    const count = posts.filter(
                      (p) => p.categoryId === cat.id
                    ).length
                    return (
                      <li key={cat.id}>
                        <Link
                          href={`${BLOG_BASE}/categories/${cat.slug}`}
                          className="flex h-8 items-center justify-between gap-3 truncate rounded-md px-2 text-sm whitespace-nowrap transition-colors hover:bg-foreground/4"
                        >
                          <span className="truncate">{cat.name}</span>
                          <span className="shrink-0 text-xs text-muted-foreground">
                            {toPersianDigits(count)}
                          </span>
                        </Link>
                      </li>
                    )
                  })}
                </ul>
              </section>

              <section aria-labelledby="authors-heading" className="space-y-3">
                <h2
                  id="authors-heading"
                  className="text-xs font-medium tracking-[0.14em] text-muted-foreground"
                >
                  نویسندگان
                </h2>
                <ul className="space-y-0.5">
                  {authors.map((author) => (
                    <li
                      key={author.id}
                      className="flex h-8 items-center gap-2 truncate px-0.5"
                    >
                      <Avatar size="sm" className="size-6 shrink-0">
                        <AvatarFallback className="bg-muted text-[0.6rem] text-muted-foreground">
                          {author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 truncate">
                        <p className="truncate text-sm font-medium leading-none">
                          {author.name}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby="newsletter-heading"
                className="space-y-2.5 rounded-xl border border-foreground/8 bg-muted/25 p-4"
              >
                <h2
                  id="newsletter-heading"
                  className="text-sm font-semibold tracking-tight"
                >
                  خبرنامهٔ حاشیه
                </h2>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  هفته‌ای یک یادداشت کوتاه. در این نمونه فقط نمایشی است.
                </p>
                <Button
                  size="sm"
                  className="blog-btn blog-btn-primary w-full"
                  type="button"
                >
                  عضویت نمایشی
                </Button>
              </section>
            </aside>
          </div>
        </>
      )}
    </div>
  )
}
