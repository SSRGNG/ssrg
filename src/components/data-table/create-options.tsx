"use client";

import { GitBranchPlus } from "lucide-react";

import { CreateActions } from "@/components/shared/create-actions";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ActionKey } from "@/types";

type DataTableCreateOptionsProps = {
  actionKey: ActionKey;
};

function DataTableCreateOptions({ actionKey }: DataTableCreateOptionsProps) {
  const isMobile = useIsMobile();

  return (
    <CreateActions actionKey={actionKey} isMobile={isMobile}>
      <Button
        aria-label="Toggle creation"
        variant="outline"
        size="sm"
        className="h-8"
      >
        <GitBranchPlus className="size-4" />
        <span className="hidden sm:inline-flex">Create</span>
      </Button>
    </CreateActions>
  );
}

export { DataTableCreateOptions };
