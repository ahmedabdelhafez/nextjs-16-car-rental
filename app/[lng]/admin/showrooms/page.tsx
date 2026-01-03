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
import { deleteShowroom } from "@/lib/actions/showrooms";

export default async function ShowroomsPage() {
  const supabase = await createClient();
  const { data: showrooms } = await supabase
    .from("showrooms")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Showrooms</h1>
        <Link href="/admin/showrooms/new">
          <Button variant={"default"}>
            <Plus className="mr-2 h-4 w-4" />
            Add Showroom
          </Button>
        </Link>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Email</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {showrooms?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No showrooms found. Add one to get started.
                </TableCell>
              </TableRow>
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              showrooms?.map((showroom: any) => (
                <TableRow key={showroom.id}>
                  <TableCell className="font-medium">{showroom.name}</TableCell>
                  <TableCell>{showroom.location}</TableCell>
                  <TableCell>{showroom.phone}</TableCell>
                  <TableCell>{showroom.email}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/showrooms/${showroom.id}/edit`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <form
                        action={
                          deleteShowroom.bind(
                            null,
                            showroom.id
                          ) as unknown as string
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
