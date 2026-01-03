import { PostForm } from "@/components/admin/posts/post-form";
import { getPostById } from "@/lib/actions/posts";
import { notFound } from "next/navigation";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    notFound();
  }

  return (
    <div className="container py-6">
      <PostForm initialData={post} />
    </div>
  );
}
