"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";

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
import { signinCredential } from "@/lib/actions";
import { catchError, cn } from "@/lib/utils";
import {
  credentialsSchema,
  type CredentialsPayload,
} from "@/lib/validations/auth";

type Props = React.ComponentPropsWithoutRef<"form">;

const defaultValues: CredentialsPayload = {
  password: "",
  email: "",
};

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
        await signinCredential(data);
        form.reset();
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
        />
        <Button isPending={isPending} className="w-full" type="submit">
          Signin
        </Button>
      </form>
    </Form>
  );
}

export { Credentials };
