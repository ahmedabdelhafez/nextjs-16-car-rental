import { PostCard } from "@/components/cars/post-card";
import { Post } from "@/lib/actions/posts";
import { Button } from "@/components/ui/button";
import Link from "next/link";
// import { ArrowRight, Newspaper } from "lucide-react";

interface LatestUpdatesProps {
  posts: Post[];
  lng: string;
}

import { getTranslation } from "@/app/i18n/server";

export async function LatestUpdates({ posts, lng }: LatestUpdatesProps) {
  const { t } = await getTranslation(lng, "common");

  if (posts.length === 0) return null;

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-primary font-bold tracking-wider uppercase text-sm">
              {/* <Newspaper className="h-5 w-5" /> */}
              <span>Stay Informed</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight">
              {t("common.latestUpdates")}
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl">
              Discover our latest adventures, industry insights, and corporate
              updates.
            </p>
          </div>
          <Link href={`/${lng}/blog`}>
            <Button variant="outline" className="group">
              {t("common.readMore")}
              {/* <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" /> */}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} lng={lng} />
          ))}
        </div>

        <div className="mt-16 text-center md:hidden">
          <Link href="/blog">
            <Button className="w-full">
              Read More
              {/* <ArrowRight className="ml-2 h-4 w-4" /> */}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
