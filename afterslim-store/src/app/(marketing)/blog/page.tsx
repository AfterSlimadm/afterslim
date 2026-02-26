import type { Metadata } from "next";
import { getAllPosts } from "@/lib/blog/mdx";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { BlogCard } from "@/components/blog/blog-card";
import { SITE } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Blog",
  description: `Health tips, supplement guides, and wellness insights from the ${SITE.name} team. Stay informed and make better choices for your well-being.`,
  openGraph: {
    title: `Blog | ${SITE.name}`,
    description:
      "Health tips, supplement guides, and wellness insights. Stay informed and make better choices for your well-being.",
  },
};

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <Breadcrumbs items={[{ label: "Blog" }]} />
          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">
            From Our Blog
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Expert insights on supplements, nutrition, and healthy living to help
            you make informed decisions on your wellness journey.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">
            No posts yet. Check back soon!
          </p>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
