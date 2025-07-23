import type { Endpoint } from "@/app/api/uploadthing/core";
import { useUploadThing } from "@/lib/uploadthing";
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

export function useUploadThingWithConfig(endpoint: Endpoint) {
  const { startUpload, routeConfig, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: () => {
      console.log("Upload completed");
    },
    onUploadError: (error) => {
      console.error("Upload error:", error);
    },
  });

  const { fileTypes } = generatePermittedFileTypes(routeConfig);

  return {
    startUpload,
    isUploading,
    fileTypes,
    accept: generateClientDropzoneAccept(fileTypes),
    maxFiles:
      routeConfig?.image?.maxFileCount || routeConfig?.pdf?.maxFileCount || 1,
    maxSize:
      routeConfig?.image?.maxFileSize || routeConfig?.pdf?.maxFileSize || "1MB",
  };
}
