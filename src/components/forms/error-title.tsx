"use client";

import { Icons } from "@/components/shared/icons";
import { FormLabel, FormMessage } from "@/components/ui/form";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { ControllerFieldState } from "react-hook-form";

/**
 * Renders a form label with error state handling.
 * Shows an error indicator with hover card when fieldState contains an error.
 *
 * @param fieldState - The field state from react-hook-form
 * @param title - The label text to display
 * @param className - Optional additional CSS classes
 * @returns JSX element with appropriate label styling
 */
function ErrorTitle({
  fieldState,
  title,
  className,
}: {
  fieldState: ControllerFieldState;
  title: string;
  className?: string;
}) {
  return fieldState.error ? (
    <HoverCard>
      <HoverCardTrigger className={cn("flex items-center gap-1.5", className)}>
        <Icons.alert strokeWidth={1.5} className="size-3.5 text-destructive" />
        <FormLabel>{title}</FormLabel>
      </HoverCardTrigger>
      <HoverCardContent>
        <FormMessage />
      </HoverCardContent>
    </HoverCard>
  ) : (
    <FormLabel className={className}>{title}</FormLabel>
  );
}

export { ErrorTitle };
