import type { Metadata } from "next";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/admin/app-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Admin Dashboard - Car Rental",
  description: "Admin dashboard for managing cars and bookings",
};

export default async function AdminLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${lng}/login`);
  }
  // main_roles is array of roles
  // default_role is single role
  const { data: profile } = await supabase
    .from("profile")
    .select("main_role, default_role")
    .eq("user_id", user.id)
    .single();

  const isAdmin =
    profile?.main_role?.includes("admin") || profile?.default_role === "admin";

  if (!isAdmin) {
    redirect(`/${lng}`);
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AdminHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 py-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
