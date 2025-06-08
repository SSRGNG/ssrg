"use client";

import type { Table } from "@tanstack/react-table";
import { GitBranchPlus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { BarAction, TableMeta } from "@/types";

import { CreatePublication } from "@/components/forms/create-publication";
import { ScrollArea } from "@/components/ui/scroll-area";
import { barActions } from "@/config/enums";
import { useIsMobile } from "@/hooks/use-mobile";

type ToolbarActionsProps<TData, TContext> = {
  table: Table<TData> & {
    options: {
      meta: TableMeta<TData, TContext>;
    };
  };
};

type FormComponentProps = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  context?: unknown;
};

function ToolbarActions<TData, TContext>({
  table,
}: ToolbarActionsProps<TData, TContext>) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const meta = table.options.meta;
  const { barAction, context } = meta;

  if (!barAction) return null;
  const actionLabel = barActions.getLabel(barAction);

  const formMappings: Record<
    BarAction,
    React.ComponentType<FormComponentProps & { context?: TContext }>
  > = {
    publication: CreatePublication,
    project: () => null,
  };

  const description = `You are creating a new ${barAction}`;
  const FormComponent = formMappings[barAction];

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          aria-label="Toggle creation"
          variant="outline"
          size="sm"
          className="h-8"
        >
          <GitBranchPlus className="size-4" />
          <span className="hidden sm:inline-flex">Create</span>
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{actionLabel}</DrawerTitle>
          <DrawerDescription className="sr-only">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <FormComponent
          setIsOpen={setOpen}
          className="px-4 pr-2 overflow-auto"
          context={context}
        />
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  ) : (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          aria-label="Toggle creation"
          variant="outline"
          size="sm"
          className="h-8"
        >
          <GitBranchPlus className="size-4" />
          <span className="hidden sm:inline-flex">Create</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>{actionLabel}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="sm:max-h-[70vh]">
          <FormComponent setIsOpen={setOpen} context={context} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export { ToolbarActions };
