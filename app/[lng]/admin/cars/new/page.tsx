import { CarForm } from "@/components/admin/cars/car-form";

export default function NewCarPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Add New Car</h1>
      </div>
      <div className="border rounded-lg p-6 bg-card">
        <CarForm />
      </div>
    </div>
  );
}
