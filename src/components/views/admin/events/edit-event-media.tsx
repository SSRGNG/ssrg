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

import { UpdateEventMedia } from "@/components/forms/update-event-media";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useIsMobile } from "@/hooks/use-mobile";
import { AllEventMedia } from "@/lib/actions/queries";

type EventMediaType = AllEventMedia[number];
type Props<TContext> = React.PropsWithChildren & {
  eventMedia: EventMediaType;
  context?: TContext;
};

function EditEventMedia<TContext>({
  eventMedia,
  context,
  children,
}: Props<TContext>) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const description =
    "The changes you make will override the existing one. Do be careful and change only what you absolutely intend to change.";

  return isMobile ? (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>{"Update Event Media"}</DrawerTitle>
          <DrawerDescription className="sr-only">
            {description}
          </DrawerDescription>
        </DrawerHeader>
        <UpdateEventMedia
          eventMedia={eventMedia}
          context={context}
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
          <DialogTitle>{"Update Event Media"}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="sm:max-h-[70vh]">
          <UpdateEventMedia
            eventMedia={eventMedia}
            context={context}
            setIsOpen={setOpen}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export { EditEventMedia };
