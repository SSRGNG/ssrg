"use client";

import { zodResolver } from "@hookform/resolvers/zod";
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
import { changePassword } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { passwordSchema } from "@/lib/validations/auth";

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Current password is required"),
    newPassword: passwordSchema.shape.password,
    confirmPassword: passwordSchema.shape.password,
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type ChangePasswordPayload = z.infer<typeof changePasswordSchema>;

type Props = React.ComponentPropsWithoutRef<"form"> & {
  onSuccess?: () => void;
};

function ChangePassword({ className, onSuccess, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<ChangePasswordPayload>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  function onSubmit(data: ChangePasswordPayload) {
    startTransition(async () => {
      try {
        const result = await changePassword(
          data.currentPassword,
          data.newPassword,
        );

        if ("error" in result) {
          toast.error(result.error, { duration: 6000 });

          if (result.error.toLowerCase().includes("current")) {
            form.setValue("currentPassword", "");
            form.setFocus("currentPassword");
          }
          return;
        }

        toast.success("Password changed successfully.");
        form.reset();
        onSuccess?.();
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
          name="currentPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Current password</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="newPassword"
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
          Update password
        </Button>
      </form>
    </Form>
  );
}

export { ChangePassword };
