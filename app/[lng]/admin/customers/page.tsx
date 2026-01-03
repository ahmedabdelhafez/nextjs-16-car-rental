import { createServerClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";

export default async function AdminCustomersPage() {
  const supabase = await createServerClient();

  const { data: customers } = await supabase
    .from("customer")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Customers</h1>

      <div className="bg-white dark:bg-gray-800 rounded-md border shadow-sm overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-200 uppercase font-medium">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Type</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Joined Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {customers?.map((cust: any) => (
              <tr
                key={cust.customer_id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700/50"
              >
                <td className="px-6 py-4 font-medium">
                  {cust.first_name} {cust.last_name}
                </td>
                <td className="px-6 py-4">{cust.email}</td>
                <td className="px-6 py-4">Standard</td>
                <td className="px-6 py-4">
                  <Badge
                    className={cust.is_active ? "bg-green-500" : "bg-red-500"}
                  >
                    {cust.is_active ? "Active" : "Inactive"}
                  </Badge>
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {new Date(cust.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {(!customers || customers.length === 0) && (
              <tr>
                <td
                  colSpan={5}
                  className="px-6 py-10 text-center text-muted-foreground"
                >
                  No customers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
