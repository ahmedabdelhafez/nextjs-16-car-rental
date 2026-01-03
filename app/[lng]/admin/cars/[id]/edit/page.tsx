import { CarForm } from "@/components/admin/cars/car-form";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

export default async function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: car } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .single();

  if (!car) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Edit Car</h1>
      </div>
      <div className="border rounded-lg p-6 bg-card">
        <CarForm car={car} />
      </div>
    </div>
  );
}
