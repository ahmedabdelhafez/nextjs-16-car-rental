import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/lib/supabase/server";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  deleteContactMessage,
  updateMessageStatus,
} from "@/lib/actions/contact";

export default async function ContactMessagesPage() {
  const supabase = await createClient();
  const { data: messages } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Contact Messages</h1>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {messages?.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center h-24">
                  No messages found.
                </TableCell>
              </TableRow>
            ) : (
              messages?.map((msg) => (
                <TableRow key={msg.id}>
                  <TableCell>
                    {new Date(msg.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">{msg.full_name}</div>
                    <div className="text-sm text-muted-foreground">
                      {msg.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {msg.subject || "No Subject"}
                    </div>
                    <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                      {msg.message}
                    </div>
                  </TableCell>
                  <TableCell>{msg.status}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {msg.status === "New" && (
                        <form
                          action={updateMessageStatus.bind(
                            null,
                            msg.id,
                            "Read"
                          )}
                        >
                          <Button variant="outline" size="sm">
                            Mark Read
                          </Button>
                        </form>
                      )}
                      <form action={deleteContactMessage.bind(null, msg.id)}>
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
