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

import { UpdateResearchArea } from "@/components/forms/update-research-area";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminAreasData } from "@/lib/actions/queries";

type RAreaType = AdminAreasData[number];
type Props = React.PropsWithChildren & { area: RAreaType };

function EditResearchArea({ area, children }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const description =
    "The changes you make will override the existing one. Do be careful and change only what you absolutely intend to change.";

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{area.title}</DrawerTitle>
          <DrawerDescription className="sr-only">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <UpdateResearchArea
          researchArea={area}
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
          <DialogTitle>{area.title}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="sm:max-h-[70vh]">
          <UpdateResearchArea researchArea={area} setIsOpen={setOpen} />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export { EditResearchArea };
