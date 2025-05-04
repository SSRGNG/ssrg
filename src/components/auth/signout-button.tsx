"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { appConfig } from "@/config";
import { unAuthenticate } from "@/lib/actions";
import { catchError, cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof CardContent>;

function SignoutButton({ className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const router = useRouter();

  const handleSignOut = () => {
    startTransition(async () => {
      try {
        await unAuthenticate();
      } catch (err) {
        catchError(err);
      }
    });
  };
  return (
    <CardContent
      className={cn("flex items-center gap-3", className)}
      {...props}
    >
      <Button
        variant="secondary"
        onClick={() => router.back()}
        className="w-full text-sm"
      >
        Go Back
        <span className="sr-only">Previous page</span>
      </Button>
      <Button
        onClick={handleSignOut}
        isPending={isPending}
        className="w-full text-sm"
      >
        {appConfig.auth.signout.title}
        <span className="sr-only">{appConfig.auth.signout.title}</span>
      </Button>
    </CardContent>
  );
}

export { SignoutButton };
