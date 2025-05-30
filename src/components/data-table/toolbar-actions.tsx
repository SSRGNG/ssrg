"use client";

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
import { BarAction } from "@/types";

import { CreatePublication } from "@/components/forms/create-publication";
import { ScrollArea } from "@/components/ui/scroll-area";
import { barActions } from "@/config/enums";
import { useIsMobile } from "@/hooks/use-mobile";

type ToolbarActionsProps = {
  barAction: BarAction;
  label?: string;
};

type FormComponentProps = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function ToolbarActions({ barAction, label }: ToolbarActionsProps) {
  const [open, setOpen] = React.useState(false);
  const isMobile = useIsMobile();

  const getActionLabel = React.useCallback(() => {
    if (label) return label;

    const derivedLabel = barActions.getLabel(barAction);
    return `Create ${derivedLabel}`;
  }, []);

  const actionLabel = getActionLabel();

  const formMappings: Record<
    BarAction,
    React.ComponentType<FormComponentProps>
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
          <FormComponent setIsOpen={setOpen} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export { ToolbarActions };
