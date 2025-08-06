"use client";

import { type Column } from "@tanstack/react-table";
import {
  endOfMonth,
  format,
  isSameDay,
  isWithinInterval,
  parse,
  startOfMonth,
} from "date-fns";
import { CalendarDaysIcon, X } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { DateColumn } from "@/types/table";

type DataTableDateFilter<TData, TValue> = React.ComponentPropsWithoutRef<
  typeof PopoverTrigger
> & {
  column?: Column<TData, TValue>;
  config?: DateColumn<TData>;
};

function DataTableDateFilter<TData, TValue>({
  column,
  config,
  ...props
}: DataTableDateFilter<TData, TValue>) {
  const [date, setDate] = React.useState<Date | undefined>(undefined);
  const [calendarMonth, setCalendarMonth] = React.useState<Date>(new Date());
  const [selectedRange, setSelectedRange] = React.useState<{
    start: Date;
    end: Date;
  } | null>(null);

  // Configuration with defaults
  const {
    label,
    placeholder = "Pick a date",
    showMonthSelect = true,
    maxMonthsInSelect = 3,
  } = config || {};

  // Get unique months from the data
  const uniqueMonths = React.useMemo(() => {
    if (!column || !showMonthSelect) return [];

    const dates = column.getFacetedUniqueValues();
    const months = new Set<string>();

    dates.forEach((_, dateStr) => {
      const date =
        dateStr instanceof Date ? dateStr : new Date(dateStr as string);

      if (date && !isNaN(date.getTime())) {
        const monthYear = format(date, "MMM yyyy");
        months.add(monthYear);
      }
    });

    return Array.from(months)
      .sort((a, b) => {
        const dateA = parse(a, "MMM yyyy", new Date());
        const dateB = parse(b, "MMM yyyy", new Date());
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, maxMonthsInSelect);
  }, [column, showMonthSelect, maxMonthsInSelect]);

  // Handle month selection
  const handleMonthSelect = (monthYear: string) => {
    const selectedDate = parse(monthYear, "MMM yyyy", new Date());
    const start = startOfMonth(selectedDate);
    const end = endOfMonth(selectedDate);

    setCalendarMonth(selectedDate);
    setSelectedRange({ start, end });
    setDate(undefined);

    column?.setFilterValue([start, end]);
  };

  // Handle date selection
  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setSelectedRange(null);

    if (selectedDate) {
      column?.setFilterValue(selectedDate);
    } else {
      column?.setFilterValue(undefined);
    }
  };

  // Handle clear filter
  const handleClearFilter = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDate(undefined);
    setSelectedRange(null);
    column?.setFilterValue(undefined);
  };

  // Check if filter is active
  const isFiltered = date || selectedRange;

  // Get display text
  const getDisplayText = () => {
    if (date) {
      return format(date, "LLL dd, y");
    }
    if (selectedRange) {
      return `${format(selectedRange.start, "MMM yyyy")}`;
    }
    return placeholder;
  };

  // Custom day rendering for the calendar
  const modifiers = {
    selected: (day: Date) =>
      date
        ? isSameDay(day, date)
        : selectedRange
        ? isWithinInterval(day, {
            start: selectedRange.start,
            end: selectedRange.end,
          })
        : false,
    first: (day: Date) =>
      selectedRange ? isSameDay(day, selectedRange.start) : false,
    last: (day: Date) =>
      selectedRange ? isSameDay(day, selectedRange.end) : false,
    middle: (day: Date) =>
      selectedRange
        ? isWithinInterval(day, {
            start: selectedRange.start,
            end: selectedRange.end,
          }) &&
          !isSameDay(day, selectedRange.start) &&
          !isSameDay(day, selectedRange.end)
        : false,
  };

  const modifiersStyles = {
    selected: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      borderRadius: "4px",
    },
    first: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      borderTopLeftRadius: "4px",
      borderBottomLeftRadius: "4px",
      borderTopRightRadius: "0px",
      borderBottomRightRadius: "0px",
    },
    last: {
      backgroundColor: "var(--primary)",
      color: "var(--primary-foreground)",
      borderTopRightRadius: "4px",
      borderBottomRightRadius: "4px",
      borderTopLeftRadius: "0px",
      borderBottomLeftRadius: "0px",
    },
    middle: {
      backgroundColor: "var(--accent)",
      color: "var(--accent-foreground)",
      borderRadius: "0px",
    },
  };

  return (
    <Popover>
      <PopoverTrigger asChild {...props}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "h-8 border-dashed justify-start text-left font-normal",
                isFiltered && "bg-muted",
                !isFiltered && "text-muted-foreground"
              )}
            >
              <CalendarDaysIcon
                className="size-4"
                strokeWidth={1.5}
                aria-hidden="true"
              />
              <span className="hidden sm:inline-flex truncate">
                {getDisplayText()}
              </span>
              {isFiltered && (
                <X
                  className="ml-2 size-3.5 hover:bg-muted-foreground/20 rounded-sm p-0.5"
                  strokeWidth={1.5}
                  onClick={handleClearFilter}
                  aria-label="Clear filter"
                />
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent className="sm:hidden">
            {getDisplayText()}
          </TooltipContent>
        </Tooltip>
      </PopoverTrigger>
      <PopoverContent className="w-auto flex flex-col gap-2 p-2" align="start">
        {showMonthSelect && uniqueMonths.length > 0 && (
          <div className="space-y-1">
            {label && (
              <p className="text-xs font-medium text-muted-foreground px-1">
                {label}
              </p>
            )}
            <Select onValueChange={handleMonthSelect}>
              <SelectTrigger className="h-8 w-full">
                <SelectValue placeholder="Select month" />
              </SelectTrigger>
              <SelectContent position="popper">
                {uniqueMonths.map((month) => (
                  <SelectItem key={month} value={month}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleDateSelect}
          month={calendarMonth}
          onMonthChange={setCalendarMonth}
          modifiers={modifiers}
          modifiersStyles={modifiersStyles}
          className="rounded-md border"
          captionLayout="dropdown"
          autoFocus
        />
        {isFiltered && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setDate(undefined);
              setSelectedRange(null);
              column?.setFilterValue(undefined);
            }}
            className="h-8"
          >
            <X className="size-3.5" strokeWidth={1.5} />
            Clear filter
          </Button>
        )}
      </PopoverContent>
    </Popover>
  );
}

export { DataTableDateFilter };
