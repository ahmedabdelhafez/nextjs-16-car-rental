import { createServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Car,
  Users,
  ClipboardList,
  LogOut,
} from "lucide-react"; // Icons

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/signin");
  }

  // Check if user is an employee (Admin)
  const { data: employee } = await supabase
    .from("employee") // Table name is lowercase in queries usually
    .select("employee_id")
    .eq("email", user.email || "")
    .single();

  if (!employee) {
    // Not an admin, redirect to home
    redirect("/");
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold flex items-center gap-2">
          <span>AdminPanel</span>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link
            href="/admin/dashboard"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            <LayoutDashboard className="h-5 w-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/cars"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            <Car className="h-5 w-5" />
            Manage Cars
          </Link>
          <Link
            href="/admin/requests"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            <ClipboardList className="h-5 w-5" />
            Requests
          </Link>
          <Link
            href="/admin/customers"
            className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-800 transition-colors"
          >
            <Users className="h-5 w-5" />
            Customers
          </Link>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <div className="text-sm opacity-50 mb-2">
            Logged in as {user.email}
          </div>
          {/* Logout button form or client component */}
          <form action="/auth/signout" method="post">
            <button className="flex items-center gap-3 text-red-400 hover:text-red-300 transition-colors">
              <LogOut className="h-5 w-5" />
              Sign Out
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 dark:bg-gray-900 p-8">
        {children}
      </main>
    </div>
  );
}
