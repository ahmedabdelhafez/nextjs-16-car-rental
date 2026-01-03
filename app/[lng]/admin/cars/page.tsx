import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { deleteCar } from "@/lib/actions/cars";

export default async function CarsPage() {
  const supabase = await createClient();
  const { data: cars } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Cars</h1>
        <Link href="/admin/cars/new">
          <Button variant={"default"}>
            <Plus className="mr-2 h-4 w-4" />
            Add Car
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Make</TableHead>
              <TableHead>Model</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Condition</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cars?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center h-24">
                  No cars found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cars?.map((car: any) => (
                <TableRow key={car.id}>
                  <TableCell className="font-medium">{car.make}</TableCell>
                  <TableCell>{car.model}</TableCell>
                  <TableCell>{car.year}</TableCell>
                  <TableCell>${car.price.toLocaleString()}</TableCell>
                  <TableCell>{car.condition}</TableCell>
                  <TableCell>{car.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/cars/${car.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form
                        action={
                          deleteCar.bind(null, car.id) as unknown as string
                        }
                      >
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
