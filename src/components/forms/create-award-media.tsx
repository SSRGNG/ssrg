"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorTitle } from "@/components/forms/error-title";
import { ImageSelector } from "@/components/shared/enhanced-image-selector";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createAwardMedia } from "@/lib/actions/events";
import { cn } from "@/lib/utils";
import {
  type CreateAwardMediaPayload,
  createAwardMediaSchema,
} from "@/lib/validations/event";
import { FileSelectionData, T_Data } from "@/types";

type Props<TContext> = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  context?: TContext;
};

const defaultValues: CreateAwardMediaPayload = {
  scholarshipId: "",
  recipientId: "",
  eventId: "",
  fileId: "",
  externalEvent: "",
  caption: "",
  isPublic: true,
  isFeatured: false,
  sortOrder: 0,
};

function CreateAwardMedia<TContext>({
  setIsOpen,
  context,
  className,
  ...props
}: Props<TContext>) {
  const [isPending, startTransition] = React.useTransition();
  const [selectedFile, setSelectedFile] = React.useState<FileSelectionData>({
    url: "",
    fileId: undefined,
  });

  const form = useForm<CreateAwardMediaPayload>({
    resolver: zodResolver(createAwardMediaSchema),
    defaultValues,
    mode: "onTouched",
  });

  const t_data = context as T_Data;
  const { events = [], recipients = [], scholarships = [] } = t_data;

  const handleFileSelect = (value: string | FileSelectionData) => {
    if (typeof value === "object") {
      setSelectedFile(value);
      if (value.fileId) {
        form.setValue("fileId", value.fileId, { shouldValidate: true });
      }
    } else {
      // Fallback for URL-only (shouldn't happen with returnType="fileData")
      setSelectedFile({ url: value, fileId: undefined });
    }
  };

  function onSubmit(data: CreateAwardMediaPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });

        // Ensure we have a fileId
        if (!data.fileId) {
          toast.error("Error", {
            description: "Please select a file before submitting.",
          });
          return;
        }

        const result = await createAwardMedia(data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Award media uploaded successfully!",
        });

        if (setIsOpen) {
          setIsOpen(false);
        }

        // Reset form
        form.reset();

        setSelectedFile({ url: "", fileId: undefined });
      } catch (error) {
        console.error("Failed to upload award media:", error);
        toast.error("Error", {
          description: "Something went wrong. Please try again.",
        });
      }
    });
  }

  // Watch for form validation errors
  const fileIdError = form.formState.errors.fileId;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
        {...props}
      >
        <div className="space-y-4">
          <h3 className="text-base text-muted-foreground font-medium">
            Link to Content
          </h3>
          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="scholarshipId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle
                    fieldState={fieldState}
                    title="Scholarship Program"
                  />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Link to scholarship" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {scholarships.length === 0 ? (
                        <SelectItem disabled value="no_scholarship">
                          No scholarship
                        </SelectItem>
                      ) : (
                        scholarships.map((scholarship) => (
                          <SelectItem
                            key={scholarship.id}
                            value={scholarship.id}
                          >
                            {scholarship.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optional: Link to specific scholarship program
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="recipientId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Recipient" />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Link to recipient" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {recipients.length === 0 ? (
                        <SelectItem disabled value="no_recipient">
                          No recipient
                        </SelectItem>
                      ) : (
                        recipients.map((recipient) => (
                          <SelectItem key={recipient.id} value={recipient.id}>
                            {recipient.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optional: Link to specific recipient
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="eventId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Event" />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Link to event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.length === 0 ? (
                        <SelectItem disabled value="no_event">
                          No event
                        </SelectItem>
                      ) : (
                        events.map((event) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.title}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Optional: Link to specific event
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="externalEvent"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="External Event" />
                  <FormControl>
                    <Input
                      placeholder="e.g., African Social Science Conference 2025"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Name of external event or conference
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>

          {/* Validation message for required relationship */}
          {form.formState.errors.scholarshipId && (
            <p className="text-sm text-destructive mt-2">
              {form.formState.errors.scholarshipId.message}
            </p>
          )}
        </div>

        <div className="space-y-4">
          <h3 className="text-base text-muted-foreground font-medium">
            Media Upload
          </h3>
          <Separator />

          <FormField
            control={form.control}
            name="sortOrder"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Sort Order" />
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value) || 0)
                    }
                  />
                </FormControl>
                <FormDescription>
                  Order for displaying in galleries (0 = first)
                </FormDescription>
              </FormItem>
            )}
          />

          {/* Hidden field for fileId with custom validation */}
          <FormField
            control={form.control}
            name="fileId"
            render={({ fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Award Media" />
                <FormControl>
                  <ImageSelector
                    value={selectedFile}
                    onValueChange={handleFileSelect}
                    returnType="fileData"
                    endpoint="awardMediaUploader"
                    imageStrategy={{
                      type: "filters",
                      filters: {
                        categories: ["award_media"],
                        includeResearch: false,
                      },
                    }}
                    triggerClassName="w-full"
                    placeholder="Upload or Select Award Media"
                  />
                </FormControl>
                <FormDescription>
                  Upload images, videos, or documents related to awards. Files
                  will be properly tracked in your media library.
                </FormDescription>
                {fileIdError && (
                  <p className="text-sm text-destructive mt-1">
                    {fileIdError.message}
                  </p>
                )}
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="caption"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Caption" />
                <FormControl>
                  <Textarea
                    placeholder="e.g., Congratulations to Okafor Miracle on winning the Award of Best Oral presentation"
                    className="min-h-[100px]"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Description that will be displayed with the media
                </FormDescription>
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="isPublic"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Make public on website</FormLabel>
                    <FormDescription>
                      Uncheck to keep this media private for internal use only
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isFeatured"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start gap-2">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Feature on homepage</FormLabel>
                    <FormDescription>
                      Check to display in homepage carousel
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Uploading..." : "Upload Media"}
        </Button>

        {/* Debug info in development */}
        {process.env.NODE_ENV === "development" && (
          <div className="p-3 bg-muted rounded text-xs space-y-1">
            <p>
              <strong>Selected File ID:</strong> {selectedFile.fileId || "None"}
            </p>
            <p>
              <strong>Selected File URL:</strong> {selectedFile.url || "None"}
            </p>
            <p>
              <strong>Form Valid:</strong>{" "}
              {form.formState.isValid ? "Yes" : "No"}
            </p>
          </div>
        )}
      </form>
    </Form>
  );
}

export { CreateAwardMedia };
