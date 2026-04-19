"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PasswordInput } from "@/components/ui/password-input";
import { appConfig } from "@/config";
import { resetPasswordWithToken } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { passwordSchema } from "@/lib/validations/auth";

const resetSchema = z
  .object({
    password: passwordSchema.shape.password,
    confirmPassword: passwordSchema.shape.password,
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ResetPayload = z.infer<typeof resetSchema>;

type Props = React.ComponentPropsWithoutRef<"form">;

function ResetPassword({ className, ...props }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const form = useForm<ResetPayload>({
    resolver: zodResolver(resetSchema),
    defaultValues: { password: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  if (!token || !email) {
    return (
      <p className="text-sm text-destructive text-center py-4">
        Invalid reset link. Please request a new one.
      </p>
    );
  }

  function onSubmit(data: ResetPayload) {
    startTransition(async () => {
      try {
        const result = await resetPasswordWithToken(
          email,
          token,
          data.password,
        );

        if ("error" in result) {
          toast.error(result.error, { duration: 6000 });
          return;
        }

        toast.success("Password updated successfully. Please sign in.");
        router.push(appConfig.auth.signin.href);
      } catch {
        toast.error("Something went wrong. Please try again.");
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
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm new password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="new-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button isPending={isPending} className="w-full" type="submit">
          Set new password
        </Button>
      </form>
    </Form>
  );
}

export { ResetPassword };
