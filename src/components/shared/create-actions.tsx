"use client";

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
import { ActionKey } from "@/types";

import { CreateResearchArea } from "@/components/forms/create-research-area";
import { CreateResearchFrameworks } from "@/components/forms/create-research-frameworks";
import { CreateResearchMethodologies } from "@/components/forms/create-research-methodologies";
import { CreateResearcher } from "@/components/forms/create-researcher";
import { UserSignup } from "@/components/forms/user-signup";
import { ScrollArea } from "@/components/ui/scroll-area";
import { appConfig } from "@/config";

type CreateActionsProps = React.PropsWithChildren & {
  actionKey: ActionKey;
  label?: string;
  isMobile: boolean;
};

type FormComponentProps = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

function CreateActions({
  actionKey,
  label,
  isMobile,
  children,
}: CreateActionsProps) {
  const [open, setOpen] = React.useState(false);

  const getActionLabel = React.useCallback(() => {
    if (label) return label;

    // Search for the label in the app config
    for (const item of appConfig.actions.items) {
      if (item.options && actionKey in item.options) {
        return item.options[actionKey];
      }
    }

    // Fallback to capitalized action key
    return actionKey.charAt(0).toUpperCase() + actionKey.slice(1);
  }, [actionKey, label]);

  const actionLabel = getActionLabel();

  const formMappings: Record<
    ActionKey,
    React.ComponentType<FormComponentProps>
  > = {
    user: UserSignup,
    researcher: CreateResearcher,
    area: CreateResearchArea,
    framework: CreateResearchFrameworks,
    methodology: CreateResearchMethodologies,
    policy: () => null,
    audit: () => null,
    event: () => null,
    newsletter: () => null,
    archive: () => null,
    export: () => null,
  };

  const description = `You are creating a new ${actionKey}`;
  const FormComponent = formMappings[actionKey];

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
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
      <DialogTrigger asChild>{children}</DialogTrigger>
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

export { CreateActions };
