"use client";

import { ArrowDownAZ, Calendar, Quote } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type Props = React.ComponentProps<typeof SelectTrigger>;

function PublicationsFilter({ className, ...props }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sort") || "recent";

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === "recent") {
      params.delete("sort"); // Default value, so remove from URL
    } else {
      params.set("sort", value);
    }

    const newUrl = `${pathname}?${params.toString()}`;
    router.push(newUrl);
  };

  const getSortIcon = () => {
    switch (currentSort) {
      case "alphabetical":
        return <ArrowDownAZ className="size-4" />;
      case "citations":
        return <Quote className="size-4" />;
      case "recent":
      default:
        return <Calendar className="size-4" />;
    }
  };

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger
        size="sm"
        className={cn("p-1 gap-0.5", className)}
        title="Sort publications"
        {...props}
      >
        {getSortIcon()}
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="recent">
          <Calendar className="size-4" strokeWidth={1.5} /> Most Recent
        </SelectItem>
        <SelectItem value="citations">
          <Quote className="size-4" strokeWidth={1.5} /> Most Cited
        </SelectItem>
        <SelectItem value="alphabetical">
          <ArrowDownAZ className="size-4" strokeWidth={1.5} /> Title A-Z
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

export { PublicationsFilter };
