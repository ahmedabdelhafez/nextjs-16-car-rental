"use client";

import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function RequestActions({ vehicleId }: { vehicleId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(action: "approve" | "reject") {
    setLoading(true);
    const supabase = createClient();

    try {
      if (action === "approve") {
        const { error } = await supabase
          .from("vehicle")
          .update({ status: "Available" })
          .eq("vehicle_id", vehicleId);

        if (error) throw error;
      } else {
        // Reject -> Delete for now
        const { error } = await supabase
          .from("vehicle")
          .delete()
          .eq("vehicle_id", vehicleId);

        if (error) throw error;
      }

      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Failed to perform action");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2 justify-end">
      <Button
        size="sm"
        className="bg-green-600 hover:bg-green-700"
        onClick={() => handleAction("approve")}
        disabled={loading}
      >
        <Check className="h-4 w-4 mr-1" />
        Approve
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={() => handleAction("reject")}
        disabled={loading}
      >
        <X className="h-4 w-4 mr-1" />
        Reject
      </Button>
    </div>
  );
}
