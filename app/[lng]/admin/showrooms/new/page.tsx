import { ShowroomForm } from "@/components/admin/showrooms/showroom-form";

export default function NewShowroomPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add New Showroom</h1>
      </div>
      <div className="border rounded-lg p-6 bg-card">
        <ShowroomForm />
      </div>
    </div>
  );
}
