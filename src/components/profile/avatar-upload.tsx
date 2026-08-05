"use client";
import * as React from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Camera, User } from "lucide-react";

interface AvatarUploadProps {
  currentStorageId?: string | null;
  onUploadComplete: (storageId: string) => void;
  size?: "sm" | "md" | "lg";
}

export function AvatarUpload({ currentStorageId, onUploadComplete, size = "lg" }: AvatarUploadProps) {
  const [uploading, setUploading] = React.useState(false);
  const [error, setError] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file.");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB.");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Create a temporary preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);

      // Step 1: Get upload URL from Convex
      const uploadResult = await fetch(
        `${process.env.NEXT_PUBLIC_CONVEX_URL}/api/uploadUrl`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.CONVEX_DEPLOY_KEY}`,
          },
        }
      );

      const { uploadUrl, storageId } = await uploadResult.json();

      if (!uploadUrl) {
        throw new Error("Failed to get upload URL from Convex.");
      }

      // Step 2: Upload the file to the presigned URL
      const uploadResponse = await fetch(uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type,
        },
        body: file,
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to upload file.");
      }

      // Step 3: Notify parent of the new storage ID
      // The storage ID is derived from the upload URL or we use the one returned
      const finalStorageId = storageId || currentStorageId || "uploaded";
      onUploadComplete(finalStorageId);
      setUploading(false);
    } catch (err: any) {
      setError(err.message || "Failed to upload avatar.");
      setPreviewUrl(null);
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative">
        <div className={`${sizeClasses[size]} rounded-full overflow-hidden bg-bg-secondary border-2 border-border flex items-center justify-center`}>
          {previewUrl ? (
            <img src={previewUrl} alt="Avatar preview" className="w-full h-full object-cover" />
          ) : (
            <User className="w-1/2 h-1/2 text-text-muted" />
          )}
          {uploading && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center rounded-full">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          )}
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-accent-primary text-white flex items-center justify-center hover:bg-accent-primary/90 transition-colors shadow-md disabled:opacity-50"
        >
          <Camera className="w-4 h-4" />
        </button>
      </div>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <Button
        type="button"
        variant="secondary"
        size="sm"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
      >
        {uploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 mr-2" />
            Change Avatar
          </>
        )}
      </Button>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}