"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"

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
import { Separator } from "@/components/ui/separator"

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
    <div className="space-y-12">
      <header className="max-w-2xl space-y-3">
        <p className="text-sm text-muted-foreground">{blogTagline}</p>
        <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
          {blogName}
        </h1>
        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
          یادداشت‌های کوتاه درباره طراحی محصول، دسترس‌پذیری و ساخت رابط‌های
          فارسی — بدون شعار اضافه.
        </p>
      </header>

      {q ? (
        <section className="space-y-4" aria-label="نتایج جستجو">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                نتایج جستجو
              </h2>
              <p className="text-sm text-muted-foreground">
                {formatCount(filtered.length)} مطلب برای «{q}»
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              nativeButton={false}
              render={<Link href={BLOG_BASE} />}
            >
              پاک کردن جستجو
            </Button>
          </div>
          <div>
            {filtered.length === 0 ? (
              <p className="border border-dashed px-4 py-12 text-center text-sm text-muted-foreground">
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
          <section aria-labelledby="featured-heading" className="space-y-5">
            <div className="flex items-baseline justify-between gap-3">
              <h2
                id="featured-heading"
                className="text-sm font-medium text-muted-foreground"
              >
                مطلب ویژه
              </h2>
            </div>
            <article className="space-y-5">
              <Link
                href={`${BLOG_BASE}/posts/${featured.slug}`}
                className="block outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <PostCover post={featured} large />
              </Link>
              <div className="max-w-3xl space-y-3">
                <PostMeta post={featured} />
                <h3 className="text-balance text-2xl font-semibold tracking-tight sm:text-3xl">
                  <Link
                    href={`${BLOG_BASE}/posts/${featured.slug}`}
                    className="outline-none hover:underline focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {featured.title}
                  </Link>
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {featured.excerpt}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  nativeButton={false}
                  render={
                    <Link href={`${BLOG_BASE}/posts/${featured.slug}`} />
                  }
                >
                  خواندن مطلب
                </Button>
              </div>
            </article>
          </section>

          <Separator />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-12">
            <section aria-labelledby="recent-heading">
              <h2
                id="recent-heading"
                className="mb-2 text-lg font-semibold tracking-tight"
              >
                تازه‌ها
              </h2>
              <div>
                {filtered.map((post) => (
                  <PostListItem key={post.id} post={post} />
                ))}
              </div>
            </section>

            <aside className="space-y-8 lg:pt-1">
              <section
                aria-labelledby="recommended-heading"
                className="space-y-3"
              >
                <h2
                  id="recommended-heading"
                  className="text-sm font-medium text-muted-foreground"
                >
                  پیشنهاد سردبیر
                </h2>
                <ol className="space-y-3">
                  {recommended.map((post, index) => (
                    <li key={post.id} className="flex gap-2">
                      <span className="w-5 shrink-0 tabular-nums text-sm text-muted-foreground">
                        {toPersianDigits(index + 1)}
                      </span>
                      <Link
                        href={`${BLOG_BASE}/posts/${post.slug}`}
                        className="text-sm font-medium leading-snug hover:underline"
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
                  className="text-sm font-medium text-muted-foreground"
                >
                  موضوع‌ها
                </h2>
                <ul className="space-y-2">
                  {categories.map((cat) => {
                    const count = posts.filter(
                      (p) => p.categoryId === cat.id
                    ).length
                    return (
                      <li key={cat.id}>
                        <Link
                          href={`${BLOG_BASE}/categories/${cat.slug}`}
                          className="flex items-baseline justify-between gap-3 text-sm hover:underline"
                        >
                          <span>{cat.name}</span>
                          <span className="tabular-nums text-muted-foreground">
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
                  className="text-sm font-medium text-muted-foreground"
                >
                  نویسندگان
                </h2>
                <ul className="space-y-3">
                  {authors.map((author) => (
                    <li key={author.id} className="flex gap-2">
                      <Avatar size="sm">
                        <AvatarFallback className="text-[0.65rem]">
                          {author.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="text-sm font-medium">{author.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {author.role}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </section>

              <section
                aria-labelledby="newsletter-heading"
                className="space-y-2 border-t pt-6"
              >
                <h2
                  id="newsletter-heading"
                  className="text-sm font-semibold tracking-tight"
                >
                  خبرنامهٔ حاشیه
                </h2>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  هفته‌ای یک یادداشت کوتاه دربارهٔ طراحی محصول فارسی. در این
                  نمونه فقط نمایشی است.
                </p>
                <Button size="sm" className="w-full" type="button">
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
