import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getPostBySlug, getPostSlugs, getAllPosts } from "@/lib/blog/mdx";
import { getMDXComponents } from "@/components/blog/mdx-components";
import { BlogCard } from "@/components/blog/blog-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { formatDate } from "@/lib/utils";
import { SITE } from "@/lib/constants";

// ---------------------------------------------------------------------------
// Static params
// ---------------------------------------------------------------------------

export function generateStaticParams() {
  return getPostSlugs().map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Dynamic metadata
// ---------------------------------------------------------------------------

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: `${post.title} | ${SITE.name}`,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      authors: [post.author],
      ...(post.image && { images: [{ url: post.image }] }),
    },
  };
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) notFound();

  // Related posts: same tags, excluding current, up to 3
  const allPosts = getAllPosts();
  const relatedPosts = allPosts
    .filter(
      (p) =>
        p.slug !== post.slug &&
        p.tags.some((tag) => post.tags.includes(tag))
    )
    .slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-16 sm:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <Breadcrumbs
            items={[
              { label: "Blog", href: "/blog" },
              { label: post.title },
            ]}
          />

          {/* Back link */}
          <Link
            href="/blog"
            className="mt-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Blog
          </Link>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Title */}
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <User className="size-4" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="size-4" />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-4" />
              {post.readTime}
            </span>
          </div>
        </div>
      </section>

      {/* Article content */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose-custom">
          <MDXRemote source={post.content} components={getMDXComponents()} />
        </div>

        <Separator className="my-10" />

        {/* Tags footer */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-foreground">Tags:</span>
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </article>

      {/* Related posts */}
      {relatedPosts.length > 0 && (
        <section className="border-t bg-muted/30 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-8 text-2xl font-bold tracking-tight">
              Related Articles
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((rp) => (
                <BlogCard key={rp.slug} post={rp} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
