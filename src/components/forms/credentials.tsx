"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
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
import { PasswordInput } from "@/components/ui/password-input";
import { appConfig } from "@/config";
import { signinCredential } from "@/lib/actions";
import { cn } from "@/lib/utils";
import {
  credentialsSchema,
  type CredentialsPayload,
} from "@/lib/validations/auth";

type Props = React.ComponentPropsWithoutRef<"form">;

const defaultValues: CredentialsPayload = { email: "", password: "" };

function Credentials({ className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<CredentialsPayload>({
    resolver: zodResolver(credentialsSchema),
    defaultValues,
    mode: "onSubmit",
  });

  function onSubmit(data: CredentialsPayload) {
    startTransition(async () => {
      try {
        // await signinCredential(data);
        // form.reset();
        const result = await signinCredential(data);

        // signinCredential returns { error } for auth failures.
        // On success it triggers a NEXT_REDIRECT (re-thrown) so we never
        // reach this block — no "NEXT_REDIRECT" toast.
        if (result?.error) {
          toast.error(result.error, { duration: 6000 });

          // If the error is about the password, clear it so the user
          // doesn't have to manually wipe the field.
          if (
            result.error.toLowerCase().includes("password") ||
            result.error.toLowerCase().includes("incorrect")
          ) {
            form.setValue("password", "");
            form.setFocus("password");
          }
        }
      } catch (err) {
        // catchError(err);
        // Re-thrown NEXT_REDIRECT errors have a `digest` starting with
        // "NEXT_REDIRECT" — we must NOT swallow them.
        const digest =
          err instanceof Error
            ? ((err as { digest?: string }).digest ?? "")
            : "";
        if (
          digest.startsWith("NEXT_REDIRECT") ||
          (err instanceof Error && err.message === "NEXT_REDIRECT")
        ) {
          throw err;
        }
        // Anything else is an unexpected server error.
        toast.error("Something went wrong. Please try again later.");
        console.error(err);
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
          name="email"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>{error ? error.message : "Email"}</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email address"
                  autoComplete="email"
                  {...field}
                />
              </FormControl>
            </FormItem>
          )}
        />
        {/* <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              {error ? (
                <FormMessage>{error.message}</FormMessage>
              ) : (
                <FormLabel>Password</FormLabel>
              )}
              <FormControl>
                <PasswordInput placeholder="********" {...field} />
              </FormControl>
            </FormItem>
          )}
        /> */}
        {/* Password */}
        <FormField
          control={form.control}
          name="password"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>{error ? error.message : "Password"}</FormLabel>
                <Link
                  href={appConfig.auth.reset.href}
                  className="text-xs text-muted-foreground underline-offset-4 hover:underline"
                  tabIndex={-1}
                >
                  Forgot password?
                </Link>
              </div>
              <FormControl>
                <PasswordInput
                  placeholder="••••••••"
                  autoComplete="current-password"
                  {...field}
                />
              </FormControl>
              {error && <FormMessage />}
            </FormItem>
          )}
        />
        <Button isPending={isPending} className="w-full" type="submit">
          Signin
        </Button>
      </form>
    </Form>
  );
}

export { Credentials };
