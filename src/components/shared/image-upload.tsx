"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
// import { sanityClient } from "@/sanity/lib/client";
import { ImageUpIcon, Loader2Icon } from "lucide-react";
import Image from "next/image";
import type React from "react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

interface ImageUploadProps {
  currentImageUrl?: string;
  onUploadChange: (status: { isUploading: boolean; imageId?: string }) => void;
}

/**
 * TODO: failed to upload image in mobile phone
 */
export default function ImageUpload({
  currentImageUrl = null,
  onUploadChange,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState<boolean>(false);
  const [imageUrl, setImageUrl] = useState<string | null>(currentImageUrl);

  const uploadImage = async (file: File) => {
    const maxSizeInBytes = 1 * 1024 * 1024; // 1MB
    if (file.size > maxSizeInBytes) {
      console.error("uploadImage, image size should be less than 1MB.");
      toast.error("Image size should be less than 1MB.");
      return null;
    }

    // NOTICE: can not use sanityClient in client component!!!
    // try {
    //   const asset = await sanityClient.assets.upload("image", file);
    //   return asset;
    // } catch (error) {
    //   console.error("uploadImage, error uploading image:", error);
    //   toast.error("Upload Image failed, please try again.");
    //   return null;
    // }

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        console.error("uploadImage, error uploading image:", response);
        toast.error("Upload Image failed, please try again.");
        return null;
      }

      const { asset } = await response.json();
      return asset;
    } catch (error) {
      console.error("uploadImage, error uploading image:", error);
      toast.error("Upload Image failed, please try again.");
      return null;
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      const image = event.target.files[0];
      handleImageUpload(image);
    }
  };

  const handleImageUpload = async (image: File) => {
    if (!image) return;
    setUploading(true);
    onUploadChange({ isUploading: true });

    try {
      const asset = await uploadImage(image);
      if (asset) {
        setImageUrl(asset.url);
        onUploadChange({ isUploading: false, imageId: asset._id });
      }
    } catch (error) {
      console.error("handleImageUpload, error uploading image:", error);
    } finally {
      setUploading(false);
      onUploadChange({ isUploading: false });
    }
  };
  const handleImageUploadRef = useRef(handleImageUpload);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === "image/png" || file.type === "image/jpeg") {
        handleImageUploadRef.current(file);
        // handleImageUpload(file);
      } else {
        toast.error("Only PNG and JPEG images are allowed.");
      }
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    noClick: true, // disable click to upload, avoid show file input dialog twice
    maxFiles: 1,
    // maxSize: 1 * 1024 * 1024, // 1MB, no effect
  });

  return (
    <div {...getRootProps()} className="h-full">
      <label
        htmlFor="dropzone-file"
        className={cn(
          "w-full h-full visually-hidden-focusable rounded-lg cursor-pointer",
          "relative flex flex-col items-center justify-center",
          "border-2 border-dashed",
          "hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600",
        )}
      >
        {/* initial state */}
        {!uploading && !imageUrl && (
          <div className="flex flex-col items-center justify-center gap-4">
            <ImageUpIcon className="h-8 w-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Drag & drop or select image to upload
            </p>
          </div>
        )}

        {/* uploading state */}
        {uploading && (
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2Icon className="h-8 w-8 text-muted-foreground animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">
              Image is uploading...
            </p>
          </div>
        )}

        {/* uploaded state */}
        {imageUrl && !uploading && (
          <div className="p-4 flex flex-col items-center justify-center gap-4 w-full h-full">
            <div className="relative group overflow-hidden rounded-lg w-full aspect-[16/9]">
              <Image
                src={imageUrl}
                alt="uploaded image"
                fill
                className="shadow-lg rounded-lg transition-opacity duration-300 hover:opacity-50"
              />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <p className="text-sm font-medium text-white bg-black bg-opacity-50 px-3 py-2 rounded-md">
                  Click to upload another image
                </p>
              </div>
            </div>
          </div>
        )}
      </label>

      {/* input to upload image */}
      {/* disabled={uploading || imageUrl !== null} */}
      <Input
        {...getInputProps()}
        id="dropzone-file"
        accept="image/png, image/jpeg"
        type="file"
        className="hidden"
        disabled={uploading}
        onChange={handleImageChange}
      />
    </div>
  );
}
