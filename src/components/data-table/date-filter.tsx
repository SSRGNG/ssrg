// "use client";

// import { type Column } from "@tanstack/react-table";
// import {
//   endOfMonth,
//   format,
//   isSameDay,
//   isWithinInterval,
//   parse,
//   startOfMonth,
// } from "date-fns";
// import { CalendarDaysIcon } from "lucide-react";
// import * as React from "react";
// import type { DayModifiers, ModifiersStyles } from "react-day-picker";

// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import {
//   Popover,
//   PopoverContent,
//   PopoverTrigger,
// } from "@/components/ui/popover";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { cn } from "@/lib/utils";

// type DataTableFacetedFilter<TData, TValue> = React.ComponentPropsWithoutRef<
//   typeof PopoverTrigger
// > & {
//   column?: Column<TData, TValue>;
// };

// function DataTableDateFilter<TData, TValue>({
//   column,
//   ...props
// }: DataTableFacetedFilter<TData, TValue>) {
//   const [date, setDate] = React.useState<Date | undefined>(undefined);
//   const [calendarMonth, setCalendarMonth] = React.useState<Date>(new Date());
//   const [selectedRange, setSelectedRange] = React.useState<{
//     start: Date;
//     end: Date;
//   } | null>(null);

//   // Get unique months from the data
//   const uniqueMonths = React.useMemo(() => {
//     if (!column) return [];

//     const dates = column.getFacetedUniqueValues();
//     const months = new Set<string>();

//     dates.forEach((_, dateStr) => {
//       const date =
//         dateStr instanceof Date ? dateStr : new Date(dateStr as string);

//       if (date && !isNaN(date.getTime())) {
//         const monthYear = format(date, "MMM yyyy");
//         months.add(monthYear);
//       }
//     });

//     return Array.from(months)
//       .sort((a, b) => {
//         const dateA = parse(a, "MMM yyyy", new Date());
//         const dateB = parse(b, "MMM yyyy", new Date());
//         return dateB.getTime() - dateA.getTime();
//       })
//       .slice(0, 3);
//   }, [column]);

//   // Handle month selection
//   const handleMonthSelect = (monthYear: string) => {
//     const selectedDate = parse(monthYear, "MMM yyyy", new Date());
//     const start = startOfMonth(selectedDate);
//     const end = endOfMonth(selectedDate);

//     setCalendarMonth(selectedDate); // Update calendar to show selected month
//     setSelectedRange({ start, end }); // Set range for highlighting
//     setDate(undefined); // Clear single date selection

//     column?.setFilterValue([start, end]);
//   };

//   // Handle date selection
//   const handleDateSelect = (selectedDate: Date | undefined) => {
//     setDate(selectedDate);
//     setSelectedRange(null); // Clear range highlighting when selecting a single date

//     if (selectedDate) {
//       column?.setFilterValue(selectedDate);
//     } else {
//       column?.setFilterValue(undefined);
//     }
//   };

//   // Custom day rendering for the calendar
//   const modifiers: DayModifiers = {
//     selected: (day: Date) =>
//       date
//         ? isSameDay(day, date) // Handle single date selection
//         : selectedRange
//         ? isWithinInterval(day, {
//             start: selectedRange.start,
//             end: selectedRange.end,
//           }) // Handle range selection
//         : false, // Default case
//     first: (day: Date) =>
//       selectedRange ? isSameDay(day, selectedRange.start) : false,
//     last: (day: Date) =>
//       selectedRange ? isSameDay(day, selectedRange.end) : false,
//     middle: (day: Date) =>
//       selectedRange
//         ? isWithinInterval(day, {
//             start: selectedRange.start,
//             end: selectedRange.end,
//           }) &&
//           !isSameDay(day, selectedRange.start) &&
//           !isSameDay(day, selectedRange.end)
//         : false,
//   };

//   const modifiersStyles: ModifiersStyles = {
//     selected: {
//       backgroundColor: "hsl(var(--primary))",
//       color: "hsl(var(--primary-foreground))",
//       borderRadius: "4px", // Default border radius for single date
//     },
//     first: {
//       backgroundColor: "hsl(var(--primary))",
//       color: "hsl(var(--primary-foreground))",
//       borderTopLeftRadius: "4px",
//       borderBottomLeftRadius: "4px",
//       borderTopRightRadius: "0px",
//       borderBottomRightRadius: "0px",
//     },
//     last: {
//       backgroundColor: "hsl(var(--primary))",
//       color: "hsl(var(--primary-foreground))",
//       borderTopRightRadius: "4px",
//       borderBottomRightRadius: "4px",
//       borderTopLeftRadius: "0px",
//       borderBottomLeftRadius: "0px",
//     },
//     middle: {
//       backgroundColor: "hsl(var(--accent))",
//       color: "hsl(var(--accent-foreground))",
//       borderRadius: "0px",
//     },
//   };

//   return (
//     <Popover>
//       <PopoverTrigger asChild {...props}>
//         <Button
//           variant="outline"
//           size="sm"
//           className={cn(
//             "h-8 border-dashed",
//             (date || selectedRange) && "bg-muted"
//           )}
//         >
//           <CalendarDaysIcon className="size-4" />
//           <span className="hidden sm:inline-flex">
//             {date
//               ? format(date, "LLL dd, y")
//               : selectedRange
//               ? `${format(selectedRange.start, "MMM yyyy")}`
//               : "Pick a date"}
//           </span>
//         </Button>
//       </PopoverTrigger>
//       <PopoverContent className="w-auto flex flex-col gap-2 p-2">
//         <Select onValueChange={handleMonthSelect}>
//           <SelectTrigger>
//             <SelectValue placeholder="Select month" />
//           </SelectTrigger>
//           <SelectContent position="popper">
//             {uniqueMonths.map((month) => (
//               <SelectItem key={month} value={month}>
//                 {month}
//               </SelectItem>
//             ))}
//           </SelectContent>
//         </Select>
//         <Calendar
//           mode="single"
//           selected={date}
//           onSelect={handleDateSelect}
//           month={calendarMonth}
//           onMonthChange={setCalendarMonth}
//           modifiers={modifiers}
//           modifiersStyles={modifiersStyles}
//           className="rounded-md border"
//           initialFocus
//         />
//       </PopoverContent>
//     </Popover>
//   );
// }

// export { DataTableDateFilter };
