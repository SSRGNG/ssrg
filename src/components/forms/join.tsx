"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

import { MultiSelect, Option } from "@/components/shared/multi-select";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { catchError, cn } from "@/lib/utils";
import { z } from "zod";

type Props = React.ComponentProps<"form">;

const joinSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address",
  }),
  interests: z.array(z.string()).min(1, "At least one interest is required"),
});

type JoinPayload = z.infer<typeof joinSchema>;

const interestOptions: Option[] = [
  { label: "Community Development", value: "community-development" },
  { label: "Social Policy", value: "social-policy" },
  { label: "Equity & Inclusion", value: "equity-inclusion" },
];
const defaultValues: JoinPayload = {
  name: "",
  email: "",
  interests: [],
};

function Join({ className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<JoinPayload>({
    resolver: zodResolver(joinSchema),
    defaultValues,
    mode: "onSubmit",
  });

  function onSubmit(data: JoinPayload) {
    startTransition(async () => {
      try {
        console.log(data);
      } catch (err) {
        catchError(err);
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
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              {error ? (
                <FormLabel>{error.message}</FormLabel>
              ) : (
                <FormLabel>Name</FormLabel>
              )}
              <FormControl>
                <Input placeholder="Oscar Wild" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              {error ? (
                <FormLabel>{error.message}</FormLabel>
              ) : (
                <FormLabel>Email</FormLabel>
              )}
              <FormControl>
                <Input placeholder="Email address" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="interests"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              {error ? (
                <FormLabel>{error.message}</FormLabel>
              ) : (
                <FormLabel>Interests</FormLabel>
              )}
              <FormControl>
                <MultiSelect
                  options={interestOptions}
                  value={field.value}
                  onValueChange={field.onChange}
                  placeholder="Select your interests"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button isPending={isPending} className="w-full" type="submit">
          Subscribe
        </Button>
      </form>
    </Form>
  );
}

export { Join };
