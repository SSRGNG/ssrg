"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { appConfig } from "@/config";
import { unAuthenticate } from "@/lib/actions";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = React.ComponentPropsWithoutRef<typeof CardContent>;

function SignoutButton({ className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        const result = await unAuthenticate();
        if (result) toast.error(result);
      } catch (err) {
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
      }
    });
  };
  return (
    <CardContent
      className={cn("flex items-center gap-4", className)}
      {...props}
    >
      <Button
        variant="secondary"
        onClick={() => router.back()}
        className="flex-1 text-sm"
      >
        Go Back
        <span className="sr-only">Previous page</span>
      </Button>
      <Button
        onClick={handleSignOut}
        isPending={isPending}
        className="flex-1 text-sm"
      >
        {appConfig.auth.signout.title}
        <span className="sr-only">{appConfig.auth.signout.title}</span>
      </Button>
    </CardContent>
  );
}

export { SignoutButton };
