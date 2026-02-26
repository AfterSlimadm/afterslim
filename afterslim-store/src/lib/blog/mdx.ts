import fs from "fs";
import path from "path";
import matter from "gray-matter";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface PostFrontmatter {
  title: string;
  description: string;
  date: string; // YYYY-MM-DD
  author: string;
  image?: string;
  tags: string[];
  readTime: string;
}

export interface PostMeta extends PostFrontmatter {
  slug: string;
}

export interface Post extends PostMeta {
  /** Raw MDX content (without frontmatter) for rendering with MDXRemote */
  content: string;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function getMdxFiles(): string[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];
  return fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".mdx"));
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Returns all available post slugs (filename without .mdx extension).
 * Useful for `generateStaticParams`.
 */
export function getPostSlugs(): string[] {
  return getMdxFiles().map((file) => file.replace(/\.mdx$/, ""));
}

/**
 * Returns every post's metadata, sorted by date descending (newest first).
 */
export function getAllPosts(): PostMeta[] {
  const files = getMdxFiles();

  const posts: PostMeta[] = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(CONTENT_DIR, file), "utf-8");
    const { data } = matter(raw);

    return {
      slug,
      title: data.title ?? "",
      description: data.description ?? "",
      date: data.date ?? "",
      author: data.author ?? "",
      image: data.image,
      tags: data.tags ?? [],
      readTime: data.readTime ?? "",
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

/**
 * Returns a single post by slug, including its raw MDX body.
 * Returns `null` when the slug doesn't match any file.
 */
export function getPostBySlug(slug: string): Post | null {
  const filePath = path.join(CONTENT_DIR, `${slug}.mdx`);

  if (!fs.existsSync(filePath)) return null;

  const raw = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(raw);

  return {
    slug,
    content,
    title: data.title ?? "",
    description: data.description ?? "",
    date: data.date ?? "",
    author: data.author ?? "",
    image: data.image,
    tags: data.tags ?? [],
    readTime: data.readTime ?? "",
  };
}
