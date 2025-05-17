"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { Icons } from "@/components/shared/icons";
import { Button, buttonVariants } from "@/components/ui/button";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { AdminAreasData } from "@/lib/actions/queries";
import { cn } from "@/lib/utils";

type RAreaType = AdminAreasData[number];
type Props = React.ComponentProps<typeof Drawer> & { area: RAreaType };

function ResearchAreaDetails({ area, ...props }: Props) {
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const Icon = Icons[(area.icon as Icons) ?? "alert"];

  return (
    <Drawer
      open={open}
      onOpenChange={setOpen}
      direction={isMobile ? "bottom" : "right"}
      {...props}
    >
      <DrawerTrigger asChild>
        <Button
          aria-label="Toggle view"
          size="sm"
          variant="ghost"
          className={cn("w-full justify-start text-xs px-2")}
        >
          View Details
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <Image
            src={area.image}
            alt={`Image for ${area.title}`}
            height={800}
            width={450}
            className="h-full w-full rounded-lg object-cover aspect-[24/9]"
            loading="lazy"
          />
          <DrawerTitle className="flex items-center gap-2.5 truncate">
            <Icon className="text-brand" strokeWidth={1.5} />
            {area.title}
          </DrawerTitle>
          <DrawerDescription className="sr-only">
            A snippet of {area.title}
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 space-y-2.5 overflow-auto">
          <h4 className="mb-1.5">Description</h4>
          <p className="text-muted-foreground">{area.description}</p>
          <h4 className="mb-1.5">Detail</h4>
          <p className="text-muted-foreground">{area.detail}</p>
          <h4>Key Research Questions:</h4>
          <ul className="space-y-1 list-none">
            {area.questions.map((q, i) => (
              <li
                className="text-xs text-muted-foreground truncate border-l-2 pl-2 border-brand"
                key={i}
              >
                {q.question}
              </li>
            ))}
          </ul>
          <h4>Research Methods:</h4>
          <ul className="space-y-1 list-none">
            {area.methods.map((m, i) => (
              <li
                className="text-xs text-muted-foreground truncate border-l-2 pl-2 border-brand"
                key={i}
              >
                {m.title}
              </li>
            ))}
          </ul>
          <h4>Key Findings:</h4>
          <ul className="space-y-1 list-none">
            {area.findings.map((f, i) => (
              <li
                className="text-xs text-muted-foreground truncate border-l-2 pl-2 border-brand"
                key={i}
              >
                {f.finding}
              </li>
            ))}
          </ul>
          {/* Add more area details here */}
        </div>
        <DrawerFooter className="pt-3 flex-row">
          <Link
            href={area.href}
            className={buttonVariants({
              variant: "brand",
              className: "whitespace-normal flex-1 text-xs",
            })}
          >
            Explore
          </Link>
          <DrawerClose asChild>
            <Button variant="outline">Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

// Example of how to write a reusable trigger for instances where you display Drawer or Dialog
// use like so: <Trigger {...props} />
// type BTNProps = React.ComponentProps<typeof Button>;
// function Trigger() {
//   return (
//     <Button
//       aria-label="Toggle view"
//       size="sm"
//       variant="ghost"
//       className={cn("w-full justify-start text-xs px-2")}
//     >
//       View
//     </Button>
//   );
// }
export { ResearchAreaDetails };
