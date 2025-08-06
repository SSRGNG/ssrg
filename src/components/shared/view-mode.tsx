"use client";

import { LayoutGrid, List } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<"div">;

function ViewMode({ className, ...props }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentView = searchParams.get("view") || "detailed";

  const handleViewChange = (view: string) => {
    const params = new URLSearchParams(searchParams);
    if (view === "detailed") {
      params.delete("view"); // Default value, so remove from URL
    } else {
      params.set("view", view);
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  };
  return (
    <div
      className={cn("flex items-center border rounded-md", className)}
      {...props}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewChange("detailed")}
            className={cn(
              "rounded-[5.3px] rounded-r-none border-r size-8",
              currentView === "detailed" && "bg-accent"
            )}
          >
            <List className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Detailed view</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleViewChange("compact")}
            className={cn(
              "rounded-[5.3px] rounded-l-none size-8",
              currentView === "compact" && "bg-accent"
            )}
          >
            <LayoutGrid className="size-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Compact view</TooltipContent>
      </Tooltip>
    </div>
  );
}

export { ViewMode };
