"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
// import { Textarea } from "@/components/ui/textarea" // Placeholder until installed

const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0, "Price must be positive"),
  mileage: z.coerce.number().min(0),
  description: z.string().optional(),
  licensePlate: z.string().min(1, "License plate is required"),
  vin: z.string().min(1, "VIN is required"),
  // image: z.instanceof(FileList).optional() // Handling file upload separately for simplicity
});

export default function SellCarPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      make: "",
      model: "",
      year: 2024,
      price: 0,
      mileage: 0,
      description: "",
      licensePlate: "",
      vin: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    const supabase = createClient();

    // Check if user is logged in (optional, but good practice)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    /*
    if (!user) {
        setError("You must be logged in to submit a request.")
        return
    }
    */

    // Insert into vehicle table with status 'Maintenance' (Pending approval) or 'Available' if auto-approved
    // Actually, per prompt: "admin can review it and accept or reject". So status should be something like "Maintenance" or "Pending" (if we add enum).
    // Our enum for status: 'Available', 'Rented', 'Sold', 'Maintenance', 'Reserved'.
    // We can use 'Maintenance' as Pending, or add 'Pending' to enum.
    // Let's use 'Maintenance' for now.

    const { error: dbError } = await supabase.from("vehicle").insert({
      make: values.make,
      model: values.model,
      year: values.year,
      vin: values.vin,
      license_plate: values.licensePlate,
      vehicle_type: "Sales", // Assuming client added cars are for sale
      status: "Maintenance", // Pending approval
      purchase_price: values.price,
      current_mileage: values.mileage,
      description: values.description,
      created_at: new Date().toISOString(),
      // owner_id: user.id // We don't have owner_id column in Vehicle table in prompt schema!
      // Schema update might be needed if we want to track who submitted it.
      // For now, we just insert it.
    });

    if (dbError) {
      setError(dbError.message);
    } else {
      setSuccess(true);
      form.reset();
    }
  }

  if (success) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Request Submitted!</h1>
        <p className="text-muted-foreground">
          Your car has been submitted for review. Our team will contact you
          shortly.
        </p>
        <Button onClick={() => setSuccess(false)} className="mt-8">
          Submit Another
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-10 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Sell Your Car</CardTitle>
          <CardDescription>
            Enter details about your vehicle to list it on our platform.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="make"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Make</FormLabel>
                      <FormControl>
                        <Input placeholder="Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model</FormLabel>
                      <FormControl>
                        <Input placeholder="Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value as number}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Expected Price ($)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value as number}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>VIN</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Vehicle Identification Number"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="licensePlate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>License Plate</FormLabel>
                      <FormControl>
                        <Input placeholder="ABC-123" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage (km)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value as number}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Condition, features, etc."
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {error && (
                <p className="text-sm text-red-500 font-medium">{error}</p>
              )}
              <Button type="submit" className="w-full">
                Submit for Review
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
