"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorTitle } from "@/components/forms/error-title";
import { ImageSelector } from "@/components/shared/enhanced-image-selector";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createEventMedia } from "@/lib/actions/events";
import { cn } from "@/lib/utils";
import {
  type CreateEventMediaPayload,
  createEventMediaSchema,
} from "@/lib/validations/event";
import { FileSelectionData, T_Data } from "@/types";

type Props<TContext> = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  context?: TContext;
};

const defaultValues: CreateEventMediaPayload = {
  eventId: "",
  fileId: "",
  caption: "",
  externalEvent: "",
  externalLocation: "",
  externalDate: undefined,
  isPublic: true,
  isFeatured: false,
  sortOrder: undefined,
};

function CreateEventMedia<TContext>({
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

  const form = useForm<CreateEventMediaPayload>({
    resolver: zodResolver(createEventMediaSchema),
    defaultValues,
    mode: "onTouched",
  });

  const t_data = context as T_Data;
  const { events = [] } = t_data;

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

  function onSubmit(data: CreateEventMediaPayload) {
    startTransition(async () => {
      try {
        // Ensure we have a fileId
        if (!data.fileId) {
          toast.error("Error", {
            description: "Please select a file before submitting.",
          });
          return;
        }

        const result = await createEventMedia(data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Event media uploaded successfully!",
        });

        if (setIsOpen) {
          setIsOpen(false);
        }

        // Reset form
        form.reset();
        setSelectedFile({ url: "", fileId: undefined });
      } catch (error) {
        console.error("Failed to upload event media:", error);
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
            Event Information
          </h3>
          <Separator />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="eventId"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Internal Event" />
                  <Select value={field.value} onValueChange={field.onChange}>
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Link to internal event" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {events.length === 0 ? (
                        <SelectItem disabled value="no_event">
                          No events available
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
                    Optional: Link to a group hosted event
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="externalLocation"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Location" />
                  <FormControl>
                    <Input
                      placeholder="e.g., University of Lagos, Nigeria"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional: Event location or venue
                  </FormDescription>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="externalDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Event Date" />
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        captionLayout="dropdown"
                        autoFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    Optional: Date when the event occurred
                  </FormDescription>
                </FormItem>
              )}
            />
          </div>
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
                <ErrorTitle fieldState={fieldState} title="Event Media" />
                <FormControl>
                  <ImageSelector
                    value={selectedFile}
                    onValueChange={handleFileSelect}
                    returnType="fileData"
                    endpoint="eventMediaUploader"
                    imageStrategy={{
                      type: "filters",
                      filters: {
                        categories: ["event_media"],
                        includeResearch: false,
                      },
                    }}
                    triggerClassName="w-full"
                    placeholder="Upload or Select Event Media"
                  />
                </FormControl>
                <FormDescription>
                  Upload images from events. Files will be properly tracked in
                  your media library.
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
                    placeholder="e.g., Dr. Okafor presenting keynote at the African Social Science Conference"
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

export { CreateEventMedia };
