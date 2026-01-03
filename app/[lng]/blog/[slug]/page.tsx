import { getPostBySlug } from "@/lib/actions/posts";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.status !== "published") {
    notFound();
  }

  return (
    <article className="min-h-screen bg-background pt-24 pb-24">
      <div className="container max-w-4xl px-4 md:px-6">
        <Link href="/blog">
          <Button
            variant="ghost"
            size="sm"
            className="mb-8 pl-0 hover:pl-2 transition-all"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blog
          </Button>
        </Link>

        <div className="space-y-4 mb-8">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 uppercase tracking-wider text-[10px] font-bold">
            {post.type}
          </Badge>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-muted-foreground border-y py-4 border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <span className="font-medium text-sm">
                {post.author_name || "Antigravity Team"}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(post.created_at).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </div>
        </div>

        {post.featured_image && (
          <div className="relative aspect-video w-full rounded-2xl overflow-hidden mb-12 shadow-2xl shadow-primary/5">
            <Image
              src={post.featured_image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-slate dark:prose-invert max-w-none">
          {/* 
            Rendering Lexical content requires a Lexical renderer or manually parsing the JSON.
            For now, we'll indicate that the content is rendered here.
            Usually, you'd use a custom renderer or the Lexical editor in read-only mode.
          */}
          <div className="whitespace-pre-wrap text-lg leading-relaxed text-slate-700 dark:text-slate-300">
            {/* In a real scenario, we'd use Lexical's internal parsing. 
                 Since we don't have a high-level renderer component ready, 
                 we'll just show the excerpt as a placeholder if no JSON parsing is done. */}
            <p className="italic text-muted-foreground mb-4">{post.excerpt}</p>
            <p className="text-muted-foreground">
              [Post content would be rendered here using Lexical renderer]
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
