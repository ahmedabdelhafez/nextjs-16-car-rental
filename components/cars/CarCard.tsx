import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Database } from "@/lib/database.types";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

type Vehicle = Database["public"]["Tables"]["vehicle"]["Row"];

interface CarCardProps {
  vehicle: Vehicle;
  lng: string;
}

import { getTranslation } from "@/app/i18n/server";

export async function CarCard({ vehicle, lng }: CarCardProps) {
  const { t } = await getTranslation(lng, "common");

  return (
    <Card className="overflow-hidden flex flex-col h-full group transition-all hover:shadow-lg">
      <div className="relative aspect-video w-full overflow-hidden bg-muted">
        {vehicle.image_url ? (
          <Image
            src={vehicle.image_url}
            alt={`${vehicle.make} ${vehicle.model}`}
            fill
            className="object-cover transition-all group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground bg-gray-100 dark:bg-gray-800">
            {t("common.noImage")}
          </div>
        )}
        <div className="absolute top-2 right-2">
          <Badge
            variant={vehicle.status === "Available" ? "default" : "secondary"}
          >
            {vehicle.status === "Available"
              ? t("common.available")
              : t("common.booked")}
          </Badge>
        </div>
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">
            {vehicle.make} {vehicle.model}
          </CardTitle>
          <span className="text-lg font-bold text-primary">
            $
            {vehicle.vehicle_type === "Rental"
              ? `${vehicle.daily_rental_rate}/${t("common.day")}`
              : vehicle.purchase_price?.toLocaleString()}
          </span>
        </div>
        <CardDescription>
          {vehicle.year} •{" "}
          {vehicle.vehicle_type === "Rental"
            ? t("common.rental")
            : t("common.sale")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {vehicle.description || "No description available."}
        </p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Link href={`/${lng}/cars/${vehicle.vehicle_id}`} className="w-full">
          <Button className="w-full">{t("common.viewDetails")}</Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
