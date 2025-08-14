"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { ErrorTitle } from "@/components/forms/error-title";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateAuthor } from "@/lib/actions/publications";
import { ProfileAuthor } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";
import {
  type UpdateAuthorPayload,
  updateAuthorSchema,
} from "@/lib/validations/author";

type Props = React.ComponentPropsWithoutRef<"form"> & {
  author: ProfileAuthor;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function UpdateAuthorProfile({
  author,
  setIsOpen,
  className,
  ...props
}: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<UpdateAuthorPayload>({
    resolver: zodResolver(updateAuthorSchema),
    defaultValues: {
      id: author.id,
      name: author.name,
      email: author.email,
      affiliation: author.affiliation,
      orcid: author.orcid,
      researcherId: author.researcherId,
    },
    mode: "onTouched",
  });

  function onSubmit(data: UpdateAuthorPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await updateAuthor(data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Your profile has been updated successfully!",
        });
        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to update profile:", error);
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
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Full Name" />
              <FormControl>
                <Input placeholder="Irene R. Davis" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Email" />
              <FormControl>
                <Input
                  placeholder="irene@unn.edu"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="affiliation"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Affiliation" />
              <FormControl>
                <Input
                  placeholder="University, Organization, or Company"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="orcid"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="ORCID ID" />
              <FormControl>
                <Input
                  placeholder="e.g., 0000-0002-1825-0097"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="researcherId"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Researcher ID" />
              <FormControl>
                <Input {...field} value={field.value || ""} disabled />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          className="w-full"
          variant="brand"
          isPending={isPending}
        >
          {isPending ? "Updating..." : "Update Author Profile"}
        </Button>
      </form>
    </Form>
  );
}

export { UpdateAuthorProfile };
