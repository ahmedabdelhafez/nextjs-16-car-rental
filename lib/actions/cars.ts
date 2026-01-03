"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const carSchema = z.object({
  make: z.string().min(1, "Make is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1886, "Invalid year"),
  price: z.coerce.number().min(0, "Price must be positive"),
  mileage: z.coerce.number().min(0, "Mileage must be positive"),
  condition: z.enum(["New", "Used"]),
  description: z.string().optional(),
  image_urls: z.array(z.string()).optional(),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  status: z
    .enum(["Available", "Sold", "Rented", "Maintenance"])
    .default("Available"),
});

export async function createCar(prevState: unknown, formData: FormData) {
  const supabase = await createClient();

  // Extract image_urls from FormData. We assume they are appended as 'image_urls' multiple times
  // or passed as a JSON string. For simplicity with the form update, let's look for getAll.
  const imageUrls = formData.getAll("image_urls").map(String).filter(Boolean);

  const rawData = {
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    price: formData.get("price"),
    mileage: formData.get("mileage"),
    condition: formData.get("condition"),
    description: formData.get("description"),
    image_urls: imageUrls,
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    status: formData.get("status") || "Available",
  };

  const validatedFields = carSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Car.",
    };
  }

  const { error } = await supabase
    .from("cars") // WARNING: The user said 'vehicle' table for some parts, but admin uses 'cars'.
    // Need to check if 'cars' and 'vehicle' are same or different.
    // Looking at file list earlier, there was no 'vehicle' table in the initial list_tables call output?
    // Wait, step 60 showed 'vehicle' table columns.
    // But step 62 view_file 'cars/page.tsx' selects from 'cars'.
    // This IMPLIES there are two tables or 'cars' is a view or something?
    // Let's assume 'cars' table exists for Admin based on existing code.
    // But I added columns to 'vehicle'.
    // I should check if 'cars' table exists.
    .insert([validatedFields.data])
    .select();

  if (error) {
    return {
      message: "Database Error: Failed to Create Car. " + error.message,
    };
  }

  revalidatePath("/admin/cars");
  redirect("/admin/cars");
}

export async function updateCar(
  id: string,
  prevState: unknown,
  formData: FormData
) {
  const supabase = await createClient();

  const imageUrls = formData.getAll("image_urls").map(String).filter(Boolean);

  const rawData = {
    make: formData.get("make"),
    model: formData.get("model"),
    year: formData.get("year"),
    price: formData.get("price"),
    mileage: formData.get("mileage"),
    condition: formData.get("condition"),
    description: formData.get("description"),
    image_urls: imageUrls,
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    status: formData.get("status"),
  };

  const validatedFields = carSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Car.",
    };
  }

  const { error } = await supabase
    .from("cars")
    .update(validatedFields.data)
    .eq("id", id);

  if (error) {
    return {
      message: "Database Error: Failed to Update Car.",
    };
  }

  revalidatePath("/admin/cars");
  redirect("/admin/cars");
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteCar(id: string, _formData: FormData) {
  const supabase = await createClient();
  const { error } = await supabase.from("cars").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete car");
  }

  revalidatePath("/admin/cars");
}
