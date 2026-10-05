import { notFound } from "next/navigation"

import { BlogArticle } from "@/components/blog/blog-article"
import { getPostBySlug, posts } from "@/lib/mock/blog"

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = getPostBySlug(slug)
  if (!post) notFound()

  const index = posts.findIndex((p) => p.id === post.id)
  const prev = index > 0 ? posts[index - 1] : null
  const next = index >= 0 && index < posts.length - 1 ? posts[index + 1] : null

  return <BlogArticle post={post} prev={prev} next={next} />
}
