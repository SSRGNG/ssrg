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
import { AdminMethodologiesData } from "@/lib/actions/queries";
import { updateResearchMethodology } from "@/lib/actions/research";
import { cn } from "@/lib/utils";
import {
  type UpdateMethodologyPayload,
  updateMethodologySchema,
} from "@/lib/validations/research";

type RMetType = AdminMethodologiesData[number];
type Props = React.ComponentPropsWithoutRef<"form"> & {
  meth: RMetType;
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function UpdateResearchMethodology({
  meth,
  setIsOpen,
  className,
  ...props
}: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<UpdateMethodologyPayload>({
    resolver: zodResolver(updateMethodologySchema),
    defaultValues: {
      title: meth.title,
      description: meth.description,
    },
    mode: "onTouched",
  });

  function onSubmit(data: UpdateMethodologyPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await updateResearchMethodology(meth.id, data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Research methodology updated successfully!",
        });
        if (setIsOpen) {
          setIsOpen(false);
        }
      } catch (error) {
        console.error("Failed to update research methodology:", error);
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
                  placeholder="e.g., Participatory Action Research (PAR)"
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
                  placeholder="Description of the research methodology"
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

        {/* <FormField
          control={form.control}
          name="order"
          render={({ field, fieldState }) => (
            <FormItem className="w-20">
              <ErrorTitle fieldState={fieldState} title="Order" />
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
            </FormItem>
          )}
        /> */}

        <Button
          type="submit"
          variant={"brand"}
          className="w-full"
          isPending={isPending}
        >
          Update Research Methodology
        </Button>
      </form>
    </Form>
  );
}

export { UpdateResearchMethodology };
