import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";

const layoutVariants = cva("", {
  variants: {
    variant: {
      container: "container grid items-center gap-8 pb-8 pt-6 md:py-8",
      sidebar: "",
      centered: cn(
        "container flex max-w-2xl flex-col justify-center",
        "min-h-[100vh] min-h-[100dvh]"
      ),
      markdown: "container max-w-3xl py-8 md:py-10 lg:py-10",
      default: "flex-1 container space-y-8 md:space-y-16 py-8 md:py-16",
      public: "flex-1 container space-y-4 py-6 md:py-8",
      publications: cn(
        "flex-1 container py-4 sm:py-8",
        "grid content-start gap-4"
      ),
      main: "flex-1 px-4",
      portal: "p-4",
      grid: "grid items-center gap-8 pb-8 pt-6 md:py-8",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

type ShellProps = React.ComponentProps<"section"> &
  VariantProps<typeof layoutVariants> & {
    asChild?: boolean;
  };

function Shell({
  className,
  variant = "container",
  asChild = false,
  ...props
}: ShellProps) {
  const Comp = asChild ? Slot : "section";

  return (
    <Comp className={cn(layoutVariants({ variant }), className)} {...props} />
  );
}

type PageProps = React.ComponentProps<"main"> &
  VariantProps<typeof layoutVariants> & {
    asChild?: boolean;
  };

function Page({
  className,
  variant = "default",
  asChild = false,
  ...props
}: PageProps) {
  const Comp = asChild ? Slot : "main";

  return (
    <Comp className={cn(layoutVariants({ variant }), className)} {...props} />
  );
}

export { layoutVariants, Page, Shell };
