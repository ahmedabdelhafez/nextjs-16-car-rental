"use client";

import { ChangeEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Trash2, Upload, Image as ImageIcon } from "lucide-react";
import Image from "next/image";

interface ImageUploadProps {
  bucketName?: string; // Default to 'vehicles' or 'showrooms'
  value?: string[]; // Array of image URLs
  onChange: (urls: string[]) => void;
  disabled?: boolean;
  multiple?: boolean;
}

export function ImageUpload({
  bucketName = "vehicles",
  value = [],
  onChange,
  disabled,
  multiple = false,
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Normalize value to always be an array
  const currentImages = Array.isArray(value) ? value : value ? [value] : [];

  const handleUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files || e.target.files.length === 0) return;

      setIsUploading(true);
      const supabase = createClient();
      const files = Array.from(e.target.files);
      const newUrls: string[] = [];

      for (const file of files) {
        const fileExt = file.name.split(".").pop();
        const fileName = `${Math.random()
          .toString(36)
          .substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          continue; // Skip failed uploads
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from(bucketName).getPublicUrl(filePath);

        newUrls.push(publicUrl);

        // If not multiple, we stop after first successful upload
        if (!multiple) break;
      }

      // Update state
      if (multiple) {
        onChange([...currentImages, ...newUrls]);
      } else {
        onChange(newUrls); // Replace if single mode
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setIsUploading(false);
      // Reset input value to allow re-uploading same file if deleted
      e.target.value = "";
    }
  };

  const removeImage = (urlToRemove: string) => {
    onChange(currentImages.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {currentImages.map((url) => (
          <div
            key={url}
            className="relative w-[200px] h-[150px] rounded-md overflow-hidden border bg-muted"
          >
            <Image
              src={url}
              alt="Uploaded image"
              fill
              className="object-cover"
            />
            {!disabled && (
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6"
                onClick={() => removeImage(url)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            )}
          </div>
        ))}
        {currentImages.length === 0 && (
          <div className="flex items-center justify-center w-[200px] h-[150px] rounded-md border border-dashed bg-muted/50 text-muted-foreground">
            <ImageIcon className="h-8 w-8 opacity-50" />
          </div>
        )}
      </div>

      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="secondary"
          disabled={disabled || isUploading}
          className="relative"
        >
          {isUploading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Upload className="mr-2 h-4 w-4" />
          )}
          {isUploading ? "Uploading..." : "Upload Images"}
          <Input
            type="file"
            accept="image/*"
            multiple={multiple}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
            onChange={handleUpload}
            disabled={disabled || isUploading}
          />
        </Button>
        <p className="text-xs text-muted-foreground">
          {multiple ? "Upload multiple images." : "Upload a single image."}
        </p>
      </div>
    </div>
  );
}
