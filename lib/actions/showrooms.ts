"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

const showroomSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  image_url: z.string().optional(),
});

export async function createShowroom(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const rawData = {
    name: formData.get("name"),
    location: formData.get("location"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    image_url: formData.get("image_url"),
  };

  const validatedFields = showroomSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Create Showroom.",
    };
  }

  const { error } = await supabase
    .from("showrooms")
    .insert([validatedFields.data]);

  if (error) {
    return {
      message: "Database Error: Failed to Create Showroom.",
    };
  }

  revalidatePath("/admin/showrooms");
  redirect("/admin/showrooms");
}

export async function updateShowroom(
  id: string,
  prevState: any,
  formData: FormData
) {
  const supabase = await createClient();

  const rawData = {
    name: formData.get("name"),
    location: formData.get("location"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    image_url: formData.get("image_url"),
  };

  const validatedFields = showroomSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Update Showroom.",
    };
  }

  const { error } = await supabase
    .from("showrooms")
    .update(validatedFields.data)
    .eq("id", id);

  if (error) {
    return {
      message: "Database Error: Failed to Update Showroom.",
    };
  }

  revalidatePath("/admin/showrooms");
  redirect("/admin/showrooms");
}

export async function deleteShowroom(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("showrooms").delete().eq("id", id);

  if (error) {
    throw new Error("Failed to delete showroom");
  }

  revalidatePath("/admin/showrooms");
}
