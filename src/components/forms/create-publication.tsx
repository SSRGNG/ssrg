"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorTitle } from "@/components/forms/error-title";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { publications } from "@/config/enums";
import { cn } from "@/lib/utils";
import {
  createPublicationSchema,
  type CreatePublicationPayload,
} from "@/lib/validations/publication";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

const defaultValues: CreatePublicationPayload = {
  title: "",
  type: "journal_article",
  abstract: "",
  link: "",
  venue: "",
  doi: "",
  metadata: {},
  authors: [{ researcherId: "", contribution: "", order: 0 }],
  areas: [],
};

const publicationTypes = publications.items;

function CreatePublication({ setIsOpen, className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<CreatePublicationPayload>({
    resolver: zodResolver(createPublicationSchema),
    defaultValues,
    mode: "onTouched",
  });

  const selectedType = form.watch("type");

  function onSubmit(data: CreatePublicationPayload) {
    startTransition(async () => {
      try {
        console.log({ data });
        // const result = await createPublication(data);

        // if (result.error) {
        //   toast.error("Error", { description: result.error });
        //   return;
        // }

        toast.success("Success", {
          description: "Publication created successfully!",
        });
        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to create publication:", error);
        toast.error("Error", {
          description: "Something went wrong. Please try again.",
        });
      }
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("space-y-4", className)}
        {...props}
      >
        <div className="grid xs:grid-cols-4 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Publication Type" />
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select publication type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {publicationTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field, fieldState }) => (
              <FormItem className="xs:col-span-3">
                <ErrorTitle fieldState={fieldState} title="Title" />
                <FormControl>
                  <Input placeholder="e.g., ..." {...field} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="abstract"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Abstract" />
              <FormControl>
                <Textarea
                  placeholder="Abstract or summary of the publication"
                  className="min-h-24"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormDescription>
                A brief summary of the publication content.
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="grid xs:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="venue"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle
                  fieldState={fieldState}
                  title={
                    selectedType === "journal_article"
                      ? "Journal Name"
                      : selectedType === "conference_paper"
                      ? "Conference Name"
                      : "Venue"
                  }
                />
                <FormControl>
                  <Input
                    placeholder={
                      selectedType === "journal_article"
                        ? "e.g., Nature Medicine"
                        : selectedType === "conference_paper"
                        ? "e.g., International Conference on Health Research"
                        : "Publication venue"
                    }
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  {selectedType === "journal_article" &&
                    "The journal where this article was published."}
                  {selectedType === "conference_paper" &&
                    "The conference where this paper was presented."}
                  {!["journal_article", "conference_paper"].includes(
                    selectedType
                  ) && "Where this publication was released."}
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="publicationDate"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Publication Date" />
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) =>
                      field.onChange(
                        e.target.value ? new Date(e.target.value) : null
                      )
                    }
                  />
                </FormControl>
                <FormDescription>
                  When this publication was released.
                </FormDescription>
              </FormItem>
            )}
          />
        </div>
        <div className="grid xs:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="link"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Link URL" />
                <FormControl>
                  <Input
                    placeholder="https://example.com/publication"
                    type="url"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  External link to the publication.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="doi"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="DOI" />
                <FormControl>
                  <Input
                    placeholder="e.g., 10.1000/182"
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormDescription>
                  Digital Object Identifier (if available).
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        {/* Type-specific metadata fields */}
        {selectedType === "journal_article" && (
          <div className="grid xs:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="metadata.volume"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Volume" />
                  <FormControl>
                    <Input
                      placeholder="e.g., 25"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata.issue"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Issue" />
                  <FormControl>
                    <Input
                      placeholder="e.g., 3"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata.pages"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Pages" />
                  <FormControl>
                    <Input
                      placeholder="e.g., 123-145"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        {selectedType === "conference_paper" && (
          <div className="grid xs:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="metadata.conferenceLocation"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle
                    fieldState={fieldState}
                    title="Conference Location"
                  />
                  <FormControl>
                    <Input
                      placeholder="e.g., New York, NY"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata.conferenceDate"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Conference Date" />
                  <FormControl>
                    <Input
                      type="datetime-local"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        {selectedType === "book_chapter" && (
          <div className="grid xs:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="metadata.bookTitle"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Book Title" />
                  <FormControl>
                    <Input
                      placeholder="e.g., Handbook of Research Methods"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata.publisher"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Publisher" />
                  <FormControl>
                    <Input
                      placeholder="e.g., Academic Press"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata.city"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="City" />
                  <FormControl>
                    <Input
                      placeholder="e.g., Boston"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata.isbn"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="ISBN" />
                  <FormControl>
                    <Input
                      placeholder="e.g., 978-0123456789"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        {selectedType === "report" && (
          <div className="grid xs:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="metadata.organization"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Organization" />
                  <FormControl>
                    <Input
                      placeholder="e.g., World Health Organization"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadata.reportNumber"
              render={({ field, fieldState }) => (
                <FormItem>
                  <ErrorTitle fieldState={fieldState} title="Report Number" />
                  <FormControl>
                    <Input
                      placeholder="e.g., WHO/2024/001"
                      {...field}
                      value={field.value || ""}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        )}

        <Button
          type="submit"
          variant={"brand"}
          className="w-full"
          isPending={isPending}
        >
          Create Publication
        </Button>
      </form>
    </Form>
  );
}

export { CreatePublication };
