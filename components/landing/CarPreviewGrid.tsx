import { createServerClient } from "@/lib/supabase/server";
import { CarCard } from "@/components/cars/CarCard";
import { Database } from "@/lib/database.types";

type Vehicle = Database["public"]["Tables"]["vehicle"]["Row"];

import { getTranslation } from "@/app/i18n/server";

export async function CarPreviewGrid({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng, "common");

  const supabase = await createServerClient();

  // Fetch only available vehicles for the landing page
  const { data: vehicles, error } = await supabase
    .from("vehicle")
    .select("*")
    .eq("status", "Available")
    .limit(6)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching vehicles:", error);
    return (
      <div className="text-center text-red-500">{t("common.loading")}</div>
    );
  }

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-10">
        {t("common.noImage")}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {vehicles.map((vehicle: Vehicle) => (
        <CarCard key={vehicle.vehicle_id} vehicle={vehicle} lng={lng} />
      ))}
    </div>
  );
}
