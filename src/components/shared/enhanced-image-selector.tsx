"use client";

import {
  FileImage,
  Image as ImageIcon,
  Sparkles,
  Upload,
  X,
  Zap,
} from "lucide-react";
import Image from "next/image";
import * as React from "react";
import { toast } from "sonner";

import type {
  Endpoint,
  UploadCompleteResponse,
} from "@/app/api/uploadthing/core";
import { EnhancedUploadDropzone } from "@/components/shared/enhanced-upload-dropzone";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getImages } from "@/lib/actions/files";
import type { Images } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
import { FileSelectionData, ImageFilters } from "@/types";

type GalleryImage = Images[number];
type ImageFetchStrategy =
  | { type: "filters"; filters: ImageFilters }
  | { type: "custom"; fetchFn: () => Promise<GalleryImage[]> };

type Props = React.ComponentPropsWithoutRef<"div"> & {
  value?: string | FileSelectionData;
  onValueChange: (value: string | FileSelectionData) => void;
  returnType?: "url" | "fileData";
  triggerClassName?: string;
  placeholder?: string;
  endpoint?: Endpoint;
  variant?: "default" | "outline" | "ghost" | "minimal";
  imageStrategy?: ImageFetchStrategy;
};

function ImageSelector({
  value,
  onValueChange,
  returnType = "url",
  triggerClassName,
  placeholder = "Upload or Select Image",
  endpoint = "researchImageUploader",
  variant = "default",
  imageStrategy = { type: "filters", filters: { includeResearch: true } },
  className,
  ...props
}: Props) {
  const [imageDialogOpen, setImageDialogOpen] = React.useState(false);
  const [uploadedImages, setUploadedImages] = React.useState<Images>([]);
  const [loadingImages, setLoadingImages] = React.useState(false);

  // Handle both URL string and FileSelectionData
  const currentUrl = typeof value === "string" ? value : value?.url || "";
  const currentFileId = typeof value === "object" ? value?.fileId : undefined;

  const loadImages = React.useCallback(async () => {
    setLoadingImages(true);
    try {
      let images: GalleryImage[];

      switch (imageStrategy.type) {
        case "filters":
          images = await getImages(imageStrategy.filters);
          break;
        case "custom":
          images = await imageStrategy.fetchFn();
          break;
        default:
          throw new Error("Invalid image strategy");
      }
      setUploadedImages(images);
    } catch (error) {
      console.error("Failed to load images:", error);
      toast.error("Failed to load images");
    } finally {
      setLoadingImages(false);
    }
  }, [imageStrategy]);

  // Load images when dialog opens
  React.useEffect(() => {
    if (imageDialogOpen && uploadedImages.length === 0) {
      loadImages();
    }
  }, [imageDialogOpen, uploadedImages.length, loadImages]);

  const handleImageSelect = (image: GalleryImage) => {
    const fileData: FileSelectionData = {
      url: image.url,
      fileId: image.id,
      name: image.name,
      mimeType: image.mimeType,
    };

    // Return based on returnType preference
    if (returnType === "fileData") {
      onValueChange(fileData);
    } else {
      onValueChange(image.url);
    }

    setImageDialogOpen(false);
    toast.success("Image selected!", {
      description: "Your image has been selected successfully.",
    });
  };

  const clearSelectedImage = () => {
    if (returnType === "fileData") {
      onValueChange({ url: "", fileId: undefined });
    } else {
      onValueChange("");
    }
    toast.info("Image cleared");
  };

  const handleUploadComplete = (res: UploadCompleteResponse) => {
    if (res?.[0]) {
      const uploadedFile = res[0];

      // Check if we have the complete response with fileId
      if (
        "fileId" in uploadedFile.serverData &&
        uploadedFile.serverData.fileId
      ) {
        const newImage: GalleryImage = {
          id: uploadedFile.serverData.fileId,
          url: uploadedFile.ufsUrl || uploadedFile.url,
          name: uploadedFile.name,
          uploadedAt: new Date(),
          category: uploadedFile.serverData.category,
          size: uploadedFile.size,
          mimeType: uploadedFile.type || "image/*",
          altText: null,
          caption: null,
        };

        setUploadedImages((prev) => [newImage, ...prev]);

        const fileData: FileSelectionData = {
          url: uploadedFile.url || uploadedFile.ufsUrl,
          fileId: uploadedFile.serverData.fileId,
          name: uploadedFile.name,
          mimeType: uploadedFile.type || "image/*",
        };

        // Return based on returnType preference
        if (returnType === "fileData") {
          onValueChange(fileData);
        } else {
          onValueChange(uploadedFile.url || uploadedFile.ufsUrl);
        }

        setImageDialogOpen(false);

        toast.success("🎉 Image uploaded and selected!", {
          description: "Your image is ready to use.",
          duration: 4000,
        });
      } else {
        console.warn("File uploaded but not saved to database");
        toast.warning("⚠️ Upload partially completed", {
          description: "File uploaded but may not be properly saved",
        });
      }
    }
  };

  const handleUploadError = (error: Error) => {
    toast.error("❌ Upload failed", {
      description: error.message,
      duration: 5000,
    });
  };

  return (
    <div className={cn(className)} {...props}>
      {currentUrl ? (
        <div className="relative group">
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-gradient-to-r from-background to-muted/30 transition-all duration-300 hover:shadow-md hover:border-primary/50">
            <div className="flex-shrink-0 relative">
              <Image
                src={currentUrl}
                alt="Selected image"
                width={48}
                height={48}
                className="w-12 h-12 object-cover rounded border shadow-sm group-hover:shadow-md transition-shadow"
                unoptimized={true}
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-background rounded-full flex items-center justify-center">
                <Sparkles className="size-2 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate flex items-center gap-2">
                <ImageIcon className="size-3 text-primary" />
                Selected Image
                {currentFileId && (
                  <Badge variant="secondary" className="text-xs">
                    ID: {currentFileId.slice(0, 8)}...
                  </Badge>
                )}
              </p>
              <p className="text-xs text-muted-foreground break-all overflow-hidden max-h-8 leading-tight">
                {currentUrl}
              </p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={clearSelectedImage}
              className="flex-shrink-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
            >
              <X className="size-4" />
            </Button>
          </div>
        </div>
      ) : (
        <Dialog open={imageDialogOpen} onOpenChange={setImageDialogOpen}>
          <DialogTrigger asChild>
            <Button
              type="button"
              variant="outline"
              className={cn(
                "relative overflow-hidden group hover:border-primary/50 hover:bg-primary/5 transition-all duration-300",
                triggerClassName
              )}
            >
              <div className="flex items-center gap-2">
                <Upload className="size-4 group-hover:scale-110 transition-transform" />
                {placeholder}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[85vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileImage className="size-5 text-primary" />
                Select or Upload Image
              </DialogTitle>
              <DialogDescription>
                Choose an existing image from your gallery or upload a new one.
                {returnType === "fileData" &&
                  " (Enhanced mode with file tracking)"}
              </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="upload" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload" className="flex items-center gap-2">
                  <Zap className="size-4" />
                  Upload New
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="flex items-center gap-2"
                >
                  <ImageIcon className="size-4" />
                  Select Existing
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="space-y-4">
                <EnhancedUploadDropzone
                  endpoint={endpoint}
                  variant={variant}
                  onClientUploadComplete={handleUploadComplete}
                  onUploadError={handleUploadError}
                  showPreview={true}
                  autoUpload={false}
                />
              </TabsContent>

              <TabsContent value="gallery" className="space-y-4">
                {loadingImages ? (
                  <div className="flex flex-col items-center justify-center py-12 space-y-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
                    <div className="text-sm text-muted-foreground animate-pulse">
                      Loading your gallery...
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-96 overflow-y-auto p-1">
                    {uploadedImages.map((image) => (
                      <div
                        key={image.id}
                        className="group relative cursor-pointer border rounded-lg overflow-hidden hover:border-primary transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-95"
                        onClick={() => handleImageSelect(image)}
                      >
                        <div className="aspect-video relative">
                          <Image
                            src={image.url}
                            alt={image.altText || image.name}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-110"
                            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw"
                            unoptimized={true}
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                        </div>

                        <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
                          >
                            ✨ Select Image
                          </Badge>
                        </div>

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3">
                          <p className="text-white text-xs font-medium truncate">
                            {image.name}
                          </p>
                          {image.caption && (
                            <p className="text-white/80 text-xs truncate mt-1">
                              {image.caption}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-white/60 text-xs">
                              {new Date(image.uploadedAt).toLocaleDateString()}
                            </span>
                            {returnType === "fileData" && (
                              <Badge
                                variant="outline"
                                className="text-xs bg-white/10 text-white border-white/20"
                              >
                                {image.id.slice(0, 6)}...
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {uploadedImages.length === 0 && !loadingImages && (
                      <div className="col-span-full flex flex-col items-center justify-center py-12 text-muted-foreground space-y-3">
                        <div className="relative">
                          <Upload className="h-12 w-12 opacity-20" />
                          <Sparkles className="h-5 w-5 absolute -top-1 -right-1 text-primary/40" />
                        </div>
                        <div className="text-center space-y-1">
                          <p className="text-sm font-medium">No images yet</p>
                          <p className="text-xs opacity-75">
                            Upload your first image to get started
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

export { ImageSelector };
