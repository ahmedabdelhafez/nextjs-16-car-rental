"use client";

import Link from "next/link";
import Image from "next/image";
import { Post } from "@/lib/actions/posts";
// import { Calendar, User, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useTranslation } from "@/app/i18n/client";

interface PostCardProps {
  post: Post;
  view?: "grid" | "list";
  lng: string;
}

export function PostCard({ post, view = "grid", lng }: PostCardProps) {
  const { t } = useTranslation(lng, "common");
  const isList = view === "list";

  return (
    <Link
      href={`/${lng}/blog/${post.slug}`}
      className={cn(
        "group block bg-card rounded-xl overflow-hidden border transition-all hover:shadow-lg hover:-translate-y-1",
        isList
          ? "flex flex-col md:flex-row h-full md:h-64"
          : "h-full flex flex-col"
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden",
          isList ? "w-full md:w-1/3 h-48 md:h-full" : "aspect-video w-full"
        )}
      >
        <Image
          src={post.featured_image || "/placeholder-car.jpg"}
          alt={post.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 left-4">
          <Badge className="bg-primary/90 hover:bg-primary backdrop-blur-sm">
            {post.type === "blog" ? t("nav.blog") : t("nav.news")}
          </Badge>
        </div>
      </div>

      <div className="flex-1 p-6 flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              {/* <Calendar className="h-3 w-3" /> */}
              {new Date(post.created_at).toLocaleDateString()}
            </span>
            {post.author_name && (
              <span className="flex items-center gap-1">
                {/* <User className="h-3 w-3" /> */}
                {post.author_name}
              </span>
            )}
          </div>
          <h3 className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
          <p className="text-muted-foreground line-clamp-2 text-sm">
            {post.excerpt || "Read more about this post..."}
          </p>
        </div>

        <div className="mt-4 flex items-center text-primary font-semibold text-sm group-hover:gap-2 transition-all">
          {t("common.readMore")}
          {/* <ArrowRight className="h-4 w-4 ml-1 opacity-0 group-hover:opacity-100 transition-all" /> */}
        </div>
      </div>
    </Link>
  );
}
