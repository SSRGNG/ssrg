"use client";

import { GitBranchPlus } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { cn } from "@/lib/utils";
import { ActionKey } from "@/types";

import { CreateResearchArea } from "@/components/forms/create-research-area";
import { UserSignup } from "@/components/forms/user-signup";

type AdminActionsProps = {
  actionKey: string;
  label: string;
  isMobile: boolean;
};

type FormComponentProps = React.ComponentPropsWithoutRef<"form"> & {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};
// type FormComponentProps = {
//   setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
// };

function AdminActions({ actionKey, label, isMobile }: AdminActionsProps) {
  const [open, setOpen] = React.useState(false);

  const formMappings: Record<
    ActionKey,
    React.ComponentType<FormComponentProps>
  > = {
    area: CreateResearchArea,
    user: UserSignup,
    framework: () => null,
    methodology: () => null,
    project: () => null,
    partner: () => null,
    event: () => null,
    newsletter: () => null,
  };

  const FormComponent = formMappings[actionKey as ActionKey];

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button
          size="sm"
          variant="ghost"
          className={cn("w-full justify-start text-xs")}
        >
          <GitBranchPlus className="size-4 text-muted-foreground" />
          {label}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{label}</DrawerTitle>
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
          size="sm"
          variant="ghost"
          className={cn("w-full justify-start text-xs")}
        >
          <GitBranchPlus className="size-4 text-muted-foreground" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[70vw]">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <FormComponent
          setIsOpen={setOpen}
          className="sm:max-h-[70vh] overflow-auto"
        />
      </DialogContent>
    </Dialog>
  );
}

AdminActions.displayName = "AdminActions";
export { AdminActions };
