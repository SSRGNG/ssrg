"use client";

import { GitBranchPlus } from "lucide-react";
import * as React from "react";

// import { AreaForm } from "@/components/forms/area-form";
// import { FrameworkForm } from "@/components/forms/framework-form";
// import { MethodologyForm } from "@/components/forms/methodology-form";
// import { ProjectForm } from "@/components/forms/project-form";
import { Signup } from "@/components/forms/signup";
// import { PartnerForm } from "@/components/forms/partner-form";
// import { EventForm } from "@/components/forms/event-form";
// import { NewsletterForm } from "@/components/forms/newsletter-form";

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

import { CreateResearchArea } from "@/components/forms/create-research-area";

type Props = {
  type: string;
  label: string;
  isMobile: boolean;
};

const formMap: Record<
  string,
  React.ComponentType<{ setOpen: (v: boolean) => void; className?: string }>
> = {
  area: CreateResearchArea,
  // framework: FrameworkForm,
  // methodology: MethodologyForm,
  // project: ProjectForm,
  user: Signup,
  // partner: PartnerForm,
  // event: EventForm,
  // newsletter: NewsletterForm,
};

function AdminActionDialog({ type, label, isMobile }: Props) {
  const [open, setOpen] = React.useState(false);
  const FormComponent = formMap[type.toLowerCase()];

  if (!FormComponent) return null;

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button size="sm" variant="ghost" className="w-full justify-start">
          <GitBranchPlus className="text-muted-foreground" />
          {label}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{label}</DrawerTitle>
        </DrawerHeader>
        <FormComponent className="px-4" setOpen={setOpen} />
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
        <Button size="sm" variant="ghost" className="w-full justify-start">
          <GitBranchPlus className="text-muted-foreground" />
          {label}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
        </DialogHeader>
        <FormComponent setOpen={setOpen} />
      </DialogContent>
    </Dialog>
  );
}
export { AdminActionDialog };
