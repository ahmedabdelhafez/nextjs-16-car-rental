import { createServerClient } from "@/lib/supabase/server";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminCarsPage() {
  const supabase = await createServerClient();

  const { data: vehicles } = await supabase
    .from("vehicle")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Manage Cars</h1>
        <Link href="/admin/cars/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Car
          </Button>
        </Link>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-md border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase font-medium">
            <tr>
              <th className="px-6 py-3">Make / Model</th>
              <th className="px-6 py-3">Year</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Price / Rate</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {vehicles?.map((car: any) => (
              <tr
                key={car.vehicle_id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-6 py-4 font-medium">
                  {car.make} {car.model}
                  <div className="text-xs text-muted-foreground">
                    {car.license_plate}
                  </div>
                </td>
                <td className="px-6 py-4">{car.year}</td>
                <td className="px-6 py-4">{car.vehicle_type}</td>
                <td className="px-6 py-4">
                  <Badge
                    variant={
                      car.status === "Available" ? "default" : "secondary"
                    }
                  >
                    {car.status}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  {car.vehicle_type === "Rent" ? (
                    <span>${car.rental_rate_daily}/day</span>
                  ) : (
                    <span>
                      $
                      {car.purchase_price
                        ? car.purchase_price.toLocaleString()
                        : "-"}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right flex justify-end gap-2">
                  <Link href={`/admin/cars/${car.vehicle_id}/edit`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  {/* Add Delete Dialog later */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
            {(!vehicles || vehicles.length === 0) && (
              <tr>
                <td
                  colSpan={6}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No vehicles found. Add one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
