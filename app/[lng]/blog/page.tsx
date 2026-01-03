"use client";
import { useEffect, useState } from "react";
import { getAllPosts } from "@/lib/actions/posts";
import type { Post } from "@/lib/actions/posts";
// import { LayoutGrid, List, Loader2 } from "lucide-react";
import { PostCard } from "@/components/cars/post-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import { PostSearch } from "@/components/cars/post-search";

export const metadata = {
  title: "Blog - CarPortal",
  description: "Read the latest automotive news and insights.",
};

import { use } from "react";
import { useTranslation } from "@/app/i18n/client";

export default function BlogPage({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = use(params);
  const { t } = useTranslation(lng, "common");

  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");

  useEffect(() => {
    async function fetchPosts() {
      try {
        const data = await getAllPosts("blog");
        setPosts(data.filter((p: Post) => p.status === "published"));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950/50 pt-24 pb-12">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="space-y-2">
            <Badge
              variant="outline"
              className="text-primary border-primary/20 bg-primary/5 uppercase tracking-wider"
            >
              Our Journal
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              {t("nav.blog")}
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Stay updated with the latest trends in the automotive industry,
              car care tips, and more.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <PostSearch posts={posts} />
            <div className="h-10 border-l mx-2 hidden md:block" />
            <div className="flex items-center bg-muted p-1 rounded-lg">
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("grid")}
                className="h-8 w-8"
              >
                <span>Grid</span>
              </Button>
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                onClick={() => setView("list")}
                className="h-8 w-8"
              >
                <span>List</span>
              </Button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <span>Loading...</span>
            <p className="mt-4 text-muted-foreground animate-pulse">
              Loading posts...
            </p>
          </div>
        ) : (
          <>
            {posts.length === 0 ? (
              <div className="text-center py-24 bg-card rounded-2xl border border-dashed">
                <p className="text-muted-foreground">No blog posts found.</p>
              </div>
            ) : (
              <div
                className={
                  view === "grid"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    : "flex flex-col gap-6"
                }
              >
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} view={view} lng={lng} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
