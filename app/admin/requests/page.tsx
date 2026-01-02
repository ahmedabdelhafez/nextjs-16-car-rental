import { createServerClient } from "@/lib/supabase/server";
import { RequestActions } from "@/components/admin/RequestActions";
import { Badge } from "@/components/ui/badge";

export default async function AdminRequestsPage() {
  const supabase = await createServerClient();

  const { data: requests } = await supabase
    .from("vehicle")
    .select("*")
    .eq("status", "Maintenance") // Using Maintenance as Pending Proxy
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Used Car Requests</h1>
      <p className="text-muted-foreground">
        Review vehicles submitted by clients.
      </p>

      <div className="bg-white dark:bg-gray-800 rounded-md border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase font-medium">
            <tr>
              <th className="px-6 py-3">Vehicle Details</th>
              <th className="px-6 py-3">Suggested Price</th>
              <th className="px-6 py-3">Mileage</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {requests?.map((req: any) => (
              <tr
                key={req.vehicle_id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-lg">
                    {req.year} {req.make} {req.model}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    VIN: {req.vin}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {req.description}
                  </div>
                </td>
                <td className="px-6 py-4 font-medium">
                  ${req.purchase_price?.toLocaleString() || "N/A"}
                </td>
                <td className="px-6 py-4">
                  {req.current_mileage?.toLocaleString()} km
                </td>
                <td className="px-6 py-4">
                  <Badge variant="secondary">Pending Review</Badge>
                </td>
                <td className="px-6 py-4 text-right">
                  <RequestActions vehicleId={req.vehicle_id} />
                </td>
              </tr>
            ))}
            {(!requests || requests.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No pending requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
