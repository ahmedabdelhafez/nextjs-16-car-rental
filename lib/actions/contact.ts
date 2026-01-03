"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const contactSchema = z.object({
  full_name: z.string().min(1, "Full name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

export async function submitContactForm(
  prevState: unknown,
  formData: FormData
) {
  const supabase = await createClient();

  const rawData = {
    full_name: formData.get("full_name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  };

  const validatedFields = contactSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: "Missing Fields. Failed to Send Message.",
    };
  }

  const { error } = await supabase
    .from("contact_messages")
    .insert([validatedFields.data]);

  if (error) {
    return {
      message: "Database Error: Failed to Send Message.",
    };
  }

  return {
    success: true,
    message: "Message sent successfully!",
  };
}

export async function deleteContactMessage(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error("Failed to delete message");
  }

  revalidatePath("/admin/contact");
}

export async function updateMessageStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("contact_messages")
    .update({ status })
    .eq("id", id);

  if (error) {
    throw new Error("Failed to update status");
  }

  revalidatePath("/admin/contact");
}
