"use client";

import type { Table } from "@tanstack/react-table";
import { GitBranchPlus } from "lucide-react";

import { CreateActions } from "@/components/shared/create-actions";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { ActionKey } from "@/types";

type DataTableCreateOptionsProps<TData> = {
  table: Table<TData>;
};

function DataTableCreateOptions<TData>({
  table,
}: DataTableCreateOptionsProps<TData>) {
  const isMobile = useIsMobile();

  const { actionKey } = table.options.meta as unknown as {
    actionKey?: ActionKey;
  };
  if (!actionKey) return null;

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
