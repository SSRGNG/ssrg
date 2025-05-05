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

// Import existing forms
import { CreateResearchArea } from "@/components/forms/create-research-area";
import { UserSignup } from "@/components/forms/user-signup";
import { env } from "@/env";

type AdminActionsProps = {
  type: string;
  actionKey: string;
  label: string;
  isMobile: boolean;
};

// Define a common props interface for all form components
type FormComponentProps = {
  setIsOpen?: React.Dispatch<React.SetStateAction<boolean>>;
};

/**
 * AdminActions component - handles showing the appropriate form in a dialog/drawer
 * for admin actions in the sidebar
 */
function AdminActions({ type, actionKey, label, isMobile }: AdminActionsProps) {
  const [open, setOpen] = React.useState(false);

  // Get form component based on action type and key
  const getFormComponent = () => {
    // Ensure actionKey is one of our defined keys or handle as unknown
    const safeActionKey = actionKey as ActionKey;

    // Current implemented forms with proper typing
    const formMappings: Record<
      ActionKey,
      React.ComponentType<FormComponentProps>
    > = {
      area: CreateResearchArea,
      user: UserSignup,
      // Add placeholders for future forms to avoid type errors
      framework: () => null,
      methodology: () => null,
      project: () => null,
      partner: () => null,
      event: () => null,
      newsletter: () => null,
    };

    // Check if we have a direct mapping for this action key
    if (Object.prototype.hasOwnProperty.call(formMappings, safeActionKey)) {
      return formMappings[safeActionKey];
    }

    // // Check if we have a mapping for this action key
    // if (formMappings[safeActionKey]) {
    //   return formMappings[safeActionKey];
    // }

    // For future expansion - placeholder components
    // When you create new form components, add them to the mapping above
    // This structure makes it easy to add more forms later
    if (env.NODE_ENV === "development") {
      console.warn(
        `No form component found for action ${actionKey} in ${type}`
      );
    }

    // Return a placeholder component for not-yet-implemented forms
    const PlaceholderComponent: React.FC<FormComponentProps> = () => (
      <div className="p-4">
        <p className="text-sm text-muted-foreground">
          Form for &ldquo;{label}&rdquo; is not yet implemented.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          Add your form component to the mappings in AdminActions.
        </p>
      </div>
    );

    return PlaceholderComponent;
  };

  const FormComponent = getFormComponent();

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
        <div className="px-4">
          <FormComponent setIsOpen={setOpen} />
        </div>
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
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <FormComponent setIsOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}

AdminActions.displayName = "AdminActions";
export { AdminActions };
