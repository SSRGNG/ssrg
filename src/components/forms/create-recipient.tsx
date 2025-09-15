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
import { createRecipient } from "@/lib/actions/events";
import { cn } from "@/lib/utils";
import {
  type CreateRecipientPayload,
  createRecipientSchema,
} from "@/lib/validations/event";
import { T_Data } from "@/types";

type Props<TContext> = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  // scholarships?: Array<{ id: string; title: string }>;
  context?: TContext;
};

const defaultValues: CreateRecipientPayload = {
  scholarshipId: "",
  name: "",
  affiliation: "",
  year: new Date().getFullYear(),
  amount: "",
  notes: "",
};

function CreateRecipient<TContext>({
  setIsOpen,
  context,
  // scholarships = [],
  className,
  ...props
}: Props<TContext>) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<CreateRecipientPayload>({
    resolver: zodResolver(createRecipientSchema),
    defaultValues,
    mode: "onTouched",
  });

  const t_data = context as T_Data;
  const { scholarships } = t_data;

  function onSubmit(data: CreateRecipientPayload) {
    startTransition(async () => {
      try {
        // console.log({ data });
        const result = await createRecipient(data);

        if (result.error) {
          toast.error("Error", { description: result.error });
          return;
        }

        toast.success("Success", {
          description: "Recipient added successfully!",
        });

        if (setIsOpen) {
          setIsOpen(false);
        }

        form.reset();
      } catch (error) {
        console.error("Failed to create recipient:", error);
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
          name="scholarshipId"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Scholarship Program" />
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select scholarship program" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {scholarships.map((scholarship) => (
                    <SelectItem key={scholarship.id} value={scholarship.id}>
                      {scholarship.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Recipient Name" />
                <FormControl>
                  <Input
                    placeholder="e.g., Johnson Patience Somtochukwu"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="year"
            render={({ field, fieldState }) => (
              <FormItem>
                <ErrorTitle fieldState={fieldState} title="Year" />
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2025"
                    {...field}
                    onChange={(e) =>
                      field.onChange(
                        parseInt(e.target.value) || new Date().getFullYear()
                      )
                    }
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="affiliation"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Affiliation" />
              <FormControl>
                <Input
                  placeholder="e.g., Department of Social Work, UNN"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Institution or department affiliation (optional)
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Amount Awarded" />
              <FormControl>
                <Input placeholder="e.g., ₦50,000 or Full Tuition" {...field} />
              </FormControl>
              <FormDescription>
                Individual amount if different from base scholarship amount
              </FormDescription>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notes"
          render={({ field, fieldState }) => (
            <FormItem>
              <ErrorTitle fieldState={fieldState} title="Notes" />
              <FormControl>
                <Textarea
                  placeholder="Additional information about the recipient..."
                  className="min-h-[80px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Any additional information or achievements
              </FormDescription>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? "Adding..." : "Add Recipient"}
        </Button>
      </form>
    </Form>
  );
}

export { CreateRecipient };
