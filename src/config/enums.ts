import { createEnum, defineEnum } from "@/lib/utils";

export const roles = createEnum(
  "admin",
  "researcher",
  "affiliate",
  "partner",
  "member"
);
// admin: Site administrators with full access
// researcher: Core team members who publish under your organization
// affiliate: External collaborators who have co-authored with your researchers
// partner: Organizations you collaborate with member: Registered users with basic access

export const partners = createEnum("academic", "nonprofit", "government");

export const events = createEnum(
  "workshop",
  "seminar",
  "conference",
  "symposium",
  "webinar"
);

export const presenterRoles = createEnum(
  "keynote",
  "panelist",
  "presenter",
  "moderator"
);

export const datasetStatus = createEnum(
  "draft",
  "processing",
  "active",
  "archived",
  "deprecated"
);

export const accessLevels = createEnum(
  "public",
  "restricted",
  "private",
  "confidential"
);

export const publications = defineEnum(
  "journal_article",
  "conference_paper",
  // "book",
  "book_chapter",
  "report"
  // "thesis",
  // "working_paper",
  // "presentation",
  // "video",
  // "other"
);

export const barActions = defineEnum("publication", "project");
