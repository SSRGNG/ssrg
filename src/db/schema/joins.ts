import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import {
  authors,
  events,
  partners,
  projects,
  publications,
  researchAreas,
  researchers,
  videos,
} from "@/db/schema";
import { PresenterRole, VideoResearcherRole } from "@/types";

// Publication authors junction table
export const publicationAuthors = pgTable(
  "pub_authors",
  {
    publicationId: uuid("pub_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
    order: integer("order").notNull(), // To maintain author ordering
    contribution: text("contribution"),
    isCorresponding: boolean("is_corresponding").default(false).notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.publicationId, t.authorId] }),
    index("pub_author_order_idx").on(t.publicationId, t.order),
    index("pub_author_corresponding_idx").on(
      t.publicationId,
      t.isCorresponding
    ),
  ]
);

// Research area publications junction table
export const researchAreaPublications = pgTable(
  "area_pubs",
  {
    researchAreaId: uuid("area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
    publicationId: uuid("pub_id")
      .notNull()
      .references(() => publications.id, { onDelete: "cascade" }),
    order: integer("order").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.researchAreaId, t.publicationId] }),
    index("area_pub_order_idx").on(t.researchAreaId, t.order),
  ]
);

// Project categories junction table
export const projectCategories = pgTable(
  "proj_areas",
  {
    projectId: uuid("proj_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
    areaId: uuid("area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.projectId, t.areaId] }),
    index("proj_areas_area_idx").on(t.areaId),
  ]
);

// Project partners junction table
export const partnerProjects = pgTable(
  "partner_projs",
  {
    partnerId: uuid("partner_id")
      .notNull()
      .references(() => partners.id, { onDelete: "cascade" }),
    projectId: uuid("proj_id")
      .notNull()
      .references(() => projects.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.partnerId, t.projectId] }),
    index("partner_projs_proj_idx").on(t.projectId),
  ]
);

// Researcher area junction table
export const researcherAreas = pgTable(
  "researcher_areas",
  {
    researcherId: uuid("researcher_id")
      .notNull()
      .references(() => researchers.id, { onDelete: "cascade" }),
    areaId: uuid("area_id")
      .notNull()
      .references(() => researchAreas.id, { onDelete: "cascade" }),
  },
  (t) => [
    primaryKey({ columns: [t.researcherId, t.areaId] }),
    index("researcher_areas_area_idx").on(t.areaId),
  ]
);

// Event presenter junction table
export const eventPresenters = pgTable(
  "event_presenters",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    eventId: uuid("event_id")
      .notNull()
      .references(() => events.id, { onDelete: "cascade" }),
    researcherId: uuid("researcher_id").references(() => researchers.id, {
      onDelete: "set null",
    }),
    externalName: text("external_name"),
    externalAffiliation: text("external_affiliation"),
    role: varchar("role", { length: 20 }).$type<PresenterRole>().notNull(),
    order: integer("order").notNull(),
  },
  (t) => [
    index("event_presenters_event_idx").on(t.eventId),
    index("event_presenters_researcher_idx").on(t.researcherId),
    check(
      "valid_presenter",
      sql`${t.researcherId} IS NOT NULL OR ${t.externalName} IS NOT NULL`
    ),
  ]
);

// Video author junction table
export const videoAuthors = pgTable(
  "video_authors",
  {
    videoId: uuid("video_id")
      .notNull()
      .references(() => videos.id, { onDelete: "cascade" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => authors.id, { onDelete: "cascade" }),
    role: varchar("role", { length: 20 }).$type<VideoResearcherRole>(),
    order: integer("order").default(0),
  },
  (t) => [
    primaryKey({ columns: [t.videoId, t.authorId] }),
    index("video_authors_video_idx").on(t.videoId),
    index("video_authors_author_idx").on(t.authorId),
  ]
);
