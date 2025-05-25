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
import { Textarea } from "@/components/ui/textarea";
import { AdminFrameworksData } from "@/lib/actions/queries";
import { updateResearchFramework } from "@/lib/actions/research";
import { cn } from "@/lib/utils";
import {
  type UpdateFrameworkPayload,
  updateFrameworkSchema,
} from "@/lib/validations/research";

type RFrameType = AdminFrameworksData[number];
type Props = React.ComponentPropsWithoutRef<"form"> & {
  frame: RFrameType;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function UpdateResearchFramework({
  frame,
  setIsOpen,
  className,
  ...props
}: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<UpdateFrameworkPayload>({
    resolver: zodResolver(updateFrameworkSchema),
    defaultValues: {
      title: frame.title,
      description: frame.description,
      href: frame.href,
      linkText: frame.linkText,
    },
    mode: "onTouched",
  });

  function onSubmit(data: UpdateFrameworkPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await updateResearchFramework(frame.id, data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Research framework updated successfully!",
        });
        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to update research framework:", error);
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
          name="title"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Title" />
              <FormControl>
                <Input
                  placeholder="e.g., Community-Based Participatory Research (CBPR)"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Description" />
              <FormControl>
                <Textarea
                  placeholder="Description of the research framework"
                  className="min-h-12"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                A detailed explanation of the methodology as used in the context
                of...
              </FormDescription>
            </FormItem>
          )}
        />
        <div className="grid xs:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="href"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Link URL" />
                <FormControl>
                  <Input
                    placeholder="https://example.com/framework-guide"
                    type="url"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  External link to framework resources.
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="linkText"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Link Text" />
                <FormControl>
                  <Input placeholder="e.g., Learn more about CBPR" {...field} />
                </FormControl>
                <FormDescription>
                  Text for the &ldquo;read more&rdquo; link
                </FormDescription>
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          variant={"brand"}
          className="w-full"
          isPending={isPending}
        >
          Update Research Framework
        </Button>
      </form>
    </Form>
  );
}

export { UpdateResearchFramework };
