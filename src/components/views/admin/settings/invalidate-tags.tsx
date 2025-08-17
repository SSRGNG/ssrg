"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import { invalidateAllTags } from "@/lib/actions";
import { catchError, cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Button>;

function InvalidateTags({ className, ...props }: Props) {
  const [isPending, startTransition] = React.useTransition();
  const invalidate = () => {
    startTransition(async () => {
      try {
        await invalidateAllTags();
      } catch (err) {
        catchError(err);
      }
    });
  };
  return (
    <Button
      className={cn(className)}
      isPending={isPending}
      onClick={invalidate}
      {...props}
    >
      Invalidate all Tags
      <span className="sr-only">Invalidate all Tags</span>
    </Button>
  );
}

export { InvalidateTags };
