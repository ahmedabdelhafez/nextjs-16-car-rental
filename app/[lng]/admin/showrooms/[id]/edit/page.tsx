import { ShowroomForm } from "@/components/admin/showrooms/showroom-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditShowroomPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: showroom } = await supabase
    .from("showrooms")
    .select("*")
    .eq("id", id)
    .single();

  if (!showroom) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Showroom</h1>
      </div>
      <div className="border rounded-lg p-6 bg-card">
        <ShowroomForm showroom={showroom} />
      </div>
    </div>
  );
}
