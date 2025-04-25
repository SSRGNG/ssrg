"use client";

import { ClipboardCopy } from "lucide-react";
import React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { catchError, cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<typeof Button> & {
  textToCopy: string;
  icon?: boolean;
};

function CopyToClipboard({ textToCopy, icon, className, ...props }: Props) {
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to Clipboard");
    } catch (err) {
      catchError(err);
    }
  };

  return (
    <Button
      onClick={copyToClipboard}
      size={icon ? "icon" : "sm"}
      variant={icon ? "ghost" : "default"}
      className={cn(className)}
      aria-label={icon ? "Copy to clipboard" : undefined}
      {...props}
    >
      {icon ? <ClipboardCopy className="size-3" aria-hidden="true" /> : "Copy"}
    </Button>
  );
}

const MemoizedCopyToClipboard = React.memo(CopyToClipboard);
MemoizedCopyToClipboard.displayName = "CopyToClipboard";

export { MemoizedCopyToClipboard as CopyToClipboard };
