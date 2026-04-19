"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { emailSchema, type EmailPayload } from "@/lib/validations/auth";

type Props = React.ComponentPropsWithoutRef<"form">;

function ForgotPassword({ className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const [submitted, setSubmitted] = React.useState(false);

  const form = useForm<EmailPayload>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: "" },
    mode: "onSubmit",
  });

  function onSubmit(data: EmailPayload) {
    startTransition(async () => {
      try {
        await requestPasswordReset(data.email);
        // Always show success to avoid email enumeration
        setSubmitted(true);
      } catch {
        toast.error("Something went wrong. Please try again.");
      }
    });
  }

  if (submitted) {
    return (
      <p className="text-sm text-muted-foreground text-center py-4">
        If an account exists for that email address, you will receive a password
        reset link shortly.{" "}
        <span className="text-foreground font-medium">
          Check your inbox (and spam folder).
        </span>
      </p>
    );
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
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button isPending={isPending} className="w-full" type="submit">
          Send reset link
        </Button>
      </form>
    </Form>
  );
}

export { ForgotPassword };
