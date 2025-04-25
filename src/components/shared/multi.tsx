"use client";

import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import * as React from "react";
import { ControllerRenderProps, FieldValues, Path } from "react-hook-form";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";

export interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
> {
  field: ControllerRenderProps<TFieldValues, TName>;
  options: Option[];
  placeholder?: string;
}

export function Multi<
  TFieldValues extends FieldValues,
  TName extends Path<TFieldValues>
>({
  field,
  options,
  placeholder = "Select options...",
}: MultiSelectProps<TFieldValues, TName>) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Convert stored values to selected options
  const selected = React.useMemo(
    () =>
      field.value
        ? options.filter((option) =>
            (field.value as string[]).includes(option.value)
          )
        : [],
    [field.value, options]
  );

  const handleUnselect = React.useCallback(
    (option: Option) => {
      const newValue = (field.value as string[]).filter(
        (value) => value !== option.value
      );
      field.onChange(newValue);
    },
    [field]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "") {
            const newValue = (field.value as string[]).slice(0, -1);
            field.onChange(newValue);
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [field]
  );

  const selectables = options.filter(
    (option) => !(field.value as string[])?.includes(option.value)
  );

  return (
    <Command
      onKeyDown={handleKeyDown}
      className="overflow-visible bg-transparent"
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((option) => (
            <Badge key={option.value} variant="secondary">
              {option.label}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(option);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(option)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        <CommandList>
          {open && selectables.length > 0 ? (
            <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
              <CommandGroup className="h-full overflow-auto">
                {selectables.map((option) => (
                  <CommandItem
                    key={option.value}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      const newValue = field.value
                        ? [...(field.value as string[]), option.value]
                        : [option.value];
                      field.onChange(newValue);
                    }}
                    className="cursor-pointer"
                  >
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </div>
          ) : null}
        </CommandList>
      </div>
    </Command>
  );
}
