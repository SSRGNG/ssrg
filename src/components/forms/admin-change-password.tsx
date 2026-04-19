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
import { adminChangeUserPassword } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { passwordSchema } from "@/lib/validations/auth";

const adminChangePasswordSchema = z
  .object({
    newPassword: passwordSchema.shape.password,
    confirmPassword: passwordSchema.shape.password,
  })
  .refine((d) => d.newPassword === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type AdminChangePasswordPayload = z.infer<typeof adminChangePasswordSchema>;

interface Props extends React.ComponentPropsWithoutRef<"form"> {
  /** The ID of the user whose password is being changed. */
  targetUserId: string;
  /** Displayed in the success toast. */
  targetUserName?: string;
  /** Called after a successful update so the parent can close a dialog, etc. */
  onSuccess?: () => void;
}

function AdminChangePassword({
  targetUserId,
  targetUserName,
  onSuccess,
  className,
  ...props
}: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<AdminChangePasswordPayload>({
    resolver: zodResolver(adminChangePasswordSchema),
    defaultValues: { newPassword: "", confirmPassword: "" },
    mode: "onSubmit",
  });

  function onSubmit(data: AdminChangePasswordPayload) {
    startTransition(async () => {
      try {
        const result = await adminChangeUserPassword(
          targetUserId,
          data.newPassword,
        );

        if ("error" in result) {
          toast.error(result.error, { duration: 6000 });
          return;
        }

        toast.success(
          `Password updated for ${result.userName ?? targetUserName ?? "user"}.`,
        );
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
        {targetUserName && (
          <p className="text-sm text-muted-foreground">
            Setting a new password for{" "}
            <span className="font-medium text-foreground">
              {targetUserName}
            </span>
            . Share it with them securely — they should change it after signing
            in.
          </p>
        )}

        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="••••••••" {...field} />
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
                <PasswordInput placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          isPending={isPending}
          type="submit"
          variant="destructive"
          className="w-full"
        >
          Set password
        </Button>
      </form>
    </Form>
  );
}

export { AdminChangePassword };
