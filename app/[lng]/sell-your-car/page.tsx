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
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GoogleMapPicker } from "@/components/ui/google-map-picker";
import { ImageUpload } from "@/components/ui/image-upload";

const formSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce
    .number()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(0, "Price must be positive"),
  mileage: z.coerce.number().min(0, "Mileage must be positive"),
  description: z.string().optional(),
  licensePlate: z.string().min(1, "License plate is required"),
  vin: z.string().min(1, "VIN is required"),
  image_urls: z.array(z.string()).min(1, "At least one image is required"),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

export default function SellCarPage() {
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
      image_urls: [],
      latitude: undefined,
      longitude: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setError(null);
    const supabase = createClient();

    // Check user auth if needed, but for now we proceed.
    // const { data: { user } } = await supabase.auth.getUser();

    const { error: dbError } = await supabase.from("vehicle").insert({
      make: values.make,
      model: values.model,
      year: values.year,
      vin: values.vin,
      license_plate: values.licensePlate,
      vehicle_type: "Sales",
      status: "Maintenance", // Pending approval
      purchase_price: values.price,
      current_mileage: values.mileage,
      description: values.description,
      image_urls: values.image_urls,
      latitude: values.latitude,
      longitude: values.longitude,
      created_at: new Date().toISOString(),
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

              <div className="space-y-2">
                <FormLabel>Map Location</FormLabel>
                <div className="h-[300px]">
                  <GoogleMapPicker
                    value={
                      form.getValues("latitude") && form.getValues("longitude")
                        ? {
                            lat: form.getValues("latitude")!,
                            lng: form.getValues("longitude")!,
                          }
                        : undefined
                    }
                    onChange={(pos) => {
                      form.setValue("latitude", pos.lat);
                      form.setValue("longitude", pos.lng);
                    }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  Click on the map to set the exact location.
                </p>
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

              <FormField
                control={form.control}
                name="image_urls"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Images</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value}
                        onChange={(urls) => field.onChange(urls)}
                        bucketName="vehicles"
                        multiple
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
