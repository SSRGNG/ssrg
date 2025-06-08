import { z } from "zod";

import type { Icons } from "@/components/shared/icons";
import { actions, researchers } from "@/config/constants";
import {
  accessLevels,
  barActions,
  datasetStatus,
  events,
  partners,
  presenterRoles,
  publications as publicationsEnum,
  roles,
} from "@/config/enums";
import {
  notifications,
  publications,
  researchFrameworks,
  researchMethodologies,
  users,
} from "@/db/schema";
import { mapResearchAreas, mapResearcherPublications } from "@/lib/utils";
import {
  bookChapterMetadataSchema,
  conferenceMetadataSchema,
  genericMetadataSchema,
  journalMetadataSchema,
  reportMetadataSchema,
} from "@/lib/validations/publication";

export type Role = typeof roles.type;
export type Partner = typeof partners.type;
export type PublicationType = typeof publicationsEnum.type;
export type Event = typeof events.type;
export type PresenterRole = typeof presenterRoles.type;
export type AccessLevel = typeof accessLevels.type;
export type DatasetStatus = typeof datasetStatus.type;
export type BarAction = typeof barActions.type;

export type Researcher = (typeof researchers)[number];

export type User = typeof users.$inferSelect;
export type Notification = typeof notifications.$inferSelect;
export type ResearchMethodology = typeof researchMethodologies.$inferSelect;
export type ResearchFramework = typeof researchFrameworks.$inferSelect;
export type Publication = typeof publications.$inferSelect;

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

export type TableMeta<TData, TContext> = {
  searchableColumns: DataTableFilterField<TData>[];
  filterableColumns: DataTableFilterField<TData>[];
  filterFields?: DataTableFilterField<TData>[];
  barAction?: BarAction;
  context?: TContext;
};
export type StoredFile = {
  id: string;
  name: string;
  url: string;
};

export type JournalMetadata = z.infer<typeof journalMetadataSchema>;
export type ConferenceMetadata = z.infer<typeof conferenceMetadataSchema>;
export type BookChapterMetadata = z.infer<typeof bookChapterMetadataSchema>;
export type ReportMetadata = z.infer<typeof reportMetadataSchema>;
export type Generic = z.infer<typeof genericMetadataSchema>;

export type PublicationMetadata =
  | JournalMetadata
  | ConferenceMetadata
  | BookChapterMetadata
  | ReportMetadata
  | Generic; // For flexible "other" types

export type ResearchAreasData = ReturnType<typeof mapResearchAreas>;
export type PortalResearcherPubs = ReturnType<typeof mapResearcherPublications>;
