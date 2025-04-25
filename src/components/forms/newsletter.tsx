"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { Icons } from "@/components/shared/icons";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { subscribeToNewsletter } from "@/lib/actions/notifications";
import { cn, unknownError } from "@/lib/utils";
import { emailSchema, type EmailPayload } from "@/lib/validations/auth";

type Props = React.ComponentProps<"form">;

function Newsletter({ className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<EmailPayload>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
    mode: "onSubmit",
  });

  function onSubmit(data: EmailPayload) {
    startTransition(async () => {
      try {
        const result = await subscribeToNewsletter({
          email: data.email,
          token: crypto.randomUUID(),
          subject: "Welcome to SSRG",
        });

        if (!result.success) {
          switch (result.status) {
            case 409:
              toast.error(
                result.message ||
                  "You are already subscribed to our newsletter."
              );
              break;
            case 422:
              toast.error("Invalid input.");
              break;
            case 429:
              toast.error("The daily email limit has been reached.");
              break;
            default:
              toast.error(result.message || unknownError);
          }
          return;
        }

        toast.success("You have been subscribed to our newsletter.");
        form.reset();
      } catch (err) {
        console.log(err);
        toast.error(unknownError);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn("grid w-full", className)}
        {...props}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field, fieldState: { error } }) => (
            <FormItem className="relative">
              <FormLabel className="sr-only">Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="Email address"
                  className="pr-28"
                  {...field}
                />
              </FormControl>
              {error ? (
                <FormMessage>{error.message}</FormMessage>
              ) : (
                <FormDescription>
                  We respect your privacy and will never share your information.
                </FormDescription>
              )}
              <Button
                isPending={isPending}
                variant={"brand"}
                className="absolute right-0 top-0 z-10"
                type="submit"
              >
                <Icons.email /> Subscribe
              </Button>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

export { Newsletter };
