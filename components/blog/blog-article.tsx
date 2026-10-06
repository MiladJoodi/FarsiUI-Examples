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
    <article className="blog-article">
      <Breadcrumb className="blog-article-crumbs">
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

      <header className="blog-article-hero">
        <Link
          href={`${BLOG_BASE}/categories/${category.slug}`}
          className="blog-article-kicker"
        >
          {category.name}
        </Link>
        <h1 className="blog-article-title" title={post.title}>
          {post.title}
        </h1>
        <PostMeta post={post} />
        <p className="blog-article-excerpt">{post.excerpt}</p>
      </header>

      <div className="blog-article-sheet">
        <div className="blog-article-cover">
          <PostCover post={post} large className="size-full" />
        </div>

        <div className="blog-author-chip">
          <Avatar size="sm">
            <AvatarFallback className="blog-author-avatar">
              {author.initials}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 text-start">
            <p className="blog-author-name">{author.name}</p>
            <p className="blog-author-bio">
              {author.role} · {author.bio}
            </p>
          </div>
        </div>

        <ArticleBlocks blocks={post.blocks} />

        {(prev || next) && (
          <nav aria-label="مطلب قبلی و بعدی" className="blog-pager">
            {prev ? (
              <Link href={`${BLOG_BASE}/posts/${prev.slug}`}>
                <span className="blog-pager-label">
                  <ArrowRightIcon className="size-3" />
                  مطلب قبلی
                </span>
                <span className="blog-pager-title">{prev.title}</span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={`${BLOG_BASE}/posts/${next.slug}`}
                className="sm:text-end"
              >
                <span className="blog-pager-label sm:justify-end">
                  مطلب بعدی
                  <ArrowLeftIcon className="size-3" />
                </span>
                <span className="blog-pager-title">{next.title}</span>
              </Link>
            ) : null}
          </nav>
        )}
      </div>

      <section aria-labelledby="related-heading" className="blog-article-related">
        <h2 id="related-heading" className="blog-section-label">
          مطالب مرتبط
        </h2>
        <div className="blog-feed-panel">
          <ol className="blog-feed">
            {related.map((item, i) => (
              <PostListItem key={item.id} post={item} index={i} />
            ))}
          </ol>
        </div>
      </section>
    </article>
  )
}
