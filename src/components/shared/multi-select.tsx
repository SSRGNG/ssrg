"use client";

import { Command as CommandPrimitive } from "cmdk";
import { XIcon } from "lucide-react";
import * as React from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { cn } from "@/lib/utils";

export type Option = {
  label: string;
  value: string;
};

type MultiSelectProps = Omit<
  React.ComponentPropsWithoutRef<typeof Command>,
  "value" | "defaultValue" | "onValueChange"
> & {
  options: Option[];
  value?: string[]; // For controlled mode
  defaultValue?: string[]; // For uncontrolled mode's initial state
  onValueChange?: (values: string[]) => void;
  placeholder?: string;
  className?: string;
  badgeVariant?: "default" | "secondary" | "outline" | "destructive";
};
const MultiSelect = React.forwardRef<
  React.ComponentRef<typeof Command>,
  MultiSelectProps
>(
  (
    {
      className,
      options,
      value,
      defaultValue,
      onValueChange,
      placeholder = "Select options",
      badgeVariant = "secondary",
      ...props
    },
    ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [open, setOpen] = React.useState(false);
    const [query, setQuery] = React.useState("");
    const [internalValue, setInternalValue] = React.useState<string[]>(
      defaultValue || []
    );

    // Determine if component is controlled or uncontrolled
    const isControlled = value !== undefined;
    const selectedValues = isControlled ? value : internalValue;

    // Convert string[] to Option[] for internal use
    const selectedOptions = React.useMemo(() => {
      return options.filter((option) => selectedValues?.includes(option.value));
    }, [options, selectedValues]);

    // Handle changes consistently
    const handleChange = React.useCallback(
      (newValues: string[]) => {
        if (!isControlled) {
          setInternalValue(newValues);
        }

        if (onValueChange) {
          onValueChange(newValues);
        }
      },
      [isControlled, onValueChange]
    );

    const handleSelect = React.useCallback(
      (option: Option) => {
        const newValues = [...(selectedValues || []), option.value];
        handleChange(newValues);
      },
      [selectedValues, handleChange]
    );

    const handleRemove = React.useCallback(
      (option: Option) => {
        const newValues =
          selectedValues?.filter((val) => val !== option.value) || [];
        handleChange(newValues);
      },
      [selectedValues, handleChange]
    );

    const handleKeyDown = React.useCallback(
      (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (!inputRef.current) return;

        if (event.key === "Backspace" || event.key === "Delete") {
          if (query === "" && selectedValues?.length) {
            const newValues = selectedValues.slice(0, -1);
            handleChange(newValues);
          }
        }

        // Blur input on escape
        if (event.key === "Escape") {
          inputRef.current.blur();
        }
      },
      [query, selectedValues, handleChange]
    );

    // Memoize filtered options to avoid unnecessary re-renders
    const filteredOptions = React.useMemo(() => {
      return options.filter((option) => {
        if (selectedValues?.includes(option.value)) return false;
        if (query.length === 0) return true;
        return option.label.toLowerCase().includes(query.toLowerCase());
      });
    }, [options, query, selectedValues]);

    return (
      <Command
        ref={ref}
        onKeyDown={handleKeyDown}
        className={cn("overflow-visible bg-transparent", className)}
        data-slot="multi-select"
        data-state={open ? "open" : "closed"}
        {...props}
      >
        <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
          <div className="flex flex-wrap gap-1">
            {selectedOptions.map((option) => (
              <Badge
                key={option.value}
                variant={badgeVariant}
                className="rounded hover:bg-secondary"
                data-slot="multi-select-badge"
              >
                {option.label}
                <Button
                  aria-label={`Remove ${option.label}`}
                  size="icon"
                  variant={"brand"}
                  className="size-4 rounded-sm hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemove(option);
                    }
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  onClick={() => handleRemove(option)}
                  data-slot="multi-select-remove"
                >
                  <XIcon className="size-2" aria-hidden="true" />
                </Button>
              </Badge>
            ))}
            <CommandPrimitive.Input
              ref={inputRef}
              placeholder={placeholder}
              className="flex-1 bg-transparent px-1 py-0.5 outline-none placeholder:text-muted-foreground"
              value={query}
              onValueChange={setQuery}
              onBlur={() => setOpen(false)}
              onFocus={() => setOpen(true)}
              data-slot="multi-select-input"
            />
          </div>
        </div>
        <div className="relative z-50 mt-2">
          {open && filteredOptions.length > 0 && (
            <div
              className="absolute top-0 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95"
              data-slot="multi-select-dropdown"
              data-state={open ? "open" : "closed"}
            >
              <CommandGroup className="h-full overflow-auto max-h-60">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    className="px-2 py-1.5 text-sm flex cursor-default items-center"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      handleSelect(option);
                      setQuery("");
                    }}
                    data-slot="multi-select-item"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          )}
        </div>
      </Command>
    );
  }
);

MultiSelect.displayName = "MultiSelect";

function MultiSelectGroup({
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandGroup>) {
  return <CommandGroup data-slot="multi-select-group" {...props} />;
}
MultiSelectGroup.displayName = "MultiSelectGroup";

function MultiSelectItem({
  ...props
}: React.ComponentPropsWithoutRef<typeof CommandItem>) {
  return <CommandItem data-slot="multi-select-item" {...props} />;
}
MultiSelectItem.displayName = "MultiSelectItem";

export { MultiSelect, MultiSelectGroup, MultiSelectItem };
