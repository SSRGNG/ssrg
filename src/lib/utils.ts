import { clsx, type ClassValue } from "clsx";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { z } from "zod";

import { researchers } from "@/config/constants";
import type { NavItem, Role, UserNavItem } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const unknownError =
  "An unknown error occurred. Please try again later.";

export function getErrorMessage(err: unknown) {
  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });
    return errors.join("\n");
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function catchError(err: unknown) {
  const errorMessage = getErrorMessage(err);
  return toast.error(errorMessage);
}

export function formatPrice(
  price: number | string,
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: options.currency ?? "NGN",
    notation: options.notation ?? "standard",
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: 0,
    ...options,
  }).format(Number(price));
}

export function formatNumber(
  number: number | string,
  options: Intl.NumberFormatOptions = {}
) {
  return new Intl.NumberFormat("en-US", {
    style: options.style ?? "decimal",
    notation: options.notation ?? "standard",
    minimumFractionDigits: options.minimumFractionDigits ?? 0,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    ...options,
  }).format(Number(number));
}

export function formatDate(
  date: Date | string | number,
  options: Intl.DateTimeFormatOptions = {}
) {
  return new Intl.DateTimeFormat("en-US", {
    month: options.month ?? "long",
    day: options.day ?? "numeric",
    year: options.year ?? "numeric",
    ...options,
  }).format(new Date(date));
}
// export const handleQuickDateSelect = (
//   value: string,
//   onChange: (date: Date) => void
// ) => {
//   const days = Math.abs(parseInt(value));
//   const newDate = subDays(new Date(), days);
//   onChange(newDate);
// };

// Helper function to check if the user's role is allowed
export const isRoleAllowed = (allowedRoles: Role | Role[], userRole: Role) => {
  if (Array.isArray(allowedRoles)) {
    return allowedRoles.includes(userRole);
  }
  return allowedRoles === userRole;
};

export const getInitials = (name?: string | null): string => {
  if (!name) return "";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("");
};

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(salt)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  const passwordBuffer = encoder.encode(password);
  const saltedPassword = new Uint8Array([...passwordBuffer, ...salt]);

  const hashBuffer = await crypto.subtle.digest("SHA-256", saltedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return `${saltHex}:${hashHex}`;
}

export async function verifyPassword(
  password: string,
  hash: string
): Promise<boolean> {
  const [saltHex, storedHashHex] = hash.split(":");

  // Convert salt from hex to Uint8Array
  const salt = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltedPassword = new Uint8Array([...passwordBuffer, ...salt]);

  const hashBuffer = await crypto.subtle.digest("SHA-256", saltedPassword);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex === storedHashHex;
}

export const mapUserNav = (
  items: Record<string, Omit<UserNavItem, "cmd">>
): UserNavItem[] => {
  // const navArray: UserNavItem[] = Object.values(items);
  return Object.entries(items).map(([key, item]) => ({
    ...item,
    cmd: `⌘${key.toUpperCase()}`,
  }));
};

export const mapNavItems = (items: NavItem[]) => {
  return items.map((item) => ({
    title: item.title,
    href: item.href,
    description: item.description,
    icon: item.icon,
    items: [],
  }));
};

export const getResearchersByArea = (areaTitle: string) => {
  return researchers.filter((researcher) =>
    researcher.areas.includes(areaTitle)
  );
};

export const featuredResearchers = researchers.filter(
  (researcher) => researcher.featured === true
);
