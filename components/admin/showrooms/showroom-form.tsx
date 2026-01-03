"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import { createShowroom, updateShowroom } from "@/lib/actions/showrooms";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";

import { GoogleMapPicker } from "@/components/ui/google-map-picker";
import { ImageUpload } from "@/components/ui/image-upload";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().min(1, "Location is required"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  image_url: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
});

type ShowroomFormProps = {
  showroom?: z.infer<typeof formSchema> & { id: string };
};

export function ShowroomForm({ showroom }: ShowroomFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: showroom || {
      name: "",
      location: "",
      phone: "",
      email: "",
      image_url: "",
      latitude: undefined,
      longitude: undefined,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    startTransition(async () => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, String(value));
        }
      });

      if (showroom) {
        await updateShowroom(showroom.id, null, formData);
      } else {
        await createShowroom(null, formData);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl"
      >
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Downtown Showroom" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location Name</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St, NY" {...field} />
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
              onChange={(pos: { lat: number; lng: number }) => {
                form.setValue("latitude", pos.lat);
                form.setValue("longitude", pos.lng);
              }}
            />
          </div>
          <p className="text-sm text-muted-foreground">
            Click on the map to set the exact location.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 234 567 890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="contact@showroom.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="image_url"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Showroom Image</FormLabel>
              <FormControl>
                <ImageUpload
                  value={field.value ? [field.value] : []}
                  onChange={(urls) => field.onChange(urls[0] || "")}
                  bucketName="showrooms"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {showroom ? "Update Showroom" : "Create Showroom"}
        </Button>
      </form>
    </Form>
  );
}
