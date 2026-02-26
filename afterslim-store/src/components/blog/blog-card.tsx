import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { PostMeta } from "@/lib/blog/mdx";

interface BlogCardProps {
  post: PostMeta;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <Card className="h-full overflow-hidden border transition-shadow duration-300 hover:shadow-md">
        {/* Image area */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
          {post.image ? (
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-primary/10 via-muted to-secondary/10">
              <span className="text-4xl font-bold text-primary/20">
                {post.title.charAt(0)}
              </span>
            </div>
          )}
        </div>

        <CardHeader className="pb-2">
          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {post.tags.slice(0, 3).map((tag) => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <CardTitle className="line-clamp-2 text-lg leading-snug transition-colors group-hover:text-primary">
            {post.title}
          </CardTitle>
        </CardHeader>

        <CardContent className="flex flex-1 flex-col gap-3">
          <p className="line-clamp-2 text-sm text-muted-foreground">
            {post.description}
          </p>

          {/* Meta */}
          <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <User className="size-3.5" />
              {post.author}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5" />
              {formatDate(post.date)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3.5" />
              {post.readTime}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
