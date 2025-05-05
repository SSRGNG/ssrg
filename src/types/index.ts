import type { Icons } from "@/components/shared/icons";
import { actions, researchers } from "@/config/constants";
import { events, partners, presenterRoles, roles } from "@/config/enums";
import { notifications, users } from "@/db/schema";

export type Role = typeof roles.type;
export type Partner = typeof partners.type;
export type Event = typeof events.type;
export type PresenterRole = typeof presenterRoles.type;

export type Researcher = (typeof researchers)[number];

export type User = typeof users.$inferSelect;
export type Notification = typeof notifications.$inferSelect;

export type ServerResponse = {
  status: "error" | "success";
  message: string;
};

export type NavItem = {
  title: string;
  href: string;
  icon: Icons;
  description: string;
  label?: string;
  disabled?: boolean;
  external?: boolean;
  items: NavItem[];
};

export type AppNavItem = {
  title: string;
  href: string;
  description: string;
  roles: Role[];
  icon: Icons;
  isActive?: boolean;
  isExpanded?: boolean;
  items: AppNavItem[];
};

export type ThemeItem = {
  name: string;
  icon: Icons;
};

export type UserNavItem = {
  title: string;
  href: string;
  icon: Icons;
  cmd: string;
  roles: Role[];
};

export type FooterItem = {
  title: string;
  items: SocialItem[];
};

export type StoredFile = {
  id: string;
  name: string;
  url: string;
};

export type SocialItem = {
  title: string;
  href: string;
  icon?: Icons;
  external?: boolean;
};

export type CardItem = {
  title: string;
  description: string;
  icon: Icons;
};

type ExtractOptionKeys<T> = T extends { items: Array<{ options: infer O }> }
  ? keyof O extends string
    ? keyof O
    : never
  : never;

export type ActionItem = typeof actions;
export type ActionKey = ExtractOptionKeys<ActionItem>;
// export type ActionItem = {
//   title: string;
//   href: string;
//   roles: Role[];
//   icon: Icons;
//   items: Omit<ActionItem, "items">[];
//   options?: {
//     view: string;
//     edit: string;
//   };
// };

export type DataTableOption = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
  withCount?: boolean;
};

export type DataTableFilterField<TData> = {
  label: string;
  value: keyof TData;
  placeholder?: string;
  options?: DataTableOption[];
};
