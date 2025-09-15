"use client";

import { useDropzone } from "@uploadthing/react";
import {
  AlertCircle,
  Check,
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
import {
  generateClientDropzoneAccept,
  generatePermittedFileTypes,
} from "uploadthing/client";

import type {
  Endpoint,
  UploadCompleteResponse,
} from "@/app/api/uploadthing/core";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useUploadThing } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";

type FileUpload = {
  file: File;
  progress: number;
  status: "pending" | "uploading" | "success" | "error";
  url?: string;
  error?: string;
  preview?: string;
};

type EnhancedUploadDropzoneProps = {
  endpoint: Endpoint;
  onClientUploadComplete?: (res: UploadCompleteResponse) => void;
  onUploadError?: (error: Error) => void;
  className?: string;
  variant?: "default" | "outline" | "ghost" | "minimal";
  disabled?: boolean;
  showPreview?: boolean;
  autoUpload?: boolean;
};

export function EnhancedUploadDropzone({
  endpoint,
  onClientUploadComplete,
  onUploadError,
  className,
  variant = "default",
  disabled = false,
  showPreview = true,
  autoUpload = true,
}: EnhancedUploadDropzoneProps) {
  const [files, setFiles] = React.useState<FileUpload[]>([]);

  const { startUpload, routeConfig, isUploading } = useUploadThing(endpoint, {
    onClientUploadComplete: (res) => {
      // Update file statuses to success
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "success" as const,
          progress: 100,
          url: res.find((r) => r.name === f.file.name)?.url,
        }))
      );

      toast.success("🎉 Upload completed!", {
        description: `Successfully uploaded ${res.length} file(s)`,
      });

      onClientUploadComplete?.(res);
    },
    onUploadError: (error) => {
      setFiles((prev) =>
        prev.map((f) => ({
          ...f,
          status: "error" as const,
          error: error.message,
        }))
      );

      toast.error("❌ Upload failed", {
        description: error.message,
      });

      onUploadError?.(error);
    },
    onUploadBegin: (file) => {
      setFiles((prev) =>
        prev.map((f) =>
          f.file.name === file
            ? { ...f, status: "uploading" as const, progress: 0 }
            : f
        )
      );

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setFiles((prev) =>
          prev.map((f) =>
            f.file.name === file && f.progress < 90
              ? { ...f, progress: f.progress + Math.random() * 15 }
              : f
          )
        );
      }, 300);

      // Clear interval after reasonable time
      setTimeout(() => clearInterval(progressInterval), 10000);
    },
    onUploadProgress: (progress) => {
      // If the API provides real progress, use it
      setFiles((prev) =>
        prev.map((f) => (f.status === "uploading" ? { ...f, progress } : f))
      );
    },
  });

  // Get configuration from route config
  const { fileTypes } = generatePermittedFileTypes(routeConfig);
  const maxFileCount =
    routeConfig?.image?.maxFileCount || routeConfig?.pdf?.maxFileCount || 1;
  const maxFileSize =
    routeConfig?.image?.maxFileSize || routeConfig?.pdf?.maxFileSize || "1MB";

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: generateClientDropzoneAccept(fileTypes),
    maxFiles: maxFileCount,
    disabled: disabled || isUploading,
    onDrop: (acceptedFiles) => {
      // Handle accepted files
      if (acceptedFiles.length > 0) {
        if (files.length + acceptedFiles.length > maxFileCount) {
          toast.error(`Maximum ${maxFileCount} files allowed`);
          return;
        }

        const newFiles: FileUpload[] = acceptedFiles.map((file) => ({
          file,
          progress: 0,
          status: "pending" as const,
          preview: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : undefined,
        }));

        setFiles((prev) => [...prev, ...newFiles]);

        if (autoUpload) {
          startUpload(acceptedFiles);
        } else {
          toast.success(`${acceptedFiles.length} file(s) added`);
        }
      }
    },
  });

  const removeFile = (fileToRemove: File) => {
    setFiles((prev) => {
      const updated = prev.filter((f) => f.file !== fileToRemove);

      // Clean up preview URLs
      const removedFile = prev.find((f) => f.file === fileToRemove);
      if (removedFile?.preview) {
        URL.revokeObjectURL(removedFile.preview);
      }

      return updated;
    });
  };

  const clearAll = () => {
    // Clean up all preview URLs
    files.forEach((f) => {
      if (f.preview) URL.revokeObjectURL(f.preview);
    });
    setFiles([]);
  };

  const uploadFiles = () => {
    const pendingFiles = files
      .filter((f) => f.status === "pending")
      .map((f) => f.file);
    if (pendingFiles.length > 0) {
      startUpload(pendingFiles);
    }
  };

  const getDropzoneStyles = () => {
    const baseStyles =
      "relative overflow-hidden transition-all duration-300 border-2 border-dashed rounded-xl";
    const activeStyles = isDragActive; // Use only the dropzone's isDragActive

    switch (variant) {
      case "default":
        return cn(
          baseStyles,
          "bg-gradient-to-br from-primary/5 via-primary/10 to-muted/20 border-primary/30",
          activeStyles &&
            "border-primary/70 bg-primary/20 shadow-lg scale-[1.02]",
          !activeStyles && "hover:border-primary/50 hover:bg-primary/10"
        );
      case "outline":
        return cn(
          baseStyles,
          "border-border bg-background",
          activeStyles && "border-primary bg-primary/5 shadow-md",
          !activeStyles && "hover:bg-muted/50 hover:border-muted-foreground"
        );
      case "ghost":
        return cn(
          baseStyles,
          "border-transparent bg-transparent",
          activeStyles && "border-primary/50 bg-primary/5",
          !activeStyles && "hover:bg-muted/30"
        );
      case "minimal":
        return cn(
          baseStyles,
          "border-dashed border-muted-foreground/20 bg-transparent",
          activeStyles && "border-primary/50 bg-primary/5",
          !activeStyles && "hover:border-muted-foreground/40"
        );
      default:
        return cn(
          baseStyles,
          "border-border bg-background hover:bg-muted/50",
          activeStyles && "border-primary bg-primary/5"
        );
    }
  };

  const canUploadMore = files.length < maxFileCount && !isUploading;
  const hasFiles = files.length > 0;
  const hasPendingFiles = files.some((f) => f.status === "pending");

  // Clean up preview URLs on unmount
  React.useEffect(() => {
    return () => {
      files.forEach((f) => {
        if (f.preview) URL.revokeObjectURL(f.preview);
      });
    };
  }, [files]);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Main Dropzone */}
      {canUploadMore && (
        <div
          {...getRootProps()}
          className={cn(
            getDropzoneStyles(),
            "min-h-40 flex flex-col items-center justify-center gap-4 p-8 cursor-pointer group",
            disabled && "cursor-not-allowed opacity-50"
          )}
        >
          <input {...getInputProps()} />

          {/* Animated Upload Icon */}
          <div className="relative">
            <div
              className={cn(
                "flex items-center justify-center w-16 h-16 rounded-full transition-all duration-500",
                variant === "default"
                  ? "bg-primary/10 text-primary group-hover:bg-primary/20"
                  : "bg-muted text-muted-foreground group-hover:bg-muted/80",
                isDragActive && "scale-110 animate-pulse"
              )}
            >
              <Upload
                className={cn(
                  "w-8 h-8 transition-all duration-300",
                  isDragActive && "scale-110 animate-bounce"
                )}
              />
            </div>
            {isDragActive && (
              <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-pulse" />
            )}
          </div>

          {/* Upload Text */}
          <div className="text-center space-y-3">
            <div className="space-y-1">
              <p className="text-lg font-semibold">
                {isDragActive
                  ? "✨ Drop your files here"
                  : "Drag & drop files here"}
              </p>
              <p className="text-sm text-muted-foreground">
                or click to browse your computer
              </p>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                Max {maxFileCount} files
              </Badge>
              <Badge variant="outline" className="text-xs">
                Up to {maxFileSize}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {fileTypes
                  .join(", ")
                  .replace(/image\/|\*|application\//g, "")
                  .toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Progress indicator for active uploads */}
          {isUploading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary/20">
              <div
                className="h-full bg-primary transition-all duration-300 animate-pulse"
                style={{ width: "60%" }}
              />
            </div>
          )}
        </div>
      )}

      {/* File List */}
      {hasFiles && (
        <div className="space-y-4">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileImage className="w-5 h-5 text-primary" />
              <h4 className="text-sm font-semibold">
                Files ({files.length}/{maxFileCount})
              </h4>
            </div>

            <div className="flex items-center gap-2">
              {!autoUpload && hasPendingFiles && (
                <Button
                  onClick={uploadFiles}
                  disabled={isUploading}
                  size="sm"
                  className="h-8"
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Upload Files
                </Button>
              )}
              <Button
                onClick={clearAll}
                variant="outline"
                size="sm"
                className="h-8"
                disabled={isUploading}
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* File Cards */}
          <div className="grid gap-3">
            {files.map((fileUpload, index) => (
              <div
                key={`${fileUpload.file.name}-${index}`}
                className={cn(
                  "flex items-center gap-4 p-4 border rounded-lg bg-card transition-all duration-200",
                  fileUpload.status === "success" &&
                    "border-emerald-200 bg-emerald-50/50",
                  fileUpload.status === "error" &&
                    "border-rose-200 bg-rose-50/50",
                  fileUpload.status === "uploading" &&
                    "border-indigo-200 bg-indigo-50/50"
                )}
              >
                {/* File Preview/Icon */}
                <div className="flex-shrink-0">
                  {showPreview && fileUpload.preview ? (
                    // <div className="w-12 h-12 rounded-lg overflow-hidden border">
                    //   <img
                    //     src={fileUpload.preview}
                    //     alt={fileUpload.file.name}
                    //     className="w-full h-full object-cover"
                    //   />
                    // </div>

                    <Image
                      src={fileUpload.preview}
                      alt={fileUpload.file.name}
                      width={48}
                      height={48}
                      className="w-12 h-12 object-cover rounded-lg border shadow-sm group-hover:shadow-md transition-shadow"
                      unoptimized={true}
                    />
                  ) : (
                    <div
                      className={cn(
                        "w-12 h-12 rounded-lg flex items-center justify-center",
                        fileUpload.status === "success" &&
                          "bg-emerald-100 text-emerald-600",
                        fileUpload.status === "error" &&
                          "bg-rose-100 text-rose-600",
                        fileUpload.status === "uploading" &&
                          "bg-indigo-100 text-indigo-600",
                        fileUpload.status === "pending" &&
                          "bg-muted text-muted-foreground"
                      )}
                    >
                      {fileUpload.status === "success" ? (
                        <Check className="w-6 h-6" />
                      ) : fileUpload.status === "error" ? (
                        <AlertCircle className="w-6 h-6" />
                      ) : (
                        <ImageIcon className="w-6 h-6" />
                      )}
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium truncate pr-2">
                      {fileUpload.file.name}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{(fileUpload.file.size / 1024).toFixed(1)} KB</span>
                      <Badge
                        variant={
                          fileUpload.status === "success"
                            ? "default"
                            : fileUpload.status === "error"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {fileUpload.status}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {fileUpload.status === "uploading" && (
                    <div className="space-y-1">
                      <Progress value={fileUpload.progress} className="h-2" />
                      <p className="text-xs text-indigo-600">
                        Uploading... {Math.round(fileUpload.progress)}%
                      </p>
                    </div>
                  )}

                  {/* Status Messages */}
                  {fileUpload.status === "success" && (
                    <p className="text-xs text-emerald-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Upload completed successfully
                    </p>
                  )}

                  {fileUpload.status === "error" && (
                    <p className="text-xs text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {fileUpload.error || "Upload failed"}
                    </p>
                  )}

                  {fileUpload.status === "pending" && (
                    <p className="text-xs text-muted-foreground">
                      {autoUpload ? "Ready to upload" : "Waiting for upload"}
                    </p>
                  )}
                </div>

                {/* Remove Button */}
                <Button
                  onClick={() => removeFile(fileUpload.file)}
                  variant="ghost"
                  size="sm"
                  className="flex-shrink-0 h-8 w-8 p-0 hover:bg-rose-100 hover:text-rose-600"
                  disabled={fileUpload.status === "uploading"}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Complete State */}
      {files.length >= maxFileCount && (
        <div className="flex items-center justify-center p-4 border-2 border-dashed border-emerald-200 bg-card rounded-xl">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 text-emerald-700">
              <Check className="w-5 h-5" />
              <span className="text-sm font-medium">
                Upload limit reached ({maxFileCount}/{maxFileCount})
              </span>
            </div>
            <p className="text-xs text-emerald-600">
              Remove files to upload more
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
